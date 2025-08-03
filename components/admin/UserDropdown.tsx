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
      <Button variant="ghost" className="h-9 px-2 gap-2 hover:bg-gray-50" disabled>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-gray-200 text-gray-600">...</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <span className="hidden md:inline font-medium text-sm text-gray-600">Loading...</span>
        </div>
      </Button>
    );
  }

  // Get user info from session or fallback to defaults
  const userIdentifier = (session?.user as any)?.identifier || session?.user?.name || 'Administrator';
  console.log(userIdentifier)
  const userName = userIdentifier;
  const userEmail = userIdentifier.includes('@') ? userIdentifier : 'admin@example.com';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 px-2 gap-2 hover:bg-gray-50 transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt={userName} />
            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="hidden md:inline font-medium text-sm text-gray-900">{userName}</span>
            <span className="hidden md:inline text-xs text-gray-500">{userEmail}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
        <DropdownMenuLabel className="p-3">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-gray-900">{userName}</p>
            <p className="text-xs leading-none text-gray-500">{userEmail}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-100" />
        <DropdownMenuItem asChild className="hover:bg-gray-50">
          <Link href="/admin" className="cursor-pointer flex w-full items-center text-gray-700 hover:text-gray-900">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="hover:bg-gray-50">
          <Link href="/subscriptions" className="cursor-pointer flex w-full items-center text-gray-700 hover:text-gray-900">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>My Subscription</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="hover:bg-gray-50">
          <Link href="/admin/sites" className="cursor-pointer flex w-full items-center text-gray-700 hover:text-gray-900">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="hover:bg-gray-50">
          <Link href="/help" className="cursor-pointer flex w-full items-center text-gray-700 hover:text-gray-900">
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-100" />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 