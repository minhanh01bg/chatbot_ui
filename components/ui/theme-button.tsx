import React from 'react';
import { cn } from '@/lib/utils';

export interface ThemeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const ThemeButton = React.forwardRef<HTMLButtonElement, ThemeButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variantClasses = {
      primary: 'bg-button-primary text-button-primary-text hover:bg-button-primary-hover',
      secondary: 'bg-button-secondary text-button-secondary-text hover:bg-button-secondary-hover',
      outline: 'border border-border bg-button-outline text-button-outline-text hover:bg-button-outline-hover',
      ghost: 'bg-button-ghost text-button-ghost-text hover:bg-button-ghost-hover',
      destructive: 'bg-button-destructive text-button-destructive-text hover:bg-button-destructive-hover',
    };
    
    const sizeClasses = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-12 px-6 text-lg',
    };
    
    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ThemeButton.displayName = 'ThemeButton'; 