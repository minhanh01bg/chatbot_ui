import { SessionData } from '@/types/session';
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Trash2Icon } from 'lucide-react';

interface ChatItemProps {
  chat: SessionData;
  isActive: boolean;
  setOpenMobile: (open: boolean) => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  setSessions?: (sessions: SessionData[]) => void;
}

const ChatItem = ({ chat, isActive, setOpenMobile, onSelectSession, onDeleteSession }: ChatItemProps) => {
  const title = chat.first_question || 'New Chat';
  
  const handleSessionClick = () => {
    onSelectSession(chat.session_id);
    setOpenMobile(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent session selection when clicking delete
    onDeleteSession(chat.session_id);
  };

  return (
    <SidebarMenuItem key={chat.session_id}>
      <SidebarMenuButton asChild isActive={isActive}>
        <button className="flex justify-between w-full gap-2" onClick={handleSessionClick}>
          <span className="truncate flex-1 text-left">{title}</span>
          <div onClick={handleDeleteClick} title="Delete Session" className="flex-shrink-0 cursor-pointer">
            <Trash2Icon className="w-4 h-4" />
          </div>
        </button>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default ChatItem;