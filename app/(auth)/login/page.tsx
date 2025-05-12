'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import LogoutButton from '@/components/logout-button';

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
      console.log(state)
      setIsSuccessful(true);
      router.refresh();
      // Redirect to chat page after successful login
      setTimeout(() => {
        router.push('/'); // URL of the main chat page
      }, 1000);
    }
  }, [state.status, router]);

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
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-8">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">Sign In</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Use your email and password to sign in
          </p>
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
        
        {/* <div className="border-t pt-4">
          <p className="text-center text-sm text-gray-500 mb-2">Having login issues?</p>
          <LogoutButton 
            variant="outline" 
            className="w-full"
          />
        </div> */}
      </div>
    </div>
  );
}
