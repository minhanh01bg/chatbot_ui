'use client';

import { useEffect, useState } from 'react';
import { getThemeConfig, applyThemeToCSS } from '@/lib/theme-config';
import { ClientOnly } from './ClientOnly';

interface AdminThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
}

export function AdminThemeProvider({ children, defaultTheme = 'light' }: AdminThemeProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Set hydration status
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  useEffect(() => {
    // Check if we're on the client side
    if (typeof window === 'undefined') return;
    
    // Get theme from localStorage or use default
    const savedTheme = localStorage.getItem('admin-theme') || defaultTheme;
    
    // Apply theme - always use light mode for specific theme selection
    const theme = getThemeConfig(savedTheme, false);
    applyThemeToCSS(theme, false);
    
    // Set CSS custom properties for admin-specific styling
    const root = document.documentElement;
    
    // Set admin-specific text colors based on theme
    if (savedTheme === 'light') {
      root.style.setProperty('--admin-text-primary', '240 10% 3.9%');
      root.style.setProperty('--admin-text-secondary', '240 5% 20%');
      root.style.setProperty('--admin-text-muted', '240 5% 45%');
      root.style.setProperty('--admin-text-subtle', '240 5% 60%');
    } else {
      root.style.setProperty('--admin-text-primary', '0 0% 98%');
      root.style.setProperty('--admin-text-secondary', '240 5% 64.9%');
      root.style.setProperty('--admin-text-muted', '240 3.8% 46.1%');
      root.style.setProperty('--admin-text-subtle', '240 3.8% 46.1%');
    }
    
    // Set admin-specific CSS variables for enhanced styling
    if (savedTheme === 'light') {
      // Light theme specific variables
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
      
    } else {
      // Dark theme specific variables
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
    
    // Common admin theme variables
    root.style.setProperty('--admin-accent', '270 100% 50%');
    root.style.setProperty('--admin-accent-secondary', '270 100% 45%');
    root.style.setProperty('--admin-accent-muted', '270 100% 50% / 0.1');
    root.style.setProperty('--admin-border-primary', '270 100% 50% / 0.2');
    root.style.setProperty('--admin-border-secondary', '270 100% 50% / 0.1');
    root.style.setProperty('--admin-border-accent', '270 100% 50% / 0.3');
    root.style.setProperty('--admin-bg-glass', '255 255% 255% / 0.1');
    
  }, [defaultTheme]);

  return (
    <ClientOnly>
      {isHydrated ? children : null}
    </ClientOnly>
  );
} 