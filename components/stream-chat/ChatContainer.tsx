import { useEffect, useRef, useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { sendChatMessage } from '@/services/chatService';
import { getChatHistory, createSession, deleteSession } from '@/services/sessionService';
import { MessageData, SessionData } from '@/types/session';
import { useSiteChat } from '@/contexts/SiteChatContext';
import { sendSiteChatMessage, getSiteSessions, getSiteChatHistory } from '@/services/siteChat.service';
import ChatLayout from './ChatLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Message {
  content: string;
  isBot: boolean;
}

const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Site chat context
  const { currentSiteId, currentSiteToken, currentSiteName, isValidSiteChat, clearSiteChat } = useSiteChat();

  const handleNewChat = () => {
    setActiveSessionId('');
    setMessages([]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat when component mounts and site context is valid
  useEffect(() => {
    if (isValidSiteChat && currentSiteId && !hasInitialized) {
      console.log('Initializing chat with site context:', currentSiteId);
      setHasInitialized(true);
      
      // If no active session, create a new one
      if (!activeSessionId) {
        const newSessionId = `site_${currentSiteId}_${Date.now()}`;
        setActiveSessionId(newSessionId);
        console.log('Created new session ID:', newSessionId);
      }
    }
  }, [isValidSiteChat, currentSiteId, activeSessionId, hasInitialized]);

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
      let history;
      
      if (isValidSiteChat && currentSiteToken) {
        // Use site-specific chat history
        console.log('Fetching site-specific chat history for session:', sessionId);
        history = await getSiteChatHistory(sessionId, currentSiteToken);
      } else {
        // Use global chat history
        console.log('Fetching global chat history for session:', sessionId);
        history = await getChatHistory(sessionId);
      }
      
      // Convert API response format to our local message format
      const convertedMessages = history.data.map((msg: MessageData) => ({
        content: msg.content,
        isBot: msg.role === 'assistant'
      }));
      
      setMessages(convertedMessages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      // Show error message to user
      setMessages([{
        content: 'Sorry, there was an error loading the chat history.',
        isBot: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
      setActiveSessionId('');
      setMessages([]);
      // setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!isValidSiteChat) {
      console.error('No valid site chat context');
      return;
    }

    setIsLoading(true);
    setMessages(prev => [...prev, { content: message, isBot: false }]);

    try {
      let sessionId = activeSessionId;
      if (!sessionId) {
        // Generate a new session ID for site chat
        sessionId = `site_${currentSiteId}_${Date.now()}`;
        setActiveSessionId(sessionId);
        console.log('Created new session ID for message:', sessionId);
      }

      let botMessage = '';
      const reader = await sendSiteChatMessage(
        {
          question: message,
          session_id: sessionId,
          chat_history: messages.map(msg => ({
            role: msg.isBot ? 'assistant' : 'user',
            content: msg.content
          }))
        },
        currentSiteToken!
      );

      // Read streaming response
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
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
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        content: 'Sorry, there was an error processing your message.',
        isBot: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Show site selection prompt if no valid site context
  if (!isValidSiteChat) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold">No Site Selected</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Please select a site from the admin panel to start chatting.
                </p>
              </div>
              <Button
                onClick={() => router.push('/admin/sites')}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go to Sites
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <ChatLayout
        messages={messages}
        messagesEndRef={messagesEndRef}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        activeSessionId={activeSessionId}
        refreshTrigger={refreshTrigger}
        sessions={sessions}
        setSessions={setSessions}
        onNewChat={handleNewChat}
        siteInfo={{
          siteId: currentSiteId!,
          siteName: currentSiteName!,
          onClearSite: () => {
            clearSiteChat();
            router.push('/admin/sites');
          }
        }}
      />
    </SidebarProvider>
  );
};

export default ChatContainer;
