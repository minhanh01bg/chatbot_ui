'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

import { login, type LoginActionState } from '../actions';

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: 'idle',
    },
  );

  useEffect(() => {
    if (state.status === 'failed') {
      toast.error('Invalid credentials or server error. Please try again.');
    } else if (state.status === 'invalid_data') {
      toast.error('Please enter a valid email and password (minimum 6 characters).');
    } else if (state.status === 'success') {
      toast.success('Login successful!');
      console.log(state);
      setIsSuccessful(true);
      router.refresh();
      
      // Save access token to localStorage if available and sync with server cookies
      const syncTokenWithServer = async () => {
        try {
          console.log('Client: Fetching session data after login');
          const res = await fetch('/api/auth/session');
          const session = await res.json();
          
          console.log('Client: Session data received:', JSON.stringify({
            hasAccessToken: !!session?.accessToken,
            tokenFirstChars: session?.accessToken ? session.accessToken.substring(0, 10) + '...' : 'none'
          }));
          
          if (session?.accessToken) {
            // Store in localStorage
            localStorage.setItem('access_token', session.accessToken);
            console.log('Client: Access token saved to localStorage');
            
            // Set client-side cookie
            document.cookie = `client_access_token=${session.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
            
            // Call the server API to ensure cookies are set server-side too
            try {
              const tokenResponse = await fetch('/api/set-token', {
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
            setTimeout(() => {
              const clientCookies = document.cookie.split(';').map(c => c.trim());
              console.log('Client: All client-accessible cookies:', clientCookies);
              const hasToken = clientCookies.some(c => c.startsWith('client_access_token='));
              console.log('Client: client_access_token cookie exists:', hasToken);
            }, 100);
            
            // Redirect to admin dashboard after successful login and token setup
            setTimeout(() => {
              router.push('/admin');
            }, 300);
          }
        } catch (err) {
          console.error('Error syncing token:', err);
        }
      };
      
      syncTokenWithServer();
    }
  }, [state, router]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string);
    formAction(formData);
  };

  // Function to handle logout and clear all session cookies
  const handleForceLogout = async () => {
    // Sign out of NextAuth
    await signOut({ redirect: false });
    
    // Manually clear cookies
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    toast.success('Successfully logged out and cleared session cache');
    router.refresh();
  };

  return (
    <div className="flex justify-center items-center min-h-screen from-blue-50 to-violet-50 dark:from-blue-950 dark:to-violet-950">
      <div className="w-full max-w-md bg-card rounded-lg shadow-lg dark:shadow-slate-800 p-6">
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Please enter your credentials.</p>
        </div>

        <AuthForm action={handleSubmit} defaultEmail={email}>
          <SubmitButton isSuccessful={isSuccessful}>
            {isSuccessful ? 'Signed in!' : 'Sign in'}
          </SubmitButton>
          <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
            {"Don't have an account? "}
            <Link
              href="/register"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              Sign up
            </Link>
            {' for free.'}
          </p>
        </AuthForm>
      </div>
    </div>
  );
}
