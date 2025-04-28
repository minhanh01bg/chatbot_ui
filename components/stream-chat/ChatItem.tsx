import { SessionData } from '@/services/sessionService';
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

interface ChatItemProps {
  chat: SessionData;
  isActive: boolean;
  setOpenMobile: (open: boolean) => void;
}

const ChatItem = ({ chat, isActive, setOpenMobile }: ChatItemProps) => {
  const title = chat.first_question || `Session ${chat.session_id.substring(0, 8)}`;
  
  return (
    <SidebarMenuItem key={chat._id}>
      <SidebarMenuButton asChild isActive={isActive}>
        <button onClick={() => setOpenMobile(false)}>
          <span>{title}</span>
        </button>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default ChatItem; 