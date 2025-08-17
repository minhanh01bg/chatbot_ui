'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { getThemeColors } from '@/lib/theme';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  themeName?: string;
}

export function GradientButton({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  themeName = 'default',
  ...props 
}: GradientButtonProps) {
  const theme = getThemeColors(themeName as any);
  
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl"
  };
  
  const variantClasses = {
    primary: `bg-gradient-to-r from-[${theme.primary.main}] to-[${theme.secondary.main}] text-white hover:from-[${theme.primary.dark}] hover:to-[${theme.secondary.dark}] shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-[${theme.primary.main}]`,
    secondary: `bg-gradient-to-r from-[${theme.secondary.main}] to-[${theme.primary.main}] text-white hover:from-[${theme.secondary.dark}] hover:to-[${theme.primary.dark}] shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-[${theme.secondary.main}]`,
    outline: `bg-transparent border-2 border-[${theme.primary.main}] text-[${theme.primary.main}] hover:bg-[${theme.primary.main}] hover:text-white shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-[${theme.primary.main}]`
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
