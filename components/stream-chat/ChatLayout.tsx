import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import AppSidebar from './AppSidebar';
import SidebarToggle from './SidebarToggle';
import { SessionData } from '@/types/session';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@/components/icons';
import { ShieldCheck, Globe, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Message {
  content: string;
  isBot: boolean;
}

interface SiteInfo {
  siteId: string;
  siteName: string;
  onClearSite: () => void;
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
  sessions: SessionData[];
  setSessions: (sessions: SessionData[] | ((prev: SessionData[]) => SessionData[])) => void;
  onNewChat: () => void;
  siteInfo?: SiteInfo;
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
  sessions,
  setSessions,
  onNewChat,
  siteInfo
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
        sessions={sessions}
        setSessions={setSessions}
        onNewChat={onNewChat}
      />
      <div className={cn(
        "flex min-w-0 flex-col h-dvh bg-background",
        "transition-all duration-300 ease-in-out flex-1"
      )}>
        <div className="flex items-center justify-between p-2 sticky top-0 bg-background z-10">
          <div className="flex items-center gap-2">
            <SidebarToggle />
            {/* check if sidebar is open */}
            {!isSidebarOpen && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    type="button"
                    className="p-2 h-fit"
                    onClick={onNewChat}
                  >
                    <PlusIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent align="end">New Chat</TooltipContent>
              </Tooltip>
            )}

            {/* Site Info */}
            {siteInfo && (
              <div className="flex items-center gap-2 ml-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {siteInfo.siteName}
                </Badge>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                      onClick={siteInfo.onClearSite}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Switch Site</TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>

          {/* Admin access button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                className="p-2 h-fit"
                asChild
              >
                <Link href="/admin">
                  <ShieldCheck className="h-5 w-5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Admin Dashboard</TooltipContent>
          </Tooltip>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden w-full">
          <div className="flex flex-col min-w-0 gap-0 py-4 w-full">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4 px-4 max-w-3xl">
                  <h2 className="text-2xl font-bold">
                    Welcome to {siteInfo?.siteName || 'Chat'}
                  </h2>
                  <p className="text-muted-foreground">
                    Start a conversation with the AI assistant by typing a message below.
                  </p>
                  {siteInfo && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <span>Chatting with {siteInfo.siteName}</span>
                    </div>
                  )}
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