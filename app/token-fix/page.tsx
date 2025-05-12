'use client';

import CookieFix from '@/components/CookieFix';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function TokenFixPage() {
  const router = useRouter();
  
  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Authentication Token Fix</h1>
        <Button onClick={() => router.push('/admin/sites')}>Go to Sites</Button>
      </div>
      
      <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md">
        <h2 className="text-lg font-semibold mb-2">About This Page</h2>
        <p>
          This page helps fix authentication issues by allowing you to set or check cookies.
          If you're experiencing 401 errors when accessing admin pages, you can use this tool
          to verify your token status and fix any issues.
        </p>
      </div>
      
      <CookieFix />
      
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Common Issues</h2>
        
        <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
          <h3 className="font-medium mb-2">Getting 401 Unauthorized Errors</h3>
          <p>
            If you're logged in but still getting 401 errors, it could be because your token 
            cookie is not being properly transmitted to the server. Use the "Set Manual Token" 
            feature above to manually set your token.
          </p>
        </div>
        
        <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
          <h3 className="font-medium mb-2">Token Not Found</h3>
          <p>
            If you see "Token Found: No" in the tool above, try logging out and logging in again. 
            If the issue persists, you might need to manually set your token.
          </p>
        </div>
        
        <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
          <h3 className="font-medium mb-2">Finding Your Token</h3>
          <p>
            You can find your token in the browser's developer tools. Open DevTools (F12), 
            go to Application → Storage → Local Storage and look for the "access_token" key.
          </p>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center space-x-4">
        <Button variant="outline" onClick={() => router.push('/login')}>
          Go to Login
        </Button>
        <Button onClick={() => router.push('/admin/sites')}>
          Go to Admin Sites
        </Button>
      </div>
    </div>
  );
} 