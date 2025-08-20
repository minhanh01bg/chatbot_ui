'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import { Loader2 } from 'lucide-react';

interface SessionLoadingProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SessionLoading({ children, fallback }: SessionLoadingProps) {
  const { isLoading } = useCurrentUser();

  if (isLoading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 