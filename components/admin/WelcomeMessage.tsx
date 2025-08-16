'use client';

import { motion } from 'framer-motion';
import { Sparkles, Clock, TrendingUp, Users, Globe } from 'lucide-react';

interface WelcomeMessageProps {
  userName?: string;
  currentTime?: string;
  stats?: {
    totalUsers?: number;
    totalSites?: number;
    growthRate?: string;
  };
}

export function WelcomeMessage({ 
  userName = 'Admin', 
  currentTime = new Date().toLocaleTimeString(),
  stats = {
    totalUsers: 2847,
    totalSites: 12,
    growthRate: '+12%'
  }
}: WelcomeMessageProps) {
  // Custom number formatting to avoid hydration issues
  const formatNumber = (num: number) => {
    const parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-500/20 rounded-full"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Welcome text */}
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-purple-300">Welcome back!</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-2xl lg:text-3xl font-bold text-white"
            >
              Hello, <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{userName}</span>! 👋
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-gray-300 text-sm lg:text-base"
            >
              Here's what's happening with your platform today. Everything is running smoothly!
            </motion.p>
          </div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">{currentTime}</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
              <Users className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">{stats.totalUsers ? formatNumber(stats.totalUsers) : '0'} users</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
              <Globe className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-300">{stats.totalSites} sites</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-gray-300">{stats.growthRate}</span>
            </div>
          </motion.div>
        </div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-6"
        >
          <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
            <span>System Health</span>
            <span>98%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "98%" }}
              transition={{ delay: 1.2, duration: 1 }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
