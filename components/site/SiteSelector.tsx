import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Site {
  id: string;
  name: string;
  url: string;
}

interface SiteSelectorProps {
  onSiteSelect?: (site: Site) => void;
}

export default function SiteSelector({ onSiteSelect }: SiteSelectorProps) {
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch sites from API
    const fetchSites = async () => {
      try {
        const response = await fetch('/api/sites');
        const data = await response.json();
        setSites(data.sites || []);
      } catch (error) {
        console.error('Error fetching sites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, []);

  const handleSiteChange = (siteId: string) => {
    setSelectedSite(siteId);
    const site = sites.find(s => s.id === siteId);
    if (site && onSiteSelect) {
      onSiteSelect(site);
    }
  };

  if (loading) {
    return <div>Loading sites...</div>;
  }

  return (
    <div className="flex items-center gap-4">
      <Select value={selectedSite} onValueChange={handleSiteChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a site" />
        </SelectTrigger>
        <SelectContent>
          {sites.map((site) => (
            <SelectItem key={site.id} value={site.id}>
              {site.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 