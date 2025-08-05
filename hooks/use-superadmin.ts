import { useSession } from 'next-auth/react';

export function useSuperAdmin() {
  const { data: session, status } = useSession();
  
  const isSuperAdmin = (session as any)?.role === 'superadmin';
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  
  return {
    isSuperAdmin,
    isLoading,
    isAuthenticated,
    session
  };
} 