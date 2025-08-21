'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, LogIn } from 'lucide-react';
import { clearAllAuthData } from '@/lib/auth-utils';

export function AuthErrorHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isHandling, setIsHandling] = useState(false);

  useEffect(() => {
    const handleAuthError = async () => {
      const error = searchParams.get('error');
      const reason = searchParams.get('reason');

      if (error || reason) {
        setIsHandling(true);
        
        // Clear any stale authentication data
        try {
          clearAllAuthData();
          console.log('Cleared authentication data due to error');
        } catch (e) {
          console.error('Error clearing auth data:', e);
        }

        // Handle specific error types
        if (error === 'oauth_error' || reason === 'unauthorized' || reason === 'expired') {
          // Redirect to login with appropriate message
          setTimeout(() => {
            router.push('/login?reason=' + (reason || 'unauthorized'));
          }, 1000);
        }
      }
    };

    handleAuthError();
  }, [searchParams, router]);

  const error = searchParams.get('error');
  const reason = searchParams.get('reason');

  if (!error && !reason) {
    return null;
  }

  const getErrorMessage = () => {
    if (error === 'oauth_error') {
      return 'OAuth authentication failed. Please try again.';
    }
    if (reason === 'unauthorized') {
      return 'You are not authorized to access this page. Please log in.';
    }
    if (reason === 'expired') {
      return 'Your session has expired. Please log in again.';
    }
    return 'An authentication error occurred. Please try again.';
  };

  const getErrorTitle = () => {
    if (error === 'oauth_error') {
      return 'OAuth Error';
    }
    if (reason === 'unauthorized') {
      return 'Unauthorized Access';
    }
    if (reason === 'expired') {
      return 'Session Expired';
    }
    return 'Authentication Error';
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="glass-enhanced rounded-2xl p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 bg-gradient-error rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <AlertTriangle className="w-8 h-8 text-white" />
          </motion.div>
          
          <h1 className="text-2xl font-bold text-white mb-4">
            {getErrorTitle()}
          </h1>
          
          <p className="text-gray-300 mb-6">
            {getErrorMessage()}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                clearAllAuthData();
                router.push('/login');
              }}
              className="flex-1 bg-gradient-button text-white px-6 py-3 rounded-xl font-medium hover-glow transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Go to Login</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                clearAllAuthData();
                router.push('/');
              }}
              className="flex-1 glass-button text-white px-6 py-3 rounded-xl font-medium hover-glow transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Go Home</span>
            </motion.button>
          </div>

          {isHandling && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 bg-gradient-info/20 rounded-lg"
            >
              <p className="text-sm text-blue-300">
                🔄 Handling authentication error...
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
} 