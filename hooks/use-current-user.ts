'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    if (status === 'authenticated' && session?.user) {
      setUser({
        id: session.user.id!,
        name: session.user.name || undefined,
        email: session.user.email || undefined,
        accessToken: (session as any).accessToken,
      });
      setIsLoading(false);
    } else if (status === 'unauthenticated') {
      setUser(null);
      setIsLoading(false);
    }
  }, [session, status]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
