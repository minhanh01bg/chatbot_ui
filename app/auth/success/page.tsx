'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processAuthSuccess = async () => {
      try {
        // Lấy tất cả thông tin từ URL params
        let token = searchParams.get('token');
        const tokenType = searchParams.get('token_type');
        const expiredAt = searchParams.get('expired_at');
        const state = searchParams.get('state');
        const userId = searchParams.get('id');
        const identifier = searchParams.get('identifier');
        let role = searchParams.get('role');
        const isHidden = searchParams.get('is_hidden');

        // Fix for missing & between role and token
        if (!token && role && role.includes('token=')) {
          const parts = role.split('token=');
          role = parts[0];
          token = parts[1];
          console.log('Fixed missing & between role and token:', { role, token });
        }

        console.log('Auth Success - Received params:', {
          hasToken: !!token,
          tokenType,
          expiredAt,
          state,
          userId,
          identifier,
          role,
          isHidden
        });

        // Debug: log all URL params
        console.log('All URL params:', Object.fromEntries(searchParams.entries()));
        console.log('Raw URL:', window.location.href);

        if (!token) {
          toast.error('No authentication token received');
          router.push('/login?error=no_token');
          return;
        }

        console.log('Google Auth Success - Processing token...');

        // Clear any existing auth data first
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_expired_at');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_identifier');
        localStorage.removeItem('user_role');

        // Lưu token và user info vào localStorage
        localStorage.setItem('access_token', token);
        if (expiredAt) {
          localStorage.setItem('token_expired_at', expiredAt);
        }
        if (userId) {
          localStorage.setItem('user_id', userId);
        }
        if (identifier) {
          localStorage.setItem('user_identifier', identifier);
        }
        if (role) {
          localStorage.setItem('user_role', role);
        }

        console.log('Stored in localStorage:', {
          access_token: localStorage.getItem('access_token')?.substring(0, 20) + '...',
          user_id: localStorage.getItem('user_id'),
          user_identifier: localStorage.getItem('user_identifier'),
          user_role: localStorage.getItem('user_role')
        });

        // Set client-side cookies
        const maxAge = 60 * 60 * 24 * 7; // 7 days
        document.cookie = `client_access_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;

        if (expiredAt) {
          document.cookie = `token_expired_at=${expiredAt}; path=/; max-age=${maxAge}; SameSite=Lax`;
        }
        if (userId) {
          document.cookie = `user_id=${userId}; path=/; max-age=${maxAge}; SameSite=Lax`;
        }
        if (identifier) {
          document.cookie = `user_identifier=${identifier}; path=/; max-age=${maxAge}; SameSite=Lax`;
        }

        // Gọi API để set server-side cookies
        try {
          const response = await fetch('/api/set-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              token,
              expired_at: expiredAt 
            }),
          });

          const result = await response.json();
          console.log('Server-side token sync result:', result.success ? 'Success' : 'Failed');
        } catch (error) {
          console.error('Failed to sync token with server:', error);
        }

        // Hiển thị thông báo thành công
        toast.success('Google login successful!');

        // Redirect về admin dashboard sau một chút delay
        setTimeout(() => {
          router.push('/admin');
        }, 1000);

      } catch (error) {
        console.error('Error processing auth success:', error);
        toast.error('Error processing authentication. Please try again.');
        router.push('/login?error=processing_error');
      } finally {
        setIsProcessing(false);
      }
    };

    processAuthSuccess();
  }, [searchParams, router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950 dark:to-violet-950">
      <div className="w-full max-w-md bg-card rounded-lg shadow-lg dark:shadow-slate-800 p-8 text-center">
        {isProcessing ? (
          <>
            <div className="mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
            <h1 className="text-xl font-semibold mb-2">Processing Authentication</h1>
            <p className="text-muted-foreground">
              Please wait while we complete your Google login...
            </p>
          </>
        ) : (
          <>
            <div className="mb-4">
              <div className="rounded-full h-12 w-12 bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-xl font-semibold mb-2">Authentication Complete</h1>
            <p className="text-muted-foreground">
              Redirecting to dashboard...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
