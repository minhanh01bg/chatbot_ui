'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';

export default function TokenDebugger() {
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to check token information
  const checkToken = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get all client-side token info
      const clientInfo = {
        localStorage: {
          hasToken: !!localStorage.getItem('access_token'),
          tokenPreview: localStorage.getItem('access_token') 
            ? `${localStorage.getItem('access_token')?.substring(0, 10)}...` 
            : null
        },
        cookies: {
          all: document.cookie.split(';').map(c => c.trim()),
          hasClientToken: document.cookie.includes('client_access_token=')
        }
      };
      
      // Get server-side token info
      const debugResponse = await fetch('/api/debug-session');
      const debugData = await debugResponse.json();
      
      setSessionInfo({
        client: clientInfo,
        server: debugData
      });
    } catch (err) {
      console.error('Error checking token:', err);
      setError('Failed to check token information');
    } finally {
      setLoading(false);
    }
  };
  
  // Function to fetch a new token from the session API
  const fetchToken = async () => {
    setLoading(true);
    try {
      const sessionResponse = await fetch('/api/auth/session');
      const sessionData = await sessionResponse.json();
      
      if (sessionData?.accessToken) {
        // Store in localStorage
        localStorage.setItem('access_token', sessionData.accessToken);
        
        // Also set a client cookie
        document.cookie = `client_access_token=${sessionData.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
        
        // Refresh the token info display
        await checkToken();
        
        return true;
      } else {
        setError('No access token found in session');
        return false;
      }
    } catch (err) {
      console.error('Error fetching token:', err);
      setError('Failed to fetch token from session');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Function to manually add a token
  const manuallySetToken = () => {
    const token = prompt('Enter the access token:');
    if (token) {
      // Store in localStorage
      localStorage.setItem('access_token', token);
      
      // Also set a client cookie
      document.cookie = `client_access_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
      
      // Refresh token info
      checkToken();
    }
  };
  
  // Initialize on mount
  useEffect(() => {
    checkToken();
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 my-4">
      <h3 className="text-lg font-medium mb-4">Token Debugger</h3>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          size="sm"
          onClick={checkToken}
          disabled={loading}
        >
          Refresh Token Info
        </Button>
        
        <Button 
          size="sm"
          onClick={fetchToken}
          disabled={loading}
          variant="secondary"
        >
          Fetch Token from Session
        </Button>
        
        <Button 
          size="sm"
          onClick={manuallySetToken}
          disabled={loading}
          variant="outline"
        >
          Manually Set Token
        </Button>
      </div>
      
      {loading ? (
        <p>Loading token information...</p>
      ) : sessionInfo ? (
        <div className="space-y-2 text-sm">
          <h4 className="font-medium">Client Information:</h4>
          <div className="pl-2 border-l-2 border-gray-300">
            <p>LocalStorage Token: {sessionInfo.client.localStorage.hasToken ? 'Present' : 'Not found'}</p>
            {sessionInfo.client.localStorage.hasToken && (
              <p>Token Preview: {sessionInfo.client.localStorage.tokenPreview}</p>
            )}
            <p>Client Cookies: {sessionInfo.client.cookies.all.join(', ') || 'None'}</p>
            <p>Has client_access_token: {sessionInfo.client.cookies.hasClientToken ? 'Yes' : 'No'}</p>
          </div>
          
          <h4 className="font-medium">Server Information:</h4>
          <div className="pl-2 border-l-2 border-gray-300">
            <p>Available Cookies: {sessionInfo.server.cookies.all.join(', ') || 'None'}</p>
            <p>Has access_token cookie: {sessionInfo.server.cookies.hasAccessToken ? 'Yes' : 'No'}</p>
            <p>Has client_access_token cookie: {sessionInfo.server.cookies.hasClientAccessToken ? 'Yes' : 'No'}</p>
            {sessionInfo.server.cookies.hasAccessToken && (
              <p>Access Token Preview: {sessionInfo.server.cookies.accessTokenPreview}</p>
            )}
            <p>Session has access token: {sessionInfo.server.session.hasAccessToken ? 'Yes' : 'No'}</p>
            {sessionInfo.server.session.hasAccessToken && (
              <p>Session Token Preview: {sessionInfo.server.session.accessTokenPreview}</p>
            )}
          </div>
        </div>
      ) : (
        <p>No token information available</p>
      )}
    </div>
  );
} 