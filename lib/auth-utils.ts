'use client';

export function getClientAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Check localStorage first
  const localToken = localStorage.getItem('access_token');
  if (localToken) {
    console.log('Found token in localStorage');
    return localToken;
  }
  
  // Check cookies
  const clientToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('client_access_token='))
    ?.split('=')[1];
    
  if (clientToken) {
    console.log('Found token in cookies');
    return clientToken;
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
  const hasClientToken = cookies.includes('client_access_token=');

  console.log('=== Auth Debug ===');
  console.log('localStorage access_token:', localToken ? `${localToken.substring(0, 20)}...` : 'null');
  console.log('localStorage user_id:', userId);
  console.log('localStorage user_identifier:', userIdentifier);
  console.log('All cookies:', cookies);
  console.log('Has client_access_token cookie:', hasClientToken);
  console.log('hasClientAuth():', hasClientAuth());
  console.log('================');
}
