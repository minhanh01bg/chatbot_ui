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
    name: 'Users Management', 
    icon: UserGroupIcon,
    subItems: [
      { name: 'User List', href: '/admin/users' },
      { name: 'User Roles', href: '/admin/users/roles' },
    ] 
  },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { toggleSidebar, setOpenMobile, open, isHovered, setIsHovered } = useSidebar();
  
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});

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
      className="group-data-[side=left]:border-r-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-row justify-between items-center px-4 w-full">
          {(open || isHovered) && (
            <h1 className="text-xl font-bold">Admin Panel</h1>
          )}
          {!open && !isHovered && (
            <div className="w-full flex justify-center">
              <span className="font-bold text-xl">A</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="relative flex w-full min-w-0 flex-col p-2 mt-2">
          <div className="w-full">
            {(open || isHovered) && (
              <div className="px-3 py-1 text-xs text-sidebar-foreground/50 mb-2">Main Navigation</div>
            )}
            <SidebarMenu className="flex w-full min-w-0 flex-col gap-1">
              {navigation.map((item, index) => {
                const isItemActive = item.href 
                  ? isActive(item.href) || isActivePrefix(item.href)
                  : isSubmenuActive(item.subItems);
                return (
                  <SidebarMenuItem key={item.name} className="group/menu-item relative">
                    {item.subItems ? (
                      <>
                        <button
                          onClick={() => handleSubmenuToggle(index)}
                          className={`flex w-full items-center justify-between gap-2 rounded-lg p-2 
                          ${isItemActive ? 
                            'bg-brand-500/10 text-brand-500' : 
                            'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                          }`}
                        >
                          <div className="flex items-center">
                            <item.icon
                              className={`h-5 w-5 mr-3 flex-shrink-0 
                              ${isItemActive ? 'text-brand-500' : 'text-gray-500 dark:text-gray-400'}`}
                              aria-hidden="true"
                            />
                            {(open || isHovered) && (
                              <span className="text-sm font-medium">{item.name}</span>
                            )}
                          </div>
                          {(open || isHovered) && (
                            <ChevronDownIcon
                              className={`h-4 w-4 transition-transform duration-200 
                              ${openSubmenu === index ? 'rotate-180' : ''}`}
                            />
                          )}
                        </button>
                        {(open || isHovered) && openSubmenu === index && (
                          <div className="mt-1 ml-7 space-y-1">
                            {item.subItems.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                onClick={() => setOpenMobile(false)}
                                className={`block rounded-lg px-2 py-1.5 text-sm 
                                ${isActive(subItem.href) || pathname.startsWith(subItem.href) ?
                                  'bg-brand-500/10 text-brand-500 font-medium' :
                                  'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                                }`}
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
                        className="h-9 text-sm flex gap-2 p-2"
                      >
                        <Link
                          href={item.href || '#'}
                          onClick={() => setOpenMobile(false)}
                          className="flex items-center"
                        >
                          <item.icon
                            className={`h-5 w-5 mr-3 flex-shrink-0
                            ${isItemActive ? 'text-brand-500' : 'text-gray-500 dark:text-gray-400'}`}
                            aria-hidden="true"
                          />
                          {(open || isHovered) && (
                            <span className="truncate text-sm font-medium">{item.name}</span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </div>
        </div>
      </SidebarContent>
    </UISidebar>
  );
} 