'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { getCurrentUserFromCookies, clearAllAuthData } from '@/lib/auth-utils';

interface User {
  id: string;
  identifier: string;
  name?: string;
  email?: string;
}

interface LoginResponse {
  access_token: string;
  role: string;
  user: User;
  brand_logos?: string[];
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  role: string | null;
  brandLogos: string[];
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [brandLogos, setBrandLogos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load authentication state from cookies on mount
  useEffect(() => {
    const cookieUser = getCurrentUserFromCookies();
    if (cookieUser) {
      setUser({
        id: cookieUser.id!,
        identifier: cookieUser.identifier!,
        name: cookieUser.identifier,
        email: cookieUser.identifier
      });
      setAccessToken(cookieUser.accessToken);
      setRole(cookieUser.role);
    }
  }, []);

  const login = async (identifier: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Đăng nhập thất bại');
      }

      if (!data.access_token) {
        throw new Error('Token không hợp lệ');
      }

      // Lưu thông tin vào memory state
      setUser(data.user);
      setAccessToken(data.access_token);
      setRole(data.role);
      setBrandLogos(data.brand_logos || []);

      toast({
        title: "Thành công",
        description: "Đăng nhập thành công!",
      });
      return true;

    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : 'Đăng nhập thất bại',
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRole(null);
    setBrandLogos([]);
    
    // Clear all authentication data (cookies and localStorage)
    clearAllAuthData();
    
    toast({
      title: "Thành công",
      description: "Đã đăng xuất",
    });
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    accessToken,
    role,
    brandLogos,
    isLoading,
    login,
    logout,
    isAuthenticated: !!accessToken && !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 