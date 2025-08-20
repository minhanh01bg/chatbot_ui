'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getClientAuthToken, debugAuthState } from '@/lib/auth-utils';

interface CurrentUser {
  id: string;
  name?: string;
  email?: string;
  accessToken?: string;
  role?: string;
}

export function useCurrentUser() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // Check localStorage/cookies first (immediate after login)
      if (!hasCheckedStorage && typeof window !== 'undefined') {
        debugAuthState();
        setHasCheckedStorage(true);

        const token = getClientAuthToken();

        if (token) {
          // Get user info from localStorage/cookies
          const userId = localStorage.getItem('user_id') ||
                        document.cookie.split('; ').find(row => row.startsWith('user_id='))?.split('=')[1];

          const userIdentifier = localStorage.getItem('user_identifier') ||
                               document.cookie.split('; ').find(row => row.startsWith('user_identifier='))?.split('=')[1];

          const userRole = localStorage.getItem('user_role') ||
                          document.cookie.split('; ').find(row => row.startsWith('user_role='))?.split('=')[1];

          console.log('useCurrentUser: Found token in storage:', {
            hasToken: !!token,
            userId: userId,
            userIdentifier: userIdentifier,
            userRole: userRole,
            tokenFirstChars: token.substring(0, 10) + '...'
          });

          setUser({
            id: userId || 'authenticated-user',
            name: userIdentifier || 'User',
            email: userIdentifier || 'user@example.com',
            accessToken: token,
            role: userRole || 'superadmin',
          });
          setIsLoading(false);
          return;
        }
      }

      // Check NextAuth session as fallback
      if (status === 'authenticated' && session?.user) {
        console.log('useCurrentUser: Using NextAuth session:', {
          userId: session.user.id,
          userName: session.user.name,
          hasAccessToken: !!(session as any).accessToken,
          role: (session as any).role
        });

        setUser({
          id: session.user.id!,
          name: session.user.name || undefined,
          email: session.user.email || undefined,
          accessToken: (session as any).accessToken,
          role: (session as any).role || 'superadmin',
        });
        setIsLoading(false);
        return;
      }

      // No authentication found
      if (status === 'unauthenticated' && hasCheckedStorage) {
        console.log('useCurrentUser: No authentication found');
        setUser(null);
        setIsLoading(false);
      }

      // Ensure loading is stopped if NextAuth is not loading and we've checked storage
      if (status !== 'loading' && hasCheckedStorage && isLoading) {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [status, session, hasCheckedStorage, isLoading]);

  // Force check on mount for client-side hydration
  useEffect(() => {
    if (typeof window !== 'undefined' && !hasCheckedStorage && status !== 'loading') {
      setHasCheckedStorage(false); // Trigger re-check
    }
  }, [hasCheckedStorage, status]);

  // Add a more aggressive check for session updates
  useEffect(() => {
    const checkSessionUpdate = () => {
      const token = getClientAuthToken();
      if (token && (!user?.accessToken || user.accessToken !== token)) {
        // Token changed, update user
        const userId = localStorage.getItem('user_id') ||
                      document.cookie.split('; ').find(row => row.startsWith('user_id='))?.split('=')[1];

        const userIdentifier = localStorage.getItem('user_identifier') ||
                             document.cookie.split('; ').find(row => row.startsWith('user_identifier='))?.split('=')[1];

        const userRole = localStorage.getItem('user_role') ||
                        document.cookie.split('; ').find(row => row.startsWith('user_role='))?.split('=')[1];

        console.log('useCurrentUser: Token updated, refreshing user data:', {
          userId: userId,
          userIdentifier: userIdentifier,
          userRole: userRole
        });

        setUser({
          id: userId || 'authenticated-user',
          name: userIdentifier || 'User',
          email: userIdentifier || 'user@example.com',
          accessToken: token,
          role: userRole || 'superadmin',
        });
      }
    };

    // Check immediately
    checkSessionUpdate();

    // Set up interval to check for session updates
    const interval = setInterval(checkSessionUpdate, 1000); // Check every second

    return () => clearInterval(interval);
  }, [user?.accessToken]);

  // Timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log('useCurrentUser: Loading timeout reached, stopping loading state');
        setIsLoading(false);
      }
    }, 5000); // 5 seconds timeout

    return () => clearTimeout(timeout);
  }, [isLoading]);

  const isSuperAdmin = user?.role?.trim().toLowerCase() === 'superadmin';

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isSuperAdmin,
  };
}
