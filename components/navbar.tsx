'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Menu, X, ChevronDown, Sparkles, Rocket, BookOpen, Zap } from 'lucide-react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { CompactDarkModeToggle } from '@/components/theme-switcher';

interface NavbarProps {
  variant?: 'landing' | 'blog';
}

export function Navbar({ variant = 'landing' }: NavbarProps) {
  const { user, isLoading, isAuthenticated } = useCurrentUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = variant === 'landing' 
    ? [
        { name: 'Features', href: '#features', icon: <Zap className="w-4 h-4" /> },
        { name: 'Pricing', href: '#pricing', icon: <Sparkles className="w-4 h-4" /> },
        { name: 'Reviews', href: '#testimonials', icon: <BookOpen className="w-4 h-4" /> },
        { name: 'Blog', href: '/blogs', icon: <BookOpen className="w-4 h-4" /> }
      ]
    : [
        { name: 'Home', href: '/', icon: <Rocket className="w-4 h-4" /> },
        { name: 'Features', href: '/#features', icon: <Zap className="w-4 h-4" /> },
        { name: 'Pricing', href: '/#pricing', icon: <Sparkles className="w-4 h-4" /> },
        { name: 'Blog', href: '/blogs', icon: <BookOpen className="w-4 h-4" /> }
      ];

  const productMenuItems = [
    { 
      name: 'AI Chat', 
      href: '/chat', 
      description: 'Start chatting with AI',
      icon: <Bot className="w-5 h-5" />,
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      name: 'Documentation', 
      href: '/docs', 
      description: 'API and guides',
      icon: <BookOpen className="w-5 h-5" />,
      gradient: 'from-green-500 to-emerald-500'
    },
    { 
      name: 'API', 
      href: '/api', 
      description: 'Developer resources',
      icon: <Zap className="w-5 h-5" />,
      gradient: 'from-yellow-500 to-orange-500'
    },
    { 
      name: 'Integrations', 
      href: '/integrations', 
      description: 'Connect with your tools',
      icon: <Sparkles className="w-5 h-5" />,
      gradient: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 shadow-2xl' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 animate-pulse-glow"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Bot className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-purple-500 transition-all">
                ChatAI Pro
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Product Dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                className="flex items-center space-x-2 px-4 py-2 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
              >
                <span>Product</span>
                <motion.div
                  animate={{ rotate: isProductDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {isProductDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-96 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-2xl py-3 z-50 border border-slate-200/50 dark:border-slate-700/50"
                  >
                    <div className="grid grid-cols-2 gap-2 p-3">
                      {productMenuItems.map((item, index) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            href={item.href}
                            className="flex flex-col p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 group"
                            onClick={() => setIsProductDropdownOpen(false)}
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <div className={`w-8 h-8 bg-gradient-to-r ${item.gradient} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200 animate-pulse-glow`}>
                                {item.icon}
                              </div>
                              <span className="font-medium text-slate-800 dark:text-slate-200">{item.name}</span>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">{item.description}</span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Links */}
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-2 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 group"
                >
                  <span className="text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform duration-200 animate-sparkle">
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Theme Switcher */}
            <CompactDarkModeToggle />
            
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <>
                    <span className="text-slate-600 dark:text-slate-300 text-sm">
                      Welcome, {user?.name || 'User'}!
                    </span>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href="/admin"
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl hover-glow transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm"
                      >
                        Dashboard
                      </Link>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href="/login"
                        className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-6 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        Sign In
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href="/register"
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl hover-glow transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm"
                      >
                        Get Started
                      </Link>
                    </motion.div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-slate-200/50 dark:border-slate-700/50 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm"
            >
              <div className="px-2 pt-4 pb-6 space-y-3">
                {/* Product Menu for Mobile */}
                <div className="px-3 py-2">
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">Product</div>
                  <div className="space-y-2">
                    {productMenuItems.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center space-x-3 p-3 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className={`w-8 h-8 bg-gradient-to-r ${item.gradient} rounded-lg flex items-center justify-center animate-pulse-glow`}>
                            {item.icon}
                          </div>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">{item.description}</div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Navigation Links */}
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center space-x-3 px-3 py-3 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-blue-500 dark:text-blue-400 animate-sparkle">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  </motion.div>
                ))}

                {/* Dark Mode Toggle for Mobile */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50"
                >
                  <div className="px-3 py-2">
                    <CompactDarkModeToggle />
                  </div>
                </motion.div>

                {/* Mobile Auth Buttons */}
                {!isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50"
                  >
                    {isAuthenticated ? (
                      <div className="space-y-3">
                        <div className="px-3 py-2 text-sm text-slate-600 dark:text-slate-300">
                          Welcome, {user?.name || 'User'}!
                        </div>
                        <Link
                          href="/admin"
                          className="block w-full text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover-glow transition-all duration-200 shadow-lg"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Go to Dashboard
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Link
                          href="/login"
                          className="block w-full text-center text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 px-6 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/register"
                          className="block w-full text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover-glow transition-all duration-200 shadow-lg"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Get Started
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.nav>
  );
} 