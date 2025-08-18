'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/components/theme-provider';
import { Check, Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// ===== THEME SWITCHER COMPONENTS =====

/**
 * Main Theme Switcher - Dropdown with all theme options
 */
export function ThemeSwitcher() {
  const { theme, setTheme, colorTheme, setColorTheme, availableThemes } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light Mode';
      case 'dark':
        return 'Dark Mode';
      default:
        return 'System Mode';
    }
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
    { value: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 h-9 w-9 p-0 theme-switcher-button transition-all duration-200"
              data-variant="outline"
              aria-label="Switch theme"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {getThemeIcon()}
              <span className="sr-only">{getThemeLabel()}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Switch theme</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-48 backdrop-blur-xl border border-border rounded-xl shadow-lg bg-white/95 dark:bg-gray-900/95 z-50 overflow-hidden"
          >
            <div className="p-2">
              {/* Mode Selection */}
              <div className="px-2 py-1.5 text-sm font-semibold text-foreground border-b border-border mb-1">
                Mode
              </div>
              
              <div className="mb-2">
                {themeOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setTheme(option.value as 'light' | 'dark' | 'system');
                    }}
                    className="w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {option.icon}
                      <span>{option.label}</span>
                    </div>
                    {theme === option.value && <Check className="h-4 w-4" />}
                  </motion.button>
                ))}
              </div>
              
              {/* Color Theme Selection */}
              <div className="px-2 py-1.5 text-sm font-semibold text-foreground border-b border-border mb-1">
                Color Theme
              </div>
              
              <div className="max-h-32 overflow-y-auto">
                {availableThemes.map((themeOption) => (
                  <motion.button
                    key={themeOption.name}
                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setColorTheme(themeOption.name);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{
                          background: `var(--accent)`,
                        }}
                      />
                      <span>{themeOption.displayName}</span>
                    </div>
                    {colorTheme === themeOption.name && <Check className="h-4 w-4" />}
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



/**
 * Simple Dark/Light Mode Toggle Button
 */
export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="gap-2 theme-switcher-button transition-all duration-200"
            data-variant="outline"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="hidden sm:inline-block">
              {theme === 'dark' ? 'Light' : 'Dark'}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Switch to {theme === 'dark' ? 'light' : 'dark'} mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Compact Dark/Light Mode Toggle (icon only)
 */
export function CompactDarkModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="h-9 w-9 p-0 theme-switcher-button transition-all duration-200"
            data-variant="outline"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Switch to {theme === 'dark' ? 'light' : 'dark'} mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}




