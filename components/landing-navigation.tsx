'use client';

import Link from 'next/link';
import { Bot } from 'lucide-react';
import { useCurrentUser } from '@/hooks/use-current-user';

export function LandingNavigation() {
  const { user, isLoading, isAuthenticated } = useCurrentUser();

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ChatAI Pro</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Reviews</a>
          </div>
          
          <div className="flex items-center space-x-4">
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  // User is logged in - show dashboard button
                  <>
                    <span className="text-gray-600 text-sm hidden sm:block">
                      Welcome, {user?.name || 'User'}!
                    </span>
                    <Link
                      href="/admin"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                    >
                      Go to Dashboard
                    </Link>
                  </>
                ) : (
                  // User is not logged in - show login/register buttons
                  <>
                    <Link
                      href="/login"
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 