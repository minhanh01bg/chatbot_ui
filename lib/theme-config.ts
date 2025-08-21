// ===== SIMPLIFIED THEME CONFIGURATION SYSTEM =====

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
  
  // Text Colors for better readability
  text: {
    primary: string
    secondary: string
    tertiary: string
    muted: string
    subtle: string
    inverse: string
  }
  
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
  
  // New Gradient Colors for enhanced UI
  gradient: {
    primary: string
    secondary: string
    tertiary: string
    accent: string
    success: string
    warning: string
    error: string
    info: string
    hero: string
    card: string
    button: string
    text: string
  }
  
  // New Animation Colors
  animation: {
    glow: string
    shimmer: string
    pulse: string
    sparkle: string
    neon: string
  }
  
  // Admin-specific colors
  admin?: {
    gradient: {
      primary: string
      secondary: string
      tertiary: string
      background: string
      card: string
      sidebar: string
    }
    card: {
      background: string
      border: string
      shadow: string
    }
    sidebar: {
      background: string
      border: string
      text: string
    }
    navbar: {
      background: string
      border: string
      text: string
    }
    input: {
      background: string
      border: string
      text: string
      placeholder: string
    }
    dropdown: {
      background: string
      border: string
      shadow: string
    }
  }
}

export interface ThemeConfig {
  name: string
  displayName: string
  description: string
  colors: ThemeColors
}

// ===== SIMPLIFIED THEME PRESETS =====
// Only light and dark themes for optimal performance

