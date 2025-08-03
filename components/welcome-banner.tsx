'use client';

import { useEffect, useState } from 'react';
import { User, Sparkles, X } from 'lucide-react';

interface WelcomeBannerProps {
  userName?: string;
  userEmail?: string;
}

export function WelcomeBanner({ userName, userEmail }: WelcomeBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Tự động ẩn banner sau 5 giây
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const displayName = userName || userEmail || 'User';

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="font-medium">
          Welcome back, {displayName}! 🎉
        </span>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
          aria-label="Close welcome banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
} 