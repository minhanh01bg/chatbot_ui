# Simplified Theme System

## Overview

The theme system has been simplified to include only basic light and dark admin themes, while maintaining a clear structure for future theme additions.

## Current Themes

### Admin Light (`adminLight`)
- **Display Name**: Admin Light
- **Description**: Clean light admin theme with purple accents
- **Type**: Light theme
- **Primary Colors**: Purple accents on light background

### Admin Dark (`adminDark`)
- **Display Name**: Admin Dark
- **Description**: Professional dark admin theme with purple accents
- **Type**: Dark theme
- **Primary Colors**: Purple accents on dark background

## Theme Structure

The theme system is organized into two main categories:

1. **Light Themes** (`themePresets`): Contains light variants of admin themes
2. **Dark Themes** (`darkThemePresets`): Contains dark variants of admin themes

## Adding New Themes

To add a new theme, follow this structure:

### 1. Add to Light Themes
```typescript
// In lib/theme-config.ts
export const themePresets: Record<string, ThemeConfig> = {
  // ... existing themes
  yourNewTheme: {
    name: 'yourNewTheme',
    displayName: 'Your New Theme',
    description: 'Description of your new theme',
    colors: {
      // Define your color palette
      background: 'hsl(0 0% 100%)',
      // ... other colors
    },
  },
}
```

### 2. Add to Dark Themes
```typescript
// In lib/theme-config.ts
export const darkThemePresets: Record<string, ThemeConfig> = {
  // ... existing themes
  yourNewThemeDark: {
    name: 'yourNewThemeDark',
    displayName: 'Your New Theme Dark',
    description: 'Dark variant of your new theme',
    colors: {
      // Define your dark color palette
      background: 'hsl(240 10% 3.9%)',
      // ... other colors
    },
  },
}
```

### 3. Update Theme Mapping
```typescript
// In getThemeConfig function
const darkThemeMap: Record<string, string> = {
  'adminLight': 'adminDark',
  'admin': 'adminDark',
  'yourNewTheme': 'yourNewThemeDark', // Add your mapping
}
```

## Theme Configuration Interface

Each theme follows the `ThemeConfig` interface:

```typescript
interface ThemeConfig {
  name: string
  displayName: string
  description: string
  colors: ThemeColors
}
```

### ThemeColors Structure

```typescript
interface ThemeColors {
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
  
  // Text Colors
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
  
  // Admin-specific colors (optional)
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
```

## Usage

### Setting a Theme
```typescript
import { useAdminTheme } from '@/hooks/use-admin-theme';

const { setTheme } = useAdminTheme();

// Set light theme
setTheme('adminLight');

// Set dark theme
setTheme('adminDark');
```

### Toggling Dark Mode
```typescript
import { useAdminTheme } from '@/hooks/use-admin-theme';

const { toggleDarkMode } = useAdminTheme();

// Toggle between light and dark mode
toggleDarkMode();
```

## Benefits of This Structure

1. **Simplicity**: Only essential light and dark themes
2. **Maintainability**: Clear separation between light and dark variants
3. **Extensibility**: Easy to add new themes following the established pattern
4. **Consistency**: All themes follow the same interface and structure
5. **Performance**: Reduced bundle size with fewer theme options

## Migration from Previous System

The previous system included multiple standard themes (default, ocean, forest, sunset) and complex admin themes. These have been removed to simplify the system while maintaining the core functionality needed for the admin interface.

Future themes can be added following the established pattern without the complexity of the previous system. 