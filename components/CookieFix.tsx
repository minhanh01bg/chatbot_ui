'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function CookieFix() {
  const [cookieInfo, setCookieInfo] = useState<{
    hasToken: boolean;
    tokenValue: string;
    allCookies: string[];
  }>({
    hasToken: false,
    tokenValue: '',
    allCookies: []
  });

  const [manualToken, setManualToken] = useState('');
  const [apiResult, setApiResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Check cookies when component mounts
  useEffect(() => {
    checkCookies();
  }, []);

  // Get information about cookies
  const checkCookies = () => {
    const allCookies = document.cookie.split(';').map(c => c.trim());
    const accessTokenCookie = allCookies.find(c => c.startsWith('access_token='));
    const clientTokenCookie = allCookies.find(c => c.startsWith('client_access_token='));
    
    let tokenValue = '';
    if (accessTokenCookie) {
      tokenValue = accessTokenCookie.split('=')[1];
    } else if (clientTokenCookie) {
      tokenValue = clientTokenCookie.split('=')[1];
    } else if (localStorage.getItem('access_token')) {
      tokenValue = localStorage.getItem('access_token') || '';
    }
    
    setCookieInfo({
      hasToken: !!tokenValue,
      tokenValue: tokenValue ? `${tokenValue.substring(0, 10)}... (${tokenValue.length} chars)` : '',
      allCookies
    });
  };

  // Check server-side cookies
  const checkServerCookies = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/check-cookies');
      const data = await res.json();
      setApiResult(data);
    } catch (error) {
      console.error('Error checking server cookies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Set token manually - both client-side and server-side
  const setManualCookie = async () => {
    if (!manualToken) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      // First set client-side cookies
      document.cookie = `client_access_token=${manualToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      localStorage.setItem('access_token', manualToken);
      
      // Then call the API to set server-side cookies
      const response = await fetch('/api/set-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: manualToken }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage('Token set successfully in both client and server cookies');
      } else {
        setMessage(`Error: ${result.error || 'Failed to set server cookie'}`);
      }
      
      // Update cookie info
      checkCookies();
      
      // Also check server cookies
      await checkServerCookies();
      
      // Reset input
      setManualToken('');
    } catch (error) {
      console.error('Error setting token:', error);
      setMessage('Error setting token: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
      <h3 className="text-lg font-medium mb-4">Cookie Manager</h3>
      
      <div className="space-y-4">
        <div>
          <p className="mb-2">Token Status: <span className={cookieInfo.hasToken ? "text-green-500" : "text-red-500"}>
            {cookieInfo.hasToken ? 'Token Found' : 'No Token'}
          </span></p>
          
          {cookieInfo.hasToken && (
            <p className="text-sm">Token Preview: {cookieInfo.tokenValue}</p>
          )}
          
          <div className="mt-1">
            <Button 
              onClick={checkCookies}
              size="sm" 
              variant="outline"
            >
              Refresh Cookie Info
            </Button>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Check Server-Side Cookies</h4>
          <Button 
            onClick={checkServerCookies} 
            disabled={loading}
            size="sm"
          >
            {loading ? 'Checking...' : 'Check Server Cookies'}
          </Button>
          
          {apiResult && (
            <div className="mt-2 text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded max-h-32 overflow-auto">
              <pre>{JSON.stringify(apiResult, null, 2)}</pre>
            </div>
          )}
        </div>
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Set Manual Token</h4>
          <div className="flex gap-2">
            <Input
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              placeholder="Paste access token here..."
              className="max-w-md"
            />
            <Button 
              onClick={setManualCookie}
              disabled={!manualToken || loading}
              size="sm"
            >
              {loading ? 'Setting...' : 'Set Token'}
            </Button>
          </div>
          {message && (
            <p className={message.includes('Error') ? 'text-red-500 mt-2' : 'text-green-500 mt-2'}>
              {message}
            </p>
          )}
        </div>
        
        <div className="border-t pt-4 text-sm">
          <h4 className="font-medium mb-2">All Client Cookies</h4>
          <ul className="list-disc pl-5">
            {cookieInfo.allCookies.map((cookie, i) => (
              <li key={i}>{cookie}</li>
            ))}
          </ul>
          {cookieInfo.allCookies.length === 0 && (
            <p className="text-red-500">No cookies found</p>
          )}
        </div>
      </div>
    </div>
  );
} 