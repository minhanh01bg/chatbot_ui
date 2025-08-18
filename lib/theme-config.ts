// ===== THEME CONFIGURATION SYSTEM =====

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeColors {
  // Background Colors
  background: string
  backgroundSecondary: string
  backgroundTertiary: string
  backgroundOverlay: string
  
  // Content Colors
  content: string
  contentSecondary: string
  contentTertiary: string
  contentMuted: string
  
  // Button Colors
  button: {
    primary: string
    primaryHover: string
    primaryText: string
    secondary: string
    secondaryHover: string
    secondaryText: string
    outline: string
    outlineHover: string
    outlineText: string
    ghost: string
    ghostHover: string
    ghostText: string
    destructive: string
    destructiveHover: string
    destructiveText: string
  }
  
  // Border Colors
  border: string
  borderSecondary: string
  borderAccent: string
  
  // Accent Colors
  accent: string
  accentSecondary: string
  accentMuted: string
  
  // Status Colors
  success: string
  warning: string
  error: string
  info: string
  
  // Shadow Colors
  shadow: string
  shadowHover: string
  
  // Glass Effects
  glass: {
    background: string
    border: string
    shadow: string
  }
}

export interface ThemeConfig {
  name: string
  displayName: string
  description: string
  colors: ThemeColors
}

// ===== THEME PRESETS =====

