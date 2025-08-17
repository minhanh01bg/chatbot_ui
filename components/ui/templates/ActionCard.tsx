'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { getThemeColors } from '@/lib/theme';
import { LucideIcon } from 'lucide-react';

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
  bgColor?: string;
  borderColor?: string;
  action: string;
  delay?: number;
  themeName?: string;
  className?: string;
  onClick?: () => void;
}

export function ActionCard({ 
  title, 
  description, 
  icon: Icon, 
  color,
  bgColor,
  borderColor,
  action, 
  delay = 0,
  themeName = 'default',
  className,
  onClick 
}: ActionCardProps) {
  const theme = getThemeColors(themeName as any);
  
  const baseClasses = "group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 cursor-pointer";
  const cardClasses = `bg-[${theme.background.glass}] border border-[${theme.border.glass}] hover:bg-[${theme.background.glassDark}] hover:border-[${theme.border.primary}]`;
  
  const iconColor = color || `text-[${theme.primary.main}]`;
  const iconBgColor = bgColor || `bg-[${theme.primary.main}]/10`;
  const iconBorderColor = borderColor || `border-[${theme.primary.main}]/20`;
  
  return (
    <div
      className={cn(baseClasses, cardClasses, className)}
      style={{
        animationDelay: `${delay}s`,
        animationFillMode: 'both'
      }}
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 ${iconBgColor} ${iconBorderColor} border rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-[var(--theme-text-primary)] group-hover:text-[var(--theme-primary-main)] transition-colors mb-2">
            {title}
          </h3>
          <p className="text-sm text-[var(--theme-text-secondary)] mb-4 leading-relaxed">
            {description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--theme-primary-main)] group-hover:text-[var(--theme-primary-light)] transition-colors">
              {action}
            </span>
            <div className="w-6 h-6 text-[var(--theme-text-muted)] group-hover:text-[var(--theme-primary-main)] transition-colors">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
