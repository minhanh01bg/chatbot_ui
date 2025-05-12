'use server';

import { z } from 'zod';

import { createUser, getUser } from '@/lib/db/queries';
import { register as registerService } from '../../services/login.service';

import { signIn, signOut } from './auth';

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export interface LoginActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'invalid_data';
}

export const login = async (
  _: LoginActionState,
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
      email: formData.get('email'),
      password: formData.get('password'),
    });

    try {
      console.log('Calling login service with:', validatedData.email);
      
      // Login to NextAuth with credentials provider
      const signInResult = await signIn('credentials', {
        email: validatedData.email,
        password: validatedData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        console.error('Sign in error:', signInResult.error);
        return { status: 'failed' };
      }
      
      console.log('Login successful', signInResult);
      // Added manual cookie setting - get session access token and store it
      if (signInResult?.ok) {
        try {
          console.log('Fetching session data to set access token cookie');
          const session = await fetch('/api/auth/session');
          const sessionData = await session.json();
          
          console.log('Session data received:', JSON.stringify({
            hasAccessToken: !!sessionData?.accessToken,
            tokenFirstChars: sessionData?.accessToken ? sessionData.accessToken.substring(0, 10) + '...' : 'none'
          }));
          
          if (sessionData?.accessToken) {
            try {
              const { cookies } = await import('next/headers');
              const cookieStore = await cookies();
              
              // Check existing cookies
              const existingCookies = cookieStore.getAll();
              console.log('Existing cookies before setting:', JSON.stringify(existingCookies.map(c => c.name)));
              
              // Set the cookie
              cookieStore.set('access_token', sessionData.accessToken, { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 1 week
              });
              
              // Also set a non-httpOnly cookie for client-side access
              cookieStore.set('client_access_token', sessionData.accessToken, { 
                httpOnly: false, 
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 1 week
              });
              
              // Verify cookie was set
              const verificationCookies = cookieStore.getAll();
              console.log('Cookies after setting:', JSON.stringify(verificationCookies.map(c => c.name)));
              const tokenCookieSet = cookieStore.get('access_token');
              console.log('Access token cookie set successfully:', !!tokenCookieSet);
            } catch (cookieError) {
              console.error('Error setting cookies:', cookieError);
              console.error('Error details:', JSON.stringify(cookieError instanceof Error ? { message: cookieError.message, stack: cookieError.stack } : cookieError));
            }
          }
        } catch (e) {
          console.error('Failed to save access token to cookie:', e);
          console.error('Error details:', JSON.stringify(e instanceof Error ? { message: e.message, stack: e.stack } : e));
        }
      }

      return { status: 'success' };
    } catch (error) {
      console.error('Login failed:', error);
      return { status: 'failed' };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

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
      email: formData.get('email'),
      password: formData.get('password'),
    });

    try {
      // Call registration API
      await registerService(
        validatedData.email,
        validatedData.password
      );
      
      // Sign in after successful registration
      const signInResult = await signIn('credentials', {
        email: validatedData.email,
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
              httpOnly: true, 
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
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
