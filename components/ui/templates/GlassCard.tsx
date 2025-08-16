'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = '', hover = true, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl ${hover ? 'hover:bg-white/20 transition-all duration-300' : ''} ${className}`}
      whileHover={hover ? { y: -5, scale: 1.02 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}
