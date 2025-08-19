'use client';

import React from 'react';
import { cn } from '@/lib/utils';
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
  className?: string;
  onClick?: () => void;
}

export function ActionCard({ 
  title, 
  description, 
  icon: Icon, 
  color = "text-purple-600",
  bgColor = "bg-purple-100",
  borderColor = "border-purple-200",
  action, 
  delay = 0,
  className,
  onClick 
}: ActionCardProps) {
  const baseClasses = "group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 cursor-pointer";
  const cardClasses = "admin-bg-glass border admin-border-primary hover:admin-accent-secondary hover:admin-border-accent backdrop-blur-xl";
  
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
        <div className={`w-12 h-12 ${bgColor} ${borderColor} border rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold admin-text-primary group-hover:admin-accent transition-colors mb-2">
            {title}
          </h3>
          <p className="text-sm admin-text-secondary mb-4 leading-relaxed">
            {description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium admin-accent group-hover:admin-accent transition-colors">
              {action}
            </span>
            <div className="w-6 h-6 admin-text-muted group-hover:admin-accent transition-colors">
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
