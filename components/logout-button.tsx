'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { performLogout } from '@/lib/auth-utils';

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
}

export const LogoutButton = ({
  variant = 'default',
  size = 'default',
  className = '',
  showIcon = true
}: LogoutButtonProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    await performLogout(router);
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLogout}
    >
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      Đăng xuất
    </Button>
  );
};

export default LogoutButton; 