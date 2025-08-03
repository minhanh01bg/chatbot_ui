'use client';

import { useCurrentUser } from './use-current-user';

interface UseAuthPermissionOptions {
  requiredRole?: string;
  requiredRoles?: string[];
  allowSuperAdmin?: boolean;
}

export function useAuthPermission(options: UseAuthPermissionOptions = {}) {
  const { user, isAuthenticated, isSuperAdmin } = useCurrentUser();
  const { requiredRole, requiredRoles = [], allowSuperAdmin = true } = options;

  // Nếu không yêu cầu role cụ thể, chỉ cần đăng nhập
  if (!requiredRole && requiredRoles.length === 0) {
    return {
      hasPermission: isAuthenticated,
      isAuthenticated,
      isSuperAdmin,
      userRole: user?.role,
      missingPermission: false
    };
  }

  // Kiểm tra nếu user là superadmin và được phép
  if (isSuperAdmin && allowSuperAdmin) {
    return {
      hasPermission: true,
      isAuthenticated,
      isSuperAdmin,
      userRole: user?.role,
      missingPermission: false
    };
  }

  // Kiểm tra role cụ thể
  const userRole = user?.role?.toLowerCase();
  const hasRequiredRole = requiredRole 
    ? userRole === requiredRole.toLowerCase()
    : requiredRoles.some(role => userRole === role.toLowerCase());

  return {
    hasPermission: isAuthenticated && hasRequiredRole,
    isAuthenticated,
    isSuperAdmin,
    userRole: user?.role,
    missingPermission: isAuthenticated && !hasRequiredRole
  };
} 