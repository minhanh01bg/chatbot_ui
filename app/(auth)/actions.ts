'use client';

import { signIn, signOut } from 'next-auth/react';
import { z } from 'zod';

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
      
      // Force session refresh and cookie sync
      if (signInResult?.ok) {
        try {
          console.log('Login successful, setting up session cookies');
          
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
            try {
              const { cookies } = await import('next/headers');
              const cookieStore = await cookies();

              // Set the cookie with httpOnly: false for client-side access
              cookieStore.set('access_token', sessionData.accessToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 1 week
              });

              // Also set a non-httpOnly cookie for client-side access
              cookieStore.set('client_access_token', sessionData.accessToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 1 week
              });

              // Set role cookie if available
              if (sessionData?.role) {
                cookieStore.set('user_role', sessionData.role, {
                  httpOnly: false,
                  secure: process.env.NODE_ENV === 'production',
                  sameSite: 'lax',
                  path: '/',
                  maxAge: 60 * 60 * 24 * 7 // 1 week
                });
                console.log('Role cookie set:', sessionData.role);
              }
              
              console.log('Access token cookie set successfully');
            } catch (cookieError) {
              console.error('Error setting cookies:', cookieError);
            }
          }
        } catch (sessionError) {
          console.error('Error getting session:', sessionError);
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

      // Added manual cookie setting - get session access token and store it
      if (signInResult?.ok) {
        try {
          const session = await fetch('/api/auth/session');
          const sessionData = await session.json();
          
          if (sessionData?.accessToken) {
            const { cookies } = await import('next/headers');
            const cookieStore = await cookies();
            cookieStore.set('access_token', sessionData.accessToken, { 
              httpOnly: false, 
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
              maxAge: 60 * 60 * 24 * 7 // 1 week
            });
            console.log('Access token cookie set successfully after registration');
          }
        } catch (e) {
          console.error('Failed to save access token to cookie after registration:', e);
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
