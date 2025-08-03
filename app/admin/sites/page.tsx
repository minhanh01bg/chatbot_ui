'use client';

import Sites from '@/components/admin/sites/Sites';
import OverallDashboardStats from '@/components/admin/OverallDashboardStats';
import { useState, useEffect } from 'react';

export default function SitesPage() {
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
        }
      } catch (error) {
        console.error('Error fetching sites:', error);
        setSites([]);
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

  return (
    <div className="space-y-6">
      {/* Dashboard Stats */}
      {!loading && siteKeys.length > 0 && (
        <OverallDashboardStats 
          siteKeys={siteKeys}
          siteNames={siteNames}
        />
      )}
      
      {/* Sites Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <Sites />
        </div>
      </div>
    </div>
  );
} 