'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminSidebar } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';
import SessionProvider from '@/components/providers/SessionProvider';
import { AdminThemeProvider } from '@/contexts/AdminThemeContext';
import { useAdminTheme } from '@/contexts/AdminThemeContext';

interface SharedAdminLayoutProps {
  children: React.ReactNode;
  className?: string;
}

function AdminLayoutContent({ children, className = '' }: SharedAdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { currentTheme } = useAdminTheme();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarHoverChange = (hovered: boolean) => {
    if (!isMobile) {
      setIsSidebarHovered(hovered);
    }
  };

  // Check if current theme is an admin theme
  const isAdminTheme = currentTheme.startsWith('admin');

  return (
    <div className={`flex h-screen overflow-hidden admin-theme`} data-theme={currentTheme}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-30"
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
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || isSidebarHovered) && (
          <motion.div
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative z-40"
          >
            <AdminSidebar
              isOpen={isSidebarOpen}
              isHovered={isSidebarHovered}
              onToggle={handleSidebarToggle}
              onHoverChange={handleSidebarHoverChange}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Navbar */}
        <AdminNavbar
          onSidebarToggle={handleSidebarToggle}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Content Area */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className={`flex-1 overflow-auto ${className}`}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}

export function SharedAdminLayout({ children, className = '' }: SharedAdminLayoutProps) {
  return (
    <SessionProvider>
      <AdminThemeProvider>
        <AdminLayoutContent className={className}>
          {children}
        </AdminLayoutContent>
      </AdminThemeProvider>
    </SessionProvider>
  );
}
