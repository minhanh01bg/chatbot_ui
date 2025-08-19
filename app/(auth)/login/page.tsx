'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Eye, EyeOff, Mail, Lock, ArrowRight, LogIn, Shield } from 'lucide-react';

import { clearAllAuthData } from '@/lib/auth-utils';
import { login, type LoginActionState } from '../actions';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: 'idle',
    },
  );

  useEffect(() => {
    // Defensive: if we reached login due to expired session, ensure stale tokens are cleared to avoid loops
    const reason = searchParams.get('reason');
    if (reason === 'expired') {
      clearAllAuthData();
    }

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

    if (state.status === 'in_progress') {
      // Loading state is handled by the button
    } else if (state.status === 'failed') {
      toast.error('Invalid credentials or server error. Please try again.');
    } else if (state.status === 'invalid_data') {
      toast.error('Please enter a valid username and password (minimum 6 characters).');
    } else if (state.status === 'success') {
      toast.success('Login successful! Welcome back to ChatAI Pro!');
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
      setTimeout(() => {
        router.push('/admin');
      }, 1500);
    }
  }, [state, router, searchParams]);



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-6 shadow-2xl"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-300 text-sm">
              Sign in to your ChatAI Pro account
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl"
          >
            <form action={formAction} className="space-y-6">
              {/* Email/Username Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="space-y-2"
              >
                <label className="text-sm font-medium text-white/90">
                  Email or Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="identifier"
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email or username"
                    required
                    autoFocus
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="space-y-2"
              >
                <label className="text-sm font-medium text-white/90">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <button
                  type="submit"
                  disabled={state.status === 'in_progress'}
                  className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                    state.status === 'in_progress'
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {state.status === 'in_progress' ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Signing In...</span>
                    </>
                  ) : isSuccessful ? (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Welcome Back!</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.div>

              {/* Google OAuth Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-transparent px-2 text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = 'http://localhost:8001/auth/google';
                  }}
                  className="w-full mt-4 py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transform hover:scale-105"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </motion.div>
            </form>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="text-center mt-6"
          >
            <p className="text-gray-300 text-sm">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="text-purple-400 hover:text-purple-300 font-medium underline transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
