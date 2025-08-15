'use client';

import { useState, useEffect } from 'react';
import { ChatMessage } from '@/types/site';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './ChatTest.module.css';

interface MessageBubbleProps {
  message: ChatMessage;
  index: number;
  isTyping?: boolean;
}

export default function MessageBubble({ message, index, isTyping = false }: MessageBubbleProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className={cn(
        "flex items-start gap-4",
        message.role === 'user' ? "ml-auto max-w-[85%] flex-row-reverse" : "mr-auto max-w-[85%]",
        message.role === 'user' ? styles.messageUser : styles.messageAssistant
      )}
    >
      {message.role === 'assistant' && (
        <Avatar className={cn("h-10 w-10 ring-2 ring-blue-100 dark:ring-blue-900/50 shadow-lg", styles.avatar)}>
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "flex-1 overflow-hidden rounded-2xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl",
        message.role === 'user' 
          ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white ml-4" 
          : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mr-4",
        styles.messageBubble
      )}>
        {message.role === 'assistant' ? (
          <div className="prose prose-sm max-w-none dark:prose-invert text-gray-800 dark:text-gray-200">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: ({ className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match;
                  return isInline ? (
                    <code className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-md text-sm font-mono border border-gray-200 dark:border-gray-600" {...props}>
                      {children}
                    </code>
                  ) : (
                    <pre className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-4 rounded-xl overflow-x-auto my-4 border border-gray-200 dark:border-gray-600 shadow-inner">
                      <code className={`${className} text-sm font-mono`} {...props}>
                        {children}
                      </code>
                    </pre>
                  );
                },
                pre: ({ children }) => <div>{children}</div>,
                h1: ({ children }) => <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0 pb-2 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-semibold mb-2 mt-3 first:mt-0 text-gray-900 dark:text-white">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-medium mb-1 mt-2 first:mt-0 text-gray-900 dark:text-white">{children}</h3>,
                ul: ({ children }) => <ul className="list-disc ml-5 mb-4 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal ml-5 mb-4 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
                p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed text-gray-800 dark:text-gray-200">{children}</p>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-300 dark:border-blue-600 pl-4 italic my-3 bg-blue-50 dark:bg-blue-950/30 py-3 rounded-r-xl text-gray-700 dark:text-gray-300">
                    {children}
                  </blockquote>
                ),
                strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>,
                em: ({ children }) => <em className="italic text-gray-800 dark:text-gray-200">{children}</em>,
                table: ({ children }) => (
                  <div className="overflow-x-auto my-4 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
                    <table className="min-w-full border-collapse">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border-b border-r last:border-r-0 border-gray-200 dark:border-gray-600 px-4 py-3 bg-gray-50 dark:bg-gray-700 font-semibold text-left text-gray-700 dark:text-gray-300">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border-b border-r last:border-r-0 border-gray-200 dark:border-gray-600 px-4 py-3 text-gray-800 dark:text-gray-200">
                    {children}
                  </td>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="whitespace-pre-wrap break-words leading-relaxed font-medium">
            {message.content}
          </p>
        )}
        
        <div className={cn(
          "mt-2 text-xs opacity-70 flex items-center gap-1",
          message.role === 'user' ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
        )}>
          <div className="w-1 h-1 rounded-full bg-current"></div>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {message.role === 'user' && (
        <Avatar className={cn("h-10 w-10 ring-2 ring-blue-100 dark:ring-blue-900/50 shadow-lg", styles.avatar)}>
          <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gray-600 text-white font-semibold">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
} 