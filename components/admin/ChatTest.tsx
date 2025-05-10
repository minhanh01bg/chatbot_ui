'use client';

import { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ChatTestProps {
  className?: string;
  variant?: 'default' | 'embedded';
}

export default function ChatTest({ className, variant = 'default' }: ChatTestProps) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat
    const newMessage = { role: 'user' as const, content: message };
    setChatHistory(prev => [...prev, newMessage]);
    setMessage('');

    // TODO: Implement actual API call to your chatbot
    // For now, just simulate a response
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: 'This is a simulated response. Implement actual API integration here.'
      }]);
    }, 1000);
  };

  // Conditionally apply border based on the variant
  const isEmbedded = variant === 'embedded';

  return (
    <Card className={cn(
      "flex flex-col h-full",
      isEmbedded && "border-0 shadow-none",
      className
    )}>
      <CardContent className={cn(
        "flex-1 overflow-y-auto",
        isEmbedded ? "p-0" : "p-4"
      )}>
        {chatHistory.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            Ask a question to test your imported data
          </div>
        ) : (
          chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 ${
                msg.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
      </CardContent>

      <form onSubmit={handleSubmit} className={cn(
        isEmbedded ? "pt-4" : "p-4"
      )}>
        <div className="flex space-x-2">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            title="Send message"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </Card>
  );
} 