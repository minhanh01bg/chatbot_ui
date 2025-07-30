'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SessionProvider from '@/components/providers/SessionProvider';
import { useEffect, useState } from 'react';
import { formatTokenForDisplay } from '@/lib/auth-utils';

function TestAuthContent() {
  const { user, isLoading, isAuthenticated } = useCurrentUser();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [storageInfo, setStorageInfo] = useState({
    hasLocalStorageToken: false,
    hasCookieToken: false,
    allCookies: '',
    localStorageToken: '',
    clientAccessToken: ''
  });

  // Only run on client side after hydration
  useEffect(() => {
    setMounted(true);

    // Get storage info safely on client side
    const hasLocalStorageToken = !!localStorage.getItem('access_token');
    const hasCookieToken = document.cookie.includes('client_access_token=');
    const allCookies = document.cookie;
    const localStorageToken = localStorage.getItem('access_token') || '';
    const clientAccessToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('client_access_token='))
      ?.split('=')[1] || '';

    setStorageInfo({
      hasLocalStorageToken,
      hasCookieToken,
      allCookies,
      localStorageToken,
      clientAccessToken
    });
  }, []);

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Authentication Test</h1>
      <p className="text-muted-foreground">
        Unified testing for all authentication methods (NextAuth, Google OAuth, etc.)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* useCurrentUser Hook */}
        <Card>
          <CardHeader>
            <CardTitle>useCurrentUser Hook</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>isLoading:</span>
              <Badge variant={isLoading ? 'secondary' : 'outline'}>
                {isLoading.toString()}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>isAuthenticated:</span>
              <Badge variant={isAuthenticated ? 'default' : 'destructive'}>
                {isAuthenticated.toString()}
              </Badge>
            </div>
            <div>
              <span className="font-semibold">User:</span>
              <pre className="mt-2 p-2 bg-muted rounded text-sm">
                {JSON.stringify(user ? {
                  ...user,
                  accessToken: formatTokenForDisplay(user.accessToken)
                } : null, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* NextAuth Session */}
        <Card>
          <CardHeader>
            <CardTitle>NextAuth Session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Status:</span>
              <Badge variant={
                status === 'authenticated' ? 'default' : 
                status === 'loading' ? 'secondary' : 'destructive'
              }>
                {status}
              </Badge>
            </div>
            <div>
              <span className="font-semibold">Session:</span>
              <pre className="mt-2 p-2 bg-muted rounded text-sm">
                {JSON.stringify(session ? {
                  ...session,
                  accessToken: formatTokenForDisplay((session as any).accessToken)
                } : null, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Browser Storage */}
        <Card>
          <CardHeader>
            <CardTitle>Browser Storage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>localStorage token:</span>
              <Badge variant={storageInfo.hasLocalStorageToken ? 'default' : 'destructive'}>
                {storageInfo.hasLocalStorageToken ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Cookie token:</span>
              <Badge variant={storageInfo.hasCookieToken ? 'default' : 'destructive'}>
                {storageInfo.hasCookieToken ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div>
              <span className="font-semibold">Token Details:</span>
              <div className="mt-2 space-y-2 text-sm">
                <div>
                  <strong>localStorage token:</strong>
                  <pre className="mt-1 p-2 bg-muted rounded text-xs break-all">
                    {mounted ? formatTokenForDisplay(storageInfo.localStorageToken) || 'No token' : 'Loading...'}
                  </pre>
                </div>
                <div>
                  <strong>client_access_token cookie:</strong>
                  <pre className="mt-1 p-2 bg-muted rounded text-xs break-all">
                    {mounted ? formatTokenForDisplay(storageInfo.clientAccessToken) || 'No token' : 'Loading...'}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function TestAuthPage() {
  return (
    <SessionProvider>
      <TestAuthContent />
    </SessionProvider>
  );
}
