'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { performLogout } from '@/lib/auth-utils';
import { motion, AnimatePresence } from 'framer-motion';
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
  Activity,
  Filter,
  Grid3X3,
  List,
  RefreshCw,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Skeleton } from '../../../components/ui/skeleton';
import SiteChatButton from './SiteChatButton';
import CreateSiteModal from './CreateSiteModal';
import SiteStats from './SiteStats';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import { deleteSite } from '@/services/site.service';
import { useAuth } from '@/contexts/AuthContext';

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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const cardVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    y: -8,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

export default function SitesTable() {
  const router = useRouter();
  const { user, accessToken } = useAuth();
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  
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
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, [currentPage]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchSites();
  };

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
    if (!siteToDelete || !accessToken) {
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
      await deleteSite(siteId, accessToken);
      
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
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg';
      case 'gpt-4o-mini':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg';
      default:
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg';
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

  // Enhanced Loading skeleton for grid view
  const GridSkeleton = () => (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div key={i} variants={itemVariants}>
          <Card className="group hover:shadow-xl transition-all duration-500 hover:scale-[1.02] border-0 shadow-lg bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-slate-800/80 dark:to-slate-700/80 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex gap-1">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <div className="flex gap-1">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );

  // Enhanced Grid view component
  const GridView = () => (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {filteredSites.map((site, index) => (
          <motion.div
            key={getSiteId(site) || site.name}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Card className="group relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-slate-800/90 dark:to-slate-700/90 backdrop-blur-xl hover:shadow-2xl transition-all duration-500">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              
              <CardHeader className="pb-3 relative z-10">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 truncate max-w-[200px]">
                      {site.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <Globe className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate max-w-[180px]">{site.domain || site.url || 'No domain'}</span>
                    </CardDescription>
                  </div>
                  <motion.div 
                    className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ x: 10, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
                      onClick={() => getSiteId(site) && router.push(`/admin/sites/${getSiteId(site)}`)}
                      title="View Analytics"
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
                      onClick={() => getSiteId(site) && navigateToSiteDocuments(site)}
                      title="View Documents"
                    >
                      <Database className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4 relative z-10">
                {/* Configuration Info */}
                <div className="space-y-2">
                  {site.email && (
                    <motion.div 
                      className="flex items-center text-sm text-gray-600 dark:text-gray-300"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Mail className="mr-2 h-3 w-3 text-gray-400" />
                      <span className="truncate max-w-[150px]">{site.email}</span>
                    </motion.div>
                  )}
                  {site.openai_api_key && (
                    <motion.div 
                      className="flex items-center text-sm text-gray-600 dark:text-gray-300"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Key className="mr-2 h-3 w-3 text-gray-400" />
                      <span className="font-mono text-xs">{truncate(site.openai_api_key, 15)}</span>
                    </motion.div>
                  )}
                </div>

                {/* Badges */}
                <motion.div 
                  className="flex flex-wrap gap-2"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {site.model_type && (
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getModelBadgeColor(site.model_type)} flex items-center gap-1 shadow-lg`}
                    >
                      {getModelIcon(site.model_type)}
                      {site.model_type}
                    </Badge>
                  )}
                  {site.document_count !== undefined && (
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-gradient-to-r from-purple-500/10 to-purple-600/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700 flex items-center gap-1 cursor-pointer hover:from-purple-500/20 hover:to-purple-600/20 transition-all duration-200 shadow-md"
                      onClick={() => getSiteId(site) && navigateToSiteDocuments(site)}
                    >
                      <Database className="h-3 w-3" />
                      {site.document_count} docs
                    </Badge>
                  )}
                </motion.div>

                {/* Created Date */}
                <motion.div 
                  className="flex items-center text-xs text-gray-500 dark:text-gray-400"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Calendar className="mr-1 h-3 w-3" />
                  Created {formatDate(site.created_at || site.created_time)}
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                  className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700 gap-2"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <SiteChatButton site={site} variant="compact" />
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
                      onClick={() => getSiteId(site) && navigateToSiteDocuments(site)}
                      title="View Details"
                      disabled={!getSiteId(site)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                      title="Delete"
                      onClick={() => handleDeleteClick(site)}
                      disabled={deletingSiteId === getSiteId(site)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Enhanced Header Section */}
      <motion.div 
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="space-y-3">
          <motion.h1 
            className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            AI Sites Management
          </motion.h1>
          <motion.p 
            className="text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Create and manage your AI-powered chat sites. Monitor performance, configure settings, and deploy chatbots across multiple domains.
          </motion.p>
        </div>
        <motion.div 
          className="flex items-center gap-3"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <CreateSiteModal onSiteCreated={fetchSites} />
        </motion.div>
      </motion.div>

      {/* Site Statistics */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      >
        <SiteStats 
          totalSites={sites.length}
          totalDocuments={sites.reduce((sum, site) => sum + (site.document_count || 0), 0)}
          activeChats={Math.floor(Math.random() * 50) + 10} // Mock data for now
          totalTraffic={Math.floor(Math.random() * 10000) + 1000} // Mock data for now
        />
      </motion.div>

      {/* Enhanced Search and Filters */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
      >
        <Card className="border-0 shadow-xl bg-gradient-to-r from-white/90 to-gray-50/90 dark:from-slate-800/90 dark:to-slate-700/90 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search sites by name, domain, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-0 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm focus:bg-white dark:focus:bg-slate-600 transition-all duration-300 shadow-lg"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 shadow-lg transition-all duration-200"
                >
                  <Grid3X3 className="h-4 w-4" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg transition-all duration-200"
                >
                  <List className="h-4 w-4" />
                  Table
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-red-200 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 backdrop-blur-xl">
            <CardContent className="p-8 text-center">
              <motion.div 
                className="text-red-600 mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Error Loading Sites</h3>
                <p className="text-sm">{error}</p>
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button onClick={fetchSites} variant="outline" className="mt-4 hover:bg-red-50 dark:hover:bg-red-900/20">
                  Try Again
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      ) : filteredSites.length > 0 ? (
        <>
          {viewMode === 'grid' ? (
            <GridView />
          ) : (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-r from-white/90 to-gray-50/90 dark:from-slate-800/90 dark:to-slate-700/90 backdrop-blur-xl">
                <div className="relative">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
                        <TableHead className="font-semibold text-purple-700 dark:text-purple-300">Site</TableHead>
                        <TableHead className="font-semibold text-purple-700 dark:text-purple-300">Configuration</TableHead>
                        <TableHead className="font-semibold text-purple-700 dark:text-purple-300">Created</TableHead>
                        <TableHead className="text-right font-semibold text-purple-700 dark:text-purple-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSites.map((site, index) => (
                        <motion.tr 
                          key={getSiteId(site) || site.name} 
                          className="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50 dark:hover:from-purple-900/10 dark:hover:to-blue-900/10 transition-all duration-300"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <TableCell className="font-medium">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[200px]">{site.name}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
                                  onClick={() => getSiteId(site) && router.push(`/admin/sites/${getSiteId(site)}`)}
                                  title="View Analytics"
                                >
                                  <BarChart3 className="h-3 w-3" />
                                </Button>
                              </div>
                              {site.domain && (
                                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                                  <Globe className="h-3 w-3 mr-1 flex-shrink-0" />
                                  <span className="truncate max-w-[180px]">{site.domain}</span>
                                </div>
                              )}
                              {site.url && !site.domain && (
                                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
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
                              <span className="text-sm text-gray-600 dark:text-gray-300">{formatDate(site.created_at || site.created_time)}</span>
                              {site.document_count !== undefined && (
                                <Badge 
                                  variant="outline" 
                                  className="text-xs bg-gradient-to-r from-purple-500/10 to-purple-600/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700 flex items-center gap-1 cursor-pointer hover:from-purple-500/20 hover:to-purple-600/20 transition-all duration-200"
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
                                className="h-8 w-8 p-0 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
                                onClick={() => getSiteId(site) && navigateToSiteDocuments(site)}
                                title="View Details"
                                disabled={!getSiteId(site)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                                title="Delete"
                                onClick={() => handleDeleteClick(site)}
                                disabled={deletingSiteId === getSiteId(site)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </motion.div>
          )}
          
          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <motion.div 
              className="flex items-center justify-center pt-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Card className="border-0 shadow-xl bg-gradient-to-r from-white/90 to-gray-50/90 dark:from-slate-800/90 dark:to-slate-700/90 backdrop-blur-xl">
                <CardContent className="p-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </>
      ) : (
        <EmptyState searchTerm={searchTerm} onSiteCreated={fetchSites} />
      )}

      {/* Enhanced Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteDialog && siteToDelete && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="max-w-md mx-4 border-0 shadow-2xl bg-gradient-to-r from-white/95 to-gray-50/95 dark:from-slate-800/95 dark:to-slate-700/95 backdrop-blur-xl">
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
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Are you sure you want to delete <strong className="text-gray-900 dark:text-gray-100">{siteToDelete.name}</strong>?
                  </p>
                </CardContent>
                <CardContent className="flex justify-end gap-3 pt-0">
                  <Button
                    variant="outline"
                    onClick={handleDeleteCancel}
                    disabled={deletingSiteId === getSiteId(siteToDelete)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteConfirm}
                    disabled={deletingSiteId === getSiteId(siteToDelete)}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-lg transition-all duration-200"
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 