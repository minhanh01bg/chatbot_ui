'use client';

import DashboardCards from '@/components/admin/DashboardCards';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ProductsList from '@/components/admin/products/ProductsList';
import { WelcomeBanner } from '@/components/welcome-banner';
import { useCurrentUser } from '@/hooks/use-current-user';
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
  Target
} from 'lucide-react';
import OverallDashboardStats from '@/components/admin/OverallDashboardStats';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { performLogout } from '@/lib/auth-utils';
import SiteDashboardStats from '@/components/admin/SiteDashboardStats';

import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const { user } = useCurrentUser();
  const router = useRouter();
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  // Fake data for dashboard
  const fakeStats = {
    totalUsers: 1247,
    totalSites: sites.length,
    totalQuestions: 15420,
    totalSessions: 8923,
    totalRevenue: 45231,
    activeChats: 234,
    documentsProcessed: 567,
    averageResponseTime: 1.2,
    userGrowth: 12.5,
    revenueGrowth: 8.2,
    sessionGrowth: 15.3,
    documentGrowth: 23.1
  };

  const siteKeys = Array.isArray(sites) ? sites.map(site => site.key || site._id) : [];
  const siteNames = Array.isArray(sites) ? sites.reduce((acc, site) => {
    acc[site.key || site._id] = site.name || site.key || site._id;
    return acc;
  }, {} as Record<string, string>) : {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {user && (
        <WelcomeBanner 
          userName={user.name} 
          userEmail={user.email} 
        />
      )}
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{user?.name || 'Admin'}</span>
            </h1>
            <p className="text-gray-600">Here's what's happening with your platform today.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-gray-300 hover:border-purple-600 hover:text-purple-600">
              Download Report
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              New Site
            </Button>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Fake UI for main dashboard */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Total Sites</p>
                      <p className="text-3xl font-bold">12</p>
                      <p className="text-purple-200 text-sm">+2 this month</p>
                    </div>
                    <Globe className="w-12 h-12 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Active Users</p>
                      <p className="text-3xl font-bold">2,847</p>
                      <p className="text-green-200 text-sm">+12% from last week</p>
                    </div>
                    <Users className="w-12 h-12 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Total Questions</p>
                      <p className="text-3xl font-bold">15,234</p>
                      <p className="text-orange-200 text-sm">+8% from yesterday</p>
                    </div>
                    <MessageSquare className="w-12 h-12 text-orange-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-100 text-sm font-medium">Revenue</p>
                      <p className="text-3xl font-bold">$12,847</p>
                      <p className="text-indigo-200 text-sm">+23% this month</p>
                    </div>
                    <DollarSign className="w-12 h-12 text-indigo-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-purple-600" />
                    Site Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Manage your sites, configure settings, and monitor performance.</p>
                  <Button variant="outline" className="w-full">
                    Manage Sites
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                    Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">View detailed analytics and performance metrics for your sites.</p>
                  <Button variant="outline" className="w-full">
                    View Analytics
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-blue-600" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Monitor system performance and optimize your chatbot experience.</p>
                  <Button variant="outline" className="w-full">
                    Performance
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">New site "TechSupport" created</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">Site</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Updated chatbot configuration</p>
                        <p className="text-xs text-gray-500">4 hours ago</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">Config</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Performance alert resolved</p>
                        <p className="text-xs text-gray-500">6 hours ago</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">Alert</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Overall Dashboard Statistics with site selector */}
            <OverallDashboardStats siteKeys={[]} />
            
            {/* Individual Site Dashboard with dropdown */}
            {/* <SiteDashboardStats /> */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 