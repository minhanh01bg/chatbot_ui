'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  period?: string;
  icon: LucideIcon;
  gradient?: string;
  delay?: number;
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  period, 
  icon: Icon, 
  gradient = "from-purple-600 to-blue-600",
  delay = 0,
  className 
}: StatsCardProps) {
  const baseClasses = "group relative overflow-hidden rounded-2xl p-6 transition-all duration-300";
  const cardClasses = "bg-white/80 border border-white/20 hover:bg-white/90 backdrop-blur-xl";
  
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
          <p className="text-sm font-medium text-gray-600">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
            {value}
          </p>
          {change && (
            <div className="flex items-center space-x-1">
              <span className={`text-xs font-medium ${
                change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {change}
              </span>
              {period && (
                <span className="text-xs text-gray-500">
                  {period}
                </span>
              )}
            </div>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
