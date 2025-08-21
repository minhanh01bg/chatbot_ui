'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Shield, User, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const { user, role, brandLogos, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 animate-spin" />
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-300">Chào mừng trở lại!</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>

        {/* User Info Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{user?.name || user?.identifier}</h2>
              <p className="text-gray-300">{user?.email || user?.identifier}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                  {role || 'User'}
                </span>
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                  Đã xác thực
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Logos */}
        {brandLogos && brandLogos.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Brand Logos</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {brandLogos.map((logo, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 flex items-center justify-center">
                  <img src={logo} alt={`Brand ${index + 1}`} className="max-w-full max-h-16" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Default Logo if no brand logos */}
        {(!brandLogos || brandLogos.length === 0) && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Brand Logo</h3>
            <div className="bg-white/5 rounded-lg p-8 flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                <Shield className="w-12 h-12 text-white" />
              </div>
            </div>
            <p className="text-gray-300 text-center mt-4">Logo thương hiệu mặc định</p>
          </div>
        )}
      </div>
    </div>
  );
} 