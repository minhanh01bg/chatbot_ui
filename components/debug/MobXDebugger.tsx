'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { debugServiceWorkers, cleanupProblematicServiceWorkers, isMobXError } from '@/lib/utils';

interface ServiceWorkerInfo {
  scriptURL?: string;
  scope: string;
  state?: string;
  id: string;
}

export default function MobXDebugger() {
  const [serviceWorkers, setServiceWorkers] = useState<ServiceWorkerInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const refreshServiceWorkers = async () => {
    setIsLoading(true);
    try {
      const workers = await debugServiceWorkers();
      setServiceWorkers(workers);
    } catch (error) {
      console.error('Error refreshing service workers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCleanup = async () => {
    setIsLoading(true);
    try {
      await cleanupProblematicServiceWorkers();
      await refreshServiceWorkers();
    } catch (error) {
      console.error('Error cleaning up service workers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Capture MobX errors
  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = function(...args) {
      const message = args.join(' ');
      if (isMobXError(message)) {
        setLastError(message);
      }
      originalConsoleError.apply(console, args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  useEffect(() => {
    refreshServiceWorkers();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>MobX Error Debugger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={refreshServiceWorkers} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Refresh Service Workers'}
          </Button>
          <Button onClick={handleCleanup} variant="destructive" disabled={isLoading}>
            Cleanup Problematic SW
          </Button>
        </div>

        {lastError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 className="font-semibold text-red-800 mb-2">Last MobX Error:</h3>
            <pre className="text-sm text-red-700 whitespace-pre-wrap">{lastError}</pre>
          </div>
        )}

        <div>
          <h3 className="font-semibold mb-2">Service Worker Registrations:</h3>
          {serviceWorkers.length === 0 ? (
            <p className="text-gray-500">No service workers found</p>
          ) : (
            <div className="space-y-2">
              {serviceWorkers.map((worker, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-md">
                  <div className="text-sm">
                    <strong>Script URL:</strong> {worker.scriptURL || 'N/A'}
                  </div>
                  <div className="text-sm">
                    <strong>Scope:</strong> {worker.scope}
                  </div>
                  <div className="text-sm">
                    <strong>State:</strong> {worker.state || 'N/A'}
                  </div>
                  <div className="text-sm">
                    <strong>ID:</strong> {worker.id}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 