'use client';

import { useState, useEffect } from 'react';
import { SidebarGroup, SidebarGroupContent, SidebarMenu, useSidebar } from '@/components/ui/sidebar';
import ChatItem from './ChatItem';
import { SessionData } from '@/types/session';
import { getSessions } from '@/services/sessionService';
import { getSiteSessions } from '@/services/siteChat.service';
import { useSiteChat } from '@/contexts/SiteChatContext';
import { isToday, isYesterday, subWeeks, subMonths } from 'date-fns';

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const { currentSiteToken, isValidSiteChat } = useSiteChat();

  useEffect(() => {
    const fetchSessions = async () => {
      setIsLoading(true);
      try {
        if (isValidSiteChat && currentSiteToken) {
          // Use site-specific sessions
          console.log('Fetching site-specific sessions');
          const response = await getSiteSessions(currentSiteToken, 1, 20);
          setSessions(response.data || []);
        } else {
          // Use global sessions (fallback)
          console.log('Fetching global sessions');
          const response = await getSessions(1, 20);
          setSessions(response.data);
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
        // Set empty array on error to prevent further issues
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
  }, [refreshTrigger, setSessions, currentSiteToken, isValidSiteChat]);

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

  const handleDeleteClick = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    if (sessionToDelete) {
      onDeleteSession(sessionToDelete);
      setShowDeleteDialog(false);
      setSessionToDelete(null);
    }
  };

  return (
    <>
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
                          onDeleteSession={handleDeleteClick}
                        />
                      ))}
                    </div>
                  )
                )}
                {sessions.length === 0 && !isLoading && (
                  <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
                    No sessions found
                  </div>
                )}
              </>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Session</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this session? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionsList;