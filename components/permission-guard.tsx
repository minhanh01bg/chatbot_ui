'use client';

import { ReactNode } from 'react';
import { useAuthPermission } from '@/hooks/use-auth-permission';
import { AuthRequiredNotice } from './auth-required-notice';
import { AccessDenied } from './access-denied';
import { LoadingSpinner } from './loading-spinner';

interface PermissionGuardProps {
  children: ReactNode;
  requiredRole?: string;
  requiredRoles?: string[];
  allowSuperAdmin?: boolean;
  loadingComponent?: ReactNode;
  accessDeniedMessage?: string;
  authRequiredMessage?: string;
}

export function PermissionGuard({ 
  children, 
  requiredRole,
  requiredRoles = [],
  allowSuperAdmin = true,
  loadingComponent = null,
  accessDeniedMessage = "You don't have permission to access this page.",
  authRequiredMessage = "Please log in to access this page."
}: PermissionGuardProps) {
  const { 
    hasPermission, 
    isAuthenticated, 
    userRole, 
    missingPermission 
  } = useAuthPermission({
    requiredRole,
    requiredRoles,
    allowSuperAdmin
  });

  // Hiển thị loading nếu đang kiểm tra authentication
  if (typeof isAuthenticated === 'undefined') {
    return loadingComponent ? (
      <>{loadingComponent}</>
    ) : (
      <LoadingSpinner text="Checking permissions..." />
    );
  }

  // Nếu chưa đăng nhập
  if (!isAuthenticated) {
    return (
      <AuthRequiredNotice 
        message={authRequiredMessage}
        title="Authentication Required"
      />
    );
  }

  // Nếu đã đăng nhập nhưng không có quyền
  if (missingPermission) {
    return (
      <AccessDenied 
        message={accessDeniedMessage}
        requiredRole={requiredRole || requiredRoles.join(' or ')}
        userRole={userRole}
      />
    );
  }

  // Nếu có quyền, hiển thị children
  return <>{children}</>;
} 