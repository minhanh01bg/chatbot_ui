'use client';

import { useSuperAdmin } from '@/hooks/use-superadmin';
import { CreateSubscriptionModal } from '@/components/admin/CreateSubscriptionModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {motion} from 'framer-motion';
import { useAdminTheme } from '@/contexts/AdminThemeContext';
import React, { useState } from 'react';

export default function AdminSubscriptionsPage() {
  const { isSuperAdmin, isLoading, isAuthenticated } = useSuperAdmin();
  const router = useRouter();
  const { currentTheme, isDark, setTheme, toggleDarkMode } = useAdminTheme();
  const [themeKey, setThemeKey] = useState(0);
    
  useEffect(() => {
    console.log('Theme changed:', { currentTheme, isDark });
    setThemeKey(prev => prev + 1);
    
    // Force a complete re-render by updating a dummy state
    setTimeout(() => {
      setThemeKey(prev => prev + 1);
    }, 100);
  }, [currentTheme, isDark]);
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    } else if (!isLoading && !isSuperAdmin) {
      router.push('/admin');
    }
  }, [isSuperAdmin, isLoading, isAuthenticated, router]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('admin-theme');
    root.setAttribute('data-theme', currentTheme);
    
    // Force CSS variables update
    if (currentTheme === 'dark') {
      root.style.setProperty('--admin-text-primary', '0 0% 98%');
      root.style.setProperty('--admin-text-secondary', '220 9% 75%');
      root.style.setProperty('--admin-text-muted', '220 9% 60%');
      root.style.setProperty('--admin-text-subtle', '220 9% 50%');
      
      // Force dark mode classes
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.style.setProperty('--admin-text-primary', '240 10% 3.9%');
      root.style.setProperty('--admin-text-secondary', '240 5% 20%');
      root.style.setProperty('--admin-text-muted', '240 5% 45%');
      root.style.setProperty('--admin-text-subtle', '240 5% 60%');
      
      // Force light mode classes
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [currentTheme, isDark]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="space-y-8 p-6 lg:p-8">
        {/* Enhanced Header with Animation */}
        <motion.div 
          className="relative"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-indigo-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl">
            <div className="text-center space-y-4">
              <motion.h1 
                className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                Admin Subscriptions Management
              </motion.h1>
              <motion.p 
                className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                Create and manage your AI-powered chat sites with advanced analytics, 
                seamless deployment, and intelligent monitoring capabilities.
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Sites Management with Enhanced Animation */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <div className="lg:col-span-3">

          </div>
        </motion.div>

        <motion.div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Admin Subscriptions</h1>
            <CreateSubscriptionModal />
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Management</CardTitle>
              </CardHeader>
              <motion.p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
                Create and manage user subscriptions. Only superadmin users can access this page.
              </motion.p>
            </Card>
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
} 