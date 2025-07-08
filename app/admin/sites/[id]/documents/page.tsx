'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import SiteDocuments from '@/components/admin/sites/SiteDocuments';
import ChatTest from '@/components/admin/ChatTest';

interface Site {
  _id?: string;
  id?: string;
  name: string;
  domain?: string;
  chat_token?: string;
  [key: string]: any;
}

interface SiteDocumentsPageProps {
  params: {
    id: string;
  };
}

export default function SiteDocumentsPage({ params }: SiteDocumentsPageProps) {
  // Get site ID from pathname to avoid accessing params.id directly
  const pathname = usePathname();
  const siteId = React.useMemo(() => {
    // Extract siteId from the path - format: /admin/sites/[id]/documents
    const pathParts = pathname.split('/');
    return pathParts[3] || '';
  }, [pathname]);

  const [site, setSite] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get site data from localStorage
    const storedSite = localStorage.getItem('selected_site');
    if (storedSite) {
      try {
        const parsedSite = JSON.parse(storedSite);
        // Verify this is the correct site
        if (parsedSite._id === siteId || parsedSite.id === siteId) {
          setSite(parsedSite);
        } else {
          // Site ID mismatch, load from API
          console.error('Site ID mismatch between stored site and URL parameters');
          setSite({
            name: 'Site',
            _id: siteId,
            id: siteId
          });
        }
      } catch (e) {
        console.error('Error parsing stored site:', e);
        setSite({
          name: 'Site',
          _id: siteId,
          id: siteId
        });
      }
    } else {
      // No stored site, use minimal data
      setSite({
        name: 'Site',
        _id: siteId,
        id: siteId
      });
    }
    setIsLoading(false);

    // Optional: Clear localStorage after use
    // localStorage.removeItem('selected_site');
  }, [siteId]);

  return (
    <div className=''>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <div className="lg:col-span-4">
          {isLoading ? (
            <div className="text-center py-10">Loading site information...</div>
          ) : site ? (
            <SiteDocuments siteId={siteId} site={site} />
          ) : (
            <div className="text-center py-10 text-red-500">
              Failed to load site information. Please try again later.
            </div>
          )}
        </div>

        <div className="h-full grid-col-span-1 lg:col-span-2">
          <div className="flex flex-col border rounded-lg bg-background shadow overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b">
              <h2 className="text-xl font-semibold mb-2">Test Imported Data</h2>
              <p className="text-sm text-muted-foreground">
                Use this chat interface to test how your imported documents respond to queries.
              </p>
            </div>
            <div className="px-2 py-2 flex-1 overflow-y-auto">
              {isLoading ? (
                  <div className="text-center py-10">Loading chat interface...</div>
                ) : site ? (
                  <ChatTest variant="embedded" siteId={siteId} site={site} />
                ) : (
                  <div className="text-center py-10 text-red-500">
                    Failed to load chat interface. Please try again later.
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}