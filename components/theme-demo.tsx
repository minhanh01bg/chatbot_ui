'use client';

import React from 'react';
import { useTheme } from '@/components/theme-provider';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { ThemeButton } from '@/components/ui/theme-button';
import { ThemeCard, ThemeCardHeader, ThemeCardTitle, ThemeCardDescription, ThemeCardContent, ThemeCardFooter } from '@/components/ui/theme-card';

export function ThemeDemo() {
  const { theme, colorTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Theme System Demo</h1>
            <p className="text-content-muted mt-2">
              Current: {theme} mode with {colorTheme} theme
            </p>
          </div>
          <ThemeSwitcher />
        </div>

        {/* Theme Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Default Card */}
          <ThemeCard>
            <ThemeCardHeader>
              <ThemeCardTitle>Default Card</ThemeCardTitle>
              <ThemeCardDescription>
                Standard card with default styling
              </ThemeCardDescription>
            </ThemeCardHeader>
            <ThemeCardContent>
              <p className="text-content-secondary">
                This card uses the default theme styling with background, border, and shadow.
              </p>
            </ThemeCardContent>
            <ThemeCardFooter>
              <ThemeButton size="sm">Action</ThemeButton>
            </ThemeCardFooter>
          </ThemeCard>

          {/* Secondary Card */}
          <ThemeCard variant="secondary">
            <ThemeCardHeader>
              <ThemeCardTitle>Secondary Card</ThemeCardTitle>
              <ThemeCardDescription>
                Card with secondary background
              </ThemeCardDescription>
            </ThemeCardHeader>
            <ThemeCardContent>
              <p className="text-content-secondary">
                This card uses a secondary background color for subtle variation.
              </p>
            </ThemeCardContent>
            <ThemeCardFooter>
              <ThemeButton variant="secondary" size="sm">Secondary</ThemeButton>
            </ThemeCardFooter>
          </ThemeCard>

          {/* Glass Card */}
          <ThemeCard variant="glass">
            <ThemeCardHeader>
              <ThemeCardTitle>Glass Card</ThemeCardTitle>
              <ThemeCardDescription>
                Card with glass morphism effect
              </ThemeCardDescription>
            </ThemeCardHeader>
            <ThemeCardContent>
              <p className="text-content-secondary">
                This card features a glass morphism effect with backdrop blur.
              </p>
            </ThemeCardContent>
            <ThemeCardFooter>
              <ThemeButton variant="ghost" size="sm">Glass</ThemeButton>
            </ThemeCardFooter>
          </ThemeCard>
        </div>

        {/* Button Showcase */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Button Variants</h2>
          <div className="flex flex-wrap gap-4">
            <ThemeButton variant="primary">Primary</ThemeButton>
            <ThemeButton variant="secondary">Secondary</ThemeButton>
            <ThemeButton variant="outline">Outline</ThemeButton>
            <ThemeButton variant="ghost">Ghost</ThemeButton>
            <ThemeButton variant="destructive">Destructive</ThemeButton>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <ThemeButton variant="primary" size="sm">Small</ThemeButton>
            <ThemeButton variant="primary" size="md">Medium</ThemeButton>
            <ThemeButton variant="primary" size="lg">Large</ThemeButton>
          </div>
        </div>

        {/* Color Palette */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-16 bg-background border border-border rounded-lg"></div>
              <p className="text-sm font-medium text-foreground">Background</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-background-secondary border border-border rounded-lg"></div>
              <p className="text-sm font-medium text-foreground">Background Secondary</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-accent border border-border rounded-lg"></div>
              <p className="text-sm font-medium text-foreground">Accent</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-accent-secondary border border-border rounded-lg"></div>
              <p className="text-sm font-medium text-foreground">Accent Secondary</p>
            </div>
          </div>
        </div>

        {/* Status Colors */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Status Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-16 bg-success border border-border rounded-lg"></div>
              <p className="text-sm font-medium text-foreground">Success</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-warning border border-border rounded-lg"></div>
              <p className="text-sm font-medium text-foreground">Warning</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-error border border-border rounded-lg"></div>
              <p className="text-sm font-medium text-foreground">Error</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-info border border-border rounded-lg"></div>
              <p className="text-sm font-medium text-foreground">Info</p>
            </div>
          </div>
        </div>

        {/* Text Colors */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Text Colors</h2>
          <div className="space-y-2">
            <p className="text-foreground text-lg">Primary Text (foreground)</p>
            <p className="text-content-secondary text-lg">Secondary Text (content-secondary)</p>
            <p className="text-content-muted text-lg">Muted Text (content-muted)</p>
            <p className="text-accent text-lg">Accent Text (accent)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
