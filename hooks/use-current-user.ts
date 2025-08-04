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
        setUser(null);
        setIsLoading(false);
      }

      // Ensure loading is stopped if NextAuth is not loading and we've checked storage
      if (status !== 'loading' && hasCheckedStorage && isLoading) {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [session, status, hasCheckedStorage]);

  // Force check on mount for client-side hydration
  useEffect(() => {
    if (typeof window !== 'undefined' && !hasCheckedStorage && status !== 'loading') {
      setHasCheckedStorage(false); // Trigger re-check
    }
  }, [hasCheckedStorage, status]);

  // Timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
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
