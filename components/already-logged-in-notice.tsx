'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, User, Home } from 'lucide-react';

interface AlreadyLoggedInNoticeProps {
  redirectTo?: string;
  delay?: number;
  showOptions?: boolean;
}

export function AlreadyLoggedInNotice({ 
  redirectTo = '/admin',
  delay = 5000,
  showOptions = true 
}: AlreadyLoggedInNoticeProps) {
  const [countdown, setCountdown] = useState(5);
  const [showOptionsState, setShowOptionsState] = useState(showOptions);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRedirect = () => {
    window.location.href = redirectTo;
  };

  const handleStayHere = () => {
    setShowOptionsState(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900">Already Logged In</h3>
        </div>
        
        <p className="text-gray-600 mb-4">
          You are already authenticated. Would you like to go to your dashboard?
        </p>
        
        {showOptionsState && (
          <div className="space-y-3 mb-4">
            <button
              onClick={handleRedirect}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </button>
            
            <button
              onClick={handleStayHere}
              className="w-full border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:border-purple-600 hover:text-purple-600 transition-all"
            >
              Stay Here
            </button>
          </div>
        )}
        
        {!showOptionsState && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ArrowRight className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-gray-500">
                Redirecting in {countdown} seconds
              </span>
            </div>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-1000"
                style={{ width: `${((5 - countdown) / 5) * 100}%` }}
              />
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mt-4">
          <User className="w-4 h-4" />
          <span>You can also manually navigate using the menu</span>
        </div>
      </div>
    </div>
  );
} 