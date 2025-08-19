'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  MessageSquare, 
  Users, 
  Settings, 
  BarChart3, 
  ChevronDown, 
  FileText, 
  Globe, 
  Wrench, 
  CreditCard, 
  UserPlus,
  Sparkles,
  Shield,
  Zap,
  Target,
  Activity,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';
import { useSuperAdmin } from '@/hooks/use-superadmin';
import { useAdminTheme } from '@/contexts/AdminThemeContext';

interface NavItem {
  name: string;
  href?: string;
  icon: React.ElementType;
  subItems?: { name: string; href: string; icon?: React.ElementType }[];
  badge?: string;
  color?: string;
}

interface AdminSidebarProps {
  isOpen: boolean;
  isHovered: boolean;
  onToggle: () => void;
  onHoverChange: (hovered: boolean) => void;
}

export function AdminSidebar({ isOpen, isHovered, onToggle, onHoverChange }: AdminSidebarProps) {
  const pathname = usePathname();
  const { isSuperAdmin } = useSuperAdmin();
  const { currentTheme } = useAdminTheme();
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  // Check if current theme is an admin theme
  const isAdminTheme = currentTheme.startsWith('admin');

  const navigation: NavItem[] = [
    { 
      name: 'Dashboard', 
      href: '/admin', 
      icon: Home,
      color: 'text-blue-400'
    },
    {
      name: 'Sites',
      href: '/admin/sites',
      icon: Globe,
      color: 'text-green-400'
    },
    {
      name: 'My Subscription',
      href: '/subscriptions',
      icon: CreditCard,
      color: 'text-purple-400'
    },
    {
      name: 'Users Management',
      icon: Users,
      color: 'text-orange-400',
      subItems: [
        { name: 'User List', href: '/admin/users', icon: Users },
        { name: 'User Roles', href: '/admin/users/roles', icon: Shield },
      ]
    },
  ];

  const superAdminNavigation: NavItem[] = [
    {
      name: 'Admin Subscriptions',
      href: '/admin/subscriptions',
      icon: UserPlus,
      color: 'text-red-400'
    },
  ];

  const isActive = (path: string) => pathname === path;
  const isActivePrefix = (path: string) => pathname.startsWith(path);
  const isSubmenuActive = (subItems?: { name: string; href: string }[]) => {
    return subItems?.some(item => pathname === item.href || pathname.startsWith(item.href));
  };

  useEffect(() => {
    navigation.forEach((item, index) => {
      if (item.subItems?.some(subItem => pathname === subItem.href || pathname.startsWith(subItem.href))) {
        setOpenSubmenu(index);
      }
    });
  }, [pathname]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu(prevState => prevState === index ? null : index);
  };

  return (
    <motion.div
      initial={{ width: isOpen ? 280 : 80 }}
      animate={{ width: isOpen || isHovered ? 280 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`relative h-screen ${isAdminTheme ? 'admin-sidebar' : ''} backdrop-blur-xl shadow-2xl`}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      {/* Header */}
      <motion.div 
        className={`h-16 flex items-center justify-center border-b ${
          isAdminTheme ? 'border-white/20 bg-white/5' : 'border-gray-200/50 bg-gray-100/50'
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <div className="flex items-center justify-between px-4 w-full">
          <AnimatePresence mode="wait">
            {(isOpen || isHovered) ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-gray-900" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="w-full flex justify-center"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
                  <Sparkles className="w-4 h-4 text-gray-900" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3 space-y-2">
          {/* Main Navigation */}
          <AnimatePresence>
            {(isOpen || isHovered) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className={`px-3 py-2 text-xs font-medium tracking-wide uppercase ${
                  isAdminTheme ? 'text-gray-600' : 'text-gray-600'
                }`}
              >
                Main Navigation
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            {navigation.map((item, index) => {
              const isItemActive = item.href 
                ? (item.subItems ? isActive(item.href) || isActivePrefix(item.href) : isActive(item.href))
                : isSubmenuActive(item.subItems);
              const isHovered = hoveredItem === index;
              
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                >
                  {item.subItems ? (
                    <div className="space-y-1">
                      <motion.button
                        onClick={() => handleSubmenuToggle(index)}
                        onMouseEnter={() => setHoveredItem(index)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 group
                        ${isItemActive 
                          ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-gray-900 shadow-lg' 
                          : `${isAdminTheme ? 'text-gray-600 hover:bg-gray-100/50' : 'text-gray-600 hover:bg-gray-100/50'} hover:text-gray-900 hover:shadow-md`
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`relative ${isHovered && !isItemActive ? 'animate-pulse' : ''}`}>
                            <item.icon className={`w-5 h-5 ${item.color || 'text-gray-600'} group-hover:text-gray-900 transition-colors`} />
                            {isItemActive && (
                              <motion.div
                                className="absolute -right-1 -top-1 w-2 h-2 bg-green-400 rounded-full"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                              />
                            )}
                          </div>
                          <AnimatePresence>
                            {(isOpen || isHovered) && (
                              <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="text-sm font-medium"
                              >
                                {item.name}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                        <AnimatePresence>
                          {(isOpen || isHovered) && (
                            <motion.div
                              initial={{ opacity: 0, rotate: -90 }}
                              animate={{ opacity: 1, rotate: 0 }}
                              exit={{ opacity: 0, rotate: -90 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown 
                                className={`w-4 h-4 transition-transform duration-300 ${
                                  openSubmenu === index ? 'rotate-180 text-purple-400' : `${isAdminTheme ? 'text-gray-600' : 'text-gray-600'}`
                                }`} 
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>

                      <AnimatePresence>
                        {openSubmenu === index && (isOpen || isHovered) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="ml-8 space-y-1 overflow-hidden"
                          >
                            {item.subItems?.map((subItem, subIndex) => (
                              <motion.div
                                key={subItem.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: subIndex * 0.1, duration: 0.3 }}
                              >
                                <Link
                                  href={subItem.href}
                                  className={`block px-3 py-2 rounded-lg text-sm transition-all duration-300 group
                                  ${isActive(subItem.href) || pathname.startsWith(subItem.href)
                                    ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-gray-900 shadow-md'
                                    : `${isAdminTheme ? 'text-gray-600 hover:bg-gray-100/50' : 'text-gray-600 hover:bg-gray-100/50'} hover:text-gray-900 hover:shadow-sm`
                                  }`}
                                >
                                  <div className="flex items-center space-x-2">
                                    {subItem.icon && (
                                      <subItem.icon className="w-4 h-4" />
                                    )}
                                    <span className="font-medium">{subItem.name}</span>
                                  </div>
                                </Link>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href || '#'}
                      onMouseEnter={() => setHoveredItem(index)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`block p-3 rounded-xl transition-all duration-300 group
                      ${isItemActive 
                        ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-gray-900 shadow-lg' 
                        : `${isAdminTheme ? 'text-gray-600 hover:bg-gray-100/50' : 'text-gray-600 hover:bg-gray-100/50'} hover:text-gray-900 hover:shadow-md`
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`relative ${isHovered && !isItemActive ? 'animate-pulse' : ''}`}>
                          <item.icon className={`w-5 h-5 ${item.color || 'text-gray-600'} group-hover:text-gray-900 transition-colors`} />
                          {isItemActive && (
                            <motion.div
                              className="absolute -right-1 -top-1 w-2 h-2 bg-green-400 rounded-full"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2, duration: 0.3 }}
                            />
                          )}
                        </div>
                        <AnimatePresence>
                          {(isOpen || isHovered) && (
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.2 }}
                              className="text-sm font-medium"
                            >
                              {item.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Super Admin Navigation */}
          {isSuperAdmin && (
            <div className="mt-8 space-y-1">
              <AnimatePresence>
                {(isOpen || isHovered) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className={`px-3 py-2 text-xs font-medium tracking-wide uppercase ${
                      isAdminTheme ? 'text-gray-600' : 'text-gray-600'
                    }`}
                  >
                    Admin Tools
                  </motion.div>
                )}
              </AnimatePresence>

              {superAdminNavigation.map((item, index) => {
                const isItemActive = isActive(item.href || '');
                const isHovered = hoveredItem === navigation.length + index;
                
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  >
                    <Link
                      href={item.href || '#'}
                      onMouseEnter={() => setHoveredItem(navigation.length + index)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`block p-3 rounded-xl transition-all duration-300 group
                      ${isItemActive 
                        ? 'bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 text-gray-900 shadow-lg' 
                        : `${isAdminTheme ? 'text-gray-600 hover:bg-gray-100/50' : 'text-gray-600 hover:bg-gray-100/50'} hover:text-gray-900 hover:shadow-md`
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`relative ${isHovered && !isItemActive ? 'animate-pulse' : ''}`}>
                          <item.icon className={`w-5 h-5 ${item.color || 'text-gray-600'} group-hover:text-gray-900 transition-colors`} />
                          {isItemActive && (
                            <motion.div
                              className="absolute -right-1 -top-1 w-2 h-2 bg-red-400 rounded-full"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2, duration: 0.3 }}
                            />
                          )}
                        </div>
                        <AnimatePresence>
                          {(isOpen || isHovered) && (
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.2 }}
                              className="text-sm font-medium"
                            >
                              {item.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <motion.div 
        className={`p-4 border-t ${
          isAdminTheme ? 'border-white/20' : 'border-gray-200/50'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <div className="flex items-center justify-center">
          <AnimatePresence>
            {(isOpen || isHovered) ? (
              <motion.div
                key="expanded-footer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center space-x-2 text-xs ${
                  isAdminTheme ? 'text-gray-600' : 'text-gray-600'
                }`}
              >
                <Shield className="w-3 h-3" />
                <span>Admin Panel v1.0</span>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed-footer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <Shield className={`w-4 h-4 ${
                  isAdminTheme ? 'text-gray-600' : 'text-gray-600'
                }`} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
