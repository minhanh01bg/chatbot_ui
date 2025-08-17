'use client';

import React from 'react';
import { useTheme } from '@/components/theme-provider';
import { themes } from '@/lib/theme';
import { Palette, Check, Sun, Moon, Monitor, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
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
  const { theme, setTheme, customTheme, setCustomTheme } = useTheme();

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

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 h-9 w-9 p-0"
                aria-label="Switch theme"
              >
                {getThemeIcon()}
                <span className="sr-only">{getThemeLabel()}</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Switch theme</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Mode Selection */}
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {theme === 'light' && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          {theme === 'dark' && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
          {theme === 'system' && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Color Themes */}
        {Object.keys(themes).map((themeName) => (
          <DropdownMenuItem
            key={themeName}
            onClick={() => setCustomTheme(themeName as any)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
                             <div
                 className="w-4 h-4 rounded-full"
                 style={{
                   background: themes[themeName as keyof typeof themes].primary.main,
                 }}
               />
              <span className="capitalize">{themeName}</span>
            </div>
            {customTheme === themeName && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Dark/Light Mode Switcher - Simple toggle between dark and light
 */
export function DarkModeSwitcher() {
  const { theme, setTheme } = useTheme();

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          aria-label={`Current theme: ${getThemeLabel()}`}
        >
          {getThemeIcon()}
          <span className="hidden sm:inline-block">Theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {theme === 'light' && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          {theme === 'dark' && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
          {theme === 'system' && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Combined Theme Switcher - Both mode and color themes
 */
export function CombinedThemeSwitcher() {
  const { theme, setTheme, customTheme, setCustomTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          aria-label="Theme settings"
        >
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline-block">Theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Theme Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Mode Section */}
        <div className="px-2 py-1.5">
          <div className="text-sm font-medium mb-2">Mode</div>
          <div className="space-y-1">
            <DropdownMenuItem onClick={() => setTheme('light')} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <span>Light</span>
              </div>
              {theme === 'light' && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => setTheme('dark')} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                <span>Dark</span>
              </div>
              {theme === 'dark' && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => setTheme('system')} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                <span>System</span>
              </div>
              {theme === 'system' && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Color Theme Section */}
        <div className="px-2 py-1.5">
          <div className="text-sm font-medium mb-2">Color Theme</div>
          <div className="grid grid-cols-2 gap-1">
            {Object.keys(themes).map((themeName) => (
              <DropdownMenuItem
                key={themeName}
                onClick={() => setCustomTheme(themeName as any)}
                className="flex items-center justify-between p-2"
              >
                <div className="flex items-center gap-2">
                                     <div
                     className="w-3 h-3 rounded-full"
                     style={{
                       background: themes[themeName as keyof typeof themes].primary.main,
                     }}
                   />
                  <span className="text-xs capitalize">{themeName}</span>
                </div>
                {customTheme === themeName && <Check className="h-3 w-3" />}
              </DropdownMenuItem>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
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
            className="gap-2"
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
            className="h-9 w-9 p-0"
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

/**
 * Color Theme Selector - Only for color themes
 */
export function ColorThemeSelector() {
  const { customTheme, setCustomTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          aria-label="Select color theme"
        >
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline-block">Colors</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {Object.keys(themes).map((themeName) => (
          <DropdownMenuItem
            key={themeName}
            onClick={() => setCustomTheme(themeName as any)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
                             <div
                 className="w-4 h-4 rounded-full"
                 style={{
                   background: themes[themeName as keyof typeof themes].primary.main,
                 }}
               />
              <span className="capitalize">{themeName}</span>
            </div>
            {customTheme === themeName && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ===== LEGACY COMPONENTS (for backward compatibility) =====

/**
 * @deprecated Use ThemeSwitcher instead
 */
export function ThemeSelector() {
  const { customTheme, setCustomTheme } = useTheme();
  
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-foreground">
        Color Theme
      </label>
      <select
        value={customTheme}
        onChange={(e) => setCustomTheme(e.target.value as any)}
        className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Select color theme"
      >
        {Object.keys(themes).map((themeName) => (
          <option key={themeName} value={themeName}>
            {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
