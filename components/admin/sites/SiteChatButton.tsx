'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle, ExternalLink, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSiteChat } from '@/contexts/SiteChatContext';
import { Site } from '@/types/site';
import { useState } from 'react';

interface SiteChatButtonProps {
  site: Site;
  variant?: 'default' | 'compact';
}

export default function SiteChatButton({ site, variant = 'default' }: SiteChatButtonProps) {
  const router = useRouter();
  const { setSiteChat } = useSiteChat();
  const [isLoading, setIsLoading] = useState(false);

  const handleChatClick = async () => {
    console.log('=== SITE CHAT BUTTON CLICKED ===');
    console.log('Site data:', {
      id: site.id,
      name: site.name,
      hasToken: !!site.chat_token,
      tokenLength: site.chat_token?.length
    });

    // Check if required fields exist
    if (!site.id || !site.chat_token || !site.name) {
      console.error('Missing required site data for chat:', {
        id: site.id,
        hasToken: !!site.chat_token,
        name: site.name
      });
      return;
    }

    setIsLoading(true);

    try {
      // Set the site context for chat
      console.log('Setting site chat context...');
      setSiteChat(site.id, site.chat_token, site.name);
      
      console.log('Site context set, navigating to chat...');
      // Navigate to chat page
      router.push('/chat');
    } catch (error) {
      console.error('Error navigating to chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'compact') {
    return (
      <Button
        onClick={handleChatClick}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
        title="Start Chat"
        disabled={isLoading || !site.id || !site.chat_token}
      >
        <MessageCircle className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      onClick={handleChatClick}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 text-purple-700 hover:from-purple-100 hover:to-blue-100 hover:border-purple-300 hover:text-purple-800 transition-all duration-200 shadow-sm hover:shadow-md"
      disabled={isLoading || !site.id || !site.chat_token}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
      ) : (
        <MessageCircle className="w-4 h-4" />
      )}
      {isLoading ? 'Loading...' : 'Chat'}
    </Button>
  );
}
