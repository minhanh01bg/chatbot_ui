'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  action: string;
  delay?: number;
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
  onClick 
}: ActionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.6 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group"
    >
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-2xl p-6">
        <div className="flex items-start space-x-4">
          <div className={`w-10 h-10 ${bgColor} ${borderColor} border rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">{description}</p>
            <button
              onClick={onClick}
              className="w-full py-2 px-4 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 hover:border-white/30 transition-all duration-300 text-sm font-medium"
            >
              {action}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
