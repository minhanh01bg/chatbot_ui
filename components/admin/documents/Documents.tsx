'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Search, FileText, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Pagination } from '@/components/ui/pagination';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface DocumentItem {
  id: string;
  name: string;
  siteId: string;
  siteName: string;
  status: 'processing' | 'completed' | 'error';
  createdAt: string;
  size: number;
  type: string;
}

export default function Documents() {
  const router = useRouter();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  
  const baseURL = 'http://localhost:8002/api';
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const skip = (currentPage - 1) * itemsPerPage;
        
        // Create headers with auth token if available
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth-token');
          if (token) {
            headers.Authorization = `Bearer ${token}`;
          }
        }
        
        const response = await fetch(`${baseURL}/documents?skip=${skip}&limit=${itemsPerPage}`, {
          method: 'GET',
          headers,
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`Error fetching documents: ${response.statusText}`);
        }
        
        const data = await response.json();
        setDocuments(data.documents);
        setTotalItems(data.total);
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast({
          title: 'Error fetching documents',
          description: 'There was a problem loading the documents.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [currentPage, toast]);

  // Filter documents based on search term
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;
    
    try {
      // Find the document to get its siteId
      const document = documents.find(doc => doc.id === documentToDelete);
      if (!document) return;
      
      // Create headers with auth token if available
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth-token');
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }
      
      const response = await fetch(`${baseURL}/sites/${document.siteId}/documents/${documentToDelete}`, {
        method: 'DELETE',
        headers,
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Error deleting document: ${response.statusText}`);
      }
      
      setDocuments(prev => prev.filter(doc => doc.id !== documentToDelete));
      
      toast({
        title: 'Document deleted',
        description: 'The document has been removed successfully.',
      });
      
      setDocumentToDelete(null);
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Error deleting document',
        description: 'There was a problem deleting the document.',
        variant: 'destructive',
      });
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>All Documents</CardTitle>
          <CardDescription>Documents from all sites</CardDescription>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search documents..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-10">Loading documents...</div>
        ) : (
          <>
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 opacity-50 mb-2" />
                <p>No documents found</p>
                <p className="text-sm mt-1">
                  {searchTerm ? "Try a different search term." : "Documents from all sites will appear here."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.name}</TableCell>
                        <TableCell>
                          <Link 
                            href={`/admin/sites/${doc.siteId}`}
                            className="text-blue-600 hover:underline"
                          >
                            {doc.siteName}
                          </Link>
                        </TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>{formatSize(doc.size)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              doc.status === 'completed' ? 'success' :
                              doc.status === 'error' ? 'destructive' : 'outline'
                            }
                          >
                            {doc.status === 'completed' ? 'Ready' : 
                             doc.status === 'error' ? 'Error' : 
                             'Processing'}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(doc.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => router.push(`/admin/sites/${doc.siteId}/documents/${doc.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                  onClick={() => setDocumentToDelete(doc.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete document</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this document? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setDocumentToDelete(null)}>
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction onClick={handleDeleteDocument}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {totalPages > 1 && (
              <div className="flex items-center justify-center p-4 border-t border-gray-200 dark:border-gray-800 mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
} 