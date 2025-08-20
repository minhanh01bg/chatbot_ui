import { useCurrentUser } from './use-current-user';

export function useSuperAdmin() {
  const { user, isLoading, isAuthenticated, isSuperAdmin } = useCurrentUser();
  
  return {
    isSuperAdmin,
    isLoading,
    isAuthenticated,
    user
  };
} 