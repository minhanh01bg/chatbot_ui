'use client';

import { signIn, signOut } from 'next-auth/react';
import { z } from 'zod';
import { registerService } from '@/services/auth.service';

const authFormSchema = z.object({
  identifier: z.string().min(1, 'Username or email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export interface LoginActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'invalid_data';
}

export const login = async (
  prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> => {
  try {
    // Before login, ensure to sign out of current session
    try {
      await signOut({ redirect: false });
    } catch (e) {
      // Ignore sign out errors if any
    }
    
    const validatedData = authFormSchema.parse({
      identifier: formData.get('identifier'),
      password: formData.get('password'),
    });

    try {
      console.log('Calling login service with:', validatedData.identifier);

      // Login to NextAuth with credentials provider
      const signInResult = await signIn('credentials', {
        username: validatedData.identifier, // Backend still expects 'username' field
        password: validatedData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        console.error('Sign in error:', signInResult.error);
        return { status: 'failed' };
      }
      
      console.log('Login successful', signInResult);
      
      // Handle client-side storage after successful login
      if (signInResult?.ok) {
        try {
          console.log('Login successful, setting up client-side storage');
          
          // Get session data from API
          const sessionResponse = await fetch('/api/auth/session');
          const sessionData = await sessionResponse.json();
          
          console.log('Session data received:', JSON.stringify({
            hasSession: !!sessionData,
            hasAccessToken: !!sessionData?.accessToken,
            hasRole: !!sessionData?.role,
            tokenFirstChars: sessionData?.accessToken ? sessionData.accessToken.substring(0, 10) + '...' : 'none',
            role: sessionData?.role
          }));

          if (sessionData?.accessToken) {
            // Store in localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem('access_token', sessionData.accessToken);
              
              if (sessionData?.role) {
                localStorage.setItem('user_role', sessionData.role);
              }
              
              if (sessionData?.user?.id) {
                localStorage.setItem('user_id', sessionData.user.id.toString());
              }
              
              if (sessionData?.user?.name || sessionData?.user?.email) {
                localStorage.setItem('user_identifier', sessionData.user.name || sessionData.user.email);
              }
            }

            // Set client-side cookies using document.cookie
            if (typeof document !== 'undefined') {
              const maxAge = 60 * 60 * 24 * 7; // 7 days
              document.cookie = `client_access_token=${sessionData.accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
              
              if (sessionData?.role) {
                document.cookie = `user_role=${sessionData.role}; path=/; max-age=${maxAge}; SameSite=Lax`;
              }
              
              if (sessionData?.user?.id) {
                document.cookie = `user_id=${sessionData.user.id}; path=/; max-age=${maxAge}; SameSite=Lax`;
              }
              
              if (sessionData?.user?.name || sessionData?.user?.email) {
                const identifier = sessionData.user.name || sessionData.user.email;
                document.cookie = `user_identifier=${identifier}; path=/; max-age=${maxAge}; SameSite=Lax`;
              }
            }
            
            console.log('Client-side storage set successfully');
          }
        } catch (sessionError) {
          console.error('Error setting up client-side storage:', sessionError);
        }
      }
      
      return { status: 'success' };
    } catch (error) {
      console.error('Login error:', error);
      return { status: 'failed' };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }
    console.error('Login action error:', error);
    return { status: 'failed' };
  }
};

export interface RegisterActionState {
  status:
    | 'idle'
    | 'in_progress'
    | 'success'
    | 'failed'
    | 'user_exists'
    | 'invalid_data';
}

export const register = async (
  _: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> => {
  try {
    // Sign out of current session before registration
    try {
      await signOut({ redirect: false });
    } catch (e) {
      // Ignore sign out errors if any
    }
    
    const validatedData = authFormSchema.parse({
      identifier: formData.get('identifier'),
      password: formData.get('password'),
    });

    try {
      // Call registration API
      await registerService(
        validatedData.identifier,
        validatedData.password
      );

      // Sign in after successful registration
      const signInResult = await signIn('credentials', {
        username: validatedData.identifier, // Backend still expects 'username' field
        password: validatedData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        console.error('Sign in after registration error:', signInResult.error);
        return { status: 'failed' };
      }

      // Handle client-side storage after successful registration
      if (signInResult?.ok) {
        try {
          const session = await fetch('/api/auth/session');
          const sessionData = await session.json();
          
          if (sessionData?.accessToken) {
            // Store in localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem('access_token', sessionData.accessToken);
              
              if (sessionData?.role) {
                localStorage.setItem('user_role', sessionData.role);
              }
              
              if (sessionData?.user?.id) {
                localStorage.setItem('user_id', sessionData.user.id.toString());
              }
              
              if (sessionData?.user?.name || sessionData?.user?.email) {
                localStorage.setItem('user_identifier', sessionData.user.name || sessionData.user.email);
              }
            }

            // Set client-side cookies
            if (typeof document !== 'undefined') {
              const maxAge = 60 * 60 * 24 * 7; // 7 days
              document.cookie = `client_access_token=${sessionData.accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
              
              if (sessionData?.role) {
                document.cookie = `user_role=${sessionData.role}; path=/; max-age=${maxAge}; SameSite=Lax`;
              }
              
              if (sessionData?.user?.id) {
                document.cookie = `user_id=${sessionData.user.id}; path=/; max-age=${maxAge}; SameSite=Lax`;
              }
              
              if (sessionData?.user?.name || sessionData?.user?.email) {
                const identifier = sessionData.user.name || sessionData.user.email;
                document.cookie = `user_identifier=${identifier}; path=/; max-age=${maxAge}; SameSite=Lax`;
              }
            }
            
            console.log('Client-side storage set successfully after registration');
          }
        } catch (e) {
          console.error('Failed to set client-side storage after registration:', e);
        }
      }

      return { status: 'success' };
    } catch (error) {
      // Check if user already exists
      if (error instanceof Error && error.message.includes('already exists')) {
        return { status: 'user_exists' };
      }
      
      console.error('Registration failed:', error);
      return { status: 'failed' };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};
