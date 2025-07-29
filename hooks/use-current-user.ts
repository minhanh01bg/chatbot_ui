'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getClientAuthToken, debugAuthState } from '@/lib/auth-utils';

interface CurrentUser {
  id: string;
  name?: string;
  email?: string;
  accessToken?: string;
}

export function useCurrentUser() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      console.log('useCurrentUser: Checking auth...', { status, hasSession: !!session });

      // Check NextAuth session first
      if (status === 'authenticated' && session?.user) {
        console.log('useCurrentUser: Found NextAuth session');
        setUser({
          id: session.user.id!,
          name: session.user.name || undefined,
          email: session.user.email || undefined,
          accessToken: (session as any).accessToken,
        });
        setIsLoading(false);
        setHasCheckedStorage(true);
        return;
      }

      // Only check localStorage after NextAuth has finished loading
      if (status !== 'loading' && !hasCheckedStorage) {
        console.log('useCurrentUser: Checking localStorage/cookies...');
        debugAuthState();
        setHasCheckedStorage(true);

        const token = getClientAuthToken();

        console.log('useCurrentUser: Token found?', {
          hasToken: !!token,
          tokenLength: token?.length
        });

        if (token) {
          console.log('useCurrentUser: Creating user with token');

          // Get user info from localStorage/cookies
          const userId = localStorage.getItem('user_id') ||
                        document.cookie.split('; ').find(row => row.startsWith('user_id='))?.split('=')[1];

          const userIdentifier = localStorage.getItem('user_identifier') ||
                               document.cookie.split('; ').find(row => row.startsWith('user_identifier='))?.split('=')[1];

          console.log('useCurrentUser: User info from storage:', { userId, userIdentifier });

          setUser({
            id: userId || 'google-user',
            name: userIdentifier || 'Google User',
            email: userIdentifier || 'user@gmail.com',
            accessToken: token,
          });
          setIsLoading(false);
          return;
        }

      }

      // No authentication found
      if (status === 'unauthenticated') {
        console.log('useCurrentUser: No authentication found');
        setUser(null);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [session, status, hasCheckedStorage]);

  // Force check on mount for client-side hydration
  useEffect(() => {
    if (typeof window !== 'undefined' && !hasCheckedStorage && status !== 'loading') {
      console.log('useCurrentUser: Force checking on mount...');
      setHasCheckedStorage(false); // Trigger re-check
    }
  }, [hasCheckedStorage, status]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
