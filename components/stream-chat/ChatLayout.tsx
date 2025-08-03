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
import { ShieldCheck, Globe, X, Sparkles, Bot, MessageSquare } from 'lucide-react';
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
    <div className="flex h-full w-full bg-gradient-to-br from-purple-50 via-white to-blue-50">
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
        "flex min-w-0 flex-col h-dvh bg-gradient-to-br from-purple-50 via-white to-blue-50",
        "transition-all duration-300 ease-in-out flex-1"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <SidebarToggle />
            {/* check if sidebar is open */}
            {!isSidebarOpen && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    type="button"
                    className="p-2 h-fit hover:bg-purple-50 hover:text-purple-600 transition-colors"
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
              <div className="flex items-center gap-3 ml-2">
                <Badge variant="outline" className="flex items-center gap-2 bg-white/80 border-purple-200 text-purple-700 hover:bg-purple-50">
                  <Globe className="h-3 w-3" />
                  {siteInfo.siteName}
                </Badge>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
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
                className="p-2 h-fit hover:bg-purple-50 hover:text-purple-600 transition-colors"
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

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden w-full">
          <div className="flex flex-col min-w-0 gap-0 py-4 w-full">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full px-4">
                <div className="text-center space-y-6 max-w-2xl">
                  {/* Welcome Icon */}
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <MessageSquare className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-gray-900">
                      Welcome to {siteInfo?.siteName || 'AI Chat'}
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Start a conversation with our advanced AI assistant. Ask questions, get help, or simply chat about anything you'd like.
                    </p>
                    
                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-900">Smart AI</h3>
                        </div>
                        <p className="text-sm text-gray-600">Advanced AI that understands context and provides intelligent responses</p>
                      </div>
                      
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-900">24/7 Available</h3>
                        </div>
                        <p className="text-sm text-gray-600">Always ready to help, anytime you need assistance</p>
                      </div>
                      
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                            <Globe className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-900">Site Specific</h3>
                        </div>
                        <p className="text-sm text-gray-600">Tailored responses based on your site's content and context</p>
                      </div>
                    </div>
                    
                    {siteInfo && (
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200/50">
                        <Globe className="h-4 w-4" />
                        <span>Chatting with {siteInfo.siteName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto w-full px-4">
                {messages.map((msg, idx) => (
                  <ChatMessage key={idx} message={msg.content} isBot={msg.isBot} />
                ))}
              </div>
            )}
            {isLoading && messages.length > 0 && !messages[messages.length - 1].isBot && (
              <div className="max-w-4xl mx-auto w-full px-4">
                <ChatMessage message="..." isBot={true} />
              </div>
            )}
            <div ref={messagesEndRef} className="shrink-0 min-w-[24px] min-h-[24px]" />
          </div>
        </div>

        {/* Input Container */}
        <div className={cn(
          "sticky bottom-0 left-0 right-0 bg-gradient-to-t from-white/90 via-white/80 to-transparent py-4 w-full backdrop-blur-sm",
          "border-t border-gray-200/50"
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