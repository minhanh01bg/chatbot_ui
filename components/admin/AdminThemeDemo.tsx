'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Palette, Settings, Users, BarChart3, Globe, CreditCard, Info } from 'lucide-react';
import { useAdminTheme } from '@/contexts/AdminThemeContext';
import { AdminTextPrimary, AdminTextSecondary, AdminTextMuted } from '@/components/ui/admin-text';

export function AdminThemeDemo() {
  const { currentTheme, setTheme } = useAdminTheme();

  const adminThemes = [
    {
      name: 'adminLight',
      displayName: 'Admin Light',
      description: 'Clean light admin theme with purple accents',
      icon: <Crown className="w-6 h-6" />,
      badge: 'Light',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      name: 'adminDark',
      displayName: 'Admin Dark',
      description: 'Professional dark admin theme with purple accents',
      icon: <Crown className="w-6 h-6" />,
      badge: 'Dark',
      gradient: 'from-purple-600 to-blue-600'
    }
  ];

  // Regular themes have been removed for simplicity
  const regularThemes: any[] = [];

  return (
    <div className={`min-h-screen p-6 space-y-8 ${currentTheme.startsWith('admin') ? 'admin-theme' : ''}`}>
      {/* Header */}
      <div className="text-center">
        <h1 className={`text-3xl font-bold mb-2 ${currentTheme.startsWith('admin') ? 'admin-text-primary' : 'text-gray-900'}`}>
          Admin Theme System
        </h1>
        <p className={`text-lg ${currentTheme.startsWith('admin') ? 'admin-text-secondary' : 'text-gray-600'}`}>
          Experience beautiful admin themes with enhanced UI
        </p>
      </div>

      {/* Current Theme Display */}
      <div className={`p-6 text-center rounded-lg border ${
        currentTheme.startsWith('admin') 
          ? 'admin-card' 
          : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-center space-x-3 mb-4">
          {currentTheme.startsWith('admin') ? (
            <Crown className="w-8 h-8 text-purple-500" />
          ) : (
            <Palette className="w-8 h-8 text-gray-500" />
          )}
          <div>
            <p className={`text-xl font-semibold ${
              currentTheme.startsWith('admin') ? 'admin-text-primary' : 'text-gray-900'
            }`}>
              Current Theme: {currentTheme}
            </p>
            <p className={`text-sm ${
              currentTheme.startsWith('admin') ? 'admin-text-muted' : 'text-gray-600'
            }`}>
              {currentTheme.startsWith('admin') ? 'Admin Theme' : 'Standard Theme'}
            </p>
          </div>
        </div>
      </div>

      {/* Admin Themes Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Crown className="w-6 h-6 text-purple-500" />
          <p className={`text-xl font-semibold ${
            currentTheme.startsWith('admin') ? 'admin-text-primary' : 'text-gray-900'
          }`}>Admin Themes</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {adminThemes.map((theme, index) => (
            <motion.div
              key={theme.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 cursor-pointer transition-all duration-300 rounded-lg border ${
                currentTheme === theme.name 
                  ? 'ring-2 ring-purple-500' 
                  : 'hover:shadow-md'
              } ${
                currentTheme.startsWith('admin') 
                  ? 'admin-card' 
                  : 'bg-white border-gray-200'
              }`}
              onClick={() => setTheme(theme.name)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${theme.gradient} text-white`}>
                  {theme.icon}
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  theme.badge === 'Premium' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {theme.badge}
                </span>
              </div>
              <p className={`font-semibold mb-2 ${
                currentTheme.startsWith('admin') ? 'admin-text-primary' : 'text-gray-900'
              }`}>{theme.displayName}</p>
              <p className={`text-sm mb-4 ${
                currentTheme.startsWith('admin') ? 'admin-text-muted' : 'text-gray-600'
              }`}>{theme.description}</p>
              {currentTheme === theme.name && (
                <div className="flex items-center space-x-2 text-purple-500">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium">Active</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Note: Standard themes have been removed for simplicity */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Info className="w-6 h-6 text-blue-500" />
          <p className={`text-xl font-semibold ${
            currentTheme.startsWith('admin') ? 'admin-text-primary' : 'text-gray-900'
          }`}>Theme System</p>
        </div>
        <div className={`p-6 rounded-lg border ${
          currentTheme.startsWith('admin') 
            ? 'admin-card' 
            : 'bg-white border-gray-200'
        }`}>
          <p className={`text-sm ${
            currentTheme.startsWith('admin') ? 'admin-text-muted' : 'text-gray-600'
          }`}>
            This theme system has been simplified to include only light and dark admin themes. 
            The structure is designed to easily accommodate future theme additions.
          </p>
        </div>
      </div>

      {/* Admin Components Demo */}
      <div className="space-y-6">
        <p className={`text-xl font-semibold ${
          currentTheme.startsWith('admin') ? 'admin-text-primary' : 'text-gray-900'
        }`}>Admin Components Preview</p>
        
        {/* Mock Admin Layout */}
        <div className={`p-6 rounded-lg border ${
          currentTheme.startsWith('admin') 
            ? 'admin-card' 
            : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <p className={`text-xl font-semibold ${
              currentTheme.startsWith('admin') ? 'admin-text-primary' : 'text-gray-900'
            }`}>Admin Dashboard</p>
            <div className="flex items-center space-x-2">
              <button className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                currentTheme.startsWith('admin') 
                  ? 'admin-button' 
                  : 'bg-purple-500 text-white hover:bg-purple-600'
              }`}>
                <Settings className="w-4 h-4 mr-2 inline" />
                Settings
              </button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <motion.div 
              className={`p-4 rounded-lg border ${
                currentTheme.startsWith('admin') 
                  ? 'admin-card' 
                  : 'bg-white border-gray-200'
              }`}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500 rounded-lg text-white">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className={`font-semibold ${
                    currentTheme.startsWith('admin') ? 'admin-text-primary' : 'text-gray-900'
                  }`}>1,234</p>
                  <p className={`text-sm ${
                    currentTheme.startsWith('admin') ? 'admin-text-muted' : 'text-gray-600'
                  }`}>Total Users</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className={`p-4 rounded-lg border ${
                currentTheme.startsWith('admin') 
                  ? 'admin-card' 
                  : 'bg-white border-gray-200'
              }`}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg text-white">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className={`font-semibold ${
                    currentTheme.startsWith('admin') ? 'admin-text-primary' : 'text-gray-900'
                  }`}>567</p>
                  <p className={`text-sm ${
                    currentTheme.startsWith('admin') ? 'admin-text-muted' : 'text-gray-600'
                  }`}>Active Sites</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className={`p-4 rounded-lg border ${
                currentTheme.startsWith('admin') 
                  ? 'admin-card' 
                  : 'bg-white border-gray-200'
              }`}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg text-white">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <p className={`font-semibold ${
                    currentTheme.startsWith('admin') ? 'admin-text-primary' : 'text-gray-900'
                  }`}>89%</p>
                  <p className={`text-sm ${
                    currentTheme.startsWith('admin') ? 'admin-text-muted' : 'text-gray-600'
                  }`}>Uptime</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className={`p-4 rounded-lg border ${
                currentTheme.startsWith('admin') 
                  ? 'admin-card' 
                  : 'bg-white border-gray-200'
              }`}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500 rounded-lg text-white">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className={`font-semibold ${
                    currentTheme.startsWith('admin') ? 'admin-text-primary' : 'text-gray-900'
                  }`}>$12,345</p>
                  <p className={`text-sm ${
                    currentTheme.startsWith('admin') ? 'admin-text-muted' : 'text-gray-600'
                  }`}>Revenue</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Form Elements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg border ${
              currentTheme.startsWith('admin') 
                ? 'admin-card' 
                : 'bg-white border-gray-200'
            }`}>
              <p className={`font-semibold mb-3 ${
                currentTheme.startsWith('admin') ? 'admin-text-primary' : 'text-gray-900'
              }`}>Input Fields</p>
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Enter site name..." 
                  className={`w-full px-3 py-2 rounded-lg border ${
                    currentTheme.startsWith('admin') 
                      ? 'admin-input' 
                      : 'border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                  }`}
                />
                <input 
                  type="email" 
                  placeholder="Enter email..." 
                  className={`w-full px-3 py-2 rounded-lg border ${
                    currentTheme.startsWith('admin') 
                      ? 'admin-input' 
                      : 'border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                  }`}
                />
              </div>
            </div>
            
            <div className={`p-4 rounded-lg border ${
              currentTheme.startsWith('admin') 
                ? 'admin-card' 
                : 'bg-white border-gray-200'
            }`}>
              <p className={`font-semibold mb-3 ${
                currentTheme.startsWith('admin') ? 'admin-text-primary' : 'text-gray-900'
              }`}>Buttons</p>
              <div className="space-y-3">
                <button className={`w-full px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentTheme.startsWith('admin') 
                    ? 'admin-button' 
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}>
                  Primary Button
                </button>
                <button className="w-full px-4 py-2 border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-500 hover:text-white transition-colors">
                  Secondary Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 