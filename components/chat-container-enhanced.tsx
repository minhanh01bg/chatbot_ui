'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChatMessageEnhanced } from './chat-message-enhanced';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp?: Date;
}

interface ChatContainerEnhancedProps {
  messages: Message[];
  className?: string;
  isLoading?: boolean;
}

export const ChatContainerEnhanced = ({ 
  messages, 
  className,
  isLoading = false 
}: ChatContainerEnhancedProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={cn(
      'flex flex-col h-full overflow-hidden',
      className
    )}>
      <div className="flex-1 overflow-y-auto chat-scroll-area px-4 py-6 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <ChatMessageEnhanced
              key={message.id}
              content={message.content}
              role={message.role}
              timestamp={message.timestamp}
              isLast={index === messages.length - 1}
            />
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.div
              className="chat-message-assistant max-w-[85%] rounded-2xl px-4 py-3 shadow-sm mr-2"
              animate={{ 
                opacity: [0.6, 1, 0.6],
                transition: { duration: 1.5, repeat: Infinity }
              }}
            >
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      transition: { duration: 0.6, repeat: Infinity, delay: 0 }
                    }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      transition: { duration: 0.6, repeat: Infinity, delay: 0.2 }
                    }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      transition: { duration: 0.6, repeat: Infinity, delay: 0.4 }
                    }}
                  />
                </div>
                <span className="text-sm text-gray-500">Đang nhập...</span>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}; 