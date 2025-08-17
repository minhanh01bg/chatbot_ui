'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Globe, Settings, FileText, BarChart3, Users, MessageSquare, TrendingUp, Activity, Clock, Zap, DollarSign } from 'lucide-react';
import Link from 'next/link';
import SiteDashboardStats from '@/components/admin/SiteDashboardStats';

interface Site {
  _id: string;
  name: string;
  key: string;
  url?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export default function SiteDetailPage() {
  // Custom number formatting to avoid hydration issues
  const formatNumber = (num: number) => {
    const parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const params = useParams();
  const siteId = params.id as string;
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const response = await fetch(`/api/sites/${siteId}`);
        if (response.ok) {
          const data = await response.json();
          setSite(data);
        }
      } catch (error) {
        console.error('Error fetching site:', error);
      } finally {
        setLoading(false);
      }
    };

    if (siteId) {
      fetchSite();
    }
  }, [siteId]);

  // Fake data for site-specific stats
  const fakeSiteStats = {
    totalVisitors: 15420,
    uniqueVisitors: 8923,
    averageSessionDuration: 4.5,
    bounceRate: 23.5,
    conversionRate: 8.2,
    totalRevenue: 12540,
    monthlyGrowth: 15.3,
    topPages: [
      { page: '/home', views: 5420, conversion: 12.5 },
      { page: '/products', views: 3240, conversion: 8.7 },
      { page: '/about', views: 2150, conversion: 5.2 },
      { page: '/contact', views: 1890, conversion: 15.8 }
    ],
    recentActivity: [
      { action: 'New chat session', time: '2 minutes ago', user: 'user_123' },
      { action: 'Document uploaded', time: '5 minutes ago', user: 'admin' },
      { action: 'Question answered', time: '8 minutes ago', user: 'user_456' },
      { action: 'Payment processed', time: '12 minutes ago', user: 'user_789' },
      { action: 'Support ticket created', time: '15 minutes ago', user: 'user_101' }
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading site details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Site not found</h1>
          <Link href="/admin/sites">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sites
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/sites">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sites
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{site.name}</h1>
              <p className="text-gray-600">Site Key: {site.key}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-purple-600 border-purple-200">
              <Globe className="h-3 w-3 mr-1" />
              Active
            </Badge>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Site Dashboard Stats */}
            <SiteDashboardStats
              siteKey={site.key}
              siteName={site.name}
              rangeDays={7}
            />

            {/* Quick Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Total Visitors</p>
                      <p className="text-3xl font-bold">{formatNumber(fakeSiteStats.totalVisitors)}</p>
                      <p className="text-purple-200 text-sm">+{fakeSiteStats.monthlyGrowth}% from last month</p>
                    </div>
                    <Users className="w-12 h-12 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Revenue</p>
                      <p className="text-3xl font-bold">${formatNumber(fakeSiteStats.totalRevenue)}</p>
                      <p className="text-green-200 text-sm">+{fakeSiteStats.conversionRate}% conversion rate</p>
                    </div>
                    <DollarSign className="w-12 h-12 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Avg Session</p>
                      <p className="text-3xl font-bold">{fakeSiteStats.averageSessionDuration}m</p>
                      <p className="text-orange-200 text-sm">{fakeSiteStats.bounceRate}% bounce rate</p>
                    </div>
                    <Clock className="w-12 h-12 text-orange-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-100 text-sm font-medium">Performance</p>
                      <p className="text-3xl font-bold">98.5%</p>
                      <p className="text-indigo-200 text-sm">Uptime this month</p>
                    </div>
                    <Zap className="w-12 h-12 text-indigo-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Site Information and Recent Activity */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-white border border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Site Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Site Name</label>
                    <p className="text-gray-900">{site.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Site Key</label>
                    <p className="text-gray-900 font-mono">{site.key}</p>
                  </div>
                  {site.url && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">URL</label>
                      <p className="text-gray-900">{site.url}</p>
                    </div>
                  )}
                  {site.description && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Description</label>
                      <p className="text-gray-900">{site.description}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Created</label>
                    <p className="text-gray-900">
                      {new Date(site.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Last Updated</label>
                    <p className="text-gray-900">
                      {new Date(site.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fakeSiteStats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time} • {activity.user}</p>
                      </div>
                      <Activity className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Top Pages Performance */}
            <Card className="bg-white border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Top Pages Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fakeSiteStats.topPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{page.page}</p>
                          <p className="text-xs text-gray-500">{formatNumber(page.views)} views</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{page.conversion}%</p>
                        <p className="text-xs text-gray-500">conversion</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-white border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Detailed Analytics</CardTitle>
                <CardDescription className="text-gray-600">
                  Comprehensive analytics and insights for {site.name}.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[400px] flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-gray-100">
                  <div className="text-center">
                    <TrendingUp className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Analytics Dashboard</p>
                    <p className="text-sm text-gray-500">Detailed analytics will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card className="bg-white border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Documents Management</CardTitle>
                <CardDescription className="text-gray-600">
                  Manage documents and knowledge base for {site.name}.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Documents</p>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="text-sm font-medium text-gray-900">2 hours ago</p>
                  </div>
                </div>
                <Link href={`/admin/sites/${siteId}/documents`}>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                    <FileText className="h-4 w-4 mr-2" />
                    Manage Documents
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Site Settings</CardTitle>
                <CardDescription className="text-gray-600">
                  Configure settings and preferences for {site.name}.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="site-name" className="text-sm font-medium text-gray-600">Site Name</label>
                    <input 
                      id="site-name"
                      type="text" 
                      defaultValue={site.name}
                      placeholder="Enter site name"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="site-url" className="text-sm font-medium text-gray-600">Site URL</label>
                    <input 
                      id="site-url"
                      type="url" 
                      defaultValue={site.url || ''}
                      placeholder="https://example.com"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="site-description" className="text-sm font-medium text-gray-600">Description</label>
                    <textarea 
                      id="site-description"
                      defaultValue={site.description || ''}
                      placeholder="Enter site description"
                      rows={3}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                    Save Changes
                  </Button>
                  <Button variant="outline">
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 