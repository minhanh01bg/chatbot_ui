'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useSession } from 'next-auth/react';

export default function AuthDebug() {
  const [isVisible, setIsVisible] = useState(false);
  const { user, isLoading, isAuthenticated } = useCurrentUser();
  const { data: session, status } = useSession();

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
        >
          Debug Auth
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Auth Debug</CardTitle>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          {/* useCurrentUser Hook */}
          <div>
            <h4 className="font-semibold mb-1">Current Authentication State:</h4>
            <div className="space-y-1">
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
              <div className="flex justify-between">
                <span>User ID:</span>
                <span className="text-right max-w-32 truncate">
                  {user?.id || 'null'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>User Name:</span>
                <span className="text-right max-w-32 truncate">
                  {user?.name || 'null'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Has Token:</span>
                <Badge variant={user?.accessToken ? 'default' : 'destructive'}>
                  {!!user?.accessToken ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>
          </div>

          {/* NextAuth Session */}
          <div>
            <h4 className="font-semibold mb-1">Session Details:</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge variant={
                  status === 'authenticated' ? 'default' : 
                  status === 'loading' ? 'secondary' : 'destructive'
                }>
                  {status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Session User:</span>
                <span className="text-right max-w-32 truncate">
                  {session?.user?.id || 'null'}
                </span>
              </div>
            </div>
          </div>

          {/* Browser Storage */}
          <div>
            <h4 className="font-semibold mb-1">Storage & Tokens:</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>localStorage token:</span>
                <Badge variant={
                  typeof window !== 'undefined' && localStorage.getItem('access_token') 
                    ? 'default' : 'destructive'
                }>
                  {typeof window !== 'undefined' && localStorage.getItem('access_token') 
                    ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Cookie token:</span>
                <Badge variant={
                  typeof window !== 'undefined' && 
                  document.cookie.includes('client_access_token=') 
                    ? 'default' : 'destructive'
                }>
                  {typeof window !== 'undefined' && 
                   document.cookie.includes('client_access_token=') 
                    ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t">
            <Button
              onClick={() => {
                console.log('Auth Debug Info:', {
                  useCurrentUser: { user, isLoading, isAuthenticated },
                  nextAuthSession: { session, status },
                  localStorage: typeof window !== 'undefined' ? {
                    access_token: localStorage.getItem('access_token'),
                  } : null,
                  cookies: typeof window !== 'undefined' ? document.cookie : null,
                });
              }}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Log to Console
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
