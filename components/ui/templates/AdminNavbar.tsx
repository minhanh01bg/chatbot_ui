'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  HelpCircle,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { performLogout } from '@/lib/auth-utils';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/admin/ThemeToggle';
import { useAdminTheme } from '@/contexts/AdminThemeContext';

interface AdminNavbarProps {
  onSidebarToggle: () => void;
  isSidebarOpen: boolean;
  className?: string;
}

export function AdminNavbar({ onSidebarToggle, isSidebarOpen, className = '' }: AdminNavbarProps) {
  const { user } = useCurrentUser();
  const router = useRouter();
  const { currentTheme } = useAdminTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = async () => {
    try {
      await performLogout(router);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const notifications = [
    {
      id: 1,
      title: 'System Update Available',
      message: 'A new version of the platform is available.',
      time: '2 minutes ago',
      type: 'info',
      read: false
    },
    {
      id: 2,
      title: 'New User Registration',
      message: 'John Doe has registered for an account.',
      time: '5 minutes ago',
      type: 'success',
      read: false
    },
    {
      id: 3,
      title: 'Performance Alert',
      message: 'Server response time is above normal.',
      time: '10 minutes ago',
      type: 'warning',
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Check if current theme is an admin theme
  const isAdminTheme = currentTheme.startsWith('admin');

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`h-16 sticky top-0 z-50 w-full backdrop-blur-xl shadow-lg admin-navbar ${className}`}
    >
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={onSidebarToggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-10 h-10 admin-accent-secondary border admin-border-secondary rounded-xl admin-text-primary hover:admin-accent-muted transition-all duration-300"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="hidden md:flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold admin-text-primary">
              Admin Panel
            </h1>
          </motion.div>
        </div>

        {/* Center Section - Search */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex-1 max-w-md mx-4 hidden lg:block"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 admin-text-muted" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-10 pr-4 py-2 admin-accent-secondary border admin-border-secondary rounded-xl admin-text-primary placeholder-admin-text-muted focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            />
          </div>
        </motion.div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Mobile Search */}
          <motion.button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden flex items-center justify-center w-10 h-10 admin-accent-secondary border admin-border-secondary rounded-xl admin-text-primary hover:admin-accent-muted transition-all duration-300"
          >
            <Search className="w-5 h-5" />
          </motion.button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <div className="relative">
            <motion.button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center justify-center w-10 h-10 admin-accent-secondary border admin-border-secondary rounded-xl admin-text-primary hover:admin-accent-muted transition-all duration-300"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-xs text-gray-900 font-bold">{unreadCount}</span>
                </motion.div>
              )}
            </motion.button>

            <AnimatePresence>
              {isNotificationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-80 admin-dropdown rounded-xl shadow-2xl overflow-hidden !bg-white dark:!bg-gray-900 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50"
                >
                  <div className="p-4 border-b admin-border-secondary">
                    <h3 className="admin-text-primary font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className={`p-4 border-b admin-border-secondary hover:admin-accent-muted transition-colors cursor-pointer ${
                          !notification.read ? 'admin-accent-secondary' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.type === 'info' ? 'bg-blue-400' :
                            notification.type === 'success' ? 'bg-green-400' :
                            'bg-orange-400'
                          }`} />
                          <div className="flex-1">
                            <p className="admin-text-primary font-medium text-sm">{notification.title}</p>
                            <p className="admin-text-secondary text-xs mt-1">{notification.message}</p>
                            <p className="admin-text-muted text-xs mt-2">{notification.time}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="p-4 border-t admin-border-secondary">
                    <button className="w-full text-center admin-accent hover:admin-accent text-sm font-medium transition-colors">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative">
            <motion.button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3 p-2 admin-accent-secondary border admin-border-secondary rounded-xl admin-text-primary hover:admin-accent-muted transition-all duration-300"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-gray-900" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium admin-text-primary">{user?.name || 'Admin'}</p>
                <p className="text-xs admin-text-secondary">Administrator</p>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 admin-dropdown rounded-xl shadow-2xl overflow-hidden !bg-white dark:!bg-gray-900 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50"
                >
                  <div className="p-4 border-b admin-border-secondary">
                    <p className="admin-text-primary font-semibold">{user?.name || 'Admin'}</p>
                    <p className="admin-text-secondary text-sm">{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <motion.button
                      whileHover={{ backgroundColor: 'rgba(147, 51, 234, 0.2)' }}
                      className="w-full flex items-center space-x-3 px-4 py-2 admin-text-primary hover:admin-accent-muted transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ backgroundColor: 'rgba(147, 51, 234, 0.2)' }}
                      className="w-full flex items-center space-x-3 px-4 py-2 admin-text-primary hover:admin-accent-muted transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ backgroundColor: 'rgba(147, 51, 234, 0.2)' }}
                      className="w-full flex items-center space-x-3 px-4 py-2 admin-text-primary hover:admin-accent-muted transition-colors"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Help</span>
                    </motion.button>
                  </div>
                  <div className="p-4 border-t admin-border-secondary">
                    <motion.button
                      onClick={handleLogout}
                      whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t admin-border-secondary admin-accent-secondary"
          >
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 admin-text-muted" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="w-full pl-10 pr-4 py-2 admin-accent-secondary border admin-border-secondary rounded-xl admin-text-primary placeholder-admin-text-muted focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
