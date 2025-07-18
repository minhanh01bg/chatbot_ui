'use client';

import { useEffect, useState } from 'react';

export default function TestGoogleAuth() {
  const [cookies, setCookies] = useState<string>('');
  const [localStorage, setLocalStorage] = useState<string>('');

  useEffect(() => {
    // Đọc cookies
    setCookies(document.cookie);
    
    // Đọc localStorage
    const token = window.localStorage.getItem('access_token');
    setLocalStorage(token || 'No token found');
  }, []);

  const clearAll = () => {
    // Clear cookies
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Clear localStorage
    window.localStorage.clear();
    
    // Refresh
    window.location.reload();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Google Auth Test Page</h1>
      
      <div className="space-y-6">
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Cookies:</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {cookies || 'No cookies found'}
          </pre>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">LocalStorage Token:</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {localStorage}
          </pre>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Test URLs:</h2>
          <div className="space-y-2 text-sm">
            <div><strong>Google Auth:</strong> http://localhost:8001/auth/google</div>
            <div><strong>Success Callback:</strong> /auth/success</div>
            <div><strong>Admin Dashboard:</strong> /admin</div>
          </div>
        </div>

        <div className="space-x-4">
          <button
            onClick={() => window.location.href = 'http://localhost:8001/auth/google'}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test Google Login
          </button>
          
          <button
            onClick={clearAll}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear All Data
          </button>
          
          <button
            onClick={() => window.location.href = '/admin'}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Go to Admin
          </button>
        </div>
      </div>
    </div>
  );
}
