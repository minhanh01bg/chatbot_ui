import { useEffect, useRef, useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { sendChatMessage } from '@/services/chatService';
import { getChatHistory, MessageData } from '@/services/sessionService';
import ChatLayout from './ChatLayout';

interface Message {
  content: string;
  isBot: boolean;
}

const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history when a session is selected
  const handleSelectSession = async (sessionId: string) => {
    if (!sessionId) {
      // Clear messages for new chat
      setMessages([]);
      setActiveSessionId('');
      return;
    }

    setIsLoading(true);
    setActiveSessionId(sessionId);

    try {
      const history = await getChatHistory(sessionId);
      
      // Convert API response format to our local message format
      const convertedMessages = history.data.map((msg: MessageData) => ({
        content: msg.content,
        isBot: msg.role === 'assistant'
      }));
      
      setMessages(convertedMessages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
        activeSessionId || 'test-session',
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
        onSelectSession={handleSelectSession}
        activeSessionId={activeSessionId}
      />
    </SidebarProvider>
  );
};

export default ChatContainer;
