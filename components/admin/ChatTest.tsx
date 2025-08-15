'use client';

import { useState, useRef, useEffect } from 'react';
import { Site, ChatMessage } from '@/types/site';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, User, ArrowDown, Send, MessageSquare, Zap, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './ChatTest.module.css';
import MessageBubble from './MessageBubble';
import WelcomeScreen from './WelcomeScreen';

interface ChatTestProps {
  variant?: 'embedded' | 'fullpage';
  site?: Site;
}

// Typing indicator component
const TypingIndicator = () => (
  <div className={cn(
    "flex items-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-800/50 max-w-[80%] mr-auto",
    styles.typingIndicator
  )}>
    <Avatar className={cn("h-8 w-8", styles.avatar)}>
      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
        <Bot className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
    <div className="flex space-x-1">
      <div className={cn("w-2 h-2 bg-blue-400 rounded-full", styles.typingDot)} style={{ animationDelay: '0ms' }}></div>
      <div className={cn("w-2 h-2 bg-blue-400 rounded-full", styles.typingDot)} style={{ animationDelay: '150ms' }}></div>
      <div className={cn("w-2 h-2 bg-blue-400 rounded-full", styles.typingDot)} style={{ animationDelay: '300ms' }}></div>
    </div>
  </div>
);

export default function ChatTest({ variant = 'embedded', site}: ChatTestProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Monitor scroll position to show/hide scroll button
  const handleScroll = () => {
    if (!scrollAreaRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const data_request = {
        question: input,
        chat_history: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        session_id: sessionId,
      }
      console.log("Sending data:", data_request);
      const res:any = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${site?.chat_token}`,
        },
        body: JSON.stringify(data_request),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch response');
      }
      const reader = res?.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let botContent = '';
      const botMessage: ChatMessage = {
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
  
        const chunk = decoder.decode(value, { stream: true });
        botContent += chunk;
        // Cập nhật nội dung botMessage trong danh sách message
        setMessages(prev => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
  
          if (updated[lastIndex].role === 'assistant') {
            updated[lastIndex] = {
              ...updated[lastIndex],
              content: botContent,
            };
          }
          return updated;
        });
      }
    } catch (error) {
      console.error('Error fetching response:', error);
      
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, an error occurred while processing your request.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn(
      "flex flex-col h-[calc(100vh-9rem)] w-full overflow-hidden",
      variant === 'fullpage' ? "max-w-4xl mx-auto" : "",
      "bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/20",
      "border-0 shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/5",
      "backdrop-blur-sm"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 flex-shrink-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 dark:from-blue-600/20 dark:via-indigo-600/20 dark:to-purple-600/20 border-b border-blue-200/50 dark:border-blue-800/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
              AI Chat Assistant
              <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
              Powered by {site?.name || 'your documents'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200 dark:border-blue-700">
            <Zap className="h-3 w-3 text-blue-500" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">{messages.length}</span>
          </Badge>
          {site?.chat_token && (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-md">
              Connected
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 p-0 flex flex-col">
        <div className="flex-1 min-h-0 relative">
                  <ScrollArea
          ref={scrollAreaRef}
          onScroll={handleScroll}
          className={cn("h-full", styles.customScrollbar, styles.smoothScroll)}
        >
            <div className="p-6 space-y-6">
              {messages.length === 0 ? (
                <WelcomeScreen siteName={site?.name} />
              ) : (
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <MessageBubble 
                      key={index}
                      message={message}
                      index={index}
                    />
                  ))}
                  
                  {isLoading && <TypingIndicator />}
                  
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </ScrollArea>

          {showScrollButton && (
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "absolute bottom-24 right-6 rounded-full shadow-lg z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200 dark:border-blue-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110",
                styles.scrollButton
              )}
              onClick={scrollToBottom}
            >
              <ArrowDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </Button>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex-shrink-0 bg-gradient-to-r from-gray-50/50 to-blue-50/50 dark:from-gray-800/50 dark:to-blue-950/20">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Input
                placeholder="Ask me anything about your documents..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className={cn(
                  "w-full pl-4 pr-12 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md focus:outline-none focus-visible:outline-none focus:ring-0 focus:ring-offset-0",
                  styles.inputField
                )}
                style={{ outline: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
              />
              {isLoading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <Loader2 className={cn("h-5 w-5 text-blue-500", styles.loadingSpinner)} />
                </div>
              )}
            </div>
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className={cn(
                "h-12 w-12 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                styles.sendButton
              )}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}