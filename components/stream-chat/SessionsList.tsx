import { useState, useEffect } from 'react';
import { isToday, isYesterday, subMonths, subWeeks } from 'date-fns';
import { getSessions } from '@/services/sessionService';
import { SessionData } from '@/types/session';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';
import ChatItem from '@/components/stream-chat/ChatItem';

type GroupedChats = {
  today: SessionData[];
  yesterday: SessionData[];
  lastWeek: SessionData[];
  lastMonth: SessionData[];
  older: SessionData[];
};

interface SessionsListProps {
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  activeSessionId?: string;
  refreshTrigger?: number;
  sessions: SessionData[];
  setSessions: (sessions: SessionData[] | ((prev: SessionData[]) => SessionData[])) => void;
}

const SessionsList = ({ onSelectSession, onDeleteSession, activeSessionId, refreshTrigger = 0, sessions, setSessions }: SessionsListProps) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      setIsLoading(true);
      try {
        const response = await getSessions(1, 20);
        setSessions(response.data);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
  }, [refreshTrigger, setSessions]);

  const groupChatsByDate = (chats: SessionData[]): GroupedChats => {
    const now = new Date();
    const oneWeekAgo = subWeeks(now, 1);
    const oneMonthAgo = subMonths(now, 1);

    return chats.reduce(
      (groups, chat) => {
        const chatDate = new Date(chat.created_time);

        if (isToday(chatDate)) {
          groups.today.push(chat);
        } else if (isYesterday(chatDate)) {
          groups.yesterday.push(chat);
        } else if (chatDate > oneWeekAgo) {
          groups.lastWeek.push(chat);
        } else if (chatDate > oneMonthAgo) {
          groups.lastMonth.push(chat);
        } else {
          groups.older.push(chat);
        }

        return groups;
      },
      {
        today: [],
        yesterday: [],
        lastWeek: [],
        lastMonth: [],
        older: [],
      } as GroupedChats,
    );
  };

  const { setOpenMobile } = useSidebar();
  const groupedChats = groupChatsByDate(sessions);
  
  // Create an array of group objects to render with proper keys
  const sessionGroups = [
    { key: 'today', title: 'Today', sessions: groupedChats.today },
    { key: 'yesterday', title: 'Yesterday', sessions: groupedChats.yesterday },
    { key: 'lastweek', title: 'Last Week', sessions: groupedChats.lastWeek },
    { key: 'lastmonth', title: 'Last Month', sessions: groupedChats.lastMonth },
    { key: 'older', title: 'Older', sessions: groupedChats.older }
  ];

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {isLoading ? (
            <div className="px-2 py-1">Loading sessions...</div>
          ) : (
            <>
              {sessionGroups.map(group => 
                group.sessions.length > 0 && (
                  <div key={group.key}>
                    <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
                      {group.title}
                    </div>
                    {group.sessions.map((session) => (
                      <ChatItem
                        key={session.session_id}
                        chat={session}
                        isActive={activeSessionId === session.session_id}
                        setOpenMobile={setOpenMobile}
                        onSelectSession={onSelectSession}
                        onDeleteSession={onDeleteSession}
                        setSessions={setSessions}
                      />
                    ))}
                  </div>
                )
              )}
              {Object.values(groupedChats).every(group => group.length === 0) && (
                <div className="px-2 py-1 text-sm">No sessions found</div>
              )}
            </>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SessionsList; 