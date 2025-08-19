'use client';

import { cn } from '@/lib/utils';

interface AdminTextProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'muted' | 'subtle';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function AdminText({ 
  children, 
  variant = 'primary', 
  className = '',
  as: Component = 'span'
}: AdminTextProps) {
  const variantClasses = {
    primary: 'admin-text-primary',
    secondary: 'admin-text-secondary', 
    muted: 'admin-text-muted',
    subtle: 'admin-text-subtle'
  };

  return (
    <Component className={cn(variantClasses[variant], className)}>
      {children}
    </Component>
  );
}

// Convenience components for common text variants
export function AdminTextPrimary({ children, className, ...props }: Omit<AdminTextProps, 'variant'>) {
  return <AdminText variant="primary" className={className} {...props}>{children}</AdminText>;
}

export function AdminTextSecondary({ children, className, ...props }: Omit<AdminTextProps, 'variant'>) {
  return <AdminText variant="secondary" className={className} {...props}>{children}</AdminText>;
}

export function AdminTextMuted({ children, className, ...props }: Omit<AdminTextProps, 'variant'>) {
  return <AdminText variant="muted" className={className} {...props}>{children}</AdminText>;
}

export function AdminTextSubtle({ children, className, ...props }: Omit<AdminTextProps, 'variant'>) {
  return <AdminText variant="subtle" className={className} {...props}>{children}</AdminText>;
} 