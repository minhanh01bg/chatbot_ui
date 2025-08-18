import { Button } from '@/components/ui/button';
import { PlusIcon } from '@/components/icons';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { SessionData } from '@/types/session';
import {
  Sidebar,
  SidebarMenu,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import SessionsList from './SessionsList';
import { MessageSquare, Sparkles } from 'lucide-react';

interface AppSidebarProps {
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  activeSessionId?: string;
  refreshTrigger?: number;
  sessions: SessionData[];
  setSessions: (sessions: SessionData[] | ((prev: SessionData[]) => SessionData[])) => void;
  onNewChat: () => void;
}

const AppSidebar = ({ onSelectSession, onDeleteSession, activeSessionId, refreshTrigger, sessions, setSessions, onNewChat }: AppSidebarProps) => {
  const { setOpenMobile } = useSidebar();

  const handleNewChat = () => {
    setOpenMobile(false);
    onNewChat();
  };

  return (
    <Sidebar className="group-data-[side=left]:border-r-0 bg-white/95 backdrop-blur-md border-r border-gray-200/50">
      <SidebarHeader className="bg-gradient-to-r from-purple-50 to-blue-50 p-3">
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link
              href="/"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex flex-row gap-3 items-center group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  AI Chat
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Powered by AI
                </span>
              </div>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit hover:bg-purple-50 hover:text-purple-600 transition-colors rounded-lg"
                  onClick={handleNewChat}
                >
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end">New Chat</TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-white/60">
        <SessionsList 
          onSelectSession={onSelectSession} 
          onDeleteSession={onDeleteSession}
          activeSessionId={activeSessionId}
          refreshTrigger={refreshTrigger}
          sessions={sessions}
          setSessions={setSessions}
        />
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar; 