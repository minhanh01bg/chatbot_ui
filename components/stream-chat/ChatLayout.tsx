import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import AppSidebar from './AppSidebar';
import SidebarToggle from './SidebarToggle';

interface Message {
  content: string;
  isBot: boolean;
}

interface ChatLayoutProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  onSendMessage: (message: string) => Promise<void>;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  activeSessionId?: string;
  refreshTrigger?: number;
}

const ChatLayout = ({
  messages,
  messagesEndRef,
  isLoading,
  onSendMessage,
  onSelectSession,
  onDeleteSession,
  activeSessionId,
  refreshTrigger,
}: ChatLayoutProps) => {
  const { state: sidebarState } = useSidebar();
  const isSidebarOpen = sidebarState === 'expanded';

  return (
    <div className="flex h-full w-full">
      <AppSidebar 
        onSelectSession={onSelectSession}
        onDeleteSession={onDeleteSession}
        activeSessionId={activeSessionId}
        refreshTrigger={refreshTrigger}
      />
      <div className={cn(
        "flex min-w-0 flex-col h-dvh bg-background",
        "transition-all duration-300 ease-in-out flex-1"
      )}>
        <div className="flex items-center justify-between p-2 border-b sticky top-0 bg-background z-10">
          <div className="flex items-center gap-2">
            <SidebarToggle />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden w-full">
          <div className="flex flex-col min-w-0 gap-0 py-4 w-full">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4 px-4 max-w-3xl">
                  <h2 className="text-2xl font-bold">Welcome to chatbot for 12th grade biology</h2>
                  <p className="text-muted-foreground">Start a conversation with the AI assistant by typing a message below.</p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <ChatMessage key={idx} message={msg.content} isBot={msg.isBot} />
              ))
            )}
            {isLoading && messages.length > 0 && !messages[messages.length - 1].isBot && (
              <ChatMessage message="..." isBot={true} />
            )}
            <div ref={messagesEndRef} className="shrink-0 min-w-[24px] min-h-[24px]" />
          </div>
        </div>

        <div className={cn(
          "sticky bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent py-2 w-full",
          "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-16 after:bg-background after:-z-10"
        )}>
          <div className="mx-auto px-4 pb-6 w-full max-w-[min(100%,1200px)]">
            <ChatInput onSend={onSendMessage} disabled={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLayout; 