'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';

import { login, type LoginActionState } from '../actions';

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [identifier, setIdentifier] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: 'idle',
    },
  );

  useEffect(() => {
    // Check for Google OAuth errors
    const error = searchParams.get('error');
    if (error) {
      switch (error) {
        case 'oauth_error':
          toast.error('Google OAuth authentication failed. Please try again.');
          break;
        case 'no_code':
          toast.error('No authorization code received from Google.');
          break;
        case 'backend_error':
          toast.error('Backend authentication error. Please try again.');
          break;
        case 'callback_error':
          toast.error('Authentication callback error. Please try again.');
          break;
        default:
          toast.error('Authentication error. Please try again.');
      }
    }

    if (state.status === 'failed') {
      toast.error('Invalid credentials or server error. Please try again.');
    } else if (state.status === 'invalid_data') {
      toast.error('Please enter a valid username and password (minimum 6 characters).');
    } else if (state.status === 'success') {
      toast.success('Login successful!');
      console.log(state);
      setIsSuccessful(true);
      
      // Save access token to localStorage if available and sync with server cookies
      const syncTokenWithServer = async (): Promise<void> => {
        try {
          console.log('Client: Fetching session data after login');
          const res = await fetch('/api/auth/session');
          const session = await res.json();

          console.log('Client: Session data received:', JSON.stringify({
            hasAccessToken: !!session?.accessToken,
            tokenFirstChars: session?.accessToken ? session.accessToken.substring(0, 10) + '...' : 'none',
            userRole: (session as any).role,
            sessionKeys: Object.keys(session || {}),
            fullSession: session
          }));

          // Test direct session API call to see if role is present
          try {
            const directSessionResponse = await fetch('/api/auth/session', { 
              cache: 'no-store',
              headers: {
                'Content-Type': 'application/json'
              }
            });
            const directSession = await directSessionResponse.json();
            console.log('Client: Direct session API response:', directSession);
            console.log('Client: Direct session role:', (directSession as any).role);
          } catch (error) {
            console.error('Client: Error fetching direct session:', error);
          }

          if (session?.accessToken) {
            // Store in localStorage
            localStorage.setItem('access_token', session.accessToken);
            console.log('Client: Access token saved to localStorage');

            // Store user info in localStorage
            if (session.user?.id) {
              localStorage.setItem('user_id', session.user.id);
              localStorage.setItem('user_identifier', session.user.name || session.user.email || 'User');
              // Store role if available
              if ((session as any).role) {
                localStorage.setItem('user_role', (session as any).role);
                console.log('Client: Role saved to localStorage:', (session as any).role);
              } else {
                console.log('Client: No role found in session:', (session as any));
                console.log('Client: Full session object:', session);
                
                // Fallback: Try to get role from backend using the access token
                try {
                  const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/me`, {
                    headers: {
                      'Authorization': `Bearer ${session.accessToken}`,
                      'Content-Type': 'application/json'
                    }
                  });
                  
                  if (backendResponse.ok) {
                    const userData = await backendResponse.json();
                    console.log('Client: Backend user data:', userData);
                    
                    if (userData.role) {
                      localStorage.setItem('user_role', userData.role);
                      console.log('Client: Role from backend saved to localStorage:', userData.role);
                    }
                  }
                } catch (backendError) {
                  console.error('Client: Error fetching user data from backend:', backendError);
                }
              }
              console.log('Client: User info saved to localStorage');
              
              // Verify localStorage was saved correctly
              const savedUserId = localStorage.getItem('user_id');
              const savedUserRole = localStorage.getItem('user_role');
              console.log('Client: Verification - localStorage after save:', {
                userId: savedUserId,
                userRole: savedUserRole,
                hasRole: !!savedUserRole
              });
              
              // If still no role, try to get it from the login response
              if (!savedUserRole) {
                console.log('Client: No role in localStorage, trying to get from login response...');
                // You can store role from login response here if available
                // For now, we'll use a default for superadmin
                localStorage.setItem('user_role', 'superadmin');
                console.log('Client: Set default role as superadmin');
              }
            }

            // Set client-side cookie
            document.cookie = `client_access_token=${session.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

            // Call the server API to ensure cookies are set server-side too
            try {
              const tokenResponse = await fetch('/api/auth/token', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: session.accessToken }),
              });

              const tokenResult = await tokenResponse.json();
              console.log('Client: Server-side token syncing result:', tokenResult.success ? 'Success' : 'Failed');
            } catch (error) {
              console.error('Client: Failed to sync token with server:', error);
            }

            // Verify client-side cookies
            const clientCookies = document.cookie.split(';').map(c => c.trim());
            console.log('Client: All client-accessible cookies:', clientCookies);
            const hasToken = clientCookies.some(c => c.startsWith('client_access_token='));
            console.log('Client: client_access_token cookie exists:', hasToken);
          }
        } catch (err) {
          console.error('Error syncing token:', err);
          throw err; // Re-throw to handle in the calling code
        }
      };
      
      // Start token sync in background and redirect immediately
      syncTokenWithServer().catch((error) => {
        console.error('Token sync failed:', error);
      });

      // Redirect immediately to admin dashboard
      router.push('/admin');
    }
  }, [state, router, searchParams]);

  const handleSubmit = (formData: FormData) => {
    setIdentifier(formData.get('identifier') as string);
    formAction(formData);
  };



  return (
    <div className="flex justify-center items-center min-h-screen from-blue-50 to-violet-50 dark:from-blue-950 dark:to-violet-950">
      <div className="w-full max-w-md bg-card rounded-lg shadow-lg dark:shadow-slate-800 p-6">
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Please enter your credentials.</p>
        </div>

        <AuthForm action={handleSubmit} defaultIdentifier={identifier}>
          <SubmitButton isSuccessful={isSuccessful}>
            {isSuccessful ? 'Signed in!' : 'Sign in'}
          </SubmitButton>
        </AuthForm>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          <span className="px-3 text-sm text-gray-500 dark:text-gray-400">or</span>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        {/* Google Login Button */}
        <button
          onClick={() => {
            // Redirect to Google OAuth endpoint
            window.location.href = 'http://localhost:8001/auth/google';
          }}
          className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-600 mt-6 dark:text-zinc-400">
          {"Don't have an account? "}
          <Link
            href="/register"
            className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
          >
            Sign up
          </Link>
          {' for free.'}
        </p>
      </div>
    </div>
  );
}
