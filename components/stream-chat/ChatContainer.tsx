import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SidebarLeftIcon, PlusIcon, SparklesIcon } from '@/components/icons';
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
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { isToday, isYesterday, subMonths, subWeeks } from 'date-fns';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { AnimatePresence, motion } from 'framer-motion';

// Add a CSS style block for the fixed content
const sidebarStyles = `
  .sidebar-layout {
    display: flex;
    height: 100%;
  }
  
  .content-area {
    flex: 1;
    width: 100%;
    min-width: 0;
    height: 100dvh;
    position: relative;
    left: 0;
    margin-left: 0;
    transition: margin-left 0.3s ease;
  }
  
  @media (min-width: 768px) {
    [data-sidebar-open="true"] .content-area {
      margin-left: 0;
      width: calc(100% - var(--sidebar-width, 16rem));
    }
  }
`;

interface Message {
  content: string;
  isBot: boolean;
  id?: string;
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
    setMessages(prev => [...prev, { content: message, isBot: false, id: `user-${Date.now()}` }]);

    try {
      const response = await fetch('http://localhost:8001/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODA5YjM0MTc5Y2FhN2VkM2ZiOWQ0ZmQiLCJ1c2VybmFtZSI6ImFkbWluIn0.a9r_nESBoFT9N6eRlh1WbHhVWGuqBij7adx_6uIfqBs'
        },
        body: JSON.stringify({
          question: message,
          chat_history: messages.map(msg => ({
            type: msg.isBot ? 'assistant' : 'user',
            content: msg.content
          })),
          session_id: 'test-session'
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body?.getReader();
      if (!reader) return;

      let botMessage = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        botMessage += text;
        setMessages(prev => {
          const newMessages = [...prev];
          if (newMessages[newMessages.length - 1].isBot) {
            newMessages[newMessages.length - 1].content = botMessage;
          } else {
            newMessages.push({ content: botMessage, isBot: true, id: `bot-${Date.now()}` });
          }
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add the styles to the document head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = sidebarStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex w-full">
        <AppSidebar />
        <SidebarInset>
          <ChatContent 
            messages={messages} 
            messagesEndRef={messagesEndRef} 
            isLoading={isLoading} 
            onSendMessage={handleSendMessage} 
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

// Chat content component that will be rendered inside the SidebarInset
const ChatContent = ({
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
  const { toggleSidebar } = useSidebar();
  
  return (
    <div className="flex flex-col h-dvh bg-background">
      <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2 border-b z-10">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={toggleSidebar}
              variant="outline"
              className="md:px-2 md:h-fit"
            >
              <SidebarLeftIcon size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent align="start">Toggle Sidebar</TooltipContent>
        </Tooltip>
      </header>
      
      <div
        className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-auto pt-4"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4 px-4 max-w-3xl">
              <h2 className="text-2xl font-bold">Welcome to Chat Stream</h2>
              <p className="text-muted-foreground">Start a conversation with the AI assistant by typing a message below.</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <AnimatePresence key={msg.id || idx}>
              <motion.div
                className="w-full mx-auto max-w-3xl px-4 group/message"
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                data-role={msg.isBot ? 'assistant' : 'user'}
              >
                <div
                  className={cn(
                    'flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl',
                    {
                      'group-data-[role=user]/message:w-fit': true,
                    },
                  )}
                >
                  {msg.isBot && (
                    <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
                      <div className="translate-y-px">
                        <SparklesIcon size={14} />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex flex-row gap-2 items-start">
                      <div
                        className={cn('flex flex-col gap-4', {
                          'bg-primary text-primary-foreground px-3 py-2 rounded-xl': !msg.isBot,
                        })}
                      >
                        {msg.isBot ? (
                          <div className="prose prose-neutral dark:prose-invert max-w-none break-words">
                            <ChatMessage message={msg.content} isBot={true} showAvatar={false} />
                          </div>
                        ) : (
                          msg.content
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ))
        )}
        {isLoading && messages.length > 0 && !messages[messages.length - 1].isBot && (
          <motion.div
            className="w-full mx-auto max-w-3xl px-4 group/message"
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
            data-role="assistant"
          >
            <div className="flex gap-4 w-full">
              <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
                <SparklesIcon size={14} />
              </div>

              <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-col gap-4 text-muted-foreground">
                  Thinking...
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} className="shrink-0 min-w-[24px] min-h-[24px]" />
      </div>
      
      <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
        <ChatInput onSend={onSendMessage} disabled={isLoading} />
      </form>
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
                    window.location.reload();
                  }}
                >
                  <PlusIcon size={16} />
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
