'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from './loading-spinner';
import { useCurrentUser } from '@/hooks/use-current-user';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated || !user) {
      console.log('AuthGuard: User not authenticated, redirecting to login');
      router.push('/login');
    } else {
      console.log('AuthGuard: User authenticated:', {
        userId: user.id,
        userRole: user.role,
        hasAccessToken: !!user.accessToken
      });
    }
  }, [isAuthenticated, user, isLoading, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return <>{children}</>;
} 