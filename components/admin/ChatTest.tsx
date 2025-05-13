'use client';

import { useState, useRef, useEffect } from 'react';
import { Site } from '@/components/admin/sites/SiteDocuments';
import { message } from '@/lib/db/schema';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, User, ArrowDown, Send } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatTestProps {
  variant?: 'embedded' | 'fullpage';
  siteId?: string;
  site?: Site;
}

export default function ChatTest({ variant = 'embedded', siteId, site}: ChatTestProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
          type: msg.role,
          content: msg.content,
        })),
        session_id: siteId,
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
      // setMessages(prev => [...prev, botMessage]);
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
    <div className={cn(
      "flex flex-col",
      variant === 'fullpage' ? "h-[calc(100vh-8rem)] max-w-3xl mx-auto" : "h-full"
    )}>
      <ScrollArea 
        ref={scrollAreaRef} 
        onScroll={handleScroll}
        className="flex-1 p-4"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-10 text-muted-foreground">
            <Bot className="h-12 w-12 mb-4 opacity-50" />
            <h3 className="font-medium text-lg mb-2">Test Your Documents</h3>
            <p className="max-w-sm">
              Ask questions to see how your AI responds using the documents you've imported.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index}
                className={cn(
                  "flex items-start gap-3 rounded-lg p-3",
                  message.role === 'user' ? "ml-auto max-w-[80%] bg-primary text-primary-foreground" : "mr-auto max-w-[80%] bg-muted"
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1 overflow-hidden">
                  <p className="whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <p className="mt-1 text-xs opacity-50">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-background text-foreground">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>
      
      {showScrollButton && (
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-20 right-6 rounded-full shadow-md"
          onClick={scrollToBottom}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
} 