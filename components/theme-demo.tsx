'use client';

import React from 'react';
import { useTheme } from '@/components/theme-provider';
import { ThemeSwitcher, CompactDarkModeToggle } from '@/components/theme-switcher';
import { GradientButton } from '@/components/ui/templates/GradientButton';
import { GlassCard } from '@/components/ui/templates/GlassCard';
import { StatsCard } from '@/components/ui/templates/StatsCard';
import { ActionCard } from '@/components/ui/templates/ActionCard';
import { Users, Settings, BarChart3, Globe } from 'lucide-react';

export function ThemeDemo() {
  const { customTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Theme System Demo
          </h1>
          <p className="text-gray-300 mb-8">
            Current theme: <span className="text-purple-400 font-semibold">{customTheme}</span>
          </p>
          
          {/* Theme Switchers */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <ThemeSwitcher />
            <CompactDarkModeToggle />
          </div>
        </div>

        {/* Gradient Buttons */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Gradient Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <GradientButton themeName={customTheme} variant="primary">
              Primary Button
            </GradientButton>
            <GradientButton themeName={customTheme} variant="secondary">
              Secondary Button
            </GradientButton>
            <GradientButton themeName={customTheme} variant="outline">
              Outline Button
            </GradientButton>
          </div>
        </div>

        {/* Glass Cards */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Glass Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard themeName={customTheme} variant="light">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Light Glass Card</h3>
                <p className="text-gray-300">
                  This is a light glass card with backdrop blur effect.
                </p>
              </div>
            </GlassCard>
            <GlassCard themeName={customTheme} variant="dark">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Dark Glass Card</h3>
                <p className="text-gray-300">
                  This is a dark glass card with backdrop blur effect.
                </p>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Stats Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Users"
              value="12,847"
              change="+12%"
              period="this month"
              icon={Users}
              themeName={customTheme}
            />
            <StatsCard
              title="Active Sites"
              value="156"
              change="+8%"
              period="this week"
              icon={Globe}
              themeName={customTheme}
            />
            <StatsCard
              title="Revenue"
              value="$45,230"
              change="+23%"
              period="this month"
              icon={BarChart3}
              themeName={customTheme}
            />
            <StatsCard
              title="Settings"
              value="24"
              change="+5%"
              period="this week"
              icon={Settings}
              themeName={customTheme}
            />
          </div>
        </div>

        {/* Action Cards */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Action Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActionCard
              title="Manage Users"
              description="View and manage user accounts, permissions, and settings."
              icon={Users}
              action="Manage Users"
              themeName={customTheme}
            />
            <ActionCard
              title="Site Analytics"
              description="View detailed analytics and performance metrics for your sites."
              icon={BarChart3}
              action="View Analytics"
              themeName={customTheme}
            />
            <ActionCard
              title="System Settings"
              description="Configure system settings, integrations, and preferences."
              icon={Settings}
              action="Configure"
              themeName={customTheme}
            />
          </div>
        </div>

        {/* CSS Custom Properties Demo */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">CSS Custom Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              className="p-6 rounded-xl"
              style={{ backgroundColor: 'var(--theme-primary-main)' }}
            >
              <h3 className="text-white font-semibold mb-2">Primary Color</h3>
              <p className="text-white/80">Using CSS custom property</p>
            </div>
            <div 
              className="p-6 rounded-xl"
              style={{ backgroundColor: 'var(--theme-secondary-main)' }}
            >
              <h3 className="text-white font-semibold mb-2">Secondary Color</h3>
              <p className="text-white/80">Using CSS custom property</p>
            </div>
            <div 
              className="p-6 rounded-xl"
              style={{ backgroundColor: 'var(--theme-status-success)' }}
            >
              <h3 className="text-white font-semibold mb-2">Success Color</h3>
              <p className="text-white/80">Using CSS custom property</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
