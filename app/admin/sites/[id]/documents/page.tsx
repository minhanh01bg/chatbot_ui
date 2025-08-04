'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import SiteDocuments from '@/components/admin/sites/SiteDocuments';
import ChatTest from '@/components/admin/ChatTest';
import { Site } from '@/types/site';
import { getSiteById } from '@/services/site.service';
import { getClientAuthToken } from '@/lib/auth-utils';

interface SiteDocumentsPageProps {
  params: {
    id: string;
  };
}

export default function SiteDocumentsPage({ }: SiteDocumentsPageProps) {
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
    const loadSiteData = async () => {
      try {
        // Get site data from localStorage first
        const storedSite = localStorage.getItem('selected_site');
        if (storedSite) {
          try {
            const parsedSite = JSON.parse(storedSite);
            // Verify this is the correct site
            if (parsedSite._id === siteId || parsedSite.id === siteId) {
              setSite(parsedSite);
              setIsLoading(false);
              return;
            } else {
              // Site ID mismatch, try to load from API
              console.warn('Site ID mismatch between stored site and URL parameters. Loading from API...');
            }
          } catch (e) {
            console.warn('Error parsing stored site:', e);
          }
        }

        // Try to load site data from API
        try {
          const apiSite = await getSiteById(siteId);
          setSite(apiSite);
        } catch (apiError) {
          console.warn('Failed to load site from API:', apiError);
          
          // Check if it's an authentication error
          const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
          if (errorMessage.includes('Access token not found') || errorMessage.includes('401')) {
            console.warn('Authentication error - user may need to log in again');
            // You could show a toast notification here if needed
          }
          
          // Fallback to minimal site data with preserved chat_token
          const fallbackSite: Site = {
            name: 'Site',
            _id: siteId,
            id: siteId,
            chat_token: undefined
          };
          
          // Try to preserve chat_token from stored site if available
          if (storedSite) {
            try {
              const parsedStoredSite = JSON.parse(storedSite);
              fallbackSite.chat_token = parsedStoredSite.chat_token || undefined;
            } catch (e) {
              console.warn('Error parsing stored site for chat_token:', e);
            }
          }
          
          setSite(fallbackSite);
        }
              } catch (error) {
          console.error('Error loading site data:', error);
          // Check if it's an authentication error
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (errorMessage.includes('Access token not found') || errorMessage.includes('401')) {
            console.warn('Authentication error in final catch - user may need to log in again');
          }
          // Final fallback
          setSite({
            name: 'Site',
            _id: siteId,
            id: siteId,
            chat_token: undefined
          });
        } finally {
          setIsLoading(false);
        }
    };

    loadSiteData();
  }, [siteId]);

  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="w-full grid grid-cols-1 lg:grid-cols-8 gap-3">
        <div className="lg:col-span-4 flex items-center justify-center">
          {isLoading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p>Loading site information...</p>
            </div>
                  ) : site ? (
          site.chat_token ? (
            <SiteDocuments siteId={siteId} site={site} />
          ) : (
            <div className="text-center py-10 text-yellow-600">
              <p>Site loaded but no chat token found.</p>
              <p className="text-sm mt-1 text-muted-foreground">
                Documents cannot be loaded without a chat token.
              </p>
              <p className="text-xs mt-1 text-muted-foreground">
                Please configure the site with a valid chat token.
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-10 text-red-500">
            <p>Failed to load site information.</p>
            <p className="text-sm mt-1 text-muted-foreground">
              Please check your authentication and try again.
            </p>
            <p className="text-xs mt-2 text-muted-foreground">
              Site ID: {siteId}
            </p>
            <p className="text-xs mt-1 text-muted-foreground">
              If you're not logged in, please log in and try again.
            </p>
          </div>
        )}
        </div>

        <div className="lg:col-span-4 flex items-center justify-center">
          {isLoading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p>Loading chat interface...</p>
            </div>
                  ) : site ? (
          site.chat_token ? (
            <ChatTest variant="embedded" site={site} />
          ) : (
            <div className="text-center py-10 text-yellow-600">
              <p>Site loaded but no chat token found.</p>
              <p className="text-sm mt-1 text-muted-foreground">
                This site may not be properly configured for chat.
              </p>
              <p className="text-xs mt-1 text-muted-foreground">
                Please configure the site with a valid chat token.
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-10 text-red-500">
            <p>Failed to load chat interface.</p>
            <p className="text-sm mt-1 text-muted-foreground">
              Please check your authentication and try again.
            </p>
            <p className="text-xs mt-1 text-muted-foreground">
              If you're not logged in, please log in and try again.
            </p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}