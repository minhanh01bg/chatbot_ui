import { useState, useEffect, useCallback } from 'react';
import { getSession, clearSessionCache } from '@/lib/session-cache';

interface SessionData {
  user?: {
    id: string;
    name: string;
    email: string;
  };
  accessToken?: string;
  role?: string;
  expires?: string;
  debug?: any;
}

interface UseSessionCacheReturn {
  session: SessionData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  clear: () => void;
}

export function useSessionCache(forceRefresh = false): UseSessionCacheReturn {
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async (refresh = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const sessionData = await getSession(refresh);
      setSession(sessionData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch session';
      setError(errorMessage);
      console.error('useSessionCache: Error fetching session:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchSession(true);
  }, [fetchSession]);

  const clear = useCallback(() => {
    clearSessionCache();
    setSession(null);
    setError(null);
  }, []);

  useEffect(() => {
    fetchSession(forceRefresh);
  }, [fetchSession, forceRefresh]);

  return {
    session,
    isLoading,
    error,
    refresh,
    clear,
  };
} 