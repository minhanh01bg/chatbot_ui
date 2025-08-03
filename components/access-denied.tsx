'use client';

import Link from 'next/link';
import { Shield, AlertTriangle, Home, User } from 'lucide-react';

interface AccessDeniedProps {
  title?: string;
  message?: string;
  requiredRole?: string;
  userRole?: string;
}

export function AccessDenied({ 
  title = "Access Denied",
  message = "You don't have permission to access this page.",
  requiredRole,
  userRole 
}: AccessDeniedProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        
        {requiredRole && userRole && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Your role: <span className="font-semibold">{userRole}</span></span>
              </div>
              <div className="text-gray-400">|</div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span className="text-gray-600">Required: <span className="font-semibold">{requiredRole}</span></span>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <Link
            href="/admin"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Go to Dashboard</span>
          </Link>
          
          <Link
            href="/"
            className="w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-purple-600 hover:text-purple-600 transition-all flex items-center justify-center space-x-2"
          >
            <span>Back to Home</span>
          </Link>
        </div>
        
        <p className="text-sm text-gray-500 mt-6">
          Need help?{' '}
          <Link href="/contact" className="text-purple-600 hover:underline font-medium">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
} 