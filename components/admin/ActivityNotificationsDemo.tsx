'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Bell, 
  CheckCircle, 
  Info, 
  AlertCircle, 
  Users, 
  DollarSign,
  Settings,
  Globe,
  Zap
} from 'lucide-react';
import { GlassCard } from '@/components/ui/templates';

export default function ActivityNotificationsDemo() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    const root = document.documentElement;
    
    if (!isDark) {
      // Switch to dark mode
      root.style.setProperty('--admin-bg-primary', '240 10% 3.9%');
      root.style.setProperty('--admin-bg-secondary', '240 3.7% 15.9%');
      root.style.setProperty('--admin-bg-tertiary', '240 3.7% 20%');
      root.style.setProperty('--admin-bg-glass', '255 255% 255% 0.1');
      root.style.setProperty('--admin-border-primary', '255 255% 255% 0.2');
      root.style.setProperty('--admin-border-secondary', '255 255% 255% 0.1');
      root.style.setProperty('--admin-text-primary', '0 0% 98%');
      root.style.setProperty('--admin-text-secondary', '240 5% 64.9%');
      root.style.setProperty('--admin-text-muted', '240 3.8% 46.1%');
    } else {
      // Switch to light mode
      root.style.setProperty('--admin-bg-primary', '0 0% 100%');
      root.style.setProperty('--admin-bg-secondary', '240 4.8% 95.9%');
      root.style.setProperty('--admin-bg-tertiary', '240 5.9% 90%');
      root.style.setProperty('--admin-bg-glass', '0 0% 0% 0.05');
      root.style.setProperty('--admin-border-primary', '240 5.9% 90%');
      root.style.setProperty('--admin-border-secondary', '240 4.8% 95.9%');
      root.style.setProperty('--admin-text-primary', '240 10% 3.9%');
      root.style.setProperty('--admin-text-secondary', '240 3.8% 46.1%');
      root.style.setProperty('--admin-text-muted', '240 3.8% 46.1%');
    }
  };

  const recentActivities = [
    {
      type: "site",
      title: "New site \"TechSupport\" created",
      time: "2 hours ago",
      status: "success",
      icon: CheckCircle,
      color: "admin-accent",
      bgColor: "admin-accent-secondary"
    },
    {
      type: "config",
      title: "Updated chatbot configuration",
      time: "4 hours ago",
      status: "info",
      icon: Info,
      color: "admin-accent",
      bgColor: "admin-accent-secondary"
    },
    {
      type: "alert",
      title: "Performance alert resolved",
      time: "6 hours ago",
      status: "warning",
      icon: AlertCircle,
      color: "admin-accent",
      bgColor: "admin-accent-secondary"
    },
    {
      type: "user",
      title: "New user registration",
      time: "8 hours ago",
      status: "success",
      icon: Users,
      color: "admin-accent",
      bgColor: "admin-accent-secondary"
    },
    {
      type: "payment",
      title: "Subscription payment received",
      time: "12 hours ago",
      status: "success",
      icon: DollarSign,
      color: "admin-accent",
      bgColor: "admin-accent-secondary"
    }
  ];

  const notifications = [
    {
      type: "info",
      title: "System Update Available",
      message: "A new version of the platform is available for deployment.",
      time: "1 hour ago",
      icon: Info,
      color: "admin-accent",
      bgColor: "admin-accent-secondary"
    },
    {
      type: "warning",
      title: "High CPU Usage",
      message: "Server CPU usage is above 80%. Consider scaling up.",
      time: "3 hours ago",
      icon: AlertCircle,
      color: "admin-accent",
      bgColor: "admin-accent-secondary"
    },
    {
      type: "success",
      title: "Backup Completed",
      message: "Daily backup has been completed successfully.",
      time: "6 hours ago",
      icon: CheckCircle,
      color: "admin-accent",
      bgColor: "admin-accent-secondary"
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold admin-text-primary">Activity & Notifications Demo</h1>
          <p className="admin-text-secondary mt-2">Recent Activity and Notifications with admin theme</p>
        </div>
        <Button onClick={toggleTheme} variant="outline" className="admin-border-primary admin-text-primary hover:admin-accent-secondary">
          Switch to {isDark ? 'Light' : 'Dark'} Mode
        </Button>
      </div>

      {/* Recent Activity and Notifications Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <GlassCard>
          <CardHeader>
            <CardTitle className="text-xl font-semibold admin-text-primary flex items-center">
              <Activity className="h-6 w-6 mr-3 admin-accent" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.slice(0, 3).map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 admin-accent-secondary rounded-xl border admin-border-secondary hover:admin-accent-muted transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 ${activity.bgColor} rounded-lg flex items-center justify-center`}>
                      <activity.icon className={`h-5 w-5 ${activity.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium admin-text-primary">{activity.title}</p>
                      <p className="text-xs admin-text-muted">{activity.time}</p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="text-xs admin-border-primary admin-text-secondary"
                  >
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </GlassCard>

        {/* Notifications */}
        <GlassCard>
          <CardHeader>
            <CardTitle className="text-xl font-semibold admin-text-primary flex items-center">
              <Bell className="h-6 w-6 mr-3 admin-accent" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className="p-4 admin-accent-secondary rounded-xl border admin-border-secondary hover:admin-accent-muted transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 ${notification.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <notification.icon className={`h-5 w-5 ${notification.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium admin-text-primary">{notification.title}</p>
                        <p className="text-xs admin-text-muted">{notification.time}</p>
                      </div>
                      <p className="text-xs admin-text-secondary leading-relaxed">{notification.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </GlassCard>
      </div>

      {/* Color Palette Demo */}
      <Card className="admin-bg-primary border admin-border-primary">
        <CardHeader className="border-b admin-border-secondary">
          <CardTitle className="admin-text-primary">Admin Theme Color Palette</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 admin-bg-primary border admin-border-primary rounded-lg mx-auto mb-2"></div>
              <p className="text-sm admin-text-primary font-medium">Primary Background</p>
              <p className="text-xs admin-text-muted">admin-bg-primary</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 admin-bg-secondary border admin-border-secondary rounded-lg mx-auto mb-2"></div>
              <p className="text-sm admin-text-primary font-medium">Secondary Background</p>
              <p className="text-xs admin-text-muted">admin-bg-secondary</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 admin-accent-secondary border admin-border-accent rounded-lg mx-auto mb-2"></div>
              <p className="text-sm admin-text-primary font-medium">Accent Background</p>
              <p className="text-xs admin-text-muted">admin-accent-secondary</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 admin-accent-bg border admin-border-accent rounded-lg mx-auto mb-2"></div>
              <p className="text-sm admin-text-primary font-medium">Primary Accent</p>
              <p className="text-xs admin-text-muted">admin-accent-bg</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Text Colors Demo */}
      <Card className="admin-bg-primary border admin-border-primary">
        <CardHeader className="border-b admin-border-secondary">
          <CardTitle className="admin-text-primary">Text Colors</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <p className="admin-text-primary text-lg">Primary Text - Main content</p>
          <p className="admin-text-secondary">Secondary Text - Supporting content</p>
          <p className="admin-text-muted text-sm">Muted Text - Less important content</p>
          <p className="admin-accent font-semibold">Accent Text - Highlighted content</p>
        </CardContent>
      </Card>
    </div>
  );
} 