'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GradientButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function GradientButton({ 
  children, 
  className = '', 
  variant = 'primary',
  size = 'md',
  ...props 
}: GradientButtonProps) {
  const baseClasses = 'font-medium transition-all duration-300 flex items-center justify-center space-x-2 rounded-xl';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105',
    secondary: 'bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transform hover:scale-105',
    outline: 'border border-white/20 text-white hover:bg-white/10 hover:border-white/30 transform hover:scale-105'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