export const themePresets: Record<string, ThemeConfig> = {
  default: {
    name: 'default',
    displayName: 'Default',
    description: 'Clean and professional default theme',
    colors: {
      // Light Mode Colors
      background: 'hsl(0 0% 100%)',
      backgroundSecondary: 'hsl(240 4.8% 95.9%)',
      backgroundTertiary: 'hsl(240 5.9% 90%)',
      backgroundOverlay: 'hsla(0 0% 0% 0.5)',
      
      content: 'hsl(240 10% 3.9%)',
      contentSecondary: 'hsl(240 3.8% 46.1%)',
      contentTertiary: 'hsl(240 5.9% 10%)',
      contentMuted: 'hsl(240 3.8% 46.1%)',
      
      button: {
        primary: 'hsl(240 5.9% 10%)',
        primaryHover: 'hsl(240 5.9% 15%)',
        primaryText: 'hsl(0 0% 98%)',
        secondary: 'hsl(240 4.8% 95.9%)',
        secondaryHover: 'hsl(240 4.8% 90%)',
        secondaryText: 'hsl(240 5.9% 10%)',
        outline: 'transparent',
        outlineHover: 'hsl(240 4.8% 95.9%)',
        outlineText: 'hsl(240 5.9% 10%)',
        ghost: 'transparent',
        ghostHover: 'hsl(240 4.8% 95.9%)',
        ghostText: 'hsl(240 5.9% 10%)',
        destructive: 'hsl(0 84.2% 60.2%)',
        destructiveHover: 'hsl(0 84.2% 65%)',
        destructiveText: 'hsl(0 0% 98%)',
      },
      
      border: 'hsl(240 5.9% 90%)',
      borderSecondary: 'hsl(240 4.8% 95.9%)',
      borderAccent: 'hsl(240 5.9% 10%)',
      
      accent: 'hsl(240 5.9% 10%)',
      accentSecondary: 'hsl(240 4.8% 95.9%)',
      accentMuted: 'hsl(240 3.8% 46.1%)',
      
      success: 'hsl(142 76% 36%)',
      warning: 'hsl(38 92% 50%)',
      error: 'hsl(0 84.2% 60.2%)',
      info: 'hsl(221 83% 53%)',
      
      shadow: 'hsla(0 0% 0% 0.1)',
      shadowHover: 'hsla(0 0% 0% 0.15)',
      
      glass: {
        background: 'hsla(255 255% 255% 0.1)',
        border: 'hsla(255 255% 255% 0.2)',
        shadow: '0 8px 32px hsla(0 0% 0% 0.1)',
      },
    },
  },
  
  ocean: {
    name: 'ocean',
    displayName: 'Ocean',
    description: 'Calming ocean blue theme',
    colors: {
      background: 'hsl(210 40% 98%)',
      backgroundSecondary: 'hsl(210 40% 96%)',
      backgroundTertiary: 'hsl(210 40% 94%)',
      backgroundOverlay: 'hsla(210 40% 10% 0.5)',
      
      content: 'hsl(210 40% 10%)',
      contentSecondary: 'hsl(210 40% 30%)',
      contentTertiary: 'hsl(210 40% 20%)',
      contentMuted: 'hsl(210 40% 40%)',
      
      button: {
        primary: 'hsl(210 100% 50%)',
        primaryHover: 'hsl(210 100% 45%)',
        primaryText: 'hsl(0 0% 100%)',
        secondary: 'hsl(210 40% 96%)',
        secondaryHover: 'hsl(210 40% 92%)',
        secondaryText: 'hsl(210 40% 20%)',
        outline: 'transparent',
        outlineHover: 'hsl(210 40% 96%)',
        outlineText: 'hsl(210 100% 50%)',
        ghost: 'transparent',
        ghostHover: 'hsl(210 40% 96%)',
        ghostText: 'hsl(210 100% 50%)',
        destructive: 'hsl(0 84.2% 60.2%)',
        destructiveHover: 'hsl(0 84.2% 65%)',
        destructiveText: 'hsl(0 0% 100%)',
      },
      
      border: 'hsl(210 40% 90%)',
      borderSecondary: 'hsl(210 40% 94%)',
      borderAccent: 'hsl(210 100% 50%)',
      
      accent: 'hsl(210 100% 50%)',
      accentSecondary: 'hsl(210 40% 96%)',
      accentMuted: 'hsl(210 40% 85%)',
      
      success: 'hsl(142 76% 36%)',
      warning: 'hsl(38 92% 50%)',
      error: 'hsl(0 84.2% 60.2%)',
      info: 'hsl(210 100% 50%)',
      
      shadow: 'hsla(210 40% 10% 0.1)',
      shadowHover: 'hsla(210 40% 10% 0.15)',
      
      glass: {
        background: 'hsla(210 40% 98% 0.1)',
        border: 'hsla(210 40% 98% 0.2)',
        shadow: '0 8px 32px hsla(210 40% 10% 0.1)',
      },
    },
  },
  
  forest: {
    name: 'forest',
    displayName: 'Forest',
    description: 'Natural green forest theme',
    colors: {
      background: 'hsl(120 20% 98%)',
      backgroundSecondary: 'hsl(120 20% 96%)',
      backgroundTertiary: 'hsl(120 20% 94%)',
      backgroundOverlay: 'hsla(120 20% 10% 0.5)',
      
      content: 'hsl(120 20% 10%)',
      contentSecondary: 'hsl(120 20% 30%)',
      contentTertiary: 'hsl(120 20% 20%)',
      contentMuted: 'hsl(120 20% 40%)',
      
      button: {
        primary: 'hsl(120 60% 40%)',
        primaryHover: 'hsl(120 60% 35%)',
        primaryText: 'hsl(0 0% 100%)',
        secondary: 'hsl(120 20% 96%)',
        secondaryHover: 'hsl(120 20% 92%)',
        secondaryText: 'hsl(120 20% 20%)',
        outline: 'transparent',
        outlineHover: 'hsl(120 20% 96%)',
        outlineText: 'hsl(120 60% 40%)',
        ghost: 'transparent',
        ghostHover: 'hsl(120 20% 96%)',
        ghostText: 'hsl(120 60% 40%)',
        destructive: 'hsl(0 84.2% 60.2%)',
        destructiveHover: 'hsl(0 84.2% 65%)',
        destructiveText: 'hsl(0 0% 100%)',
      },
      
      border: 'hsl(120 20% 90%)',
      borderSecondary: 'hsl(120 20% 94%)',
      borderAccent: 'hsl(120 60% 40%)',
      
      accent: 'hsl(120 60% 40%)',
      accentSecondary: 'hsl(120 20% 96%)',
      accentMuted: 'hsl(120 20% 85%)',
      
      success: 'hsl(120 60% 40%)',
      warning: 'hsl(38 92% 50%)',
      error: 'hsl(0 84.2% 60.2%)',
      info: 'hsl(210 100% 50%)',
      
      shadow: 'hsla(120 20% 10% 0.1)',
      shadowHover: 'hsla(120 20% 10% 0.15)',
      
      glass: {
        background: 'hsla(120 20% 98% 0.1)',
        border: 'hsla(120 20% 98% 0.2)',
        shadow: '0 8px 32px hsla(120 20% 10% 0.1)',
      },
    },
  },
  
  sunset: {
    name: 'sunset',
    displayName: 'Sunset',
    description: 'Warm sunset orange theme',
    colors: {
      background: 'hsl(30 50% 98%)',
      backgroundSecondary: 'hsl(30 50% 96%)',
      backgroundTertiary: 'hsl(30 50% 94%)',
      backgroundOverlay: 'hsla(30 50% 10% 0.5)',
      
      content: 'hsl(30 50% 10%)',
      contentSecondary: 'hsl(30 50% 30%)',
      contentTertiary: 'hsl(30 50% 20%)',
      contentMuted: 'hsl(30 50% 40%)',
      
      button: {
        primary: 'hsl(30 100% 50%)',
        primaryHover: 'hsl(30 100% 45%)',
        primaryText: 'hsl(0 0% 100%)',
        secondary: 'hsl(30 50% 96%)',
        secondaryHover: 'hsl(30 50% 92%)',
        secondaryText: 'hsl(30 50% 20%)',
        outline: 'transparent',
        outlineHover: 'hsl(30 50% 96%)',
        outlineText: 'hsl(30 100% 50%)',
        ghost: 'transparent',
        ghostHover: 'hsl(30 50% 96%)',
        ghostText: 'hsl(30 100% 50%)',
        destructive: 'hsl(0 84.2% 60.2%)',
        destructiveHover: 'hsl(0 84.2% 65%)',
        destructiveText: 'hsl(0 0% 100%)',
      },
      
      border: 'hsl(30 50% 90%)',
      borderSecondary: 'hsl(30 50% 94%)',
      borderAccent: 'hsl(30 100% 50%)',
      
      accent: 'hsl(30 100% 50%)',
      accentSecondary: 'hsl(30 50% 96%)',
      accentMuted: 'hsl(30 50% 85%)',
      
      success: 'hsl(142 76% 36%)',
      warning: 'hsl(30 100% 50%)',
      error: 'hsl(0 84.2% 60.2%)',
      info: 'hsl(210 100% 50%)',
      
      shadow: 'hsla(30 50% 10% 0.1)',
      shadowHover: 'hsla(30 50% 10% 0.15)',
      
      glass: {
        background: 'hsla(30 50% 98% 0.1)',
        border: 'hsla(30 50% 98% 0.2)',
        shadow: '0 8px 32px hsla(30 50% 10% 0.1)',
      },
    },
  },
}

