import { Bot } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ size = 'md', text = 'Loading...' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-purple-200 border-t-purple-600`}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Bot className={`${size === 'lg' ? 'h-6 w-6' : size === 'md' ? 'h-4 w-4' : 'h-3 w-3'} text-purple-600`} />
          </div>
        </div>
        {text && (
          <p className="text-gray-600 font-medium">{text}</p>
        )}
      </div>
    </div>
  );
} 