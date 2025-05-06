'use client';

import { Users, ArrowUp, ArrowDown, DollarSign, ShoppingBag, UserPlus, LineChart } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
  percentage: string;
};

const StatCard = ({ title, value, description, icon, trend, percentage }: StatCardProps) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="p-2 bg-primary/10 rounded-full">{icon}</div>
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-sm">
          <div className={`mr-2 p-1 rounded-md ${
            trend === 'up' 
              ? 'text-green-500 bg-green-500/10' 
              : trend === 'down' 
                ? 'text-red-500 bg-red-500/10' 
                : 'text-yellow-500 bg-yellow-500/10'
          }`}>
            {trend === 'up' ? (
              <ArrowUp className="h-3 w-3" />
            ) : trend === 'down' ? (
              <ArrowDown className="h-3 w-3" />
            ) : null}
          </div>
          <p className={`${
            trend === 'up' 
              ? 'text-green-500' 
              : trend === 'down' 
                ? 'text-red-500' 
                : 'text-yellow-500'
          }`}>
            {percentage}
          </p>
          <p className="text-muted-foreground ml-2">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default function DashboardCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Revenue"
        value="$45,231.89"
        description="compared to last month"
        icon={<DollarSign className="h-4 w-4 text-primary" />}
        trend="up"
        percentage="12.5%"
      />
      <StatCard
        title="New Users"
        value="2,350"
        description="compared to last month"
        icon={<UserPlus className="h-4 w-4 text-primary" />}
        trend="up"
        percentage="5.2%"
      />
      <StatCard
        title="Sales"
        value="12,234"
        description="compared to last month"
        icon={<ShoppingBag className="h-4 w-4 text-primary" />}
        trend="down"
        percentage="3.1%"
      />
      <StatCard
        title="Active Users"
        value="573"
        description="compared to last week"
        icon={<Users className="h-4 w-4 text-primary" />}
        trend="up"
        percentage="7.4%"
      />
    </div>
  );
} 