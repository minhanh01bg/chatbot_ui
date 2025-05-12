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
import { Eye, Edit, Trash2, Plus, Search, Globe, Database } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';

// Define the site type
interface Site {
  _id: string;
  name: string;
  description: string;
  url: string;
  created_at: string;
  updated_at: string;
  document_count: number;
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
        const response = await fetch(`/admin/sites/api?skip=${skip}&limit=${itemsPerPage}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error fetching sites: ${response.statusText}`);
        }
        
        const data = await response.json();
        setSites(data.sites);
        setTotalItems(data.total);
        setError(null);
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
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.url.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Navigate to site documents
  const navigateToSiteDocuments = (siteId: string) => {
    router.push(`/admin/sites/${siteId}/documents`);
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
                <TableHead>Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Loading sites...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-red-500">
                    {error}
                  </TableCell>
                </TableRow>
              ) : filteredSites.length > 0 ? (
                filteredSites.map((site) => (
                  <TableRow key={site._id}>
                    <TableCell className="font-medium">{site.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4 text-gray-500" />
                        <span className="text-blue-600 hover:underline">{site.url}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className="flex items-center gap-1 w-fit cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => navigateToSiteDocuments(site._id)}
                      >
                        <Database className="h-3 w-3" />
                        {site.document_count}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(site.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => navigateToSiteDocuments(site._id)}
                          title="View Documents"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Documents</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
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