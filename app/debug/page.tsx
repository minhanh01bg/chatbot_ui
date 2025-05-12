import TokenDebugger from '@/components/TokenDebugger';

export default function DebugPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Auth Debug Page</h1>
      <p className="mb-6">
        Use this page to debug authentication issues. The token debugger below
        shows information about your authentication tokens and provides tools
        to fix common issues.
      </p>
      
      <TokenDebugger />
      
      <div className="mt-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Common Issues</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Missing Token:</strong> If no token is found, try clicking "Fetch Token from Session" 
            to retrieve it from your current session.
          </li>
          <li>
            <strong>Expired Token:</strong> If you're getting 401 errors, your token may be expired.
            Try logging out and logging back in.
          </li>
          <li>
            <strong>Cookie Storage Issues:</strong> If the server can't find your token but it exists 
            in localStorage, use the "Manually Set Token" button to set it.
          </li>
        </ul>
      </div>
    </div>
  );
} 