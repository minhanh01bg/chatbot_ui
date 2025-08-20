'use client';

import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useAdminTheme } from '@/contexts/AdminThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { currentTheme, isDark, toggleDarkMode } = useAdminTheme();
  
  // Check if current theme is an admin theme
  const isAdminTheme = currentTheme.startsWith('admin');

  return (
    <motion.button
      onClick={toggleDarkMode}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center justify-center w-10 h-10 admin-accent-secondary border admin-border-secondary rounded-xl admin-text-primary hover:admin-accent-muted transition-all duration-300 ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </motion.button>
  );
} 