'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';

interface SessionRefreshProps {
  redirectTo?: string;
  onSessionReady?: (user: any) => void;
}

export function SessionRefresh({ redirectTo, onSessionReady }: SessionRefreshProps) {
  const { user, isLoading, isAuthenticated } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      console.log('Session ready:', {
        userId: user.id,
        userRole: user.role,
        hasAccessToken: !!user.accessToken
      });

      // Call callback if provided
      if (onSessionReady) {
        onSessionReady(user);
      }

      // Redirect if specified
      if (redirectTo) {
        router.push(redirectTo);
      }
    }
  }, [isLoading, isAuthenticated, user, redirectTo, onSessionReady, router]);

  // Don't render anything, this is just for side effects
  return null;
} 