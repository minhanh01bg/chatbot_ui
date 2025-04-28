import { Button } from '@/components/ui/button';
import { PlusIcon } from '@/components/icons';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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
  activeSessionId?: string;
  refreshTrigger?: number;
}

const AppSidebar = ({ onSelectSession, activeSessionId, refreshTrigger }: AppSidebarProps) => {
  const { setOpenMobile } = useSidebar();

  const handleNewChat = () => {
    setOpenMobile(false);
    // Clear active session by passing empty string
    onSelectSession('');
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
          activeSessionId={activeSessionId}
          refreshTrigger={refreshTrigger}
        />
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar; 