// ===== DARK THEME VARIANTS =====

export const darkThemePresets: Record<string, ThemeConfig> = {
  default: {
    name: 'default-dark',
    displayName: 'Default Dark',
    description: 'Clean and professional dark theme',
    colors: {
      background: 'hsl(240 10% 3.9%)',
      backgroundSecondary: 'hsl(240 3.7% 15.9%)',
      backgroundTertiary: 'hsl(240 3.7% 20%)',
      backgroundOverlay: 'hsla(0 0% 0% 0.8)',
      
      content: 'hsl(0 0% 98%)',
      contentSecondary: 'hsl(240 5% 64.9%)',
      contentTertiary: 'hsl(240 4.8% 83.9%)',
      contentMuted: 'hsl(240 3.8% 46.1%)',
      
      button: {
        primary: 'hsl(0 0% 98%)',
        primaryHover: 'hsl(0 0% 90%)',
        primaryText: 'hsl(240 10% 3.9%)',
        secondary: 'hsl(240 3.7% 15.9%)',
        secondaryHover: 'hsl(240 3.7% 20%)',
        secondaryText: 'hsl(0 0% 98%)',
        outline: 'transparent',
        outlineHover: 'hsl(240 3.7% 15.9%)',
        outlineText: 'hsl(0 0% 98%)',
        ghost: 'transparent',
        ghostHover: 'hsl(240 3.7% 15.9%)',
        ghostText: 'hsl(0 0% 98%)',
        destructive: 'hsl(0 62.8% 30.6%)',
        destructiveHover: 'hsl(0 62.8% 35%)',
        destructiveText: 'hsl(0 0% 98%)',
      },
      
      border: 'hsl(240 3.7% 15.9%)',
      borderSecondary: 'hsl(240 3.7% 20%)',
      borderAccent: 'hsl(0 0% 98%)',
      
      accent: 'hsl(0 0% 98%)',
      accentSecondary: 'hsl(240 3.7% 15.9%)',
      accentMuted: 'hsl(240 3.8% 46.1%)',
      
      success: 'hsl(142 76% 36%)',
      warning: 'hsl(38 92% 50%)',
      error: 'hsl(0 84.2% 60.2%)',
      info: 'hsl(221 83% 53%)',
      
      shadow: 'hsla(0 0% 0% 0.3)',
      shadowHover: 'hsla(0 0% 0% 0.4)',
      
      glass: {
        background: 'hsla(240 10% 3.9% 0.8)',
        border: 'hsla(240 3.7% 15.9% 0.5)',
        shadow: '0 8px 32px hsla(0 0% 0% 0.3)',
      },
    },
  },
  
  ocean: {
    name: 'ocean-dark',
    displayName: 'Ocean Dark',
    description: 'Deep ocean dark theme',
    colors: {
      background: 'hsl(210 40% 8%)',
      backgroundSecondary: 'hsl(210 40% 12%)',
      backgroundTertiary: 'hsl(210 40% 16%)',
      backgroundOverlay: 'hsla(210 40% 2% 0.8)',
      
      content: 'hsl(210 40% 98%)',
      contentSecondary: 'hsl(210 40% 80%)',
      contentTertiary: 'hsl(210 40% 90%)',
      contentMuted: 'hsl(210 40% 60%)',
      
      button: {
        primary: 'hsl(210 100% 50%)',
        primaryHover: 'hsl(210 100% 45%)',
        primaryText: 'hsl(0 0% 100%)',
        secondary: 'hsl(210 40% 12%)',
        secondaryHover: 'hsl(210 40% 16%)',
        secondaryText: 'hsl(210 40% 98%)',
        outline: 'transparent',
        outlineHover: 'hsl(210 40% 12%)',
        outlineText: 'hsl(210 100% 50%)',
        ghost: 'transparent',
        ghostHover: 'hsl(210 40% 12%)',
        ghostText: 'hsl(210 100% 50%)',
        destructive: 'hsl(0 84.2% 60.2%)',
        destructiveHover: 'hsl(0 84.2% 65%)',
        destructiveText: 'hsl(0 0% 100%)',
      },
      
      border: 'hsl(210 40% 16%)',
      borderSecondary: 'hsl(210 40% 20%)',
      borderAccent: 'hsl(210 100% 50%)',
      
      accent: 'hsl(210 100% 50%)',
      accentSecondary: 'hsl(210 40% 12%)',
      accentMuted: 'hsl(210 40% 25%)',
      
      success: 'hsl(142 76% 36%)',
      warning: 'hsl(38 92% 50%)',
      error: 'hsl(0 84.2% 60.2%)',
      info: 'hsl(210 100% 50%)',
      
      shadow: 'hsla(210 40% 2% 0.3)',
      shadowHover: 'hsla(210 40% 2% 0.4)',
      
      glass: {
        background: 'hsla(210 40% 8% 0.8)',
        border: 'hsla(210 40% 12% 0.5)',
        shadow: '0 8px 32px hsla(210 40% 2% 0.3)',
      },
    },
  },
  
  forest: {
    name: 'forest-dark',
    displayName: 'Forest Dark',
    description: 'Deep forest dark theme',
    colors: {
      background: 'hsl(120 20% 8%)',
      backgroundSecondary: 'hsl(120 20% 12%)',
      backgroundTertiary: 'hsl(120 20% 16%)',
      backgroundOverlay: 'hsla(120 20% 2% 0.8)',
      
      content: 'hsl(120 20% 98%)',
      contentSecondary: 'hsl(120 20% 80%)',
      contentTertiary: 'hsl(120 20% 90%)',
      contentMuted: 'hsl(120 20% 60%)',
      
      button: {
        primary: 'hsl(120 60% 40%)',
        primaryHover: 'hsl(120 60% 35%)',
        primaryText: 'hsl(0 0% 100%)',
        secondary: 'hsl(120 20% 12%)',
        secondaryHover: 'hsl(120 20% 16%)',
        secondaryText: 'hsl(120 20% 98%)',
        outline: 'transparent',
        outlineHover: 'hsl(120 20% 12%)',
        outlineText: 'hsl(120 60% 40%)',
        ghost: 'transparent',
        ghostHover: 'hsl(120 20% 12%)',
        ghostText: 'hsl(120 60% 40%)',
        destructive: 'hsl(0 84.2% 60.2%)',
        destructiveHover: 'hsl(0 84.2% 65%)',
        destructiveText: 'hsl(0 0% 100%)',
      },
      
      border: 'hsl(120 20% 16%)',
      borderSecondary: 'hsl(120 20% 20%)',
      borderAccent: 'hsl(120 60% 40%)',
      
      accent: 'hsl(120 60% 40%)',
      accentSecondary: 'hsl(120 20% 12%)',
      accentMuted: 'hsl(120 20% 25%)',
      
      success: 'hsl(120 60% 40%)',
      warning: 'hsl(38 92% 50%)',
      error: 'hsl(0 84.2% 60.2%)',
      info: 'hsl(210 100% 50%)',
      
      shadow: 'hsla(120 20% 2% 0.3)',
      shadowHover: 'hsla(120 20% 2% 0.4)',
      
      glass: {
        background: 'hsla(120 20% 8% 0.8)',
        border: 'hsla(120 20% 12% 0.5)',
        shadow: '0 8px 32px hsla(120 20% 2% 0.3)',
      },
    },
  },
  
  sunset: {
    name: 'sunset-dark',
    displayName: 'Sunset Dark',
    description: 'Warm sunset dark theme',
    colors: {
      background: 'hsl(30 50% 8%)',
      backgroundSecondary: 'hsl(30 50% 12%)',
      backgroundTertiary: 'hsl(30 50% 16%)',
      backgroundOverlay: 'hsla(30 50% 2% 0.8)',
      
      content: 'hsl(30 50% 98%)',
      contentSecondary: 'hsl(30 50% 80%)',
      contentTertiary: 'hsl(30 50% 90%)',
      contentMuted: 'hsl(30 50% 60%)',
      
      button: {
        primary: 'hsl(30 100% 50%)',
        primaryHover: 'hsl(30 100% 45%)',
        primaryText: 'hsl(0 0% 100%)',
        secondary: 'hsl(30 50% 12%)',
        secondaryHover: 'hsl(30 50% 16%)',
        secondaryText: 'hsl(30 50% 98%)',
        outline: 'transparent',
        outlineHover: 'hsl(30 50% 12%)',
        outlineText: 'hsl(30 100% 50%)',
        ghost: 'transparent',
        ghostHover: 'hsl(30 50% 12%)',
        ghostText: 'hsl(30 100% 50%)',
        destructive: 'hsl(0 84.2% 60.2%)',
        destructiveHover: 'hsl(0 84.2% 65%)',
        destructiveText: 'hsl(0 0% 100%)',
      },
      
      border: 'hsl(30 50% 16%)',
      borderSecondary: 'hsl(30 50% 20%)',
      borderAccent: 'hsl(30 100% 50%)',
      
      accent: 'hsl(30 100% 50%)',
      accentSecondary: 'hsl(30 50% 12%)',
      accentMuted: 'hsl(30 50% 25%)',
      
      success: 'hsl(142 76% 36%)',
      warning: 'hsl(30 100% 50%)',
      error: 'hsl(0 84.2% 60.2%)',
      info: 'hsl(210 100% 50%)',
      
      shadow: 'hsla(30 50% 2% 0.3)',
      shadowHover: 'hsla(30 50% 2% 0.4)',
      
      glass: {
        background: 'hsla(30 50% 8% 0.8)',
        border: 'hsla(30 50% 12% 0.5)',
        shadow: '0 8px 32px hsla(30 50% 2% 0.3)',
      },
    },
  },
}

// ===== THEME UTILITIES =====

export function getThemeConfig(themeName: string, isDark: boolean = false): ThemeConfig {
  const presets = isDark ? darkThemePresets : themePresets
  return presets[themeName] || presets.default
}

export function applyThemeToCSS(themeConfig: ThemeConfig, isDark: boolean = false) {
  const root = document.documentElement
  const colors = themeConfig.colors
  
  // Apply CSS custom properties
  Object.entries(colors).forEach(([key, value]) => {
    if (typeof value === 'object') {
      // Handle nested objects like button colors
      Object.entries(value).forEach(([subKey, subValue]) => {
        root.style.setProperty(`--${key}-${subKey}`, subValue as string)
      })
    } else {
      root.style.setProperty(`--${key}`, value)
    }
  })
  
  // Apply theme class
  root.classList.remove('light', 'dark')
  root.classList.add(isDark ? 'dark' : 'light')
}

export function getAvailableThemes(): Array<{ name: string; displayName: string; description: string }> {
  return Object.values(themePresets).map(theme => ({
    name: theme.name,
    displayName: theme.displayName,
    description: theme.description,
  }))
} 