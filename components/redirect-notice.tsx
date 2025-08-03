'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface RedirectNoticeProps {
  redirectTo: string;
  delay?: number;
}

export function RedirectNotice({ redirectTo, delay = 2000 }: RedirectNoticeProps) {
  const [countdown, setCountdown] = useState(3);

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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900">Already Logged In</h3>
        </div>
        <p className="text-gray-600 mb-4">
          You are already authenticated. Redirecting you to the dashboard...
        </p>
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
              style={{ width: `${((3 - countdown) / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 