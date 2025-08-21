'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { 
  Globe, 
  Database, 
  MessageCircle, 
  TrendingUp,
  Users,
  Activity,
  Zap,
  Sparkles
} from 'lucide-react';

interface SiteStatsProps {
  totalSites: number;
  totalDocuments: number;
  activeChats: number;
  totalTraffic: number;
}

const statsVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const numberVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

export default function SiteStats({ 
  totalSites, 
  totalDocuments, 
  activeChats, 
  totalTraffic 
}: SiteStatsProps) {
  const stats = [
    {
      title: "Total Sites",
      value: totalSites,
      icon: Globe,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      darkBgColor: "from-purple-900/20 to-purple-800/20"
    },
    {
      title: "Documents",
      value: totalDocuments,
      icon: Database,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      darkBgColor: "from-blue-900/20 to-blue-800/20"
    },
    {
      title: "Active Chats",
      value: activeChats,
      icon: MessageCircle,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      darkBgColor: "from-green-900/20 to-green-800/20"
    },
    {
      title: "Total Traffic",
      value: totalTraffic.toLocaleString(),
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
      darkBgColor: "from-orange-900/20 to-orange-800/20"
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      variants={statsVariants}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          variants={statsVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1 }}
        >
          <Card className="group relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-slate-800/90 dark:to-slate-700/90 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} dark:${stat.darkBgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            
            {/* Glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`}></div>
            
            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                  {stat.title}
                </CardTitle>
                <motion.div
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} text-white shadow-lg`}
                >
                  <stat.icon className="h-4 w-4" />
                </motion.div>
              </div>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <motion.div
                variants={numberVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 + 0.5 }}
                className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300"
              >
                {stat.value}
              </motion.div>
              
              {/* Animated progress bar */}
              <motion.div 
                className="mt-3 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.1 + 0.7, duration: 1, ease: "easeOut" }}
              >
                <motion.div
                  className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((stat.value as number) / 100, 1) * 100}%` }}
                  transition={{ delay: index * 0.1 + 0.9, duration: 1.2, ease: "easeOut" }}
                />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
} 