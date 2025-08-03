"use client"

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChatContainer from '@/components/stream-chat/ChatContainer';
import SiteSelector from '@/components/site/SiteSelector';
import { useSiteChat } from '@/contexts/SiteChatContext';

export default function ChatPage() {
  const router = useRouter();
  const { isValidSiteChat } = useSiteChat();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait longer for context to load from localStorage
    const timer = setTimeout(() => {
      console.log('ChatPage: Context load timeout completed');
      setIsLoading(false);
    }, 500); // Increased from 100ms to 500ms

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log('ChatPage: isValidSiteChat changed:', isValidSiteChat);
    console.log('ChatPage: isLoading:', isLoading);
    
    // Only redirect after initial load and if no valid site chat
    if (!isLoading && !isValidSiteChat) {
      console.log('No valid site chat context, redirecting to home');
      router.push('/');
    }
  }, [isValidSiteChat, isLoading, router]);

  // Show loading while checking context
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col">
      <div className="flex-1 w-full overflow-hidden">
        <div className="relative h-full w-full">
          <ChatContainer />
        </div>
      </div>
    </div>
  );
}
