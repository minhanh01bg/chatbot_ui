'use client';

// Utility function to format tokens for display
export const formatTokenForDisplay = (token: string | null | undefined): string | null => {
  if (!token) return null;
  if (token.length <= 40) return token; // If short, show full token
  return `${token.substring(0, 20)}...${token.substring(token.length - 10)}`;
};

export function getClientAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Check localStorage first
  const localToken = localStorage.getItem('access_token');
  if (localToken) {
    console.log('Found token in localStorage');
    return localToken;
  }
  
  // Check cookies - try both naming conventions
  const clientToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('client_access_token='))
    ?.split('=')[1];
    
  if (clientToken) {
    console.log('Found token in client_access_token cookie');
    return clientToken;
  }
  
  // Check for access_token cookie (set by server)
  const serverToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('access_token='))
    ?.split('=')[1];
    
  if (serverToken) {
    console.log('Found token in access_token cookie');
    return serverToken;
  }
  
  console.log('No token found in localStorage or cookies');
  return null;
}

export function hasClientAuth(): boolean {
  return !!getClientAuthToken();
}

export function debugAuthState() {
  // Debug logging enabled for troubleshooting
  if (typeof window === 'undefined') return;

  const localToken = localStorage.getItem('access_token');
  const userId = localStorage.getItem('user_id');
  const userIdentifier = localStorage.getItem('user_identifier');
  const userRole = localStorage.getItem('user_role');
  const cookies = document.cookie;

  // Extract tokens from cookies
  const clientToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('client_access_token='))
    ?.split('=')[1];
    
  const serverToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('access_token='))
    ?.split('=')[1];

  console.log('=== Auth Debug ===');
  console.log('localStorage access_token:', formatTokenForDisplay(localToken));
  console.log('localStorage user_id:', userId);
  console.log('localStorage user_identifier:', userIdentifier);
  console.log('localStorage user_role:', userRole);
  console.log('client_access_token cookie:', formatTokenForDisplay(clientToken));
  console.log('access_token cookie:', formatTokenForDisplay(serverToken));
  console.log('hasClientAuth():', hasClientAuth());
  console.log('getClientAuthToken():', formatTokenForDisplay(getClientAuthToken()));
  console.log('All cookies:', cookies);
  console.log('================');
}

/**
 * Comprehensive logout function that clears all authentication data
 * including localStorage, cookies, and NextAuth session
 */
export const clearAllAuthData = () => {
  // Clear localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_identifier');
    localStorage.removeItem('user_role');
    localStorage.removeItem('access_token');
    localStorage.removeItem('auth_token');
    
    // Clear all auth-related localStorage items
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('user') || key.includes('auth') || key.includes('token'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  // Clear cookies
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      if (name.includes('user') || name.includes('auth') || name.includes('token')) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });
  }
};

/**
 * Complete logout function that handles all cleanup and redirection
 */
export const performLogout = async (router: any) => {
  try {
    // Clear all local storage and cookies first
    clearAllAuthData();
    
    // Import signOut dynamically to avoid SSR issues
    const { signOut } = await import('next-auth/react');
    
    // Sign out from NextAuth
    await signOut({ 
      redirect: false,
      callbackUrl: '/login'
    });
    
    // Force router refresh and redirect
    router.push('/login');
    router.refresh();
    
    // Force page reload to ensure all state is cleared
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
    
  } catch (error) {
    console.error('Logout error:', error);
    // Even if NextAuth fails, clear local data and redirect
    clearAllAuthData();
    router.push('/login');
    router.refresh();
  }
};
