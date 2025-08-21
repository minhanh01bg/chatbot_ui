'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Shield, Loader2, ArrowLeft, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập địa chỉ email",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Lỗi",
        description: "Địa chỉ email không hợp lệ",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gửi email thất bại');
      }

      setIsEmailSent(true);
      toast({
        title: "Thành công",
        description: "Link đặt lại mật khẩu đã được gửi đến email của bạn.",
      });

    } catch (error) {
      console.error('Forgot password error:', error);
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : 'Gửi email thất bại',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendAnother = () => {
    setIsEmailSent(false);
    setEmail('');
  };

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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-6 shadow-2xl"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isEmailSent ? 'Kiểm tra email' : 'Quên mật khẩu'}
            </h1>
            <p className="text-gray-300 text-sm">
              {isEmailSent 
                ? 'Chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn'
                : 'Nhập email để nhận link đặt lại mật khẩu'
              }
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20"
          >
            {!isEmailSent ? (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium text-white/90">
                    Địa chỉ email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nhập địa chỉ email của bạn"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                      isLoading
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Đang gửi...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Gửi link đặt lại</span>
                      </>
                    )}
                  </button>
                </motion.div>
              </form>
            ) : (
              /* Success Message */
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-green-400 mb-4"
                >
                  <Mail className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-white text-lg font-medium mb-2">
                    Email đã được gửi!
                  </p>
                  <p className="text-gray-300 text-sm">
                    Vui lòng kiểm tra hộp thư email <strong>{email}</strong> và nhấp vào link để đặt lại mật khẩu.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="space-y-3"
                >
                  <button
                    onClick={handleSendAnother}
                    className="w-full py-3 px-6 rounded-xl font-medium bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    Gửi lại email
                  </button>
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Back to Login Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center mt-6"
          >
            <Link
              href="/login"
              className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại đăng nhập</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}