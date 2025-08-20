'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, ChevronDown, Check, Moon, Sun } from 'lucide-react';
import { getAvailableThemes } from '@/lib/theme-config';
import { useAdminTheme } from '@/hooks/use-admin-theme';
import { AdminTextSecondary, AdminTextMuted } from '@/components/ui/admin-text';

interface ThemeSelectorProps {
  className?: string;
}

export function ThemeSelector({ className = '' }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, isDark, setTheme, toggleDarkMode } = useAdminTheme();

  const themes = getAvailableThemes();
  
  // Determine if we're in dark mode based on current theme
  const isCurrentlyDark = currentTheme === 'dark';

  const handleThemeChange = (themeName: string) => {
    setTheme(themeName);
    setIsOpen(false);
  };

  const handleModeToggle = () => {
    toggleDarkMode();
  };

  const getThemeIcon = (themeName: string) => {
    if (themeName === 'light') return <Sun className="w-4 h-4" />;
    if (themeName === 'dark') return <Moon className="w-4 h-4" />;
    return <Palette className="w-4 h-4" />;
  };

  const getThemeBadge = (themeName: string) => {
    if (themeName === 'light') return 'Light';
    if (themeName === 'dark') return 'Dark';
    return 'Basic';
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center space-x-3 p-2 bg-gray-100/50 border border-gray-200/50 rounded-xl text-gray-900 hover:bg-gray-200/50 transition-all duration-300"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
          <Palette className="w-4 h-4 text-gray-900" />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">Theme</p>
          <AdminTextSecondary className="text-xs">{currentTheme}</AdminTextSecondary>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute right-0 mt-2 w-72 admin-dropdown rounded-xl shadow-2xl overflow-hidden z-50 !bg-white dark:!bg-gray-900 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50`}
          >
            <div className="p-4 border-b border-purple-500/20">
              <p className="text-gray-900 font-semibold">Theme Settings</p>
              <AdminTextMuted className="text-sm">Choose your preferred theme</AdminTextMuted>
            </div>
            
            <div className="p-4">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between mb-4 p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-gray-900 text-sm font-medium">Dark Mode</p>
                  <AdminTextMuted className="text-xs">Toggle dark/light mode</AdminTextMuted>
                </div>
                <button
                  onClick={handleModeToggle}
                  aria-label={`Toggle ${isCurrentlyDark ? 'light' : 'dark'} mode`}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    isCurrentlyDark ? 'bg-purple-500' : 'bg-gray-400'
                  }`}
                >
                  <motion.div
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                    animate={{ x: isCurrentlyDark ? 24 : 2 }}
                    transition={{ duration: 0.3 }}
                  />
                </button>
              </div>

              {/* Available Themes Section */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 mb-3">
                  <Palette className="w-4 h-4 text-purple-500" />
                  <p className="text-gray-900 text-sm font-semibold">Available Themes</p>
                </div>
                {themes.map((theme) => (
                  <motion.button
                    key={theme.name}
                    onClick={() => handleThemeChange(theme.name)}
                    whileHover={{ backgroundColor: 'rgba(147, 51, 234, 0.2)' }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      currentTheme === theme.name ? 'bg-purple-500/20 border border-purple-500/30' : 'hover:bg-purple-500/10'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {getThemeIcon(theme.name)}
                      <div className="text-left">
                        <div className="flex items-center space-x-2">
                          <p className="text-gray-900 text-sm font-medium">{theme.displayName}</p>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            getThemeBadge(theme.name) === 'Light' 
                              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                              : getThemeBadge(theme.name) === 'Dark'
                              ? 'bg-gradient-to-r from-gray-600 to-gray-800 text-white'
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {getThemeBadge(theme.name)}
                          </span>
                        </div>
                        <AdminTextMuted className="text-xs">{theme.description}</AdminTextMuted>
                      </div>
                    </div>
                    {currentTheme === theme.name && (
                      <Check className="w-4 h-4 text-purple-400" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 