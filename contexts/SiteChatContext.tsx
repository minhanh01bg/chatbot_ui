'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SiteChatContextType {
  currentSiteId: string | null;
  currentSiteToken: string | null;
  currentSiteName: string | null;
  setSiteChat: (siteId: string, siteToken: string, siteName: string) => void;
  clearSiteChat: () => void;
  isValidSiteChat: boolean;
}

const SiteChatContext = createContext<SiteChatContextType | undefined>(undefined);

export function SiteChatProvider({ children }: { children: React.ReactNode }) {
  const [currentSiteId, setCurrentSiteId] = useState<string | null>(null);
  const [currentSiteToken, setCurrentSiteToken] = useState<string | null>(null);
  const [currentSiteName, setCurrentSiteName] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    console.log('=== SITE CHAT CONTEXT MOUNTING ===');
    const savedSiteId = localStorage.getItem('current_site_id');
    const savedSiteToken = localStorage.getItem('current_site_token');
    const savedSiteName = localStorage.getItem('current_site_name');
    
    if (savedSiteId && savedSiteToken && savedSiteName) {
      console.log('Setting context from localStorage');
      setCurrentSiteId(savedSiteId);
      setCurrentSiteToken(savedSiteToken);
      setCurrentSiteName(savedSiteName);
    } else {
      console.log('No valid data in localStorage');
    }
  }, []);

  const setSiteChat = (siteId: string, siteToken: string, siteName: string) => {
    console.log('=== SET SITE CHAT CALLED ===');
    console.log('Setting site chat:', { siteId, siteName, tokenLength: siteToken.length });
    
    setCurrentSiteId(siteId);
    setCurrentSiteToken(siteToken);
    setCurrentSiteName(siteName);
    
    // Save to localStorage
    localStorage.setItem('current_site_id', siteId);
    localStorage.setItem('current_site_token', siteToken);
    localStorage.setItem('current_site_name', siteName);
    
    console.log('Site chat context set and saved to localStorage');
  };

  const clearSiteChat = () => {
    console.log('=== CLEAR SITE CHAT CALLED ===');
    setCurrentSiteId(null);
    setCurrentSiteToken(null);
    setCurrentSiteName(null);
    
    // Clear from localStorage
    localStorage.removeItem('current_site_id');
    localStorage.removeItem('current_site_token');
    localStorage.removeItem('current_site_name');
    
    console.log('Site chat context cleared');
  };

  const isValidSiteChat = !!(currentSiteId && currentSiteToken && currentSiteName);

  return (
    <SiteChatContext.Provider
      value={{
        currentSiteId,
        currentSiteToken,
        currentSiteName,
        setSiteChat,
        clearSiteChat,
        isValidSiteChat,
      }}
    >
      {children}
    </SiteChatContext.Provider>
  );
}

export function useSiteChat() {
  const context = useContext(SiteChatContext);
  if (context === undefined) {
    throw new Error('useSiteChat must be used within a SiteChatProvider');
  }
  return context;
}
