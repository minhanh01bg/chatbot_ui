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
  if (typeof window === 'undefined') return;

  const localToken = localStorage.getItem('access_token');
  const userId = localStorage.getItem('user_id');
  const userIdentifier = localStorage.getItem('user_identifier');
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
  console.log('client_access_token cookie:', formatTokenForDisplay(clientToken));
  console.log('access_token cookie:', formatTokenForDisplay(serverToken));
  console.log('hasClientAuth():', hasClientAuth());
  console.log('getClientAuthToken():', formatTokenForDisplay(getClientAuthToken()));
  console.log('================');
}
