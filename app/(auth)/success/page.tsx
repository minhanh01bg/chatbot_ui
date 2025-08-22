'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processAuthSuccess = async () => {
      try {
        // Lấy token từ URL params
        const token = searchParams.get('token');

        console.log('Google Auth Success - Received token:', !!token);

        if (!token) {
          console.error('No token received from Google OAuth');
          router.push('/login?error=no_token');
          return;
        }

        // Clear any existing auth data first
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_expired_at');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_identifier');
        localStorage.removeItem('user_role');

        // Clear existing cookies
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'client_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'user_identifier=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        // Temporarily store the Google token for API call
        const maxAge = 60 * 60 * 24 * 7; // 7 days

        // Call API to get user info from the Google token
        try {
          const response = await fetch('/api/auth/get-user-info', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
          });

          if (response.ok) {
            const userData = await response.json();
            
            // Store the new access token from backend
            if (userData.access_token) {
              localStorage.setItem('access_token', userData.access_token);
              document.cookie = `access_token=${userData.access_token}; path=/; max-age=${maxAge}; SameSite=Lax`;
              document.cookie = `client_access_token=${userData.access_token}; path=/; max-age=${maxAge}; SameSite=Lax`;
            }
            
            // Store user info if available
            if (userData.user?.id) {
              localStorage.setItem('user_id', userData.user.id);
              document.cookie = `user_id=${userData.user.id}; path=/; max-age=${maxAge}; SameSite=Lax`;
            }
            if (userData.user?.identifier) {
              localStorage.setItem('user_identifier', userData.user.identifier);
              document.cookie = `user_identifier=${userData.user.identifier}; path=/; max-age=${maxAge}; SameSite=Lax`;
            }
            if (userData.role) {
              localStorage.setItem('user_role', userData.role);
              document.cookie = `user_role=${userData.role}; path=/; max-age=${maxAge}; SameSite=Lax`;
            }
            
            // Store brand logos if available
            if (userData.brand_logos) {
              localStorage.setItem('brand_logos', JSON.stringify(userData.brand_logos));
              document.cookie = `brand_logos=${JSON.stringify(userData.brand_logos)}; path=/; max-age=${maxAge}; SameSite=Lax`;
            }

            console.log('User data stored successfully');
          } else {
            console.error('Failed to get user info from Google token');
            router.push('/login?error=auth_failed');
            return;
          }
        } catch (error) {
          console.error('Error getting user info from Google token:', error);
          router.push('/login?error=auth_failed');
          return;
        }

        console.log('Google authentication successful');

        // Show success for a moment, then redirect
        setTimeout(() => {
          setIsProcessing(false);
          setTimeout(() => {
            router.push('/admin');
          }, 1500);
        }, 1000);

      } catch (error) {
        console.error('Error processing Google auth success:', error);
        router.push('/login?error=processing_error');
      }
    };

    processAuthSuccess();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl"
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
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl"
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
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {isProcessing ? (
              <>
                <motion.div
                  className="mb-6"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-2xl">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                </motion.div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Đang xử lý...
                </h1>
                <p className="text-gray-300 text-sm">
                  Vui lòng chờ trong khi chúng tôi hoàn tất đăng nhập Google của bạn
                </p>
              </>
            ) : (
              <>
                <motion.div
                  className="mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-2xl">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
                <motion.h1
                  className="text-2xl font-bold text-white mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Đăng nhập thành công!
                </motion.h1>
                <motion.p
                  className="text-gray-300 text-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Đang chuyển hướng đến dashboard...
                </motion.p>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}