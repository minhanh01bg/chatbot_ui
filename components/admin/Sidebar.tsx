'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ChevronDownIcon,
  DocumentIcon,
  GlobeAltIcon,
  WrenchScrewdriverIcon,
  CreditCardIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { 
  Sidebar as UISidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from '@/components/ui/sidebar';
import { useSuperAdmin } from '@/hooks/use-superadmin';

type NavItem = {
  name: string;
  href?: string;
  icon: React.ElementType;
  subItems?: { name: string; href: string }[];
};

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  {
    name: 'Sites',
    href: '/admin/sites',
    icon: GlobeAltIcon
  },
  {
    name: 'My Subscription',
    href: '/subscriptions',
    icon: CreditCardIcon
  },
  {
    name: 'Users Management',
    icon: UserGroupIcon,
    subItems: [
      { name: 'User List', href: '/admin/users' },
      { name: 'User Roles', href: '/admin/users/roles' },
    ]
  },
  // { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
];

const superAdminNavigation: NavItem[] = [
  {
    name: 'Admin Subscriptions',
    href: '/admin/subscriptions',
    icon: UserPlusIcon
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { toggleSidebar, setOpenMobile, open, isHovered, setIsHovered } = useSidebar();
  const { isSuperAdmin } = useSuperAdmin();
  
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const isActive = (path: string) => pathname === path;
  const isActivePrefix = (path: string) => pathname.startsWith(path);
  const isSubmenuActive = (subItems?: { name: string; href: string }[]) => {
    return subItems?.some(item => pathname === item.href || pathname.startsWith(item.href));
  };

  // Track if any submenu should be open based on active path
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
    <UISidebar 
      className="group-data-[side=left]:border-r-0 bg-white/90 backdrop-blur-xl border-r border-gray-200/50 shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-gray-200/50 bg-gradient-to-r from-white/50 to-gray-50/50">
        <div className="flex flex-row justify-between items-center px-4 w-full">
          {(open || isHovered) && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          )}
          {!open && !isHovered && (
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 hover:shadow-xl">
                <span className="font-bold text-white text-sm">A</span>
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="relative flex w-full min-w-0 flex-col p-3 mt-2">
          <div className="w-full">
            {(open || isHovered) && (
              <div className="px-3 py-2 text-xs text-gray-500 mb-3 font-medium tracking-wide uppercase opacity-75 animate-fade-in">
                Main Navigation
              </div>
            )}
            <SidebarMenu className="flex w-full min-w-0 flex-col gap-2">
              {navigation.map((item, index) => {
                const isItemActive = item.href 
                  ? (item.subItems ? isActive(item.href) || isActivePrefix(item.href) : isActive(item.href))
                  : isSubmenuActive(item.subItems);
                const isHovered = hoveredItem === index;
                
                return (
                  <SidebarMenuItem key={item.name} className="group/menu-item relative">
                    {item.subItems ? (
                      <>
                        <SidebarMenuButton 
                          asChild={false}
                          isActive={isItemActive}
                          className="h-11 text-sm flex gap-2 p-3 transition-all duration-300 ease-out"
                          onClick={() => handleSubmenuToggle(index)}
                          onMouseEnter={() => setHoveredItem(index)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          <div className={`flex w-full items-center justify-between rounded-xl transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-md
                          ${isItemActive ? 
                            'bg-gradient-to-r from-purple-100 to-blue-100 border-l-4 border-purple-600 text-purple-700 shadow-md' : 
                            'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 hover:text-gray-900 hover:shadow-sm'
                          }`}>
                            <div className="flex items-center">
                              <div className={`relative ${isHovered && !isItemActive ? 'animate-bounce' : ''}`}>
                                <item.icon
                                  className={`h-5 w-5 mr-3 flex-shrink-0 transition-all duration-300
                                  ${isItemActive ? 'text-purple-600' : 'text-gray-500 group-hover:text-gray-700'}`}
                                  aria-hidden="true"
                                />
                              </div>
                              {(open || isHovered) && (
                                <span className="ml-2 text-sm font-medium transition-all duration-300">{item.name}</span>
                              )}
                            </div>
                            {(open || isHovered) && (
                              <ChevronDownIcon
                                className={`h-4 w-4 transition-all duration-300 ease-out
                                ${openSubmenu === index ? 'rotate-180 text-purple-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                              />
                            )}
                          </div>
                        </SidebarMenuButton>
                        {(open || isHovered) && openSubmenu === index && (
                          <div className="mt-2 ml-7 space-y-1 animate-slide-down">
                            {item.subItems.map((subItem, subIndex) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                onClick={() => setOpenMobile(false)}
                                className={`block rounded-lg px-3 py-2 text-sm transition-all duration-300 ease-out transform hover:scale-[1.02] hover:translate-x-1
                                ${isActive(subItem.href) || pathname.startsWith(subItem.href) ?
                                  'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 font-medium shadow-sm' :
                                  'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                                }`}
                                style={{
                                  animationDelay: `${subIndex * 100}ms`
                                }}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <SidebarMenuButton 
                        asChild 
                        isActive={isItemActive}
                        className="h-11 text-sm flex gap-2 p-3 transition-all duration-300 ease-out"
                      >
                        <Link
                          href={item.href || '#'}
                          onClick={() => setOpenMobile(false)}
                          onMouseEnter={() => setHoveredItem(index)}
                          onMouseLeave={() => setHoveredItem(null)}
                          className={`flex items-center rounded-xl transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-md
                          ${isItemActive ? 
                            'bg-gradient-to-r from-purple-100 to-blue-100 border-l-4 border-purple-600 text-purple-700 shadow-md' : 
                            'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 hover:text-gray-900 hover:shadow-sm'
                          }`}
                        >
                          <div className={`relative ${isHovered && !isItemActive ? 'animate-bounce' : ''}`}>
                            <item.icon
                              className={`h-5 w-5 mr-3 flex-shrink-0 transition-all duration-300
                              ${isItemActive ? 'text-purple-600' : 'text-gray-500 group-hover:text-gray-700'}`}
                              aria-hidden="true"
                            />
                          </div>
                          {(open || isHovered) && (
                            <span className="truncate text-sm font-medium transition-all duration-300">{item.name}</span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
              
              {/* Super Admin Navigation */}
              {isSuperAdmin && (
                <>
                  {(open || isHovered) && (
                    <div className="px-3 py-2 text-xs text-gray-500 mb-3 font-medium tracking-wide uppercase opacity-75 mt-6 animate-fade-in">
                      Admin Tools
                    </div>
                  )}
                  {superAdminNavigation.map((item, index) => {
                    const isItemActive = isActive(item.href || '');
                    const isHovered = hoveredItem === navigation.length + index;
                    
                    return (
                      <SidebarMenuItem key={item.name} className="group/menu-item relative">
                        <SidebarMenuButton 
                          asChild 
                          isActive={isItemActive}
                          className="h-11 text-sm flex gap-2 p-3 transition-all duration-300 ease-out"
                        >
                          <Link
                            href={item.href || '#'}
                            onClick={() => setOpenMobile(false)}
                            onMouseEnter={() => setHoveredItem(navigation.length + index)}
                            onMouseLeave={() => setHoveredItem(null)}
                            className={`flex items-center rounded-xl transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-md
                            ${isItemActive ? 
                              'bg-gradient-to-r from-purple-100 to-blue-100 border-l-4 border-purple-600 text-purple-700 shadow-md' : 
                              'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 hover:text-gray-900 hover:shadow-sm'
                            }`}
                          >
                            <div className={`relative ${isHovered && !isItemActive ? 'animate-bounce' : ''}`}>
                              <item.icon
                                className={`h-5 w-5 mr-3 flex-shrink-0 transition-all duration-300
                                ${isItemActive ? 'text-purple-600' : 'text-gray-500 group-hover:text-gray-700'}`}
                                aria-hidden="true"
                              />
                              {isItemActive && (
                                <div className="absolute -right-1 -top-1 w-2 h-2 bg-purple-500 rounded-full"></div>
                              )}
                            </div>
                            {(open || isHovered) && (
                              <span className="truncate text-sm font-medium transition-all duration-300">{item.name}</span>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </>
              )}
            </SidebarMenu>
          </div>
        </div>
      </SidebarContent>
      
      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </UISidebar>
  );
} 