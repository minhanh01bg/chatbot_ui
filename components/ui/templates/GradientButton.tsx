'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function GradientButton({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children,
  ...props 
}: GradientButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-105";
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl"
  };
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-purple-600 to-blue-600 text-gray-900 hover:from-purple-700 hover:to-blue-700 focus:ring-purple-500",
    secondary: "bg-gradient-to-r from-blue-600 to-purple-600 text-gray-900 hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500",
    outline: "bg-transparent border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-gray-900 focus:ring-purple-500"
  };
  
  return (
    <button
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
