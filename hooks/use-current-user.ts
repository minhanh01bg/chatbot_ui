'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
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
      console.log('useCurrentUser: Checking auth...', {
        status,
        hasSession: !!session,
        sessionUser: session?.user,
        sessionUserId: session?.user?.id,
        sessionAccessToken: !!(session as any)?.accessToken,
        sessionRole: (session as any)?.role
      });

      // Check localStorage/cookies first (immediate after login)
      if (!hasCheckedStorage && typeof window !== 'undefined') {
        console.log('useCurrentUser: Checking localStorage/cookies first...');
        debugAuthState();
        setHasCheckedStorage(true);

        const token = getClientAuthToken();

        console.log('useCurrentUser: Token found?', {
          hasToken: !!token,
          tokenLength: token?.length
        });

        if (token) {
          console.log('useCurrentUser: Creating user with token from storage');

          // Get user info from localStorage/cookies
          const userId = localStorage.getItem('user_id') ||
                        document.cookie.split('; ').find(row => row.startsWith('user_id='))?.split('=')[1];

          const userIdentifier = localStorage.getItem('user_identifier') ||
                               document.cookie.split('; ').find(row => row.startsWith('user_identifier='))?.split('=')[1];

          const userRole = localStorage.getItem('user_role') ||
                          document.cookie.split('; ').find(row => row.startsWith('user_role='))?.split('=')[1];

          console.log('useCurrentUser: User info from storage:', { 
            userId, 
            userIdentifier, 
            userRole,
            localStorageKeys: typeof window !== 'undefined' ? Object.keys(localStorage) : [],
            cookieKeys: document.cookie.split('; ').map(c => c.split('=')[0])
          });

          setUser({
            id: userId || 'authenticated-user',
            name: userIdentifier || 'User',
            email: userIdentifier || 'user@example.com',
            accessToken: token,
            role: userRole,
          });
          setIsLoading(false);
          return;
        }
      }

      // Check NextAuth session as fallback
      if (status === 'authenticated' && session?.user) {
        console.log('useCurrentUser: Found NextAuth session', {
          userId: session.user.id,
          userName: session.user.name,
          userEmail: session.user.email,
          hasAccessToken: !!(session as any).accessToken,
          userRole: (session as any).role
        });

        setUser({
          id: session.user.id!,
          name: session.user.name || undefined,
          email: session.user.email || undefined,
          accessToken: (session as any).accessToken,
          role: (session as any).role,
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
        console.log('useCurrentUser: NextAuth finished loading, stopping our loading state');
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

  // Timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log('useCurrentUser: Timeout reached, stopping loading state');
        setIsLoading(false);
      }
    }, 5000); // 5 seconds timeout

    return () => clearTimeout(timeout);
  }, [isLoading]);

  const isSuperAdmin = user?.role?.trim().toLowerCase() === 'superadmin';
  
  console.log('useCurrentUser: Role check:', {
    userRole: user?.role,
    roleType: typeof user?.role,
    roleLength: user?.role?.length,
    isSuperAdmin,
    comparison: user?.role?.trim().toLowerCase() === 'superadmin',
    trimmedRole: user?.role?.trim().toLowerCase()
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isSuperAdmin,
  };
}
