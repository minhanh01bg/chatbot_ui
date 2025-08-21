'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../ui/card';
import { Globe, Plus, Sparkles, Zap } from 'lucide-react';
import CreateSiteModal from './CreateSiteModal';

interface EmptyStateProps {
  searchTerm: string;
  onSiteCreated: () => void;
}

export default function EmptyState({ searchTerm, onSiteCreated }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-slate-800/90 dark:to-slate-700/90 backdrop-blur-xl">
        <CardContent className="p-12 text-center">
          <motion.div 
            className="text-gray-400 mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Animated icon */}
            <motion.div
              className="relative mx-auto mb-6"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-2xl"></div>
              <div className="relative bg-gradient-to-r from-purple-500 to-blue-500 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                <Globe className="h-10 w-10 text-white" />
              </div>
            </motion.div>

            <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-3">
              {searchTerm ? 'No sites found' : 'Welcome to AI Sites Management'}
            </h3>
            
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              {searchTerm 
                ? 'No sites match your search criteria. Try adjusting your search terms or create a new site.'
                : 'Get started by creating your first AI-powered chat site. Deploy intelligent chatbots across multiple domains with ease.'
              }
            </p>

            {/* Feature highlights */}
            {!searchTerm && (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {[
                  {
                    icon: Sparkles,
                    title: "AI-Powered",
                    description: "Advanced language models for intelligent conversations"
                  },
                  {
                    icon: Zap,
                    title: "Lightning Fast",
                    description: "Instant responses with optimized performance"
                  },
                  {
                    icon: Globe,
                    title: "Multi-Domain",
                    description: "Deploy across multiple websites seamlessly"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-900/20 dark:to-blue-900/20 backdrop-blur-sm"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full mb-3">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Action buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {!searchTerm && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CreateSiteModal onSiteCreated={onSiteCreated} />
                </motion.div>
              )}
              
              {searchTerm && (
                <motion.button
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.reload()}
                >
                  <Plus className="h-4 w-4" />
                  Clear Search
                </motion.button>
              )}
            </motion.div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                  style={{
                    left: `${10 + i * 12}%`,
                    top: `${20 + (i % 3) * 25}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 