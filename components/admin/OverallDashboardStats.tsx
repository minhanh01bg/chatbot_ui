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
  Globe
} from 'lucide-react';
import { DashboardStats } from '@/services/dashboard.service';
import { useCurrentUser } from '@/hooks/use-current-user';

interface OverallDashboardStatsProps {
  siteKeys: string[];
  siteNames?: Record<string, string>;
}

export default function OverallDashboardStats({ siteKeys, siteNames = {} }: OverallDashboardStatsProps) {
  const { user } = useCurrentUser();
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
    console.log('=== FETCH SITES CALLED ===');
    console.log('fetchSites called');
    try {
      const response = await fetch('/api/sites?skip=0&limit=50');
      console.log('Sites API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Sites API response data:', data);
        
        const sitesArray = Array.isArray(data) ? data : (data.sites || []);
        console.log('Processed sites array:', sitesArray);
        console.log('First site structure:', sitesArray[0]);
        console.log('First site keys:', Object.keys(sitesArray[0] || {}));
        
        console.log('Setting sites array:', sitesArray.length, 'sites');
        setSites(sitesArray);
        
        // Don't set selectedSite here, let the useEffect handle it
        console.log('Sites loaded, selectedSite will be set by useEffect');
      } else {
        console.error('Sites API failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching sites:', error);
    }
  };

  useEffect(() => {
    console.log('=== COMPONENT MOUNTED ===');
    console.log('Component mounted, fetching sites');
    fetchSites();
  }, []);

  const fetchStats = async () => {
    console.log('=== FETCH STATS CALLED ===');
    console.log('fetchStats called with:', { selectedSite, sites: sites.length });
    
    if (!selectedSite) {
      console.log('No selectedSite, returning early');
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

      console.log('Fetching dashboard stats for site:', selectedSite);
      console.log('Using chat token:', selectedSiteData.chat_token);
      console.log('Range days:', rangeDays);

      // Call dashboard API with site's chat_token
      const apiUrl = `/api/dashboard?rangeDays=${rangeDays}`;
      console.log('Making API call to:', apiUrl);
      console.log('Request body:', { site_key: selectedSite });
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${selectedSiteData.chat_token}`,
        },
        body: JSON.stringify({ site_key: selectedSite }),
      });
      
      console.log('API response status:', response.status);
      console.log('API response headers:', Object.fromEntries(response.headers.entries()));

      console.log('Dashboard API response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Dashboard API response data:', data);
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

  // Effect to fetch stats when selectedSite, rangeDays, or sites change
  useEffect(() => {
    console.log('=== MAIN USE EFFECT ===');
    console.log('OverallDashboardStats useEffect triggered:', {
      selectedSite,
      hasUser: !!user,
      user: user,
      rangeDays,
      sitesLoaded: sites.length > 0
    });
    
    if (selectedSite && sites.length > 0) {
      console.log('Conditions met, calling fetchStats');
      fetchStats();
    } else {
      console.log('Conditions not met:', { selectedSite: !!selectedSite, sitesLength: sites.length });
    }
  }, [selectedSite, rangeDays, sites]);

  // Effect to ensure selectedSite is set when sites are loaded
  useEffect(() => {
    console.log('=== SITES LOADED EFFECT ===');
    console.log('Sites changed:', sites.length, 'sites');
    console.log('Current selectedSite:', selectedSite);
    
    if (sites.length > 0) {
      if (!selectedSite) {
        const firstSite = getSiteKey(sites[0]);
        console.log('Sites loaded but no selectedSite, setting to first site:', firstSite);
        setSelectedSite(firstSite);
      } else {
        console.log('Sites loaded and selectedSite already set:', selectedSite);
      }
    } else {
      console.log('No sites available');
    }
  }, [sites]);

  // Effect to handle manual site selection from dropdown
  useEffect(() => {
    console.log('=== SITE SELECTION EFFECT ===');
    console.log('Site selection changed:', selectedSite);
    console.log('Current sites length:', sites.length);
         console.log('Current sites:', sites.map(s => ({ key: getSiteKey(s), name: s.name })));
    
    if (selectedSite && sites.length > 0) {
      console.log('Manual site selection detected, calling fetchStats');
      fetchStats();
    } else {
      console.log('Conditions not met for fetchStats:', { 
        hasSelectedSite: !!selectedSite, 
        sitesLength: sites.length 
      });
    }
  }, [selectedSite]);

  // Effect to handle rangeDays changes
  useEffect(() => {
    console.log('=== RANGE DAYS EFFECT ===');
    console.log('Range days changed to:', rangeDays);
    if (selectedSite && sites.length > 0) {
      console.log('Range days change detected, calling fetchStats');
      fetchStats();
    }
  }, [rangeDays]);

  // Effect to debug selectedSite changes
  useEffect(() => {
    console.log('=== SELECTED SITE DEBUG ===');
    console.log('selectedSite changed to:', selectedSite);
    console.log('Type of selectedSite:', typeof selectedSite);
    console.log('selectedSite is empty string:', selectedSite === '');
    console.log('selectedSite is undefined:', selectedSite === undefined);
  }, [selectedSite]);

  // Effect to force set selectedSite when sites are loaded
  useEffect(() => {
    console.log('=== FORCE SET SELECTED SITE ===');
    console.log('Sites length:', sites.length);
    console.log('Current selectedSite:', selectedSite);
    console.log('First site data:', sites[0]);
    console.log('First site keys:', Object.keys(sites[0] || {}));
    
    if (sites.length > 0 && (!selectedSite || selectedSite === '')) {
      const firstSite = sites[0];
      console.log('First site object:', firstSite);
      
                    const selectedKey = getSiteKey(firstSite);
       if (selectedKey) {
         console.log('Force setting selectedSite to:', selectedKey);
         setSelectedSite(selectedKey);
       } else {
         console.log('No valid key found in first site:', firstSite);
       }
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
      <Card className="bg-white border border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Overall Dashboard Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-gray-600">
            <Globe className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No sites available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show loading state while fetching sites or stats
  if (loading) {
    return (
      <Card className="bg-white border border-gray-200 shadow-lg">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Overall Dashboard Statistics
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedSite} onValueChange={(value) => {
                console.log('Selected site changed from', selectedSite, 'to', value);
                setSelectedSite(value);
              }}>
                <SelectTrigger className="w-48">
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
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
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
              <p className="text-gray-600">Loading overall statistics...</p>
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
              Overall Dashboard Statistics
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedSite} onValueChange={(value) => {
                console.log('Selected site changed from', selectedSite, 'to', value);
                setSelectedSite(value);
              }}>
                <SelectTrigger className="w-48">
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

  return (
    <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Overall Dashboard Statistics
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedSite} onValueChange={(value) => {
              console.log('Selected site changed from', selectedSite, 'to', value);
              setSelectedSite(value);
            }}>
              <SelectTrigger className="w-48">
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
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" onClick={fetchStats}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Questions */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <Badge className="text-xs text-purple-600 bg-purple-50 border-purple-200">
                <BarChart3 className="h-3 w-3 mr-1" />
                Total
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(totals.total_questions)}
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
              {formatNumber(totals.total_sessions)}
            </div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </div>

          {/* Average Satisfaction */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-100">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
              <Badge className="text-xs text-yellow-600 bg-yellow-50 border-yellow-200">
                Average
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {averageSatisfaction.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Avg Satisfaction</div>
          </div>

          {/* Total Cost */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-4 border border-red-100">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-red-600" />
              <Badge className="text-xs text-red-600 bg-red-50 border-red-200">
                Total
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(totals.total_cost)}
            </div>
            <div className="text-sm text-gray-600">Total Cost</div>
          </div>
        </div>

        {/* Individual Site Stats */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Site Performance</h3>
          
          {Object.entries(stats).map(([siteKey, stat]) => (
            <div key={siteKey} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-900">
                    {siteNames[siteKey] || siteKey}
                  </h4>
                  <p className="text-sm text-gray-600">Site Performance Overview</p>
                </div>
                <Badge className={`text-sm ${getDirectionColor(stat.direction)}`}>
                  {getDirectionIcon(stat.direction)}
                  <span className="ml-1">{stat.percent_change}%</span>
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                    <span className="text-xs text-gray-500">Questions</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {formatNumber(stat.total_questions)}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-gray-500">Sessions</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {formatNumber(stat.total_sessions)}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="h-4 w-4 text-yellow-600" />
                    <span className="text-xs text-gray-500">Satisfaction</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {stat.percent_good.toFixed(1)}%
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="h-4 w-4 text-red-600" />
                    <span className="text-xs text-gray-500">Cost</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {formatCurrency(stat.total_cost)}
                  </div>
                </div>
              </div>
              
              {/* Additional Stats */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">Total Tokens</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatNumber(stat.total_tokens)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Change</div>
                      <div className={`text-sm font-medium ${
                        stat.tokens_change > 0 ? 'text-green-600' : 
                        stat.tokens_change < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {stat.tokens_change > 0 ? '+' : ''}{formatNumber(stat.tokens_change)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">Performance</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {stat.direction === 'increase' ? 'Improving' : 
                         stat.direction === 'decrease' ? 'Declining' : 'Stable'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Trend</div>
                      <div className="text-sm font-medium text-gray-600">
                        {stat.percent_change > 0 ? '+' : ''}{stat.percent_change}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 