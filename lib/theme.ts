// Theme configuration for the entire application
export interface ThemeColors {
  // Primary colors
  primary: {
    main: string;
    light: string;
    dark: string;
    contrast: string;
  };
  
  // Secondary colors
  secondary: {
    main: string;
    light: string;
    dark: string;
    contrast: string;
  };
  
  // Background colors
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    glass: string;
    glassDark: string;
  };
  
  // Text colors
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
    inverse: string;
  };
  
  // Border colors
  border: {
    primary: string;
    secondary: string;
    glass: string;
  };
  
  // Status colors
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  
  // Gradient colors
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  
  // Animation colors
  animation: {
    blob1: string;
    blob2: string;
    blob3: string;
  };
}

// Light theme (default)
export const lightTheme: ThemeColors = {
  primary: {
    main: '#8b5cf6', // purple-600
    light: '#a855f7', // purple-500
    dark: '#7c3aed', // purple-700
    contrast: '#ffffff',
  },
  secondary: {
    main: '#3b82f6', // blue-600
    light: '#60a5fa', // blue-500
    dark: '#2563eb', // blue-700
    contrast: '#ffffff',
  },
  background: {
    primary: '#ffffff', // white for light mode
    secondary: '#f8fafc', // slate-50
    tertiary: '#f1f5f9', // slate-100
    glass: 'rgba(255, 255, 255, 0.8)',
    glassDark: 'rgba(0, 0, 0, 0.1)',
  },
  text: {
    primary: '#0f172a', // slate-900
    secondary: '#334155', // slate-700
    tertiary: '#475569', // slate-600
    muted: '#64748b', // slate-500
    inverse: '#ffffff',
  },
  border: {
    primary: 'rgba(0, 0, 0, 0.1)',
    secondary: 'rgba(0, 0, 0, 0.05)',
    glass: 'rgba(0, 0, 0, 0.1)',
  },
  status: {
    success: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
    error: '#ef4444', // red-500
    info: '#3b82f6', // blue-500
  },
  gradients: {
    primary: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
    secondary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accent: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
    background: 'linear-gradient(135deg, #0f172a 0%, #581c87 100%)',
  },
  animation: {
    blob1: '#8b5cf6', // purple-600
    blob2: '#3b82f6', // blue-600
    blob3: '#ec4899', // pink-500
  },
};

// Dark theme
export const darkTheme: ThemeColors = {
  primary: {
    main: '#8b5cf6', // purple-600
    light: '#a855f7', // purple-500
    dark: '#7c3aed', // purple-700
    contrast: '#ffffff',
  },
  secondary: {
    main: '#3b82f6', // blue-600
    light: '#60a5fa', // blue-500
    dark: '#2563eb', // blue-700
    contrast: '#ffffff',
  },
  background: {
    primary: '#000000', // black
    secondary: '#0f172a', // slate-900
    tertiary: '#1e293b', // slate-800
    glass: 'rgba(255, 255, 255, 0.1)',
    glassDark: 'rgba(0, 0, 0, 0.2)',
  },
  text: {
    primary: '#ffffff',
    secondary: '#e2e8f0', // slate-200
    tertiary: '#cbd5e1', // slate-300
    muted: '#64748b', // slate-500
    inverse: '#000000',
  },
  border: {
    primary: 'rgba(255, 255, 255, 0.2)',
    secondary: 'rgba(255, 255, 255, 0.1)',
    glass: 'rgba(255, 255, 255, 0.2)',
  },
  status: {
    success: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
    error: '#ef4444', // red-500
    info: '#3b82f6', // blue-500
  },
  gradients: {
    primary: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
    secondary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accent: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
    background: 'linear-gradient(135deg, #0f172a 0%, #581c87 100%)',
  },
  animation: {
    blob1: '#8b5cf6', // purple-600
    blob2: '#3b82f6', // blue-600
    blob3: '#ec4899', // pink-500
  },
};

// Alternative themes
export const oceanTheme: ThemeColors = {
  ...lightTheme,
  primary: {
    main: '#0891b2', // cyan-600
    light: '#06b6d4', // cyan-500
    dark: '#0e7490', // cyan-700
    contrast: '#ffffff',
  },
  secondary: {
    main: '#0ea5e9', // sky-600
    light: '#38bdf8', // sky-500
    dark: '#0284c7', // sky-700
    contrast: '#ffffff',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #0891b2 0%, #0ea5e9 100%)',
    secondary: 'linear-gradient(135deg, #06b6d4 0%, #38bdf8 100%)',
    accent: 'linear-gradient(135deg, #0891b2 0%, #0ea5e9 100%)',
    background: 'linear-gradient(135deg, #0f172a 0%, #0e7490 100%)',
  },
  animation: {
    blob1: '#0891b2', // cyan-600
    blob2: '#0ea5e9', // sky-600
    blob3: '#06b6d4', // cyan-500
  },
};

export const forestTheme: ThemeColors = {
  ...lightTheme,
  primary: {
    main: '#059669', // emerald-600
    light: '#10b981', // emerald-500
    dark: '#047857', // emerald-700
    contrast: '#ffffff',
  },
  secondary: {
    main: '#16a34a', // green-600
    light: '#22c55e', // green-500
    dark: '#15803d', // green-700
    contrast: '#ffffff',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #059669 0%, #16a34a 100%)',
    secondary: 'linear-gradient(135deg, #10b981 0%, #22c55e 100%)',
    accent: 'linear-gradient(135deg, #059669 0%, #16a34a 100%)',
    background: 'linear-gradient(135deg, #0f172a 0%, #047857 100%)',
  },
  animation: {
    blob1: '#059669', // emerald-600
    blob2: '#16a34a', // green-600
    blob3: '#10b981', // emerald-500
  },
};

