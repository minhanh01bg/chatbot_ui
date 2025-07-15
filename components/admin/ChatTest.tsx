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
import { Bot, User, ArrowDown, Send, MessageSquare, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


interface ChatTestProps {
  variant?: 'embedded' | 'fullpage';
  site?: Site;
}

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
    <Card className={cn(
      "flex flex-col h-[calc(100vh-9rem)] w-full",
      variant === 'fullpage' ? "max-w-3xl mx-auto" : ""
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 flex-shrink-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chat Test
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Test your AI assistant with {site?.name || 'this site'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            {messages.length} messages
          </Badge>
          {site?.chat_token && (
            <Badge variant="secondary">Connected</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 p-0 flex flex-col">
        <div className="flex-1 min-h-0 relative">
        <ScrollArea
          ref={scrollAreaRef}
          onScroll={handleScroll}
          className="h-full"
        >
          <div className="p-4 space-y-4">
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
                      {message.role === 'assistant' ? (
                        <div className="prose prose-sm max-w-none dark:prose-invert text-gray-800 dark:text-gray-200">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code: ({ className, children, ...props }: any) => {
                                const match = /language-(\w+)/.exec(className || '');
                                const isInline = !match;
                                return isInline ? (
                                  <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                                    {children}
                                  </code>
                                ) : (
                                  <pre className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 rounded-lg overflow-x-auto my-3 border border-gray-200 dark:border-gray-700">
                                    <code className={`${className} text-sm font-mono`} {...props}>
                                      {children}
                                    </code>
                                  </pre>
                                );
                              },
                              pre: ({ children }) => <div>{children}</div>,
                              h1: ({ children }) => <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0 pb-1 border-b border-gray-200 dark:border-gray-700">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-lg font-semibold mb-2 mt-3 first:mt-0 pb-0.5">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-base font-medium mb-1 mt-2 first:mt-0">{children}</h3>,
                              ul: ({ children }) => <ul className="list-disc ml-5 mb-4 space-y-1">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal ml-5 mb-4 space-y-1">{children}</ol>,
                              li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
                              p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed text-gray-800 dark:text-gray-200">{children}</p>,
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-3 bg-gray-50 dark:bg-gray-800/50 py-2 rounded-r text-gray-700 dark:text-gray-300">
                                  {children}
                                </blockquote>
                              ),
                              strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>,
                              em: ({ children }) => <em className="italic text-gray-800 dark:text-gray-200">{children}</em>,
                              table: ({ children }) => (
                                <div className="overflow-x-auto my-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                  <table className="min-w-full border-collapse">
                                    {children}
                                  </table>
                                </div>
                              ),
                              th: ({ children }) => (
                                <th className="border-b border-r last:border-r-0 border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-800 font-semibold text-left text-gray-700 dark:text-gray-300">
                                  {children}
                                </th>
                              ),
                              td: ({ children }) => (
                                <td className="border-b border-r last:border-r-0 border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-800 dark:text-gray-200">
                                  {children}
                                </td>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap break-words leading-relaxed">
                          {message.content}
                        </p>
                      )}
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
          </div>
        </ScrollArea>

        {showScrollButton && (
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-20 right-6 rounded-full shadow-md z-10"
            onClick={scrollToBottom}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        )}
        </div>

        <div className="border-t p-4 flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
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
          </form>
        </div>
      </CardContent>
    </Card>
  );
}