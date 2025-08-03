'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSiteChat } from '@/contexts/SiteChatContext';
import { Site } from '@/types/site';

interface SiteChatButtonProps {
  site: Site;
}

export default function SiteChatButton({ site }: SiteChatButtonProps) {
  const router = useRouter();
  const { setSiteChat } = useSiteChat();

  const handleChatClick = () => {
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

    // Set the site context for chat
    console.log('Setting site chat context...');
    setSiteChat(site.id, site.chat_token, site.name);
    
    console.log('Site context set, navigating to chat...');
    // Navigate to chat page
    router.push('/chat');
  };

  return (
    <Button
      onClick={handleChatClick}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <MessageCircle className="w-4 h-4" />
      Chat
    </Button>
  );
}
