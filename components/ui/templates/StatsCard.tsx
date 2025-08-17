'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { getThemeColors } from '@/lib/theme';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  period?: string;
  icon: LucideIcon;
  gradient?: string;
  delay?: number;
  themeName?: string;
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  period, 
  icon: Icon, 
  gradient,
  delay = 0,
  themeName = 'default',
  className 
}: StatsCardProps) {
  const theme = getThemeColors(themeName as any);
  
  const baseClasses = "group relative overflow-hidden rounded-2xl p-6 transition-all duration-300";
  const cardClasses = `bg-[${theme.background.glass}] border border-[${theme.border.glass}] hover:bg-[${theme.background.glassDark}]`;
  
  const iconGradient = gradient || `from-[${theme.primary.main}] to-[${theme.secondary.main}]`;
  
  return (
    <div
      className={cn(baseClasses, cardClasses, className)}
      style={{
        animationDelay: `${delay}s`,
        animationFillMode: 'both'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-[var(--theme-text-secondary)]">
            {title}
          </p>
          <p className="text-2xl font-bold text-[var(--theme-text-primary)] group-hover:text-[var(--theme-primary-main)] transition-colors">
            {value}
          </p>
          {change && (
            <div className="flex items-center space-x-1">
              <span className={`text-xs font-medium ${
                change.startsWith('+') ? 'text-[var(--theme-status-success)]' : 'text-[var(--theme-status-error)]'
              }`}>
                {change}
              </span>
              {period && (
                <span className="text-xs text-[var(--theme-text-muted)]">
                  {period}
                </span>
              )}
            </div>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-r ${iconGradient} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
