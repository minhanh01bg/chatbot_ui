import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      sans: ['geist'],
      mono: ['geist-mono'],
    },
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        // Background Colors
        background: 'var(--background)',
        'background-secondary': 'var(--backgroundSecondary)',
        'background-tertiary': 'var(--backgroundTertiary)',
        'background-overlay': 'var(--backgroundOverlay)',
        
        // Content Colors
        foreground: 'var(--content)',
        content: 'var(--content)',
        'content-secondary': 'var(--contentSecondary)',
        'content-tertiary': 'var(--contentTertiary)',
        'content-muted': 'var(--contentMuted)',
        
        // Button Colors
        'button-primary': 'var(--button-primary)',
        'button-primary-hover': 'var(--button-primaryHover)',
        'button-primary-text': 'var(--button-primaryText)',
        'button-secondary': 'var(--button-secondary)',
        'button-secondary-hover': 'var(--button-secondaryHover)',
        'button-secondary-text': 'var(--button-secondaryText)',
        'button-outline': 'var(--button-outline)',
        'button-outline-hover': 'var(--button-outlineHover)',
        'button-outline-text': 'var(--button-outlineText)',
        'button-ghost': 'var(--button-ghost)',
        'button-ghost-hover': 'var(--button-ghostHover)',
        'button-ghost-text': 'var(--button-ghostText)',
        'button-destructive': 'var(--button-destructive)',
        'button-destructive-hover': 'var(--button-destructiveHover)',
        'button-destructive-text': 'var(--button-destructiveText)',
        
        // Border Colors
        border: 'var(--border)',
        'border-secondary': 'var(--borderSecondary)',
        'border-accent': 'var(--borderAccent)',
        
        // Accent Colors
        accent: 'var(--accent)',
        'accent-foreground': 'var(--content)',
        'accent-secondary': 'var(--accentSecondary)',
        'accent-muted': 'var(--accentMuted)',
        
        // Status Colors
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        info: 'var(--info)',
        
        // Shadow Colors
        shadow: 'var(--shadow)',
        'shadow-hover': 'var(--shadowHover)',
        
        // Glass Effects
        'glass-bg': 'var(--glass-background)',
        'glass-border': 'var(--glass-border)',
        'glass-shadow': 'var(--glass-shadow)',
        
        // Legacy Support
        card: {
          DEFAULT: 'var(--background)',
          foreground: 'var(--content)',
        },
        popover: {
          DEFAULT: 'var(--background)',
          foreground: 'var(--content)',
        },
        primary: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--button-primary-text)',
        },
        secondary: {
          DEFAULT: 'var(--background-secondary)',
          foreground: 'var(--content)',
        },
        muted: {
          DEFAULT: 'var(--background-secondary)',
          foreground: 'var(--content-muted)',
        },
        destructive: {
          DEFAULT: 'var(--error)',
          foreground: 'var(--button-destructive-text)',
        },
        input: 'var(--border)',
        ring: 'var(--accent)',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'var(--background-secondary)',
          foreground: 'var(--content)',
          primary: 'var(--accent)',
          'primary-foreground': 'var(--button-primary-text)',
          accent: 'var(--accent-secondary)',
          'accent-foreground': 'var(--content)',
          border: 'var(--border)',
          ring: 'var(--accent)',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
export default config;
