'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ChartBarIcon
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
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PanelLeftIcon } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Chat Test', href: '/admin/chat-test', icon: ChatBubbleLeftRightIcon },
  { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { toggleSidebar, setOpenMobile } = useSidebar();

  return (
    <UISidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-xl font-bold px-2">Admin Panel</h1>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={toggleSidebar}
                >
                  <PanelLeftIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Toggle Sidebar</TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <div data-sidebar="group" className="relative flex w-full min-w-0 flex-col p-2">
          <div data-sidebar="group-content" className="w-full text-sm">
            <div className="px-2 py-1 text-xs text-sidebar-foreground/50">Main Navigation</div>
            <SidebarMenu className="flex w-full min-w-0 flex-col gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name} className="group/menu-item relative">
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className="h-8 text-sm flex gap-2 p-3"
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpenMobile(false)}
                        className="flex items-center"
                      >
                        <item.icon
                          className="mr-3 h-5 w-5 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <span className="truncate flex-1 text-left">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
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