'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  MessageSquare, 
  Users, 
  DollarSign, 
  Activity,
  RefreshCw,
  BarChart3,
  Globe,
  Sparkles,
  Zap,
  Shield,
  Bot
} from 'lucide-react';
import { DashboardStats } from '@/services/dashboard.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { performLogout } from '@/lib/auth-utils';
import { useCurrentUser } from '@/hooks/use-current-user';

interface OverallDashboardStatsProps {
  siteKeys: string[];
  siteNames?: Record<string, string>;
}

export default function OverallDashboardStats({ siteKeys, siteNames = {} }: OverallDashboardStatsProps) {
  // const { user } = useCurrentUser();
  const router = useRouter();
  const [stats, setStats] = useState<Record<string, DashboardStats>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rangeDays, setRangeDays] = useState<number>(7);
  const [selectedSite, setSelectedSite] = useState<string>('');
  const [sites, setSites] = useState<any[]>([]);

  // Helper function to get site key
  const getSiteKey = (site: any) => {
    return site.id || site.key || site._id;
  };

  // Helper function to get site display name
  const getSiteDisplayName = (site: any) => {
    return site.name || getSiteKey(site);
  };

  // Fetch sites with their tokens
  const fetchSites = async () => {
    try {
      const response = await fetch('/api/sites?skip=0&limit=50');
      if (response.ok) {
        const data = await response.json();
        const sitesArray = Array.isArray(data) ? data : (data.sites || []);
        setSites(sitesArray);
      } else {
        console.error('Sites API failed:', response.status, response.statusText);
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
    fetchSites();
  }, []);

  const fetchStats = async () => {
    if (!selectedSite) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
             // Find the selected site to get its chat_token
       const selectedSiteData = sites.find(site => getSiteKey(site) === selectedSite);
      console.log('Selected site data:', selectedSiteData);
             console.log('Available sites:', sites.map(site => ({
         key: getSiteKey(site),
         name: site.name,
         hasToken: !!site.chat_token,
         allKeys: Object.keys(site)
       })));
      
      if (!selectedSiteData?.chat_token) {
        console.log('No chat token available for selected site');
        setError('No chat token available for selected site');
        return;
      }


      // Call dashboard API with site's chat_token
      const apiUrl = `/api/dashboard?rangeDays=${rangeDays}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${selectedSiteData.chat_token}`,
        },
        body: JSON.stringify({ site_key: selectedSite }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats({
          [selectedSite]: data
        });
      } else {
        console.error(`Failed to fetch stats:`, response.statusText);
        const errorData = await response.json().catch(() => ({}));
        console.error('Error details:', errorData);
        
        // Provide default stats for failed requests
        const defaultStats: DashboardStats = {
          total_questions: 0,
          total_sessions: 0,
          percent_good: 0,
          percent_change: 0,
          direction: 'no_change',
          total_tokens: 0,
          total_cost: 0,
          cost_change: 0,
          tokens_change: 0,
        };
        
        setStats({
          [selectedSite]: defaultStats
        });
        
        setError(`Failed to fetch stats: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats when selectedSite or rangeDays change
  useEffect(() => {
    const shouldFetch = selectedSite && sites.length > 0;

    console.log('=== FETCH STATS EFFECT ===');
    console.log('Triggered with:', { selectedSite, rangeDays, sitesLength: sites.length });

    if (shouldFetch) {
      fetchStats();
    } else {
      console.log('Conditions not met:', { hasSelectedSite: !!selectedSite, sitesLength: sites.length });
    }
  }, [selectedSite, rangeDays]);

  useEffect(() => {
    if (sites.length > 0 && (!selectedSite || selectedSite === '')) {
      const firstSite = sites[0];
      const selectedKey = getSiteKey(firstSite);
      selectedKey && setSelectedSite(selectedKey);
    }
  }, [sites]);

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case 'increase':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'decrease':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Calculate totals
  const totals = Object.values(stats).reduce(
    (acc, stat) => ({
      total_questions: acc.total_questions + stat.total_questions,
      total_sessions: acc.total_sessions + stat.total_sessions,
      total_tokens: acc.total_tokens + stat.total_tokens,
      total_cost: acc.total_cost + stat.total_cost,
      percent_good: acc.percent_good + stat.percent_good,
      count: acc.count + 1,
    }),
    { total_questions: 0, total_sessions: 0, total_tokens: 0, total_cost: 0, percent_good: 0, count: 0 }
  );

  const averageSatisfaction = totals.count > 0 ? totals.percent_good / totals.count : 0;

  if (sites.length === 0) {
    return (
      <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Globe className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Sites Available</h3>
          <p className="text-gray-600">Create your first site to start tracking analytics</p>
        </div>
      </div>
    );
  }

  // Show loading state while fetching sites or stats
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-2xl shadow-xl border border-gray-200">
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Analytics</h2>
                <p className="text-gray-600">Real-time performance insights</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedSite} onValueChange={(value) => {
                console.log('Selected site changed from', selectedSite, 'to', value);
                setSelectedSite(value);
              }}>
                <SelectTrigger className="w-48 bg-white border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={getSiteKey(site)} value={getSiteKey(site)}>
                      {getSiteDisplayName(site)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={rangeDays.toString()} onValueChange={(value) => {
                console.log('Range days changed from', rangeDays, 'to', value);
                setRangeDays(parseInt(value));
              }}>
                <SelectTrigger className="w-24 bg-white border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" disabled className="bg-white">
                <RefreshCw className="h-4 w-4 animate-spin" />
              </Button>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="h-8 w-8 animate-spin text-white" />
              </div>
              <p className="text-gray-600 font-medium">Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-2xl shadow-xl border border-gray-200">
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Analytics</h2>
                <p className="text-gray-600">Real-time performance insights</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedSite} onValueChange={(value) => {
                console.log('Selected site changed from', selectedSite, 'to', value);
                setSelectedSite(value);
              }}>
                <SelectTrigger className="w-48 bg-white border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={getSiteKey(site)} value={getSiteKey(site)}>
                      {getSiteDisplayName(site)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" onClick={fetchStats} className="bg-white">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Analytics</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-500">
      {/* Header */}
      <div className="p-8 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard Analytics</h2>
              <p className="text-gray-600">Real-time performance insights</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedSite} onValueChange={(value) => {
              console.log('Selected site changed from', selectedSite, 'to', value);
              setSelectedSite(value);
            }}>
              <SelectTrigger className="w-48 bg-white border-gray-200 shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sites.map((site) => (
                  <SelectItem key={getSiteKey(site)} value={getSiteKey(site)}>
                    {getSiteDisplayName(site)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={rangeDays.toString()} onValueChange={(value) => {
              console.log('Range days changed from', rangeDays, 'to', value);
              setRangeDays(parseInt(value));
            }}>
              <SelectTrigger className="w-24 bg-white border-gray-200 shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={fetchStats}
              className="bg-white hover:bg-gray-50 shadow-sm"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Overall Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Questions */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg flex items-center justify-center shadow-md">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <Badge className="text-xs bg-purple-50 text-purple-600 border-purple-200">
                <Sparkles className="h-3 w-3 mr-1" />
                Total
              </Badge>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatNumber(totals.total_questions)}
            </div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </div>

          {/* Total Sessions */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg flex items-center justify-center shadow-md">
                <Users className="h-6 w-6 text-white" />
              </div>
              <Badge className="text-xs bg-green-50 text-green-600 border-green-200">
                <Activity className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatNumber(totals.total_sessions)}
            </div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </div>

          {/* Average Satisfaction */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center shadow-md">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <Badge className="text-xs bg-yellow-50 text-yellow-600 border-yellow-200">
                Average
              </Badge>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {averageSatisfaction.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Avg Satisfaction</div>
          </div>

          {/* Total Cost */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-400 rounded-lg flex items-center justify-center shadow-md">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <Badge className="text-xs bg-red-50 text-red-600 border-red-200">
                Total
              </Badge>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatCurrency(totals.total_cost)}
            </div>
            <div className="text-sm text-gray-600">Total Cost</div>
          </div>
        </div>

        {/* Individual Site Performance */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Site Performance</h3>
          </div>
          
          {Object.entries(stats).map(([siteKey, stat]) => (
            <div key={siteKey} className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-1">
                    {siteNames[siteKey] || siteKey}
                  </h4>
                  <p className="text-gray-600">Performance Overview</p>
                </div>
                <Badge className={`text-sm px-4 py-2 ${getDirectionColor(stat.direction)}`}>
                  {getDirectionIcon(stat.direction)}
                  <span className="ml-2 font-semibold">{stat.percent_change}%</span>
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    <span className="text-xs text-purple-600 font-medium">Questions</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatNumber(stat.total_questions)}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">Sessions</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatNumber(stat.total_sessions)}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
                  <div className="flex items-center justify-between mb-3">
                    <TrendingUp className="h-5 w-5 text-yellow-600" />
                    <span className="text-xs text-yellow-600 font-medium">Satisfaction</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.percent_good.toFixed(1)}%
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-6 border border-red-200">
                  <div className="flex items-center justify-between mb-3">
                    <DollarSign className="h-5 w-5 text-red-600" />
                    <span className="text-xs text-red-600 font-medium">Cost</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stat.total_cost)}
                  </div>
                </div>
              </div>
              
              {/* Additional Metrics */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Total Tokens</div>
                      <div className="text-xl font-bold text-gray-900">
                        {formatNumber(stat.total_tokens)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">Change</div>
                      <div className={`text-sm font-semibold ${
                        stat.tokens_change > 0 ? 'text-green-600' : 
                        stat.tokens_change < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {stat.tokens_change > 0 ? '+' : ''}{formatNumber(stat.tokens_change)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-6 border border-cyan-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Performance</div>
                      <div className="text-xl font-bold text-gray-900">
                        {stat.direction === 'increase' ? 'Improving' : 
                         stat.direction === 'decrease' ? 'Declining' : 'Stable'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">Trend</div>
                      <div className="text-sm font-semibold text-gray-600">
                        {stat.percent_change > 0 ? '+' : ''}{stat.percent_change}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 