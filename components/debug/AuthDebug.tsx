'use client';

import { useEffect, useState } from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { getClientAuthToken, debugAuthState } from '@/lib/auth-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AuthDebug() {
  const { user, isAuthenticated, isLoading } = useCurrentUser();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const updateDebugInfo = () => {
      const token = getClientAuthToken();
      const localToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;
      const userIdentifier = typeof window !== 'undefined' ? localStorage.getItem('user_identifier') : null;
      
      // Get cookies
      const cookies = typeof window !== 'undefined' ? document.cookie : '';
      const clientToken = cookies
        .split('; ')
        .find(row => row.startsWith('client_access_token='))
        ?.split('=')[1];
      const serverToken = cookies
        .split('; ')
        .find(row => row.startsWith('access_token='))
        ?.split('=')[1];

      setDebugInfo({
        useCurrentUser: {
          isAuthenticated,
          isLoading,
          hasUser: !!user,
          userId: user?.id,
          userName: user?.name,
          userEmail: user?.email,
          hasAccessToken: !!user?.accessToken,
          tokenLength: user?.accessToken?.length,
        },
        localStorage: {
          hasAccessToken: !!localToken,
          tokenLength: localToken?.length,
          userId,
          userIdentifier,
        },
        cookies: {
          all: cookies,
          hasClientToken: !!clientToken,
          clientTokenLength: clientToken?.length,
          hasServerToken: !!serverToken,
          serverTokenLength: serverToken?.length,
        },
        getClientAuthToken: {
          hasToken: !!token,
          tokenLength: token?.length,
        }
      });
    };

    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 1000);
    return () => clearInterval(interval);
  }, [user, isAuthenticated, isLoading]);

  const handleDebugAuth = () => {
    debugAuthState();
  };

  const handleTestAPI = async () => {
    try {
      console.log('Testing API call...');
      const response = await fetch('/api/subscriptions/my', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.accessToken}`
        }
      });
      
      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('API Data:', data);
      } else {
        const error = await response.text();
        console.log('API Error:', error);
      }
    } catch (error) {
      console.error('API Test Error:', error);
    }
  };

  const handleTestBackend = async () => {
    try {
      console.log('Testing backend connectivity...');
      const response = await fetch('/api/test-backend', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      console.log('Backend Test Result:', data);
    } catch (error) {
      console.error('Backend Test Error:', error);
    }
  };

  const handleTestSession = async () => {
    try {
      console.log('Testing session...');
      const response = await fetch('/api/debug-session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      console.log('Session Test Result:', data);
    } catch (error) {
      console.error('Session Test Error:', error);
    }
  };

  const handleTestAuth = async () => {
    try {
      console.log('Testing auth...');
      const response = await fetch('/api/test-auth', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      console.log('Auth Test Result:', data);
    } catch (error) {
      console.error('Auth Test Error:', error);
    }
  };

  const handleTestToken = async () => {
    try {
      console.log('Testing token...');
      const response = await fetch('/api/test-token', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.accessToken}`
        }
      });
      
      const data = await response.json();
      console.log('Token Test Result:', data);
    } catch (error) {
      console.error('Token Test Error:', error);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Authentication Debug
          <div className="flex gap-2">
            <Button onClick={handleDebugAuth} size="sm" variant="outline">
              Debug Auth
            </Button>
            <Button onClick={handleTestAPI} size="sm" variant="outline">
              Test API
            </Button>
            <Button onClick={handleTestBackend} size="sm" variant="outline">
              Test Backend
            </Button>
            <Button onClick={handleTestSession} size="sm" variant="outline">
              Test Session
            </Button>
            <Button onClick={handleTestAuth} size="sm" variant="outline">
              Test Auth
            </Button>
            <Button onClick={handleTestToken} size="sm" variant="outline">
              Test Token
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}
