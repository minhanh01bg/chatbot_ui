'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { Eye, Edit, Trash2, Plus, Search, Globe, Database, Key, Mail } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';

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
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  
  const itemsPerPage = 10;

  useEffect(() => {
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
          throw new Error(`Error fetching sites: ${response.statusText}`);
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
        setSites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, [currentPage]);

  // Filter sites based on search term
  const filteredSites = sites.filter(site => 
    // Handle sites with different field names
    (site.name && site.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (site.description && site.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (site.url && site.url.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (site.domain && site.domain.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (site.email && site.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Format date for display, handling different date field names
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

  // Safely get site ID
  const getSiteId = (site: Site) => site._id || site.id || '';

  // Navigate to site documents
  const navigateToSiteDocuments = (site: Site) => {
    const siteId = getSiteId(site);
    if (!siteId) return;
    
    // Store the selected site in localStorage, but don't include sensitive data
    const safeData = {
      ...site,
      // Only include needed fields
      name: site.name,
      domain: site.domain,
      chat_token: site.chat_token,
      _id: site._id || site.id,
      id: site._id || site.id
    };
    
    // Store in localStorage temporarily
    localStorage.setItem('selected_site', JSON.stringify(safeData));
    
    // Navigate to documents page
    router.push(`/admin/sites/${siteId}/documents`);
  };

  // Truncate long strings for display
  const truncate = (str?: string, length = 30) => {
    if (!str) return '';
    return str.length > length ? str.substring(0, length) + '...' : str;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Sites</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search sites..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>New Site</span>
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name/Domain</TableHead>
                <TableHead>User/Key</TableHead>
                <TableHead>Creation</TableHead>
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
                        <div>{site.name}</div>
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
    </div>
  );
} 