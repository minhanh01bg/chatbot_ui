'use client';

import { Users, ArrowUp, ArrowDown, DollarSign, ShoppingBag, UserPlus, LineChart } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
  percentage: string;
  gradient: string;
};

const StatCard = ({ title, value, description, icon, trend, percentage, gradient }: StatCardProps) => {
  return (
    <div className="bg-gradient-to-br from-white/95 via-purple-50/95 to-white/95 backdrop-blur-xl border border-purple-200/30 rounded-xl shadow-2xl hover:shadow-purple-200/20 transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium admin-text-secondary">{title}</p>
          <div className={`p-3 rounded-lg bg-gradient-to-r ${gradient} text-gray-900 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
        <div className="flex items-center text-sm">
          <div className={`mr-2 p-1.5 rounded-md ${
            trend === 'up' 
              ? 'admin-status-success admin-bg-status-success' 
              : trend === 'down' 
                ? 'admin-status-error admin-bg-status-error' 
                : 'admin-status-warning admin-bg-status-warning'
          }`}>
            {trend === 'up' ? (
              <ArrowUp className="h-4 w-4" />
            ) : trend === 'down' ? (
              <ArrowDown className="h-4 w-4" />
            ) : null}
          </div>
          <p className={`font-medium ${
            trend === 'up' 
              ? 'admin-status-success' 
              : trend === 'down' 
                ? 'admin-status-error' 
                : 'admin-status-warning'
          }`}>
            {percentage}
          </p>
          <p className="admin-text-muted ml-2">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default function DashboardCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Revenue"
        value="$45,231.89"
        description="compared to last month"
        icon={<DollarSign className="h-5 w-5" />}
        trend="up"
        percentage="12.5%"
        gradient="from-purple-600 to-blue-600"
      />
      <StatCard
        title="New Users"
        value="2,350"
        description="compared to last month"
        icon={<UserPlus className="h-5 w-5" />}
        trend="up"
        percentage="5.2%"
        gradient="from-green-600 to-emerald-600"
      />
      <StatCard
        title="Sales"
        value="12,234"
        description="compared to last month"
        icon={<ShoppingBag className="h-5 w-5" />}
        trend="down"
        percentage="3.1%"
        gradient="from-orange-600 to-red-600"
      />
      <StatCard
        title="Active Users"
        value="573"
        description="compared to last week"
        icon={<Users className="h-5 w-5" />}
        trend="up"
        percentage="7.4%"
        gradient="from-indigo-600 to-purple-600"
      />
    </div>
  );
} 