'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { performLogout } from '@/lib/auth-utils';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../../components/ui/table';
import { Pagination } from '../../../components/ui/pagination';
import { Button } from '../../../components/ui/button';
import { Eye, Edit, Trash2, Plus, Search, Globe, Database, Key, Mail, MessageCircle, BarChart3 } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import SiteChatButton from './SiteChatButton';
import CreateSiteModal from './CreateSiteModal';
import { deleteSite } from '@/services/site.service';
import { useSession } from 'next-auth/react';

// Define site type - flexible to match multiple API response formats
interface Site {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  url?: string;
  domain?: string;
  created_at?: string;
  updated_at?: string;
  document_count?: number;
  openai_api_key?: string;
  chat_token?: string;
  model_type?: string;
  email?: string;
  created_time?: string;
  updated_time?: string;
  [key: string]: any; // Allow for additional fields
}

export default function SitesTable() {
  const router = useRouter();
  const { data: session } = useSession();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [deletingSiteId, setDeletingSiteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null);
  
  const itemsPerPage = 10;

  const fetchSites = async () => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * itemsPerPage;

      // Use the new API route that proxies to the backend
      const response = await fetch(`/api/sites?skip=${skip}&limit=${itemsPerPage}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Make sure cookies are sent
      });

      if (!response.ok) {
        let message = `Error fetching sites: ${response.statusText}`;
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
          setSites([]);
          setError('Unauthorized');
          // Fully clear session to avoid redirect loops
          await performLogout(router);
          return;
        }

        throw new Error(message);
      }

      const data = await response.json();
      console.log('Sites data received:', data);

      // Ensure data has the expected structure
      if (data.sites && Array.isArray(data.sites)) {
        setSites(data.sites);
        setTotalItems(data.total || data.sites.length);
        setError(null);
      } else {
        console.error('Unexpected data format:', data);
        setError('Received unexpected data format from server');
        setSites([]);
      }
    } catch (err) {
      console.error('Error fetching sites:', err);
      setError('Failed to load sites. Please try again later.');
      if (err instanceof Error) {
        // Show generic error toast when not handled above
        toast.error(err.message);
      }
      setSites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, [currentPage]);

  // Filter sites based on search term
  const filteredSites = sites.filter(site => 
    // Handle sites with different field names
    (site.name && site.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (site.description && site.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (site.domain && site.domain.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (site.url && site.url.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  const getSiteId = (site: Site) => site._id || site.id || '';

  const navigateToSiteDocuments = (site: Site) => {
    const siteId = getSiteId(site);
    if (siteId) {
      router.push(`/admin/sites/${siteId}/documents`);
    }
  };

  const truncate = (str?: string, length = 30) => {
    if (!str) return '';
    return str.length > length ? str.substring(0, length) + '...' : str;
  };

  const handleDeleteClick = (site: Site) => {
    setSiteToDelete(site);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!siteToDelete || !(session as any)?.accessToken) {
      setShowDeleteDialog(false);
      setSiteToDelete(null);
      return;
    }

    const siteId = getSiteId(siteToDelete);
    if (!siteId) {
      console.error('No site ID found');
      setShowDeleteDialog(false);
      setSiteToDelete(null);
      return;
    }

    try {
      setDeletingSiteId(siteId);
      await deleteSite(siteId, (session as any).accessToken);
      
      // Remove the deleted site from the list
      setSites(prev => prev.filter(site => getSiteId(site) !== siteId));
      
      // Show success message
      console.log('Site deleted successfully');
    } catch (error) {
      console.error('Error deleting site:', error);
      setError('Failed to delete site. Please try again.');
    } finally {
      setDeletingSiteId(null);
      setShowDeleteDialog(false);
      setSiteToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setSiteToDelete(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sites</h2>
          <p className="text-muted-foreground">
            Manage your AI chat sites and configurations.
          </p>
        </div>
        <CreateSiteModal onSiteCreated={fetchSites} />
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <div className="relative">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Site</TableHead>
                <TableHead>Configuration</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Loading sites...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-red-500">
                    {error}
                  </TableCell>
                </TableRow>
              ) : filteredSites.length > 0 ? (
                filteredSites.map((site) => (
                  <TableRow key={getSiteId(site) || site.name}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="flex items-center gap-2">
                          <span>{site.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                            onClick={() => getSiteId(site) && router.push(`/admin/sites/${getSiteId(site)}`)}
                            title="View Analytics"
                          >
                            <BarChart3 className="h-3 w-3" />
                          </Button>
                        </div>
                        {site.domain && (
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Globe className="h-3 w-3 mr-1" />
                            {site.domain}
                          </div>
                        )}
                        {site.url && !site.domain && (
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Globe className="h-3 w-3 mr-1" />
                            {site.url}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {site.email && (
                        <div className="flex items-center mb-1 text-sm">
                          <Mail className="mr-2 h-3 w-3 text-gray-500" />
                          <span>{site.email}</span>
                        </div>
                      )}
                      {site.openai_api_key && (
                        <div className="flex items-center text-sm">
                          <Key className="mr-2 h-3 w-3 text-gray-500" />
                          <span className="font-mono">{truncate(site.openai_api_key, 20)}</span>
                        </div>
                      )}
                      {site.model_type && (
                        <Badge variant="outline" className="mt-1">
                          {site.model_type}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {formatDate(site.created_at || site.created_time)}
                      {site.document_count !== undefined && (
                        <Badge 
                          variant="outline" 
                          className="ml-2 flex items-center gap-1 w-fit cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => getSiteId(site) && navigateToSiteDocuments(site)}
                        >
                          <Database className="h-3 w-3" />
                          {site.document_count}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <SiteChatButton site={site} />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => getSiteId(site) && navigateToSiteDocuments(site)}
                          title="View Details"
                          disabled={!getSiteId(site)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          title="Delete"
                          onClick={() => handleDeleteClick(site)}
                          disabled={deletingSiteId === getSiteId(site)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No sites found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center p-4 border-t border-gray-200 dark:border-gray-800">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && siteToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Site</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{siteToDelete.name}</strong>? 
              This action cannot be undone and will remove all associated data.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={handleDeleteCancel}
                disabled={deletingSiteId === getSiteId(siteToDelete)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deletingSiteId === getSiteId(siteToDelete)}
              >
                {deletingSiteId === getSiteId(siteToDelete) ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 