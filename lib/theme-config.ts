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

// ===== BASIC THEME PRESETS =====
// Only light and dark variants of admin themes for simplicity
// Future themes can be easily added by following this structure

export const themePresets: Record<string, ThemeConfig> = {
  // Light Admin Theme
  adminLight: {
    name: 'adminLight',
    displayName: 'Admin Light',
    description: 'Light admin panel theme with purple accents',
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
}

// ===== DARK THEME VARIANTS =====

export const darkThemePresets: Record<string, ThemeConfig> = {
  // Dark Admin Theme
  adminDark: {
    name: 'adminDark',
    displayName: 'Admin Dark',
    description: 'Dark admin panel theme with purple accents',
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

  // Enhanced Dark Admin Theme with better contrast
  adminDarkEnhanced: {
    name: 'adminDarkEnhanced',
    displayName: 'Admin Dark Enhanced',
    description: 'Enhanced dark admin panel theme with better contrast and readability',
    colors: {
      background: 'hsl(0 0% 6%)',
      backgroundSecondary: 'hsl(0 0% 8%)',
      backgroundTertiary: 'hsl(0 0% 10%)',
      backgroundOverlay: 'hsla(0 0% 0% 0.9)',
      
      content: 'hsl(0 0% 100%)',
      contentSecondary: 'hsl(0 0% 90%)',
      contentTertiary: 'hsl(0 0% 85%)',
      contentMuted: 'hsl(0 0% 75%)',
      
      text: {
        primary: 'hsl(0 0% 100%)',
        secondary: 'hsl(0 0% 90%)',
        tertiary: 'hsl(0 0% 85%)',
        muted: 'hsl(0 0% 75%)',
        subtle: 'hsl(0 0% 65%)',
        inverse: 'hsl(0 0% 6%)',
      },
      
      button: {
        primary: 'hsl(270 100% 50%)',
        primaryHover: 'hsl(270 100% 45%)',
        primaryText: 'hsl(0 0% 100%)',
        secondary: 'hsla(255 255% 255% 0.15)',
        secondaryHover: 'hsla(255 255% 255% 0.25)',
        secondaryText: 'hsl(0 0% 100%)',
        outline: 'transparent',
        outlineHover: 'hsla(255 255% 255% 0.15)',
        outlineText: 'hsl(270 100% 50%)',
        ghost: 'transparent',
        ghostHover: 'hsla(255 255% 255% 0.15)',
        ghostText: 'hsl(270 100% 50%)',
        destructive: 'hsl(0 84.2% 60.2%)',
        destructiveHover: 'hsl(0 84.2% 65%)',
        destructiveText: 'hsl(0 0% 100%)',
      },
      
      border: 'hsla(255 255% 255% 0.25)',
      borderSecondary: 'hsla(255 255% 255% 0.15)',
      borderAccent: 'hsl(270 100% 50%)',
      
      accent: 'hsl(270 100% 50%)',
      accentSecondary: 'hsl(0 0% 8%)',
      accentMuted: 'hsl(0 0% 75%)',
      
      success: 'hsl(142 76% 36%)',
      warning: 'hsl(38 92% 50%)',
      error: 'hsl(0 84.2% 60.2%)',
      info: 'hsl(221 83% 53%)',
      
      shadow: 'hsla(0 0% 0% 0.4)',
      shadowHover: 'hsla(0 0% 0% 0.5)',
      
      glass: {
        background: 'hsla(255 255% 255% 0.15)',
        border: 'hsla(255 255% 255% 0.25)',
        shadow: '0 8px 32px hsla(0 0% 0% 0.4)',
      },
      
      admin: {
        gradient: {
          primary: 'linear-gradient(135deg, hsl(270 100% 50%) 0%, hsl(280 100% 60%) 100%)',
          secondary: 'linear-gradient(135deg, hsl(0 0% 8%) 0%, hsl(0 0% 10%) 100%)',
          tertiary: 'linear-gradient(135deg, hsla(255 255% 255% 0.15) 0%, hsla(255 255% 255% 0.08) 100%)',
          background: 'linear-gradient(135deg, hsl(0 0% 6%) 0%, hsl(0 0% 8%) 100%)',
          card: 'linear-gradient(135deg, hsla(255 255% 255% 0.08) 0%, hsla(255 255% 255% 0.04) 100%)',
          sidebar: 'linear-gradient(180deg, hsl(0 0% 8%) 0%, hsl(0 0% 10%) 100%)',
        },
        card: {
          background: 'hsla(255 255% 255% 0.08)',
          border: 'hsla(255 255% 255% 0.15)',
          shadow: '0 8px 32px hsla(0 0% 0% 0.3)',
        },
        sidebar: {
          background: 'hsl(0 0% 8%)',
          border: 'hsla(255 255% 255% 0.15)',
          text: 'hsl(0 0% 100%)',
        },
        navbar: {
          background: 'hsla(255 255% 255% 0.08)',
          border: 'hsla(255 255% 255% 0.15)',
          text: 'hsl(0 0% 100%)',
        },
        input: {
          background: 'hsla(255 255% 255% 0.08)',
          border: 'hsla(255 255% 255% 0.15)',
          text: 'hsl(0 0% 100%)',
          placeholder: 'hsla(255 255% 255% 0.7)',
        },
        dropdown: {
          background: 'hsla(255 255% 255% 0.15)',
          border: 'hsla(255 255% 255% 0.25)',
          shadow: '0 8px 32px hsla(0 0% 0% 0.4)',
        },
      },
    },
  },
}

// ===== THEME UTILITIES =====

export function getThemeConfig(themeName: string, isDark: boolean = false): ThemeConfig {
  // For specific theme selection, always use the theme presets directly
  // The isDark parameter is only used for toggle functionality
  if (themeName === 'adminLight') {
    return themePresets.adminLight;
  }
  
  if (themeName === 'adminDark') {
    return darkThemePresets.adminDark;
  }
  
  if (themeName === 'adminDarkEnhanced') {
    return darkThemePresets.adminDarkEnhanced;
  }
  
  // Fallback to adminLight for any unknown theme
  return themePresets.adminLight;
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
  // Combine both light and dark themes
  const allThemes = { ...themePresets, ...darkThemePresets };
  
  return Object.values(allThemes).map(theme => ({
    name: theme.name,
    displayName: theme.displayName,
    description: theme.description,
  }))
} 