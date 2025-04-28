import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SidebarLeftIcon, PlusIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import {
  SidebarProvider,
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { isToday, isYesterday, subMonths, subWeeks } from 'date-fns';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { sendChatMessage } from '@/services/chatService';
import { send } from 'process';

interface Message {
  content: string;
  isBot: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: string; // ISO string date
}

type GroupedChats = {
  today: ChatSession[];
  yesterday: ChatSession[];
  lastWeek: ChatSession[];
  lastMonth: ChatSession[];
  older: ChatSession[];
};

const MOCK_SESSIONS: ChatSession[] = Array.from({ length: 5 }).map((_, i) => ({
  id: `session-${i + 1}`,
  title: `Chat session ${i + 1}`,
  createdAt: new Date().toISOString(),
}));

const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    setIsLoading(true);
    setMessages(prev => [...prev, { content: message, isBot: false }]);

    try {
      let botMessage = '';
      await sendChatMessage(
        message,
        messages.map(msg => ({
          type: msg.isBot ? 'assistant' : 'user',
          content: msg.content
        })),
        'test-session',
        (chunk) => {
          botMessage += chunk;
          setMessages(prev => {
            const newMessages = [...prev];
            if (newMessages[newMessages.length - 1].isBot) {
              newMessages[newMessages.length - 1].content = botMessage;
            } else {
              newMessages.push({ content: botMessage, isBot: true });
            }
            return newMessages;
          });
        }
      );
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <ChatLayout
        messages={messages}
        messagesEndRef={messagesEndRef}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
    </SidebarProvider>
  );
};

// Sidebar Toggle Component
const SidebarToggle = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={toggleSidebar}
          variant="ghost"
          size="icon"
          className="h-9 w-9"
        >
          <SidebarLeftIcon size={18} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">Toggle Sidebar</TooltipContent>
    </Tooltip>
  );
};

// This component is inside the SidebarProvider context
const ChatLayout = ({
  messages,
  messagesEndRef,
  isLoading,
  onSendMessage
}: {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  onSendMessage: (message: string) => Promise<void>;
}) => {
  const { state: sidebarState } = useSidebar();
  const isSidebarOpen = sidebarState === 'expanded';

  return (
    <div className="flex h-full w-full">
      <AppSidebar />
      <div className={cn(
        "flex min-w-0 flex-col h-dvh bg-background",
        "transition-all duration-300 ease-in-out flex-1"
      )}>
        <div className="flex items-center justify-between p-2 border-b sticky top-0 bg-background z-10">
          <div className="flex items-center gap-2">
            <SidebarToggle />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden w-full">
          <div className="flex flex-col min-w-0 gap-0 py-4 w-full">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4 px-4 max-w-3xl">
                  <h2 className="text-2xl font-bold">Welcome to Chat Stream</h2>
                  <p className="text-muted-foreground">Start a conversation with the AI assistant by typing a message below.</p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <ChatMessage key={idx} message={msg.content} isBot={msg.isBot} />
              ))
            )}
            {isLoading && messages.length > 0 && !messages[messages.length - 1].isBot && (
              <ChatMessage message="..." isBot={true} />
            )}
            <div ref={messagesEndRef} className="shrink-0 min-w-[24px] min-h-[24px]" />
          </div>
        </div>

        <div className={cn(
          "sticky bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent py-2 w-full",
          "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-16 after:bg-background after:-z-10"
        )}>
          <div className="mx-auto px-4 pb-6 w-full max-w-[min(100%,1200px)]">
            <ChatInput onSend={onSendMessage} disabled={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

const AppSidebar = () => {
  const { setOpenMobile } = useSidebar();

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
                  onClick={() => {
                    setOpenMobile(false);
                  }}
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
        <SessionsList />
      </SidebarContent>
    </Sidebar>
  );
};

const SessionsList = () => {
  const groupChatsByDate = (chats: ChatSession[]): GroupedChats => {
    const now = new Date();
    const oneWeekAgo = subWeeks(now, 1);
    const oneMonthAgo = subMonths(now, 1);

    return chats.reduce(
      (groups, chat) => {
        const chatDate = new Date(chat.createdAt);

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
  const groupedChats = groupChatsByDate(MOCK_SESSIONS);

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {groupedChats.today.length > 0 && (
            <>
              <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
                Today
              </div>
              {groupedChats.today.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={false}
                  setOpenMobile={setOpenMobile}
                />
              ))}
            </>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

const ChatItem = ({
  chat,
  isActive,
  setOpenMobile,
}: {
  chat: ChatSession;
  isActive: boolean;
  setOpenMobile: (open: boolean) => void;
}) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <button onClick={() => setOpenMobile(false)}>
          <span>{chat.title}</span>
        </button>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default ChatContainer;
