'use client';

import Sites from '@/components/admin/sites/Sites';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { performLogout } from '@/lib/auth-utils';

export default function SitesPage() {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const siteKeys = Array.isArray(sites) ? sites.map(site => site.key || site._id) : [];
  const siteNames = Array.isArray(sites) ? sites.reduce((acc, site) => {
    acc[site.key || site._id] = site.name || site.key || site._id;
    return acc;
  }, {} as Record<string, string>) : {};

  return (
    <div className="space-y-6 p-5">
      {/* Sites Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <Sites />
        </div>
      </div>
    </div>
  );
} 