'use client';

import Link from 'next/link';
import { Lock, LogIn, UserPlus } from 'lucide-react';

interface AuthRequiredNoticeProps {
  title?: string;
  message?: string;
  showRegister?: boolean;
}

export function AuthRequiredNotice({ 
  title = "Authentication Required",
  message = "Please log in to access this page.",
  showRegister = true 
}: AuthRequiredNoticeProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 mb-8">{message}</p>
        
        <div className="space-y-4">
          <Link
            href="/login"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
          >
            <LogIn className="w-5 h-5" />
            <span>Sign In</span>
          </Link>
          
          {showRegister && (
            <Link
              href="/register"
              className="w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-purple-600 hover:text-purple-600 transition-all flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Create Account</span>
            </Link>
          )}
        </div>
        
        <p className="text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-purple-600 hover:underline font-medium">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
} 