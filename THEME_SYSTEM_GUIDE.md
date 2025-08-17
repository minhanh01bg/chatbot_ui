# Theme System Guide

## Overview

This project uses a comprehensive and professional theme system that supports both **dark/light mode** and **custom color themes**. The system is built with CSS custom properties (CSS variables) and provides a seamless experience across all components.

## Features

### 🌙 Dark/Light Mode
- **Light Mode**: Clean, bright interface with high contrast
- **Dark Mode**: Easy on the eyes with reduced brightness
- **System Mode**: Automatically follows your operating system preference

### 🎨 Custom Color Themes
- **Default**: Purple/Blue gradient theme
- **Ocean**: Cyan/Sky blue theme
- **Forest**: Green/Emerald theme  
- **Sunset**: Orange/Red theme

## Architecture

### CSS Variables Structure

The theme system uses CSS custom properties organized in layers:

```css
:root {
  /* Base colors */
  --background: 0 0% 100%;        /* Light mode background */
  --foreground: 240 10% 3.9%;     /* Light mode text */
  
  /* Custom theme colors */
  --gradient-primary: linear-gradient(...);
  --bg-gradient-primary: linear-gradient(...);
  
  /* Glass effects */
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dark {
  /* Dark mode overrides */
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  
  /* Dark mode specific colors */
  --glass-bg: rgba(0, 0, 0, 0.2);
  --glass-border: rgba(255, 255, 255, 0.1);
}
```

### Theme Provider

The `ThemeProvider` manages theme state and provides context:

```tsx
import { ThemeProvider } from '@/components/theme-provider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider defaultTheme="system" storageKey="chataipro-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## Usage

### Theme Switcher Components

#### 1. Main Theme Switcher (Recommended)
```tsx
import { ThemeSwitcher } from '@/components/theme-switcher';

// Complete theme switcher with mode and color options
<ThemeSwitcher />
```

#### 2. Dark/Light Mode Only
```tsx
import { DarkModeToggle } from '@/components/theme-switcher';

// Simple toggle between dark and light
<DarkModeToggle />
```

#### 3. Compact Version
```tsx
import { CompactDarkModeToggle } from '@/components/theme-switcher';

// Icon-only toggle for space-constrained areas
<CompactDarkModeToggle />
```

#### 4. Color Themes Only
```tsx
import { ColorThemeSelector } from '@/components/theme-switcher';

// Only color theme selection
<ColorThemeSelector />
```

### Using Theme in Components

#### CSS Classes
```tsx
// Theme-aware classes
<div className="bg-background text-foreground">
<div className="bg-card text-card-foreground">
<div className="text-muted-foreground">
<div className="border-border">

// Glass effects
<div className="glass">
<div className="bg-gradient-primary">

// Shadows
<div className="shadow-theme-sm">
<div className="shadow-theme-lg">
```

#### CSS Variables
```css
.my-component {
  background: var(--background);
  color: var(--foreground);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md);
}
```

#### JavaScript/TypeScript
```tsx
import { useTheme } from '@/components/theme-provider';

function MyComponent() {
  const { theme, setTheme, customTheme, setCustomTheme } = useTheme();
  
  return (
    <div>
      <p>Current mode: {theme}</p>
      <p>Current color theme: {customTheme}</p>
      <button onClick={() => setTheme('dark')}>Switch to Dark</button>
    </div>
  );
}
```

## Theme Configuration

### Adding New Color Themes

1. **Define the theme in `lib/theme.ts`:**
```tsx
export const myTheme: ThemeColors = {
  primary: {
    main: '#your-color',
    light: '#your-light-color',
    dark: '#your-dark-color',
    contrast: '#ffffff',
  },
  secondary: {
    main: '#your-secondary-color',
    // ... other properties
  },
  // ... other theme properties
};
```

2. **Add to themes registry:**
```tsx
export const themes = {
  default: defaultTheme,
  ocean: oceanTheme,
  forest: forestTheme,
  sunset: sunsetTheme,
  myTheme: myTheme, // Add your theme here
} as const;
```

3. **The theme will automatically appear in all theme switchers**

### Customizing CSS Variables

You can add custom CSS variables in `app/globals.css`:

```css
:root {
  /* Your custom variables */
  --my-custom-color: #your-color;
  --my-custom-gradient: linear-gradient(...);
}

.dark {
  /* Dark mode overrides */
  --my-custom-color: #your-dark-color;
}
```

## Best Practices

### 1. Use Semantic Color Names
```tsx
// ✅ Good
<div className="bg-background text-foreground">
<div className="text-muted-foreground">

// ❌ Avoid
<div className="bg-white text-black">
<div className="text-gray-500">
```

### 2. Use Theme-Aware Components
```tsx
// ✅ Good
<Button variant="outline" className="border-border">

// ❌ Avoid
<Button variant="outline" className="border-gray-300">
```

### 3. Test Both Modes
Always test your components in both light and dark modes to ensure proper contrast and readability.

### 4. Use Glass Effects Sparingly
Glass effects work best for overlays and floating elements, not for main content areas.

## Troubleshooting

### Theme Not Switching
1. Check if `ThemeProvider` is wrapping your app
2. Verify localStorage is working (check browser dev tools)
3. Ensure CSS variables are properly defined

### Colors Not Updating
1. Check if custom theme is properly applied in `lib/theme.ts`
2. Verify CSS custom properties are being set correctly
3. Clear browser cache and localStorage

### Performance Issues
1. Use CSS variables instead of JavaScript for color changes
2. Avoid complex gradients in frequently updated components
3. Use `will-change` CSS property for animated elements

## Migration Guide

### From Old Theme System
1. Replace hardcoded colors with CSS variables
2. Update component imports to use new theme switchers
3. Replace `bg-black text-white` with `bg-background text-foreground`
4. Update glass effects to use new `.glass` class

### Example Migration
```tsx
// Old
<div className="bg-black text-white border border-gray-600">
  <button className="bg-purple-600 hover:bg-purple-700">

// New
<div className="bg-background text-foreground border border-border">
  <button className="bg-primary hover:bg-primary/90">
```

## Accessibility

The theme system includes:
- High contrast ratios for both light and dark modes
- Proper focus indicators
- Screen reader support with aria-labels
- Keyboard navigation support
- Reduced motion support for animations

## Browser Support

- **Modern browsers**: Full support
- **Safari**: Requires `-webkit-` prefixes for backdrop-filter
- **Internet Explorer**: Not supported (use modern browsers)

## Performance

- CSS variables provide instant theme switching
- No layout shifts during theme changes
- Optimized for 60fps animations
- Minimal JavaScript overhead
