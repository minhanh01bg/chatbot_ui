'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getThemeConfig, applyThemeToCSS } from '@/lib/theme-config';

// Helper function to apply admin theme CSS variables
function applyAdminThemeCSSVariables(themeName: string) {
  const root = document.documentElement;
  
  if (themeName === 'light') {
    root.style.setProperty('--admin-text-primary', '240 10% 3.9%');
    root.style.setProperty('--admin-text-secondary', '240 5% 20%');
    root.style.setProperty('--admin-text-muted', '240 5% 45%');
    root.style.setProperty('--admin-text-subtle', '240 5% 60%');
    
    // Apply light theme specific variables
    root.style.setProperty('--admin-gradient-primary', 'linear-gradient(135deg, hsl(270 100% 50%) 0%, hsl(280 100% 60%) 100%)');
    root.style.setProperty('--admin-gradient-secondary', 'linear-gradient(135deg, hsl(240 4.8% 95.9%) 0%, hsl(240 5.9% 90%) 100%)');
    root.style.setProperty('--admin-gradient-background', 'linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(240 4.8% 95.9%) 100%)');
    root.style.setProperty('--admin-gradient-card', 'linear-gradient(135deg, hsla(270 100% 50% 0.03) 0%, hsla(270 100% 50% 0.01) 100%)');
    root.style.setProperty('--admin-gradient-sidebar', 'linear-gradient(180deg, hsl(240 4.8% 95.9%) 0%, hsl(240 5.9% 90%) 100%)');
    
    root.style.setProperty('--admin-card-background', 'hsla(270 100% 50% 0.03)');
    root.style.setProperty('--admin-card-border', 'hsla(270 100% 50% 0.08)');
    root.style.setProperty('--admin-card-shadow', '0 4px 20px hsla(0 0% 0% 0.05)');
    
    root.style.setProperty('--admin-sidebar-background', 'hsl(240 4.8% 95.9%)');
    root.style.setProperty('--admin-sidebar-border', 'hsla(270 100% 50% 0.1)');
    root.style.setProperty('--admin-sidebar-text', 'hsl(240 10% 3.9%)');
    
    root.style.setProperty('--admin-navbar-background', 'hsla(270 100% 50% 0.03)');
    root.style.setProperty('--admin-navbar-border', 'hsla(270 100% 50% 0.1)');
    root.style.setProperty('--admin-navbar-text', 'hsl(240 10% 3.9%)');
    
    root.style.setProperty('--admin-input-background', 'hsla(270 100% 50% 0.03)');
    root.style.setProperty('--admin-input-border', 'hsla(270 100% 50% 0.1)');
    root.style.setProperty('--admin-input-text', 'hsl(240 10% 3.9%)');
    root.style.setProperty('--admin-input-placeholder', 'hsla(240 10% 3.9% 0.5)');
    
    root.style.setProperty('--admin-dropdown-background', 'hsla(0 0% 100% 0.95)');
    root.style.setProperty('--admin-dropdown-border', 'hsla(270 100% 50% 0.2)');
    root.style.setProperty('--admin-dropdown-shadow', '0 8px 32px hsla(0 0% 0% 0.1)');
    
    // Add main content background for light mode
    root.style.setProperty('--admin-main-background', 'hsl(0 0% 100%)');
    root.style.setProperty('--admin-content-background', 'hsl(240 4.8% 95.9%)');
    
  } else if (themeName === 'dark') {
    root.style.setProperty('--admin-text-primary', '0 0% 98%');
    root.style.setProperty('--admin-text-secondary', '220 9% 75%');
    root.style.setProperty('--admin-text-muted', '220 9% 60%');
    root.style.setProperty('--admin-text-subtle', '220 9% 50%');
    
    // Apply dark theme specific variables with improved contrast
    root.style.setProperty('--admin-gradient-primary', 'linear-gradient(135deg, hsl(270 100% 50%) 0%, hsl(280 100% 60%) 100%)');
    root.style.setProperty('--admin-gradient-secondary', 'linear-gradient(135deg, hsl(220 13% 22%) 0%, hsl(220 13% 26%) 100%)');
    root.style.setProperty('--admin-gradient-background', 'linear-gradient(135deg, hsl(220 13% 18%) 0%, hsl(220 13% 22%) 100%)');
    root.style.setProperty('--admin-gradient-card', 'linear-gradient(135deg, hsla(255 255% 255% 0.08) 0%, hsla(255 255% 255% 0.04) 100%)');
    root.style.setProperty('--admin-gradient-sidebar', 'linear-gradient(180deg, hsl(220 13% 22%) 0%, hsl(220 13% 26%) 100%)');
    
    root.style.setProperty('--admin-card-background', 'hsla(255 255% 255% 0.08)');
    root.style.setProperty('--admin-card-border', 'hsla(255 255% 255% 0.15)');
    root.style.setProperty('--admin-card-shadow', '0 8px 32px hsla(0 0% 0% 0.25)');
    
    root.style.setProperty('--admin-sidebar-background', 'hsl(220 13% 22%)');
    root.style.setProperty('--admin-sidebar-border', 'hsla(255 255% 255% 0.15)');
    root.style.setProperty('--admin-sidebar-text', 'hsl(0 0% 98%)');
    
    root.style.setProperty('--admin-navbar-background', 'hsla(255 255% 255% 0.08)');
    root.style.setProperty('--admin-navbar-border', 'hsla(255 255% 255% 0.15)');
    root.style.setProperty('--admin-navbar-text', 'hsl(0 0% 98%)');
    
    root.style.setProperty('--admin-input-background', 'hsla(255 255% 255% 0.08)');
    root.style.setProperty('--admin-input-border', 'hsla(255 255% 255% 0.15)');
    root.style.setProperty('--admin-input-text', 'hsl(0 0% 98%)');
    root.style.setProperty('--admin-input-placeholder', 'hsla(255 255% 255% 0.6)');
    
    root.style.setProperty('--admin-dropdown-background', 'hsla(255 255% 255% 0.15)');
    root.style.setProperty('--admin-dropdown-border', 'hsla(255 255% 255% 0.25)');
    root.style.setProperty('--admin-dropdown-shadow', '0 8px 32px hsla(0 0% 0% 0.25)');
    
    // Add main content background for dark mode
    root.style.setProperty('--admin-main-background', 'hsl(220 13% 18%)');
    root.style.setProperty('--admin-content-background', 'hsl(220 13% 22%)');
  }
  
  // Common admin theme variables
  root.style.setProperty('--admin-accent', '270 100% 50%');
  root.style.setProperty('--admin-accent-secondary', '270 100% 45%');
  root.style.setProperty('--admin-accent-muted', '270 100% 50% / 0.1');
  root.style.setProperty('--admin-border-primary', '270 100% 50% / 0.2');
  root.style.setProperty('--admin-border-secondary', '270 100% 50% / 0.1');
  root.style.setProperty('--admin-border-accent', '270 100% 50% / 0.3');
  root.style.setProperty('--admin-bg-glass', '255 255% 255% / 0.1');
}

