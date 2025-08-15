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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Globe, 
  Database, 
  Key, 
  Mail, 
  MessageCircle, 
  BarChart3,
  Settings,
  Calendar,
  ExternalLink,
  Sparkles,
  Zap,
  Shield,
  Activity
} from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Skeleton } from '../../../components/ui/skeleton';
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
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  const itemsPerPage = 12;

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
      toast.success('Site deleted successfully');
    } catch (error) {
      console.error('Error deleting site:', error);
      setError('Failed to delete site. Please try again.');
      toast.error('Failed to delete site');
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

  const getModelBadgeColor = (modelType?: string) => {
    switch (modelType) {
      case 'gpt-4':
      case 'gpt-4-turbo':
      case 'gpt-4o':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'gpt-4o-mini':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  const getModelIcon = (modelType?: string) => {
    switch (modelType) {
      case 'gpt-4':
      case 'gpt-4-turbo':
      case 'gpt-4o':
        return <Sparkles className="h-3 w-3" />;
      case 'gpt-4o-mini':
        return <Zap className="h-3 w-3" />;
      default:
        return <Sparkles className="h-3 w-3" />;
    }
  };

  // Loading skeleton for grid view
  const GridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Grid view component
  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredSites.map((site, index) => (
        <Card 
          key={getSiteId(site) || site.name} 
          className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-0 shadow-md bg-gradient-to-br from-white to-gray-50/50"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0 overflow-hidden">
                <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-200 truncate max-w-[200px]">
                  {site.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                  <Globe className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate max-w-[180px]">{site.domain || site.url || 'No domain'}</span>
                </CardDescription>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-purple-600 hover:bg-purple-50"
                  onClick={() => getSiteId(site) && router.push(`/admin/sites/${getSiteId(site)}`)}
                  title="View Analytics"
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-purple-600 hover:bg-purple-50"
                  onClick={() => getSiteId(site) && navigateToSiteDocuments(site)}
                  title="View Documents"
                >
                  <Database className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Configuration Info */}
            <div className="space-y-2">
              {site.email && (
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="mr-2 h-3 w-3 text-gray-400" />
                  <span className="truncate max-w-[150px]">{site.email}</span>
                </div>
              )}
              {site.openai_api_key && (
                <div className="flex items-center text-sm text-gray-600">
                  <Key className="mr-2 h-3 w-3 text-gray-400" />
                  <span className="font-mono text-xs">{truncate(site.openai_api_key, 15)}</span>
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {site.model_type && (
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getModelBadgeColor(site.model_type)} flex items-center gap-1`}
                >
                  {getModelIcon(site.model_type)}
                  {site.model_type}
                </Badge>
              )}
              {site.document_count !== undefined && (
                <Badge 
                  variant="outline" 
                  className="text-xs bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1 cursor-pointer hover:bg-purple-100 transition-colors"
                  onClick={() => getSiteId(site) && navigateToSiteDocuments(site)}
                >
                  <Database className="h-3 w-3" />
                  {site.document_count} docs
                </Badge>
              )}
            </div>

            {/* Created Date */}
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="mr-1 h-3 w-3" />
              Created {formatDate(site.created_at || site.created_time)}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 gap-2">
              <SiteChatButton site={site} variant="compact" />
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-purple-600 hover:bg-purple-50"
                  onClick={() => getSiteId(site) && navigateToSiteDocuments(site)}
                  title="View Details"
                  disabled={!getSiteId(site)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                  title="Delete"
                  onClick={() => handleDeleteClick(site)}
                  disabled={deletingSiteId === getSiteId(site)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AI Sites Management
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Create and manage your AI-powered chat sites. Monitor performance, configure settings, and deploy chatbots across multiple domains.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CreateSiteModal onSiteCreated={fetchSites} />
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-white to-gray-50/30">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search sites by name, domain, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-0 bg-white/50 backdrop-blur-sm focus:bg-white transition-all duration-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="flex items-center gap-2"
              >
                <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                </div>
                Grid
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="flex items-center gap-2"
              >
                <div className="flex flex-col gap-0.5 w-4 h-4">
                  <div className="w-full h-0.5 bg-current rounded-sm"></div>
                  <div className="w-full h-0.5 bg-current rounded-sm"></div>
                  <div className="w-full h-0.5 bg-current rounded-sm"></div>
                </div>
                Table
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {loading ? (
        <GridSkeleton />
      ) : error ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <div className="text-red-600 mb-2">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Sites</h3>
              <p className="text-sm">{error}</p>
            </div>
            <Button onClick={fetchSites} variant="outline" className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : filteredSites.length > 0 ? (
        <>
          {viewMode === 'grid' ? (
            <GridView />
          ) : (
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="relative">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="font-semibold">Site</TableHead>
                      <TableHead className="font-semibold">Configuration</TableHead>
                      <TableHead className="font-semibold">Created</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSites.map((site) => (
                      <TableRow key={getSiteId(site) || site.name} className="hover:bg-gray-50/50 transition-colors duration-150">
                        <TableCell className="font-medium">
                          <div>
                            <div className="flex items-center gap-2">
                                                             <span className="font-semibold text-gray-900 truncate max-w-[200px]">{site.name}</span>
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
                                                             <div className="text-sm text-gray-500 flex items-center mt-1">
                                 <Globe className="h-3 w-3 mr-1 flex-shrink-0" />
                                 <span className="truncate max-w-[180px]">{site.domain}</span>
                               </div>
                            )}
                            {site.url && !site.domain && (
                                                             <div className="text-sm text-gray-500 flex items-center mt-1">
                                 <Globe className="h-3 w-3 mr-1 flex-shrink-0" />
                                 <span className="truncate max-w-[180px]">{site.url}</span>
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
                            <Badge variant="outline" className={`mt-1 text-xs ${getModelBadgeColor(site.model_type)} flex items-center gap-1 w-fit`}>
                              {getModelIcon(site.model_type)}
                              {site.model_type}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{formatDate(site.created_at || site.created_time)}</span>
                                                         {site.document_count !== undefined && (
                               <Badge 
                                 variant="outline" 
                                 className="text-xs bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1 cursor-pointer hover:bg-purple-100 transition-colors"
                                 onClick={() => getSiteId(site) && navigateToSiteDocuments(site)}
                               >
                                 <Database className="h-3 w-3" />
                                 {site.document_count}
                               </Badge>
                             )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <SiteChatButton site={site} />
                                                         <Button
                               variant="ghost"
                               size="sm"
                               className="h-8 w-8 p-0 text-gray-400 hover:text-purple-600 hover:bg-purple-50"
                               onClick={() => getSiteId(site) && navigateToSiteDocuments(site)}
                               title="View Details"
                               disabled={!getSiteId(site)}
                             >
                               <Eye className="h-4 w-4" />
                             </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-gray-400 hover:text-green-600 hover:bg-green-50"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                              title="Delete"
                              onClick={() => handleDeleteClick(site)}
                              disabled={deletingSiteId === getSiteId(site)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center pt-6">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Globe className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No sites found</h3>
              <p className="text-sm text-gray-500 mb-6">
                {searchTerm ? 'No sites match your search criteria.' : 'Get started by creating your first AI-powered site.'}
              </p>
              {!searchTerm && <CreateSiteModal onSiteCreated={fetchSites} />}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && siteToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <Card className="max-w-md mx-4 border-0 shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Delete Site
              </CardTitle>
              <CardDescription>
                This action cannot be undone. All associated data will be permanently removed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete <strong className="text-gray-900">{siteToDelete.name}</strong>?
              </p>
            </CardContent>
            <CardContent className="flex justify-end gap-3 pt-0">
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
                className="bg-red-600 hover:bg-red-700"
              >
                {deletingSiteId === getSiteId(siteToDelete) ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete Site'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.4s ease-out forwards;
        }

        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .text-overflow-safe {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .flex-shrink-0 {
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
} 