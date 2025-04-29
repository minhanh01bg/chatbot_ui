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
}

const ChatItem = ({ chat, isActive, setOpenMobile, onSelectSession, onDeleteSession }: ChatItemProps) => {
  const title = chat.first_question || `Session ${chat.session_id.substring(0, 8)}`;
  
  const handleSessionClick = () => {
    setOpenMobile(false);
    onSelectSession(chat.session_id);
  };
  const handleDeleteSession = () => {
    console.log('delete session', chat.session_id);
    onDeleteSession(chat.session_id);
  }
  return (
    <SidebarMenuItem key={chat._id}>
      <SidebarMenuButton asChild isActive={isActive}>
        <div className="flex justify-between">
            <button onClick={handleSessionClick}>
                <span>{title}</span>
            </button>
            <button onClick={handleDeleteSession} title="Delete Session">
                <Trash2Icon className="w-4 h-4" />
            </button>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default ChatItem; 