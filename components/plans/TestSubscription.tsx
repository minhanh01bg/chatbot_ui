'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentUser } from '@/hooks/use-current-user';

export default function TestSubscription() {
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useCurrentUser();

  const testAPI = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      console.log('Testing subscription API with:', {
        isAuthenticated,
        hasUser: !!user,
        hasToken: !!user?.accessToken,
        tokenLength: user?.accessToken?.length
      });

      const response = await fetch('/api/subscriptions/my', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.accessToken}`
        }
      });

      const data = await response.json();
      
      setResult({
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        data: data,
        timestamp: new Date().toISOString()
      });

      console.log('API Test Result:', {
        status: response.status,
        ok: response.ok,
        data: data
      });
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
      console.error('API Test Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Subscription API</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          <p><strong>Authentication:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
          <p><strong>User:</strong> {user ? 'Yes' : 'No'}</p>
          <p><strong>Token:</strong> {user?.accessToken ? 'Yes' : 'No'} ({user?.accessToken?.length || 0} chars)</p>
        </div>
        
        <Button onClick={testAPI} disabled={isLoading || !isAuthenticated}>
          {isLoading ? 'Testing...' : 'Test API'}
        </Button>
        
        {result && (
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Result:</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 