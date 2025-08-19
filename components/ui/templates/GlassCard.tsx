'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'light' | 'dark';
  children: React.ReactNode;
}

export function GlassCard({ 
  variant = 'light', 
  className, 
  children,
  ...props 
}: GlassCardProps) {
  const baseClasses = "rounded-2xl backdrop-blur-xl transition-all duration-300";
  
  const variantClasses = {
    light: "admin-bg-glass border admin-border-primary",
    dark: "admin-bg-glass border admin-border-primary"
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
