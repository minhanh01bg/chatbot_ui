import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/80 admin-theme:bg-purple-500/20 admin-theme:text-purple-300 admin-theme:border-purple-500/30',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 admin-theme:bg-white/10 admin-theme:text-gray-300 admin-theme:border-white/20',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/80 admin-theme:bg-red-500/20 admin-theme:text-red-300 admin-theme:border-red-500/30',
        outline:
          'text-foreground border border-input hover:bg-accent hover:text-accent-foreground admin-theme:text-gray-900 admin-theme:border-purple-200/30 admin-theme:hover:bg-purple-100/20',
        success:
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 admin-theme:bg-emerald-500/20 admin-theme:text-emerald-300 admin-theme:border-emerald-500/30',
        warning:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 admin-theme:bg-yellow-500/20 admin-theme:text-yellow-300 admin-theme:border-yellow-500/30',
        error:
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 admin-theme:bg-red-500/20 admin-theme:text-red-300 admin-theme:border-red-500/30',
        info:
          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 admin-theme:bg-blue-500/20 admin-theme:text-blue-300 admin-theme:border-blue-500/30',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children?: React.ReactNode;
  className?: string;
}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
export default Badge; 