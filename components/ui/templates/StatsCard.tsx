'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  period?: string;
  icon: LucideIcon;
  gradient: string;
  delay?: number;
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  period, 
  icon: Icon, 
  gradient, 
  delay = 0 
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.6 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group"
    >
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-gray-300 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-white group-hover:text-purple-300 transition-colors">
              {value}
            </p>
            {change && (
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 text-green-400">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-green-400 text-sm">{change}</p>
                {period && <p className="text-gray-400 text-sm">{period}</p>}
              </div>
            )}
          </div>
          <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