export const themePresets: Record<string, ThemeConfig> = {
  // Light Theme
  light: {
    name: 'light',
    displayName: 'Light',
    description: 'Clean light theme with purple accents',
    colors: {
      background: 'hsl(0 0% 100%)',
      backgroundSecondary: 'hsl(240 4.8% 95.9%)',
      backgroundTertiary: 'hsl(240 5.9% 90%)',
      backgroundOverlay: 'hsla(0 0% 0% 0.5)',
      
      content: 'hsl(240 10% 3.9%)',
      contentSecondary: 'hsl(240 3.8% 46.1%)',
      contentTertiary: 'hsl(240 5.9% 10%)',
      contentMuted: 'hsl(240 3.8% 46.1%)',
      
      text: {
        primary: 'hsl(240 10% 3.9%)',
        secondary: 'hsl(240 5% 20%)',
        tertiary: 'hsl(240 5% 30%)',
        muted: 'hsl(240 5% 45%)',
        subtle: 'hsl(240 5% 60%)',
        inverse: 'hsl(0 0% 98%)',
      },
      
      button: {
        primary: 'hsl(270 100% 50%)',
        primaryHover: 'hsl(270 100% 45%)',
        primaryText: 'hsl(0 0% 100%)',
        secondary: 'hsl(240 4.8% 95.9%)',
        secondaryHover: 'hsl(240 4.8% 90%)',
        secondaryText: 'hsl(240 5.9% 10%)',
        outline: 'transparent',
        outlineHover: 'hsl(240 4.8% 95.9%)',
        outlineText: 'hsl(270 100% 50%)',
        ghost: 'transparent',
        ghostHover: 'hsl(240 4.8% 95.9%)',
        ghostText: 'hsl(270 100% 50%)',
        destructive: 'hsl(0 84.2% 60.2%)',
        destructiveHover: 'hsl(0 84.2% 65%)',
        destructiveText: 'hsl(0 0% 98%)',
      },
      
      border: 'hsl(240 5.9% 90%)',
      borderSecondary: 'hsl(240 4.8% 95.9%)',
      borderAccent: 'hsl(270 100% 50%)',
      
      accent: 'hsl(270 100% 50%)',
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
      
      // New gradient colors
      gradient: {
        primary: 'linear-gradient(135deg, hsl(270 100% 50%) 0%, hsl(280 100% 60%) 100%)',
        secondary: 'linear-gradient(135deg, hsl(240 4.8% 95.9%) 0%, hsl(240 5.9% 90%) 100%)',
        tertiary: 'linear-gradient(135deg, hsla(270 100% 50% 0.1) 0%, hsla(270 100% 50% 0.05) 100%)',
        accent: 'linear-gradient(135deg, hsl(270 100% 50%) 0%, hsl(221 83% 53%) 100%)',
        success: 'linear-gradient(135deg, hsl(142 76% 36%) 0%, hsl(160 84% 39%) 100%)',
        warning: 'linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(48 96% 53%) 100%)',
        error: 'linear-gradient(135deg, hsl(0 84.2% 60.2%) 0%, hsl(0 72% 51%) 100%)',
        info: 'linear-gradient(135deg, hsl(221 83% 53%) 0%, hsl(217 91% 60%) 100%)',
        hero: 'linear-gradient(135deg, hsl(270 100% 50%) 0%, hsl(221 83% 53%) 50%, hsl(280 100% 60%) 100%)',
        card: 'linear-gradient(135deg, hsla(270 100% 50% 0.05) 0%, hsla(270 100% 50% 0.02) 100%)',
        button: 'linear-gradient(135deg, hsl(270 100% 50%) 0%, hsl(280 100% 60%) 100%)',
        text: 'linear-gradient(135deg, hsl(270 100% 50%) 0%, hsl(221 83% 53%) 100%)',
      },
      
      // New animation colors
      animation: {
        glow: 'hsla(270 100% 50% 0.3)',
        shimmer: 'hsla(255 255% 255% 0.2)',
        pulse: 'hsla(270 100% 50% 0.6)',
        sparkle: 'hsla(270 100% 50% 0.8)',
        neon: 'hsla(270 100% 50% 1)',
      },
      
      admin: {
        gradient: {
          primary: 'linear-gradient(135deg, hsl(270 100% 50%) 0%, hsl(280 100% 60%) 100%)',
          secondary: 'linear-gradient(135deg, hsl(240 4.8% 95.9%) 0%, hsl(240 5.9% 90%) 100%)',
          tertiary: 'linear-gradient(135deg, hsla(270 100% 50% 0.1) 0%, hsla(270 100% 50% 0.05) 100%)',
          background: 'linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(240 4.8% 95.9%) 100%)',
          card: 'linear-gradient(135deg, hsla(270 100% 50% 0.05) 0%, hsla(270 100% 50% 0.02) 100%)',
          sidebar: 'linear-gradient(180deg, hsl(240 4.8% 95.9%) 0%, hsl(240 5.9% 90%) 100%)',
        },
        card: {
          background: 'hsla(270 100% 50% 0.05)',
          border: 'hsla(270 100% 50% 0.1)',
          shadow: '0 8px 32px hsla(0 0% 0% 0.1)',
        },
        sidebar: {
          background: 'hsl(240 4.8% 95.9%)',
          border: 'hsla(270 100% 50% 0.1)',
          text: 'hsl(240 10% 3.9%)',
        },
        navbar: {
          background: 'hsla(270 100% 50% 0.05)',
          border: 'hsla(270 100% 50% 0.1)',
          text: 'hsl(240 10% 3.9%)',
        },
        input: {
          background: 'hsla(270 100% 50% 0.05)',
          border: 'hsla(270 100% 50% 0.1)',
          text: 'hsl(240 10% 3.9%)',
          placeholder: 'hsla(240 10% 3.9% 0.5)',
        },
        dropdown: {
          background: 'hsla(270 100% 50% 0.1)',
          border: 'hsla(270 100% 50% 0.2)',
          shadow: '0 8px 32px hsla(0 0% 0% 0.1)',
        },
      },
    },
  },

  // Dark Theme
  dark: {
    name: 'dark',
    displayName: 'Dark',
    description: 'Elegant dark theme with purple accents',
    colors: {
      background: 'hsl(240 10% 3.9%)',
      backgroundSecondary: 'hsl(240 3.7% 15.9%)',
      backgroundTertiary: 'hsl(240 3.7% 20%)',
      backgroundOverlay: 'hsla(0 0% 0% 0.8)',
      
      content: 'hsl(0 0% 98%)',
      contentSecondary: 'hsl(240 5% 64.9%)',
      contentTertiary: 'hsl(240 4.8% 83.9%)',
      contentMuted: 'hsl(240 3.8% 46.1%)',
      
      text: {
        primary: 'hsl(0 0% 98%)',
        secondary: 'hsl(240 5% 64.9%)',
        tertiary: 'hsl(240 4.8% 83.9%)',
        muted: 'hsl(240 3.8% 46.1%)',
        subtle: 'hsl(240 3.8% 46.1%)',
        inverse: 'hsl(240 10% 3.9%)',
      },
      
      button: {
        primary: 'hsl(270 100% 50%)',
        primaryHover: 'hsl(270 100% 45%)',
        primaryText: 'hsl(0 0% 100%)',
        secondary: 'hsla(255 255% 255% 0.1)',
        secondaryHover: 'hsla(255 255% 255% 0.2)',
        secondaryText: 'hsl(0 0% 98%)',
        outline: 'transparent',
        outlineHover: 'hsla(255 255% 255% 0.1)',
        outlineText: 'hsl(270 100% 50%)',
        ghost: 'transparent',
        ghostHover: 'hsla(255 255% 255% 0.1)',
        ghostText: 'hsl(270 100% 50%)',
        destructive: 'hsl(0 84.2% 60.2%)',
        destructiveHover: 'hsl(0 84.2% 65%)',
        destructiveText: 'hsl(0 0% 100%)',
      },
      
      border: 'hsla(255 255% 255% 0.2)',
      borderSecondary: 'hsla(255 255% 255% 0.1)',
      borderAccent: 'hsl(270 100% 50%)',
      
      accent: 'hsl(270 100% 50%)',
      accentSecondary: 'hsl(240 3.7% 15.9%)',
      accentMuted: 'hsl(240 3.8% 46.1%)',
      
      success: 'hsl(142 76% 36%)',
      warning: 'hsl(38 92% 50%)',
      error: 'hsl(0 84.2% 60.2%)',
      info: 'hsl(221 83% 53%)',
      
      shadow: 'hsla(0 0% 0% 0.3)',
      shadowHover: 'hsla(0 0% 0% 0.4)',
      
      glass: {
        background: 'hsla(255 255% 255% 0.1)',
        border: 'hsla(255 255% 255% 0.2)',
        shadow: '0 8px 32px hsla(0 0% 0% 0.3)',
      },
      
      // New gradient colors for dark theme
      gradient: {
        primary: 'linear-gradient(135deg, hsl(270 100% 50%) 0%, hsl(280 100% 60%) 100%)',
        secondary: 'linear-gradient(135deg, hsl(240 3.7% 15.9%) 0%, hsl(250 3.7% 17%) 100%)',
        tertiary: 'linear-gradient(135deg, hsla(255 255% 255% 0.1) 0%, hsla(255 255% 255% 0.05) 100%)',
        accent: 'linear-gradient(135deg, hsl(270 100% 50%) 0%, hsl(221 83% 53%) 100%)',
        success: 'linear-gradient(135deg, hsl(142 76% 36%) 0%, hsl(160 84% 39%) 100%)',
        warning: 'linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(48 96% 53%) 100%)',
        error: 'linear-gradient(135deg, hsl(0 84.2% 60.2%) 0%, hsl(0 72% 51%) 100%)',
        info: 'linear-gradient(135deg, hsl(221 83% 53%) 0%, hsl(217 91% 60%) 100%)',
        hero: 'linear-gradient(135deg, hsl(270 100% 50%) 0%, hsl(221 83% 53%) 50%, hsl(280 100% 60%) 100%)',
        card: 'linear-gradient(135deg, hsla(255 255% 255% 0.05) 0%, hsla(255 255% 255% 0.02) 100%)',
        button: 'linear-gradient(135deg, hsl(270 100% 50%) 0%, hsl(280 100% 60%) 100%)',
        text: 'linear-gradient(135deg, hsl(270 100% 50%) 0%, hsl(221 83% 53%) 100%)',
      },
      
      // New animation colors for dark theme
      animation: {
        glow: 'hsla(270 100% 50% 0.4)',
        shimmer: 'hsla(255 255% 255% 0.1)',
        pulse: 'hsla(270 100% 50% 0.7)',
        sparkle: 'hsla(270 100% 50% 0.9)',
        neon: 'hsla(270 100% 50% 1)',
      },
      
      admin: {
        gradient: {
          primary: 'linear-gradient(135deg, hsl(270 100% 50%) 0%, hsl(280 100% 60%) 100%)',
          secondary: 'linear-gradient(135deg, hsl(240 3.7% 15.9%) 0%, hsl(250 3.7% 17%) 100%)',
          tertiary: 'linear-gradient(135deg, hsla(255 255% 255% 0.1) 0%, hsla(255 255% 255% 0.05) 100%)',
          background: 'linear-gradient(135deg, hsl(240 10% 3.9%) 0%, hsl(250 10% 5%) 100%)',
          card: 'linear-gradient(135deg, hsla(255 255% 255% 0.05) 0%, hsla(255 255% 255% 0.02) 100%)',
          sidebar: 'linear-gradient(180deg, hsl(240 3.7% 15.9%) 0%, hsl(250 3.7% 17%) 100%)',
        },
        card: {
          background: 'hsla(255 255% 255% 0.05)',
          border: 'hsla(255 255% 255% 0.1)',
          shadow: '0 8px 32px hsla(0 0% 0% 0.2)',
        },
        sidebar: {
          background: 'hsl(240 3.7% 15.9%)',
          border: 'hsla(255 255% 255% 0.1)',
          text: 'hsl(0 0% 98%)',
        },
        navbar: {
          background: 'hsla(255 255% 255% 0.05)',
          border: 'hsla(255 255% 255% 0.1)',
          text: 'hsl(0 0% 98%)',
        },
        input: {
          background: 'hsla(255 255% 255% 0.05)',
          border: 'hsla(255 255% 255% 0.1)',
          text: 'hsl(0 0% 98%)',
          placeholder: 'hsla(255 255% 255% 0.5)',
        },
        dropdown: {
          background: 'hsla(255 255% 255% 0.1)',
          border: 'hsla(255 255% 255% 0.2)',
          shadow: '0 8px 32px hsla(0 0% 0% 0.3)',
        },
      },
    },
  },
}

// ===== THEME UTILITIES =====

export function getThemeConfig(themeName: string, isDark: boolean = false): ThemeConfig {
  // For specific theme selection, always use the theme presets directly
  if (themeName === 'light') {
    return themePresets.light;
  }
  
  if (themeName === 'dark') {
    return themePresets.dark;
  }
  
  // Fallback to light theme for any unknown theme
  return themePresets.light;
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
