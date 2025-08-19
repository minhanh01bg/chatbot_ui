'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  UserIcon,
  Settings,
  HelpCircle,
  LayoutDashboard,
  CreditCard,
  LogOut
} from 'lucide-react';
import { performLogout } from '@/lib/auth-utils';

export default function UserDropdown() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleLogout = async (): Promise<void> => {
    await performLogout(router);
  };

  // Show loading state while session is loading
  if (status === 'loading') {
    return (
      <Button variant="ghost" className="h-9 px-2 gap-2 hover:admin-accent-secondary" disabled>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="admin-accent-secondary admin-text-secondary">...</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <span className="hidden md:inline font-medium text-sm admin-text-secondary">Loading...</span>
        </div>
      </Button>
    );
  }

  // Get user info from session or fallback to defaults
  const userIdentifier = (session?.user as any)?.identifier || session?.user?.name || 'Administrator';
  const userName = userIdentifier;
  const userEmail = userIdentifier.includes('@') ? userIdentifier : 'admin@example.com';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 px-2 gap-2 hover:admin-accent-secondary transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt={userName} />
            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="hidden md:inline font-medium text-sm admin-text-primary">{userName}</span>
            <span className="hidden md:inline text-xs admin-text-muted">{userEmail}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="p-3">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none admin-text-muted">{userEmail}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/admin" className="cursor-pointer flex w-full items-center">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/subscriptions" className="cursor-pointer flex w-full items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>My Subscription</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/admin/sites" className="cursor-pointer flex w-full items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/help" className="cursor-pointer flex w-full items-center">
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 