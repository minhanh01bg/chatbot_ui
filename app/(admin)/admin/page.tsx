'use client';

import DashboardCards from '@/components/admin/DashboardCards';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ProductsList from '@/components/admin/products/ProductsList';
import { WelcomeBanner } from '@/components/welcome-banner';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useAdminTheme } from '@/contexts/AdminThemeContext';
import { 
  ArrowDown, 
  ArrowUp, 
  TrendingUp, 
  Users, 
  Activity, 
  MessageSquare, 
  FileText, 
  Globe, 
  Zap, 
  DollarSign, 
  BarChart3,
  Plus,
  Settings,
  Clock,
  Target,
  Sparkles,
  Shield,
  Rocket,
  Brain,
  Cpu,
  Eye,
  Heart,
  Award,
  ChevronRight,
  Calendar,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Info,
  Bell,
  HardDrive,
  Wifi
} from 'lucide-react';
import OverallDashboardStats from '@/components/admin/OverallDashboardStats';
import React from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { performLogout } from '@/lib/auth-utils';
import SiteDashboardStats from '@/components/admin/SiteDashboardStats';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { WelcomeMessage } from '@/components/admin/WelcomeMessage';
import { 
  GlassCard, 
  GradientButton, 
  StatsCard, 
  ActionCard 
} from '@/components/ui/templates';