interface AdminThemeContextType {
  currentTheme: string;
  isDark: boolean;
  setTheme: (themeName: string) => void;
  toggleDarkMode: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

interface AdminThemeProviderProps {
  children: ReactNode;
  defaultTheme?: string;
}

export function AdminThemeProvider({ children, defaultTheme = 'light' }: AdminThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);
  const [isDark, setIsDark] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Get theme from localStorage or use default
    const savedTheme = localStorage.getItem('admin-theme') || defaultTheme;
    
    // Set isDark state based on the saved theme
    const isDarkTheme = savedTheme === 'dark';
    setIsDark(isDarkTheme);
    setCurrentTheme(savedTheme);
    
    // Apply the saved theme
    const theme = getThemeConfig(savedTheme, false);
    applyThemeToCSS(theme, false);
    
    // Apply admin-specific styles for all admin themes
    const root = document.documentElement;
    root.classList.add('admin-theme');
    root.setAttribute('data-theme', savedTheme);
    applyAdminThemeCSSVariables(savedTheme);
    
    setIsInitialized(true);
  }, [defaultTheme]);

  const setTheme = (themeName: string) => {
    setCurrentTheme(themeName);
    setIsDark(themeName === 'dark');
    localStorage.setItem('admin-theme', themeName);
    
    const theme = getThemeConfig(themeName, false);
    applyThemeToCSS(theme, false);
    
    // Apply admin-specific styles for all themes
    const root = document.documentElement;
    root.classList.add('admin-theme');
    root.setAttribute('data-theme', themeName);
    applyAdminThemeCSSVariables(themeName);
  };

  const toggleDarkMode = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const value = {
    currentTheme,
    isDark,
    setTheme,
    toggleDarkMode,
  };

  // Don't render children until theme is initialized to prevent flash
  if (!isInitialized) {
    return null;
  }

  return (
    <AdminThemeContext.Provider value={value}>
      {children}
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (context === undefined) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider');
  }
  return context;
} 