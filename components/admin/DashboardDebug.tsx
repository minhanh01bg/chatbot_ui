'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DashboardDebug() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
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

  const testDropdown = async () => {
    setLoading(true);
    try {
      console.log('Testing dropdown functionality...');
      
      // Fetch sites first
      const response = await fetch('/api/sites?skip=0&limit=50');
      if (response.ok) {
        const data = await response.json();
        const sitesArray = Array.isArray(data) ? data : (data.sites || []);
        setSites(sitesArray);
        
        console.log('Sites data structure:');
        console.log('First site:', sitesArray[0]);
        console.log('First site keys:', Object.keys(sitesArray[0] || {}));
        
                 if (sitesArray.length > 0) {
           const firstSite = sitesArray[0];
           const siteKey = getSiteKey(firstSite);
           
           if (siteKey) {
             setSelectedSite(siteKey);
             console.log('Set first site as selected:', siteKey);
           } else {
             console.log('No valid key found in first site');
           }
         }
      }
    } catch (error) {
      console.error('Error testing dropdown:', error);
    } finally {
      setLoading(false);
    }
  };

  const testSelectedSite = () => {
    console.log('=== TESTING SELECTED SITE ===');
    console.log('selectedSite:', selectedSite);
    console.log('Type of selectedSite:', typeof selectedSite);
    console.log('selectedSite is empty string:', selectedSite === '');
    console.log('selectedSite is undefined:', selectedSite === undefined);
    console.log('selectedSite length:', selectedSite?.length);
         console.log('Current sites:', sites.map(s => ({ 
       key: getSiteKey(s), 
       name: s.name,
       allKeys: Object.keys(s)
     })));
  };

  const testDashboardAPI = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      console.log('Testing Dashboard API directly...');
      
      // Test with a sample token and site
      const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODdmM2FlZGMzYzg1OTg5Y2EzNTc1YTciLCJpZGVudGlmaWVyIjoiYWRtaW4ifQ.GRLlAsWbWv5xQsm_JjcUGDlcCFjtcnF9ImVmKMq4-Xo';
      const testSite = 'test_site';
      
      const response = await fetch('/api/dashboard?rangeDays=7', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testToken}`,
        },
        body: JSON.stringify({ site_key: testSite }),
      });
      
      const data = await response.json();
      
      setTestResult({
        status: response.status,
        statusText: response.statusText,
        data: data,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      console.log('Test result:', {
        status: response.status,
        data: data
      });
      
    } catch (error) {
      console.error('Error testing dashboard API:', error);
      setTestResult({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard API Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button 
            onClick={testDropdown} 
            disabled={loading}
            variant="outline"
          >
            {loading ? 'Testing...' : 'Test Dropdown'}
          </Button>
          
          <Button 
            onClick={testSelectedSite} 
            variant="outline"
          >
            Test Selected Site
          </Button>
          
          {sites.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Dropdown Test:</h4>
              <Select value={selectedSite} onValueChange={(value) => {
                console.log('=== DEBUG DROPDOWN ===');
                console.log('Selected site changed from', selectedSite, 'to', value);
                setSelectedSite(value);
                console.log('setSelectedSite called with:', value);
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
              <p className="text-sm text-gray-600">Selected: {selectedSite}</p>
              <p className="text-sm text-gray-600">Type: {typeof selectedSite}</p>
              <p className="text-sm text-gray-600">Length: {selectedSite?.length}</p>
              <p className="text-sm text-gray-600">Sites count: {sites.length}</p>
            </div>
          )}
        </div>

        <Button 
          onClick={testDashboardAPI} 
          disabled={loading}
          variant="outline"
        >
          {loading ? 'Testing...' : 'Test Dashboard API'}
        </Button>
        
        {testResult && (
          <div className="space-y-2">
            <h4 className="font-semibold">Test Result:</h4>
            <div className="bg-gray-100 p-3 rounded text-sm">
              <pre>{JSON.stringify(testResult, null, 2)}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 