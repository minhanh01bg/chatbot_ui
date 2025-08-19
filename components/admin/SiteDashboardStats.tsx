'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  MessageSquare, 
  Users, 
  DollarSign, 
  Activity,
  RefreshCw,
  Globe
} from 'lucide-react';
import { DashboardStats } from '@/services/dashboard.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { performLogout } from '@/lib/auth-utils';
import { useCurrentUser } from '@/hooks/use-current-user';

interface SiteDashboardStatsProps {
  siteKey?: string;
  siteName?: string;
  rangeDays?: number;
}

export default function SiteDashboardStats({ siteKey, siteName, rangeDays = 7 }: SiteDashboardStatsProps) {
  const { user } = useCurrentUser();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<string>(siteKey || '');
  const [sites, setSites] = useState<any[]>([]);
  const [showSiteSelector, setShowSiteSelector] = useState<boolean>(!siteKey);
  const [currentRangeDays, setCurrentRangeDays] = useState<number>(rangeDays);

  // Fetch sites with their tokens
  const fetchSites = async () => {
    try {
      const response = await fetch('/api/sites?skip=0&limit=50');
      if (response.ok) {
        const data = await response.json();
        const sitesArray = Array.isArray(data) ? data : (data.sites || []);
        setSites(sitesArray);
        if (sitesArray.length > 0 && !selectedSite) {
          setSelectedSite(sitesArray[0].key || sitesArray[0]._id);
        }
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
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (showSiteSelector) {
      fetchSites();
    }
  }, [showSiteSelector]);

  // Update currentRangeDays when rangeDays prop changes
  useEffect(() => {
    setCurrentRangeDays(rangeDays);
  }, [rangeDays]);

  // Fetch stats when selectedSite or currentRangeDays changes
  useEffect(() => {
    if (selectedSite) {
      fetchStats();
    }
  }, [selectedSite, currentRangeDays]);

  const fetchStats = async () => {
    if (!selectedSite) return;

    try {
      setLoading(true);
      setError(null);
      
      let siteData;
      
      if (siteKey) {
        // If siteKey is provided, use it directly
        siteData = { key: siteKey, name: siteName };
      } else {
        // Find the selected site to get its chat_token
        siteData = sites.find(site => (site.key || site._id) === selectedSite);
        if (!siteData?.chat_token) {
          setError('No chat token available for selected site');
          return;
        }
      }

      const response = await fetch(`/api/dashboard?rangeDays=${currentRangeDays}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${siteData.chat_token}`,
        },
        body: JSON.stringify({ site_key: selectedSite }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSite && user) {
      fetchStats();
    }
  }, [selectedSite, rangeDays, user]);

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-emerald-400" />;
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case 'increase':
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'decrease':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const formatCurrency = (amount: number) => {
    // Use consistent formatting to avoid hydration issues
    return `$${amount.toFixed(2)}`;
  };

  const formatNumber = (num: number) => {
    // Use consistent formatting to avoid hydration issues
    // Custom implementation that doesn't rely on locale
    const parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  // If we have a specific siteKey, show that site's stats
  if (siteKey && !showSiteSelector) {
    if (loading) {
      return (
        <Card className="bg-gradient-to-br from-white/95 via-purple-50/95 to-white/95 backdrop-blur-xl border border-purple-200/30 shadow-2xl">
          <CardHeader className="border-b border-purple-500/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-white">
                {siteName || siteKey} - Dashboard Stats
              </CardTitle>
              <Button variant="ghost" size="sm" disabled className="text-white hover:bg-purple-500/20">
                <RefreshCw className="h-4 w-4 animate-spin" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin text-purple-400 mx-auto mb-2" />
                <p className="text-gray-600">Loading statistics...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (error) {
      return (
        <Card className="bg-gradient-to-br from-white/95 via-purple-50/95 to-white/95 backdrop-blur-xl border border-purple-200/30 shadow-2xl">
          <CardHeader className="border-b border-purple-500/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-white">
                {siteName || siteKey} - Dashboard Stats
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={fetchStats} className="text-white hover:bg-purple-500/20">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center text-red-400">
              <p className="mb-2">Error loading statistics</p>
                              <p className="text-sm text-gray-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!stats) {
      return null;
    }

    return (
      <Card className="admin-bg-primary border admin-border-primary shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="border-b admin-border-secondary">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold admin-text-primary">
              {siteName || siteKey} - Dashboard Stats
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {rangeDays} days
              </Badge>
              <Button variant="ghost" size="sm" onClick={fetchStats}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Questions */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                <Badge className={`text-xs ${getDirectionColor(stats.direction)}`}>
                  {getDirectionIcon(stats.direction)}
                  <span className="ml-1">{stats.percent_change}%</span>
                </Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatNumber(stats.total_questions)}
              </div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>

            {/* Total Sessions */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-5 w-5 text-green-600" />
                <Badge className="text-xs text-green-600 bg-green-50 border-green-200">
                  <Activity className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatNumber(stats.total_sessions)}
              </div>
              <div className="text-sm text-gray-600">Total Sessions</div>
            </div>

            {/* Satisfaction Rate */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-100">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
                <Badge className="text-xs text-yellow-600 bg-yellow-50 border-yellow-200">
                  Quality
                </Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.percent_good.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>

            {/* Total Cost */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-4 border border-red-100">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="h-5 w-5 text-red-600" />
                <Badge className={`text-xs ${getDirectionColor(stats.direction)}`}>
                  {getDirectionIcon(stats.direction)}
                  <span className="ml-1">{stats.cost_change > 0 ? '+' : ''}{formatCurrency(stats.cost_change)}</span>
                </Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.total_cost)}
              </div>
              <div className="text-sm text-gray-600">Total Cost</div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Total Tokens</div>
                  <div className="text-xl font-semibold text-gray-900">
                    {formatNumber(stats.total_tokens)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Change</div>
                  <div className={`text-sm font-medium ${
                    stats.tokens_change > 0 ? 'text-green-600' : 
                    stats.tokens_change < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stats.tokens_change > 0 ? '+' : ''}{formatNumber(stats.tokens_change)}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Performance</div>
                  <div className="text-xl font-semibold text-gray-900">
                    {stats.direction === 'increase' ? 'Improving' : 
                     stats.direction === 'decrease' ? 'Declining' : 'Stable'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Trend</div>
                  <div className="text-sm font-medium text-gray-600">
                    {stats.percent_change > 0 ? '+' : ''}{stats.percent_change}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If no siteKey provided, show site selector
  if (sites.length === 0) {
    return (
      <Card className="bg-white border border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Site Dashboard Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-gray-600">
            <Globe className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <p>No sites available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!selectedSite) {
    return (
      <Card className="bg-white border border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Site Dashboard Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-gray-600">
            <Globe className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <p>Please select a site to view statistics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-white border border-gray-200 shadow-lg">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Site Dashboard Statistics
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedSite} onValueChange={setSelectedSite}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.key || site._id} value={site.key || site._id}>
                      {site.name || site.key || site._id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" disabled>
                <RefreshCw className="h-4 w-4 animate-spin" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-2" />
              <p className="text-gray-600">Loading statistics...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white border border-gray-200 shadow-lg">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Site Dashboard Statistics
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedSite} onValueChange={setSelectedSite}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.key || site._id} value={site.key || site._id}>
                      {site.name || site.key || site._id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" onClick={fetchStats}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p className="mb-2">Error loading statistics</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  const selectedSiteData = sites.find(site => (site.key || site._id) === selectedSite);
  const currentSiteName = selectedSiteData?.name || selectedSiteData?.key || selectedSite;

  return (
    <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Site Dashboard Statistics
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedSite} onValueChange={setSelectedSite}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sites.map((site) => (
                  <SelectItem key={site.key || site._id} value={site.key || site._id}>
                    {site.name || site.key || site._id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="outline" className="text-xs">
              {rangeDays} days
            </Badge>
            <Button variant="ghost" size="sm" onClick={fetchStats}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">
            {currentSiteName} - Performance Overview
          </h3>
                          <p className="text-sm text-gray-600">
            Statistics for the selected site over the last {rangeDays} days
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Questions */}
          <div className="bg-gradient-to-br from-white/95 via-purple-50/95 to-white/95 backdrop-blur-xl border border-purple-200/30 rounded-lg p-4 shadow-lg hover:shadow-purple-200/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="h-5 w-5 text-purple-400" />
              <Badge className={`text-xs ${getDirectionColor(stats.direction)}`}>
                {getDirectionIcon(stats.direction)}
                <span className="ml-1">{stats.percent_change}%</span>
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white">
              {formatNumber(stats.total_questions)}
            </div>
                            <div className="text-sm text-gray-600">Total Questions</div>
          </div>

          {/* Total Sessions */}
          <div className="bg-gradient-to-br from-white/95 via-purple-50/95 to-white/95 backdrop-blur-xl border border-purple-200/30 rounded-lg p-4 shadow-lg hover:shadow-purple-200/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-emerald-400" />
              <Badge className="text-xs text-emerald-300 bg-emerald-500/20 border-emerald-500/30">
                <Activity className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white">
              {formatNumber(stats.total_sessions)}
            </div>
                            <div className="text-sm text-gray-600">Total Sessions</div>
          </div>

          {/* Satisfaction Rate */}
          <div className="bg-gradient-to-br from-white/95 via-purple-50/95 to-white/95 backdrop-blur-xl border border-purple-200/30 rounded-lg p-4 shadow-lg hover:shadow-purple-200/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-yellow-400" />
              <Badge className="text-xs text-yellow-300 bg-yellow-500/20 border-yellow-500/30">
                Quality
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white">
              {stats.percent_good.toFixed(1)}%
            </div>
                            <div className="text-sm text-gray-600">Satisfaction Rate</div>
          </div>

          {/* Total Cost */}
          <div className="bg-gradient-to-br from-white/95 via-purple-50/95 to-white/95 backdrop-blur-xl border border-purple-200/30 rounded-lg p-4 shadow-lg hover:shadow-purple-200/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-red-400" />
              <Badge className={`text-xs ${getDirectionColor(stats.direction)}`}>
                {getDirectionIcon(stats.direction)}
                <span className="ml-1">{stats.cost_change > 0 ? '+' : ''}{formatCurrency(stats.cost_change)}</span>
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(stats.total_cost)}
            </div>
                            <div className="text-sm text-gray-600">Total Cost</div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-white/95 via-purple-50/95 to-white/95 backdrop-blur-xl border border-purple-200/30 rounded-lg p-4 shadow-lg hover:shadow-purple-200/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Total Tokens</div>
                <div className="text-xl font-semibold text-white">
                  {formatNumber(stats.total_tokens)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Change</div>
                <div className={`text-sm font-medium ${
                  stats.tokens_change > 0 ? 'text-emerald-400' : 
                  stats.tokens_change < 0 ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {stats.tokens_change > 0 ? '+' : ''}{formatNumber(stats.tokens_change)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Performance</div>
                <div className="text-xl font-semibold text-gray-900">
                  {stats.direction === 'increase' ? 'Improving' : 
                   stats.direction === 'decrease' ? 'Declining' : 'Stable'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Trend</div>
                <div className="text-sm font-medium text-gray-600">
                  {stats.percent_change > 0 ? '+' : ''}{stats.percent_change}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 