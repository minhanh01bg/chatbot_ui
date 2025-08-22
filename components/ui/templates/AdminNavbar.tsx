'use client';

import * as React from 'react';
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
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);


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
                  className="absolute right-0 mt-2 w-80 admin-dropdown rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
                  style={{
                    background: 'var(--admin-dropdown-background)',
                    border: '1px solid var(--admin-dropdown-border)',
                    boxShadow: 'var(--admin-dropdown-shadow)',
                  }}
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
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute right-0 mt-3 w-72 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-3xl"
                  style={{
                    background: 'var(--admin-dropdown-background)',
                    border: '1px solid var(--admin-dropdown-border)',
                    boxShadow: 'var(--admin-dropdown-shadow)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  {/* Header with User Info */}
                  <div 
                    className="relative p-6 border-b"
                    style={{
                      background: 'var(--admin-gradient-card)',
                      borderBottomColor: 'var(--admin-dropdown-border)',
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold admin-text-primary truncate">
                          {user?.name || 'Admin User'}
                        </h3>
                        <p className="text-sm admin-text-secondary truncate">
                          {user?.email || 'admin@example.com'}
                        </p>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 mt-1">
                          Administrator
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-3">
                    <motion.button
                      whileHover={{ 
                        scale: 1.02, 
                        x: 4
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center space-x-4 px-6 py-3 admin-text-primary hover:admin-accent-muted transition-all duration-200 group rounded-lg"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <span className="text-sm font-medium">My Profile</span>
                        <p className="text-xs admin-text-muted">View and edit profile</p>
                      </div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </motion.button>

                    <motion.button
                      whileHover={{ 
                        scale: 1.02, 
                        x: 4
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center space-x-4 px-6 py-3 admin-text-primary hover:admin-accent-muted transition-all duration-200 group rounded-lg"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                        <Settings className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <span className="text-sm font-medium">Account Settings</span>
                        <p className="text-xs admin-text-muted">Manage preferences</p>
                      </div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </motion.button>

                    <motion.button
                      whileHover={{ 
                        scale: 1.02, 
                        x: 4
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center space-x-4 px-6 py-3 admin-text-primary hover:admin-accent-muted transition-all duration-200 group rounded-lg"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                        <HelpCircle className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <span className="text-sm font-medium">Help & Support</span>
                        <p className="text-xs admin-text-muted">Get assistance</p>
                      </div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </motion.button>
                  </div>

                  {/* Divider */}
                  <div className="mx-6 border-t border-gray-200/50 dark:border-gray-700/50"></div>

                  {/* Logout Button */}
                  <div className="p-3">
                    <motion.button
                      onClick={handleLogout}
                      whileHover={{ 
                        scale: 1.02, 
                        y: -1,
                        background: 'linear-gradient(135deg, rgb(220, 38, 38) 0%, rgb(225, 29, 72) 100%)'
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="font-medium">Sign Out</span>
                    </motion.button>
                  </div>

                  {/* Footer */}
                  <div 
                    className="px-6 py-3 border-t"
                    style={{
                      background: 'var(--admin-gradient-card)',
                      borderTopColor: 'var(--admin-dropdown-border)',
                    }}
                  >
                    <p className="text-xs text-center admin-text-muted">
                      Admin Panel v2.0
                    </p>
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