export const sunsetTheme: ThemeColors = {
  ...lightTheme,
  primary: {
    main: '#ea580c', // orange-600
    light: '#f97316', // orange-500
    dark: '#c2410c', // orange-700
    contrast: '#ffffff',
  },
  secondary: {
    main: '#dc2626', // red-600
    light: '#ef4444', // red-500
    dark: '#b91c1c', // red-700
    contrast: '#ffffff',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
    secondary: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
    accent: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
    background: 'linear-gradient(135deg, #0f172a 0%, #c2410c 100%)',
  },
  animation: {
    blob1: '#ea580c', // orange-600
    blob2: '#dc2626', // red-600
    blob3: '#f97316', // orange-500
  },
};

// Theme registry
export const themes = {
  light: lightTheme,
  dark: darkTheme,
  ocean: oceanTheme,
  forest: forestTheme,
  sunset: sunsetTheme,
} as const;

export type ThemeName = keyof typeof themes;

// Theme utility functions
export function getThemeColors(themeName: ThemeName = 'light'): ThemeColors {
  return themes[themeName];
}

export function applyTheme(themeName: ThemeName = 'light'): void {
  const theme = getThemeColors(themeName);
  
  // Apply CSS custom properties
  const root = document.documentElement;
  
  // Primary colors
  root.style.setProperty('--theme-primary-main', theme.primary.main);
  root.style.setProperty('--theme-primary-light', theme.primary.light);
  root.style.setProperty('--theme-primary-dark', theme.primary.dark);
  root.style.setProperty('--theme-primary-contrast', theme.primary.contrast);
  
  // Secondary colors
  root.style.setProperty('--theme-secondary-main', theme.secondary.main);
  root.style.setProperty('--theme-secondary-light', theme.secondary.light);
  root.style.setProperty('--theme-secondary-dark', theme.secondary.dark);
  root.style.setProperty('--theme-secondary-contrast', theme.secondary.contrast);
  
  // Background colors
  root.style.setProperty('--theme-background-primary', theme.background.primary);
  root.style.setProperty('--theme-background-secondary', theme.background.secondary);
  root.style.setProperty('--theme-background-tertiary', theme.background.tertiary);
  root.style.setProperty('--theme-background-glass', theme.background.glass);
  root.style.setProperty('--theme-background-glass-dark', theme.background.glassDark);
  
  // Text colors
  root.style.setProperty('--theme-text-primary', theme.text.primary);
  root.style.setProperty('--theme-text-secondary', theme.text.secondary);
  root.style.setProperty('--theme-text-tertiary', theme.text.tertiary);
  root.style.setProperty('--theme-text-muted', theme.text.muted);
  root.style.setProperty('--theme-text-inverse', theme.text.inverse);
  
  // Border colors
  root.style.setProperty('--theme-border-primary', theme.border.primary);
  root.style.setProperty('--theme-border-secondary', theme.border.secondary);
  root.style.setProperty('--theme-border-glass', theme.border.glass);
  
  // Status colors
  root.style.setProperty('--theme-status-success', theme.status.success);
  root.style.setProperty('--theme-status-warning', theme.status.warning);
  root.style.setProperty('--theme-status-error', theme.status.error);
  root.style.setProperty('--theme-status-info', theme.status.info);
  
  // Animation colors
  root.style.setProperty('--theme-animation-blob1', theme.animation.blob1);
  root.style.setProperty('--theme-animation-blob2', theme.animation.blob2);
  root.style.setProperty('--theme-animation-blob3', theme.animation.blob3);
  
  // Store theme preference
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', themeName);
  }
}

export function getCurrentTheme(): ThemeName {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('theme') as ThemeName) || 'light';
  }
  return 'light';
}

export function initializeTheme(): void {
  const currentTheme = getCurrentTheme();
  applyTheme(currentTheme);
}

// CSS class generators for common patterns
export function getGradientClasses(theme: ThemeColors) {
  return {
    primary: `bg-gradient-to-r from-[${theme.primary.main}] to-[${theme.secondary.main}]`,
    secondary: `bg-gradient-to-r from-[${theme.secondary.main}] to-[${theme.primary.main}]`,
    accent: `bg-gradient-to-r from-[${theme.primary.light}] to-[${theme.secondary.light}]`,
  };
}

export function getGlassClasses(theme: ThemeColors) {
  return {
    light: `bg-[${theme.background.glass}] backdrop-blur-xl border border-[${theme.border.glass}]`,
    dark: `bg-[${theme.background.glassDark}] backdrop-blur-xl border border-[${theme.border.secondary}]`,
  };
}

export function getTextClasses(theme: ThemeColors) {
  return {
    primary: `text-[${theme.text.primary}]`,
    secondary: `text-[${theme.text.secondary}]`,
    tertiary: `text-[${theme.text.tertiary}]`,
    muted: `text-[${theme.text.muted}]`,
    inverse: `text-[${theme.text.inverse}]`,
  };
}
