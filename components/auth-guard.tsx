'use client';

import { ReactNode } from 'react';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { LoadingSpinner } from './loading-spinner';
import { RedirectNotice } from './redirect-notice';
import { AuthRequiredNotice } from './auth-required-notice';

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
  redirectIfAuthenticated?: boolean;
  loadingComponent?: ReactNode;
  requireAuth?: boolean;
  authRequiredMessage?: string;
}

export function AuthGuard({ 
  children, 
  redirectTo = '/admin',
  redirectIfAuthenticated = true,
  loadingComponent = null,
  requireAuth = false,
  authRequiredMessage = "Please log in to access this page."
}: AuthGuardProps) {
  const { isLoading, loadingFallback, showRedirectNotice, isAuthenticated } = useAuthRedirect({
    redirectTo,
    redirectIfAuthenticated,
    loadingFallback: loadingComponent
  });

  // Hiển thị loading component nếu đang loading
  if (isLoading) {
    return loadingComponent ? (
      <>{loadingComponent}</>
    ) : (
      <LoadingSpinner text="Checking authentication..." />
    );
  }

  // Hiển thị thông báo redirect nếu cần
  if (showRedirectNotice) {
    return <RedirectNotice redirectTo={redirectTo} />;
  }

  // Nếu yêu cầu auth và user chưa đăng nhập
  if (requireAuth && !isLoading && !isAuthenticated) {
    return <AuthRequiredNotice message={authRequiredMessage} />;
  }

  // Nếu không loading và không redirect, hiển thị children
  return <>{children}</>;
} 