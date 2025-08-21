'use client';

import { useAuth } from '@/contexts/AuthContext';

interface CurrentUser {
  id: string;
  name?: string;
  email?: string;
  accessToken?: string;
  role?: string;
}

export function useCurrentUser() {
  const { user, isLoading, isAuthenticated, role, accessToken } = useAuth();

  const currentUser: CurrentUser | null = user ? {
    id: user.id,
    name: user.name || user.identifier,
    email: user.email || user.identifier,
    accessToken: accessToken || undefined,
    role: role || 'user',
  } : null;

  const isSuperAdmin = currentUser?.role?.trim().toLowerCase() === 'superadmin';

  return {
    user: currentUser,
    isLoading,
    isAuthenticated,
    isSuperAdmin,
  };
}
