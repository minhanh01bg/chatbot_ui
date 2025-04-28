import { useEffect, useRef, useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { sendChatMessage } from '@/services/chatService';
import ChatLayout from './ChatLayout';

interface Message {
  content: string;
  isBot: boolean;
}

const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    setIsLoading(true);
    setMessages(prev => [...prev, { content: message, isBot: false }]);

    try {
      let botMessage = '';
      await sendChatMessage(
        message,
        messages.map(msg => ({
          type: msg.isBot ? 'assistant' : 'user',
          content: msg.content
        })),
        'test-session',
        (chunk) => {
          botMessage += chunk;
          setMessages(prev => {
            const newMessages = [...prev];
            if (newMessages[newMessages.length - 1].isBot) {
              newMessages[newMessages.length - 1].content = botMessage;
            } else {
              newMessages.push({ content: botMessage, isBot: true });
            }
            return newMessages;
          });
        }
      );
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <ChatLayout
        messages={messages}
        messagesEndRef={messagesEndRef}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
    </SidebarProvider>
  );
};

export default ChatContainer;
