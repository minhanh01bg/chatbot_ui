"use client"

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ChatContainer from '@/components/stream-chat/ChatContainer';
import SiteSelector from '@/components/site/SiteSelector';

export default function ChatPage() {
  const router = useRouter();

  useEffect(() => {
    const siteToken = localStorage.getItem('site_token');
    const selectedSiteId = localStorage.getItem('selected_site_id');

    if (!siteToken || !selectedSiteId) {
      router.push('/');
    }
  }, [router]);

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
