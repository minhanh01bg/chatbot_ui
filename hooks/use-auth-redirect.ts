'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from './use-current-user';

interface UseAuthRedirectOptions {
  redirectTo?: string;
  redirectIfAuthenticated?: boolean;
  loadingFallback?: React.ReactNode;
}

export function useAuthRedirect(options: UseAuthRedirectOptions = {}) {
  const { user, isLoading, isAuthenticated, isSuperAdmin } = useCurrentUser();
  const router = useRouter();
  const [showRedirectNotice, setShowRedirectNotice] = useState(false);
  
  const {
    redirectTo = '/admin',
    redirectIfAuthenticated = true,
    loadingFallback = null
  } = options;

  useEffect(() => {
    if (!isLoading && isAuthenticated && redirectIfAuthenticated) {
      // Nếu user đã đăng nhập và chúng ta muốn redirect
      console.log('User is authenticated, redirecting to:', redirectTo);
      
      // Hiển thị thông báo redirect trước
      setShowRedirectNotice(true);
      
      // Thêm delay để user thấy thông báo
      const timeout = setTimeout(() => {
        router.push(redirectTo);
      }, 3000); // 3 giây để user thấy thông báo

      return () => clearTimeout(timeout);
    }
  }, [isLoading, isAuthenticated, redirectIfAuthenticated, redirectTo, router]);

  return {
    user,
    isLoading,
    isAuthenticated,
    isSuperAdmin,
    loadingFallback,
    showRedirectNotice
  };
} 