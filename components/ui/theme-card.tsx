import React from 'react';
import { cn } from '@/lib/utils';

export interface ThemeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'glass';
  children: React.ReactNode;
}

export const ThemeCard = React.forwardRef<HTMLDivElement, ThemeCardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const baseClasses = 'rounded-lg border transition-colors';
    
    const variantClasses = {
      default: 'bg-background border-border shadow-sm',
      secondary: 'bg-background-secondary border-border-secondary',
      glass: 'bg-glass-bg border-glass-border shadow-[var(--glass-shadow)] backdrop-blur-sm',
    };
    
    return (
      <div
        className={cn(
          baseClasses,
          variantClasses[variant],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ThemeCard.displayName = 'ThemeCard';

export const ThemeCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
);

ThemeCardHeader.displayName = 'ThemeCardHeader';

export const ThemeCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight text-foreground', className)}
      {...props}
    />
  )
);

ThemeCardTitle.displayName = 'ThemeCardTitle';

export const ThemeCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-content-muted', className)}
      {...props}
    />
  )
);

ThemeCardDescription.displayName = 'ThemeCardDescription';

export const ThemeCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-6 pt-0', className)}
      {...props}
    />
  )
);

ThemeCardContent.displayName = 'ThemeCardContent';

export const ThemeCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
);

ThemeCardFooter.displayName = 'ThemeCardFooter'; 