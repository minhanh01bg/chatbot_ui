'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { getThemeColors } from '@/lib/theme';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'light' | 'dark';
  children: React.ReactNode;
  themeName?: string;
}

export function GlassCard({ 
  variant = 'light', 
  className, 
  children, 
  themeName = 'default',
  ...props 
}: GlassCardProps) {
  const theme = getThemeColors(themeName as any);
  
  const baseClasses = "rounded-2xl backdrop-blur-xl transition-all duration-300";
  
  const variantClasses = {
    light: `bg-[${theme.background.glass}] border border-[${theme.border.glass}]`,
    dark: `bg-[${theme.background.glassDark}] border border-[${theme.border.secondary}]`
  };
  
  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
