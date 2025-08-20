/**
 * Utility functions for session management
 */

// Force refresh session by clearing cache and reloading
export const forceRefreshSession = () => {
  if (typeof window !== 'undefined') {
    // Clear any cached session data
    localStorage.removeItem('session_cache');
    sessionStorage.removeItem('session_cache');
    
    // Clear NextAuth session cache
    if (window.location) {
      // Force a hard reload to clear all caches
      window.location.reload();
    }
  }
};

// Check if session is valid
export const isSessionValid = () => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('access_token') || 
                document.cookie.split('; ').find(row => row.startsWith('client_access_token='))?.split('=')[1];
  
  return !!token;
};

// Get current user role
export const getCurrentUserRole = () => {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem('user_role') ||
         document.cookie.split('; ').find(row => row.startsWith('user_role='))?.split('=')[1];
};

// Check if user is super admin
export const isSuperAdmin = () => {
  const role = getCurrentUserRole();
  return role?.toLowerCase() === 'superadmin';
};

// Check if user is admin
export const isAdmin = () => {
  const role = getCurrentUserRole();
  return role?.toLowerCase() === 'admin' || role?.toLowerCase() === 'superadmin';
};

// Wait for session to be ready
export const waitForSession = (timeout = 5000): Promise<boolean> => {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const checkSession = () => {
      if (isSessionValid()) {
        resolve(true);
        return;
      }
      
      if (Date.now() - startTime > timeout) {
        resolve(false);
        return;
      }
      
      setTimeout(checkSession, 100);
    };
    
    checkSession();
  });
};

// Sync session data from cookies to localStorage
export const syncSessionData = () => {
  if (typeof window === 'undefined') return;
  
  // Sync access token
  const cookieToken = document.cookie.split('; ').find(row => row.startsWith('client_access_token='))?.split('=')[1];
  if (cookieToken && !localStorage.getItem('access_token')) {
    localStorage.setItem('access_token', cookieToken);
  }
  
  // Sync user ID
  const cookieUserId = document.cookie.split('; ').find(row => row.startsWith('user_id='))?.split('=')[1];
  if (cookieUserId && !localStorage.getItem('user_id')) {
    localStorage.setItem('user_id', cookieUserId);
  }
  
  // Sync user identifier
  const cookieUserIdentifier = document.cookie.split('; ').find(row => row.startsWith('user_identifier='))?.split('=')[1];
  if (cookieUserIdentifier && !localStorage.getItem('user_identifier')) {
    localStorage.setItem('user_identifier', cookieUserIdentifier);
  }
  
  // Sync user role
  const cookieUserRole = document.cookie.split('; ').find(row => row.startsWith('user_role='))?.split('=')[1];
  if (cookieUserRole && !localStorage.getItem('user_role')) {
    localStorage.setItem('user_role', cookieUserRole);
  }
}; 