export default function AdminDashboard() {
  const { user } = useCurrentUser();
  const { currentTheme, isDark } = useAdminTheme();
  const router = useRouter();
  const [sites, setSites] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await fetch('/api/sites?skip=0&limit=50');
        if (response.ok) {
          const data = await response.json();
          // Handle both array and object response formats
          const sitesArray = Array.isArray(data) ? data : (data.sites || []);
          setSites(sitesArray);
        } else {
          let message = response.statusText;
          try {
            const errorData = await response.json();
            const rawDetail = (errorData?.error ?? errorData?.detail) as any;
            if (Array.isArray(rawDetail)) {
              const firstMsg = rawDetail.find((d) => typeof d?.msg === 'string')?.msg;
              if (firstMsg) message = firstMsg;
            } else if (typeof rawDetail === 'string') {
              message = rawDetail;
            }
          } catch {}

          if (response.status === 401 && /expired|hết hạn|signature has expired/i.test(message)) {
            toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            await performLogout(router);
            return;
          }

          toast.error(message || 'Failed to fetch sites');
        }
      } catch (error) {
        console.error('Error fetching sites:', error);
        setSites([]);
        if (error instanceof Error) {
          toast.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, []);

  const siteKeys = Array.isArray(sites) ? sites.map(site => site.key || site._id) : [];
  const siteNames = Array.isArray(sites) ? sites.reduce((acc, site) => {
    acc[site.key || site._id] = site.name || site.key || site._id;
    return acc;
  }, {} as Record<string, string>) : {};

  // Mock data for demonstration
  const statsData = [
    {
      title: "Total Sites",
      value: "12",
      change: "+2",
      period: "this month",
      icon: Globe,
      gradient: "from-purple-600 to-blue-600"
    },
    {
      title: "Active Users",
      value: "2,847",
      change: "+12%",
      period: "from last week",
      icon: Users,
      gradient: "from-green-600 to-emerald-600"
    },
    {
      title: "Total Questions",
      value: "15,234",
      change: "+8%",
      period: "from yesterday",
      icon: MessageSquare,
      gradient: "from-orange-600 to-red-600"
    },
    {
      title: "Revenue",
      value: "$12,847",
      change: "+23%",
      period: "this month",
      icon: DollarSign,
      gradient: "from-indigo-600 to-purple-600"
    }
  ];

  const quickActions = [
    {
      title: "Site Management",
      description: "Manage your sites, configure settings, and monitor performance.",
      icon: Settings,
      color: "admin-accent",
      bgColor: "admin-accent-secondary",
      borderColor: "admin-border-accent",
      action: "Manage Sites"
    },
    {
      title: "Analytics",
      description: "View detailed analytics and performance metrics for your sites.",
      icon: BarChart3,
      color: "admin-accent",
      bgColor: "admin-accent-secondary",
      borderColor: "admin-border-accent",
      action: "View Analytics"
    },
    {
      title: "Performance",
      description: "Monitor system performance and optimize your chatbot experience.",
      icon: Target,
      color: "admin-accent",
      bgColor: "admin-accent-secondary",
      borderColor: "admin-border-accent",
      action: "Performance"
    }
  ];

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
      {/* Welcome Message */}
      <WelcomeMessage 
        userName={user?.name}
        stats={{
          totalUsers: 2847,
          totalSites: 12,
          growthRate: '+12%'
        }}
      />

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <GradientButton variant="outline" size="md">
            <Calendar className="h-4 w-4 mr-2" />
            Download Report
          </GradientButton>
          <GradientButton variant="primary" size="md">
            <Plus className="h-4 w-4 mr-2" />
            New Site
          </GradientButton>
        </div>
        
        <div className="flex items-center gap-2 text-sm admin-text-muted">
          <div className="w-2 h-2 admin-bg-status-success rounded-full animate-pulse"></div>
          <span>System Online</span>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            period={stat.period}
            icon={stat.icon}
            gradient={stat.gradient}
            delay={1 + index * 0.1}
          />
        ))}
      </motion.div>

      {/* Main Dashboard Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 admin-bg-glass backdrop-blur-xl border admin-border-primary">
            <TabsTrigger 
              value="overview"
              className="tabs-trigger"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="tabs-trigger"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {quickActions.map((action, index) => (
                <ActionCard
                  key={index}
                  title={action.title}
                  description={action.description}
                  icon={action.icon}
                  color={action.color}
                  bgColor={action.bgColor}
                  borderColor={action.borderColor}
                  action={action.action}
                  delay={1.8 + index * 0.1}
                />
              ))}
            </motion.div>

            {/* Recent Activity and Notifications Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2, duration: 0.8 }}
              className="grid gap-6 lg:grid-cols-2"
            >
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
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2.4 + index * 0.1, duration: 0.6 }}
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
                      </motion.div>
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
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2.4 + index * 0.1, duration: 0.6 }}
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
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </GlassCard>
            </motion.div>

            {/* System Status and Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.6, duration: 0.8 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
              {[
                {
                  title: "CPU Usage",
                  value: "68%",
                  status: "normal",
                  icon: Cpu,
                  color: "admin-accent",
                  bgColor: "admin-accent-secondary"
                },
                {
                  title: "Memory Usage",
                  value: "72%",
                  status: "warning",
                  icon: Brain,
                  color: "admin-accent",
                  bgColor: "admin-accent-secondary"
                },
                {
                  title: "Disk Space",
                  value: "45%",
                  status: "good",
                  icon: HardDrive,
                  color: "admin-accent",
                  bgColor: "admin-accent-secondary"
                },
                {
                  title: "Network",
                  value: "1.2GB/s",
                  status: "normal",
                  icon: Wifi,
                  color: "admin-accent",
                  bgColor: "admin-accent-secondary"
                }
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.8 + index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="group"
                >
                  <GlassCard>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <p className="admin-text-secondary text-sm font-medium">{metric.title}</p>
                          <p className="text-2xl font-bold admin-text-primary group-hover:admin-accent transition-colors">
                            {metric.value}
                          </p>
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${
                              metric.status === 'good' ? 'admin-bg-status-success' : 
                              metric.status === 'warning' ? 'admin-bg-status-warning' : 'admin-bg-status-info'
                            }`} />
                            <p className={`text-xs ${
                              metric.status === 'good' ? 'admin-status-success' : 
                              metric.status === 'warning' ? 'admin-status-warning' : 'admin-status-info'
                            }`}>
                              {metric.status === 'good' ? 'Good' : 
                               metric.status === 'warning' ? 'Warning' : 'Normal'}
                            </p>
                          </div>
                        </div>
                        <div className={`w-12 h-12 ${metric.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <metric.icon className={`w-6 h-6 ${metric.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-8">
            {/* Overall Dashboard Statistics with site selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <OverallDashboardStats siteKeys={[]} />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
} 