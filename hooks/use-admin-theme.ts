'use client';

import { useState, useEffect } from 'react';
import { getThemeConfig, applyThemeToCSS } from '@/lib/theme-config';

// Helper function to apply admin theme CSS variables
function applyAdminThemeCSSVariables(themeName: string) {
  const root = document.documentElement;
  
  if (themeName === 'adminLight') {
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
    
  } else if (themeName === 'adminDark') {
    root.style.setProperty('--admin-text-primary', '0 0% 98%');
    root.style.setProperty('--admin-text-secondary', '240 5% 64.9%');
    root.style.setProperty('--admin-text-muted', '240 3.8% 46.1%');
    root.style.setProperty('--admin-text-subtle', '240 3.8% 46.1%');
    
    // Apply dark theme specific variables
    root.style.setProperty('--admin-gradient-primary', 'linear-gradient(135deg, hsl(270 100% 50%) 0%, hsl(280 100% 60%) 100%)');
    root.style.setProperty('--admin-gradient-secondary', 'linear-gradient(135deg, hsl(240 3.7% 15.9%) 0%, hsl(250 3.7% 17%) 100%)');
    root.style.setProperty('--admin-gradient-background', 'linear-gradient(135deg, hsl(240 10% 3.9%) 0%, hsl(250 10% 5%) 100%)');
    root.style.setProperty('--admin-gradient-card', 'linear-gradient(135deg, hsla(255 255% 255% 0.05) 0%, hsla(255 255% 255% 0.02) 100%)');
    root.style.setProperty('--admin-gradient-sidebar', 'linear-gradient(180deg, hsl(240 3.7% 15.9%) 0%, hsl(250 3.7% 17%) 100%)');
    
    root.style.setProperty('--admin-card-background', 'hsla(255 255% 255% 0.05)');
    root.style.setProperty('--admin-card-border', 'hsla(255 255% 255% 0.1)');
    root.style.setProperty('--admin-card-shadow', '0 8px 32px hsla(0 0% 0% 0.2)');
    
    root.style.setProperty('--admin-sidebar-background', 'hsl(240 3.7% 15.9%)');
    root.style.setProperty('--admin-sidebar-border', 'hsla(255 255% 255% 0.1)');
    root.style.setProperty('--admin-sidebar-text', 'hsl(0 0% 98%)');
    
    root.style.setProperty('--admin-navbar-background', 'hsla(255 255% 255% 0.05)');
    root.style.setProperty('--admin-navbar-border', 'hsla(255 255% 255% 0.1)');
    root.style.setProperty('--admin-navbar-text', 'hsl(0 0% 98%)');
    
    root.style.setProperty('--admin-input-background', 'hsla(255 255% 255% 0.05)');
    root.style.setProperty('--admin-input-border', 'hsla(255 255% 255% 0.1)');
    root.style.setProperty('--admin-input-text', 'hsl(0 0% 98%)');
    root.style.setProperty('--admin-input-placeholder', 'hsla(255 255% 255% 0.5)');
    
    root.style.setProperty('--admin-dropdown-background', 'hsla(255 255% 255% 0.1)');
    root.style.setProperty('--admin-dropdown-border', 'hsla(255 255% 255% 0.2)');
    root.style.setProperty('--admin-dropdown-shadow', '0 8px 32px hsla(0 0% 0% 0.3)');
  }
}

export function useAdminTheme() {
  const [currentTheme, setCurrentTheme] = useState('adminLight');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Get theme from localStorage or use default
    const savedTheme = localStorage.getItem('admin-theme') || 'adminLight';
    setCurrentTheme(savedTheme);
    
    // Apply the saved theme - always use light mode for specific theme selection
    const theme = getThemeConfig(savedTheme, false);
    applyThemeToCSS(theme, false);
    
    // Apply admin-specific styles for admin themes
    const root = document.documentElement;
    if (savedTheme.startsWith('admin')) {
      root.classList.add('admin-theme');
      root.setAttribute('data-theme', savedTheme);
      applyAdminThemeCSSVariables(savedTheme);
    } else {
      root.classList.remove('admin-theme');
      root.removeAttribute('data-theme');
    }
    
    return () => {
      root.classList.remove('admin-theme');
      root.removeAttribute('data-theme');
    };
  }, []);

  const setTheme = (themeName: string) => {
    setCurrentTheme(themeName);
    localStorage.setItem('admin-theme', themeName);
    
    // Always apply the specific theme in light mode
    // The isDark state is only used for toggle functionality
    const theme = getThemeConfig(themeName, false);
    applyThemeToCSS(theme, false);
    
    // Apply admin-specific styles for admin themes
    const root = document.documentElement;
    if (themeName.startsWith('admin')) {
      root.classList.add('admin-theme');
      root.setAttribute('data-theme', themeName);
      applyAdminThemeCSSVariables(themeName);
    } else {
      root.classList.remove('admin-theme');
      root.removeAttribute('data-theme');
      
      // Clear admin-specific CSS variables
      const adminVars = [
        '--admin-text-primary', '--admin-text-secondary', '--admin-text-muted', '--admin-text-subtle',
        '--admin-gradient-primary', '--admin-gradient-secondary', '--admin-gradient-background',
        '--admin-gradient-card', '--admin-gradient-sidebar',
        '--admin-card-background', '--admin-card-border', '--admin-card-shadow',
        '--admin-sidebar-background', '--admin-sidebar-border', '--admin-sidebar-text',
        '--admin-navbar-background', '--admin-navbar-border', '--admin-navbar-text',
        '--admin-input-background', '--admin-input-border', '--admin-input-text', '--admin-input-placeholder',
        '--admin-dropdown-background', '--admin-dropdown-border', '--admin-dropdown-shadow'
      ];
      
      adminVars.forEach(varName => {
        root.style.removeProperty(varName);
      });
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    
    // When toggling dark mode, we need to determine which theme to apply
    let themeToApply = currentTheme;
    
    // If switching to dark mode and current theme is adminLight, switch to adminDark
    if (newDarkMode && currentTheme === 'adminLight') {
      themeToApply = 'adminDark';
      setCurrentTheme('adminDark');
      localStorage.setItem('admin-theme', 'adminDark');
    }
    // If switching to light mode and current theme is adminDark, switch to adminLight
    else if (!newDarkMode && currentTheme === 'adminDark') {
      themeToApply = 'adminLight';
      setCurrentTheme('adminLight');
      localStorage.setItem('admin-theme', 'adminLight');
    }
    
    const theme = getThemeConfig(themeToApply, false);
    applyThemeToCSS(theme, false);
    
    // Update admin text colors and CSS variables for the new theme
    const root = document.documentElement;
    if (themeToApply.startsWith('admin')) {
      applyAdminThemeCSSVariables(themeToApply);
    }
  };

  return {
    currentTheme,
    isDark,
    setTheme,
    toggleDarkMode,
  };
} 