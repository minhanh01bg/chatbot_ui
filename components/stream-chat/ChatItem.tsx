import { SessionData } from '@/services/sessionService';
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

interface ChatItemProps {
  chat: SessionData;
  isActive: boolean;
  setOpenMobile: (open: boolean) => void;
  onSelectSession: (sessionId: string) => void;
}

const ChatItem = ({ chat, isActive, setOpenMobile, onSelectSession }: ChatItemProps) => {
  const title = chat.first_question || `Session ${chat.session_id.substring(0, 8)}`;
  
  const handleSessionClick = () => {
    setOpenMobile(false);
    onSelectSession(chat.session_id);
  };
  
  return (
    <SidebarMenuItem key={chat._id}>
      <SidebarMenuButton asChild isActive={isActive}>
        <button onClick={handleSessionClick}>
          <span>{title}</span>
        </button>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default ChatItem; 