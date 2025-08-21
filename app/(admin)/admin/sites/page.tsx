'use client';

import Sites from '@/components/admin/sites/Sites';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { performLogout } from '@/lib/auth-utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function SitesPage() {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await fetch('/api/sites?skip=0&limit=50');
        if (response.ok) {
          const data = await response.json();
          // Handle both array and object response formats
          const sitesArray = Array.isArray(data) ? data : (data.sites || []);
          setSites(sitesArray);
        } else {
          let message = response.statusText;
          try {
            const errorData = await response.json();
            const rawDetail = (errorData?.error ?? errorData?.detail) as any;
            if (Array.isArray(rawDetail)) {
              const firstMsg = rawDetail.find((d) => typeof d?.msg === 'string')?.msg;
              if (firstMsg) message = firstMsg;
            } else if (typeof rawDetail === 'string') {
              message = rawDetail;
            }
          } catch {}

          if (response.status === 401 && /expired|hết hạn|signature has expired/i.test(message)) {
            toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            await performLogout(router);
            return;
          }

          toast.error(message || 'Failed to fetch sites');
        }
      } catch (error) {
        console.error('Error fetching sites:', error);
        setSites([]);
        if (error instanceof Error) {
          toast.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, []);

  const siteKeys = Array.isArray(sites) ? sites.map(site => site.key || site._id) : [];
  const siteNames = Array.isArray(sites) ? sites.reduce((acc, site) => {
    acc[site.key || site._id] = site.name || site.key || site._id;
    return acc;
  }, {} as Record<string, string>) : {};

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
                AI Sites Management
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
            <Sites />
          </div>
        </motion.div>
      </div>

      {/* Floating Elements for Visual Appeal */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-300/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>
    </motion.div>
  );
} 