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
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link
              href="/"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex flex-row gap-3 items-center"
            >
              <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
                Chatbot
              </span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit"
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
      <SidebarContent>
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