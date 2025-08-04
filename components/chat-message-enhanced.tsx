'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';
import { cn } from '@/lib/utils';
import { Markdown } from './markdown';

interface ChatMessageEnhancedProps {
  content: string;
  role: 'user' | 'assistant';
  timestamp?: Date;
  isLast?: boolean;
}

export const ChatMessageEnhanced = memo(({ 
  content, 
  role, 
  timestamp, 
  isLast = false 
}: ChatMessageEnhancedProps) => {
  const isUser = role === 'user';
  
  return (
    <motion.div
      className={cn(
        'flex gap-3 w-full',
        isUser ? 'justify-end' : 'justify-start'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3, 
        ease: 'easeOut',
        delay: isLast ? 0.1 : 0
      }}
    >
      <motion.div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3 shadow-sm',
          'chat-message transition-all duration-200',
          isUser 
            ? 'chat-message-user ml-2' 
            : 'chat-message-assistant mr-2'
        )}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
      >
        <div className="prose prose-sm max-w-none">
          <Markdown>{content}</Markdown>
        </div>
        
        {timestamp && (
          <div className={cn(
            'text-xs mt-2 opacity-60',
            isUser ? 'text-right' : 'text-left'
          )}>
            {timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
});

ChatMessageEnhanced.displayName = 'ChatMessageEnhanced'; 