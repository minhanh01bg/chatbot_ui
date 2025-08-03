'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCurrentUser } from '@/hooks/use-current-user';

export default function AuthDebug() {
  const { user } = useCurrentUser();
  const [sessionData, setSessionData] = useState<any>(null);
  const [dashboardTest, setDashboardTest] = useState<any>(null);
  const [backendTest, setBackendTest] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSession = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      setSessionData(data);
    } catch (error) {
      console.error('Session test error:', error);
      setSessionData({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const testDashboardAPI = async () => {
    try {
      setLoading(true);
      
      // Get sites to find a chat_token
      const sitesResponse = await fetch('/api/sites?skip=0&limit=50');
      const sitesData = await sitesResponse.json();
      const sitesArray = Array.isArray(sitesData) ? sitesData : (sitesData.sites || []);
      
      if (sitesArray.length === 0) {
        setDashboardTest({ error: 'No sites available' });
        return;
      }

      const firstSite = sitesArray[0];
      if (!firstSite?.chat_token) {
        setDashboardTest({ error: 'No chat token available for sites' });
        return;
      }

      // Test dashboard API with site's chat_token
      const response = await fetch('/api/dashboard?rangeDays=7', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${firstSite.chat_token}`,
        },
      });

      const data = await response.json();
      setDashboardTest({
        status: response.status,
        statusText: response.statusText,
        data: data,
        siteName: firstSite.name || firstSite.key,
        token: firstSite.chat_token.substring(0, 20) + '...'
      });
    } catch (error) {
      console.error('Dashboard API test error:', error);
      setDashboardTest({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const testBackend = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/test-backend');
      const data = await response.json();
      setBackendTest(data);
    } catch (error) {
      console.error('Backend test error:', error);
      setBackendTest({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Auth Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Current User</h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <pre className="text-xs text-gray-800 overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button onClick={testSession} disabled={loading} variant="outline">
              Test Session API
            </Button>
            <Button onClick={testDashboardAPI} disabled={loading} variant="outline">
              Test Dashboard API
            </Button>
            <Button onClick={testBackend} disabled={loading} variant="outline">
              Test Backend
            </Button>
          </div>

          {sessionData && (
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Session Data</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <pre className="text-xs text-gray-800 overflow-auto">
                  {JSON.stringify(sessionData, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {dashboardTest && (
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Dashboard API Test</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <pre className="text-xs text-gray-800 overflow-auto">
                  {JSON.stringify(dashboardTest, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {backendTest && (
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Backend Test</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <pre className="text-xs text-gray-800 overflow-auto">
                  {JSON.stringify(backendTest, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
