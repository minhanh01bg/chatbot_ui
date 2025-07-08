'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, FileText, AlertTriangle, Trash2, ChevronLeft, ChevronRight, Globe, Square, Activity } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { get_site_documents_with_token, crawler_data_automatic, stop_crawler } from '@/services/document.service';

// Define API document interface (from backend)
interface ApiDocument {
  _id: string;
  site_id: string;
  title: string;
  source: string;
  object_id: string;
  created_time: string;
  updated_time: string;
  doc_type: string;
  format: string;
  file_name?: string;
}

// Define UI document interface (for component)
interface Document {
  id: string;
  name: string;
  siteId: string;
  status: 'processing' | 'completed' | 'error';
  createdAt: string;
  size: number;
  type: string;
}

export interface Site {
  _id?: string;
  id?: string;
  name: string;
  chat_token?: string;
  [key: string]: any;
}

interface SiteDocumentsProps {
  siteId: string;
  site: Site; // Pass the complete site object directly
}
// interface ApiResponse {
//   list_docs: ApiDocument[];
// }

export default function SiteDocuments({ siteId, site }: SiteDocumentsProps) {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [crawlerDocuments, setCrawlerDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCrawlerLoading, setIsCrawlerLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [crawlerSearchTerm, setCrawlerSearchTerm] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocs, setTotalDocs] = useState(0);
  // Pagination state for file documents
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Reduced for testing

  // Pagination state for crawler documents
  const [crawlerCurrentPage, setCrawlerCurrentPage] = useState(1);
  const [crawlerItemsPerPage, setCrawlerItemsPerPage] = useState(10);
  const [crawlerTotalPages, setCrawlerTotalPages] = useState(0);
  const [crawlerTotalDocs, setCrawlerTotalDocs] = useState(0);

  // Crawler modal state
  const [isCrawlerModalOpen, setIsCrawlerModalOpen] = useState(false);
  const [crawlerUrl, setCrawlerUrl] = useState('');
  const [isCrawling, setIsCrawling] = useState(false);

  // WebSocket and crawler status state
  const [, setSocket] = useState<WebSocket | null>(null);
  const [crawlerStatus, setCrawlerStatus] = useState<{
    status: string;
    message: string;
    url: string;
    end: boolean;
  } | null>(null);
  const [crawlerHistory, setCrawlerHistory] = useState<Array<{
    timestamp: string;
    status: string;
    message: string;
    url: string;
  }>>([]);
  const [activeTab, setActiveTab] = useState('documents');

  // Fetch documents when component mounts, site changes, or pagination changes
  useEffect(() => {
    console.log('Site in SiteDocuments:', site);

    // If we have a site with chat_token, fetch documents
    if (site?.chat_token) {
      fetchFileDocuments(site.chat_token);
      if (activeTab === 'crawler') {
        fetchCrawlerDocuments(site.chat_token);
      }
    } else {
      setIsLoading(false);
      setIsCrawlerLoading(false);
      console.warn('No chat_token found for site:', site);
      toast({
        title: 'Missing token',
        description: 'No chat token found for this site. Documents cannot be fetched.',
        variant: 'destructive',
      });
    }
  }, [site, toast, currentPage, itemsPerPage, activeTab]);

  // WebSocket connection for crawler status
  useEffect(() => {
    if (!site?.chat_token) return;
    console.log('Connecting WebSocket for crawler status with token:', site);

    // Create WebSocket connection
    const wsUrl = `ws://localhost:8001/api/v1/ws/${site._id}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected for crawler status');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Crawler status received:', data);

        // Update current status
        setCrawlerStatus(data);

        // Add to history
        setCrawlerHistory(prev => [...prev, {
          timestamp: new Date().toLocaleTimeString(),
          status: data.status,
          message: data.message,
          url: data.url
        }]);

        // If crawler ended, stop crawling state
        if (data.end === true) {
          console.log('Crawler process completed, setting isCrawling to false');
          setIsCrawling(false);
          // Refresh documents after crawler completes
          if (site?.chat_token) {
            setTimeout(() => {
              fetchFileDocuments(site.chat_token!);
              fetchCrawlerDocuments(site.chat_token!);
            }, 1000);
          }
        } else if (data.end === false) {
          // Crawler is still running, ensure isCrawling is true
          console.log('Crawler process still running, ensuring isCrawling is true');
          setIsCrawling(true);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Cleanup on unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [site?.chat_token]);

  // Fetch crawler documents when switching to crawler tab or pagination changes
  useEffect(() => {
    if (activeTab === 'crawler' && site?.chat_token) {
      fetchCrawlerDocuments(site.chat_token);
    }
  }, [activeTab, site?.chat_token, crawlerCurrentPage, crawlerItemsPerPage]);

  // Fetch file documents using chat_token with pagination
  const fetchFileDocuments = async (chatToken: string) => {
    try {
      setIsLoading(true);
      console.log('Fetching file documents for site ID:', siteId.substring(0, 10) + '...');
      console.log('Pagination:', { currentPage, itemsPerPage });
      const data: any = await get_site_documents_with_token(siteId, chatToken, currentPage, itemsPerPage, 'file');
      console.log('File documents fetched successfully:', data);

      // Map the API documents to our UI document format
      const formattedDocuments: Document[] = (data?.list_docs || []).map((doc: ApiDocument) => ({
        id: doc._id,
        name: doc.title || doc.file_name,
        siteId: siteId,
        status: 'completed' as const, // Type assertion to match enum 
        createdAt: doc.created_time,
        size: 0, // Default size
        type: doc.file_name?.split('.').pop() || 'unknown'
      }));

      setTotalPages(data?.total_pages);
      setTotalDocs(data?.total_docs);
      setDocuments(formattedDocuments);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching documents:', error);
      console.error('Error details:', { siteId, tokenLength: chatToken?.length });
      toast({
        title: 'Error fetching documents',
        description: 'There was a problem loading your documents.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  // Fetch crawler documents using chat_token with pagination
  const fetchCrawlerDocuments = async (chatToken: string) => {
    try {
      setIsCrawlerLoading(true);
      console.log('Fetching crawler documents for site ID:', siteId.substring(0, 10) + '...');
      console.log('Crawler Pagination:', { crawlerCurrentPage, crawlerItemsPerPage });
      const data: any = await get_site_documents_with_token(siteId, chatToken, crawlerCurrentPage, crawlerItemsPerPage, 'crawler');
      console.log('Crawler documents fetched successfully:', data);

      // Map the API documents to our UI document format
      const formattedDocuments: Document[] = (data?.list_docs || []).map((doc: ApiDocument) => ({
        id: doc._id,
        name: doc.title || doc.file_name,
        siteId: siteId,
        status: 'completed' as const,
        createdAt: doc.created_time,
        size: 0,
        type: doc.file_name?.split('.').pop() || 'crawler'
      }));

      setCrawlerDocuments(formattedDocuments);
      setCrawlerTotalPages(data.total_pages || 1);
      setCrawlerTotalDocs(data.total_docs || 0);
      setIsCrawlerLoading(false);
    } catch (error) {
      console.error('Error fetching crawler documents:', error);
      setIsCrawlerLoading(false);
    }
  };

  // For server-side pagination, we use documents directly (already paginated from server)
  // Client-side filtering is applied only for search within current page
  const filteredDocuments = searchTerm
    ? documents.filter(doc =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.status.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : documents;

  const filteredCrawlerDocuments = crawlerSearchTerm
    ? crawlerDocuments.filter(doc =>
      doc.name.toLowerCase().includes(crawlerSearchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(crawlerSearchTerm.toLowerCase())
    )
    : crawlerDocuments;

  // Server-side pagination - documents are already paginated
  const paginatedDocuments = filteredDocuments;
  const paginatedCrawlerDocuments = filteredCrawlerDocuments;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalDocs);

  // Debug logs
  console.log('=== SiteDocuments Debug ===');
  console.log('Documents count:', documents.length);
  console.log('Total docs from server:', totalDocs);
  console.log('Total pages from server:', totalPages);
  console.log('Current page:', currentPage);
  console.log('Items per page:', itemsPerPage);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  // Reset to first page when crawler search term changes
  useEffect(() => {
    setCrawlerCurrentPage(1);
  }, [crawlerSearchTerm]);

  // Crawler pagination handlers
  const goToCrawlerPage = (page: number) => {
    setCrawlerCurrentPage(Math.max(1, Math.min(page, crawlerTotalPages)));
  };

  const goToCrawlerPreviousPage = () => {
    setCrawlerCurrentPage(prev => Math.max(1, prev - 1));
  };

  const goToCrawlerNextPage = () => {
    setCrawlerCurrentPage(prev => Math.min(crawlerTotalPages, prev + 1));
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !site?.chat_token) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Call Next.js API route in admin/sites/api instead of backend directly
      const response = await fetch('/admin/sites/api/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${site.chat_token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Upload result:', result);

      toast({
        title: 'Document uploaded',
        description: 'Your document has been uploaded successfully.',
      });

      // Refresh documents list
      if (site?.chat_token) {
        fetchFileDocuments(site.chat_token);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Upload failed',
        description: 'There was a problem uploading your document.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle crawler data automatic
  const handleCrawlerDataAutomatic = async () => {
    if (!crawlerUrl.trim() || !site?.chat_token) {
      toast({
        title: 'Invalid input',
        description: 'Please enter a valid URL.',
        variant: 'destructive',
      });
      return;
    }

    setIsCrawling(true);

    try {
      // Call crawler API using service
      const result = await crawler_data_automatic(crawlerUrl, site.chat_token);
      console.log('Crawler result:', result);

      if (result.message && result.message.includes('already running')) {
        setIsCrawling(false); // Reset state if crawler already running
        toast({
          title: 'Crawler already running',
          description: 'A crawler task is already running for this site.',
          variant: 'destructive',
        });
      } else {
        // Keep isCrawling = true, will be set to false by WebSocket when end=true
        toast({
          title: 'Crawler started',
          description: `Crawler task started successfully for site ${result.site_id}`,
        });

        // Close modal and reset form
        setIsCrawlerModalOpen(false);
        setCrawlerUrl('');

        // Switch to crawler tab to show status
        setActiveTab('crawler');

        // Refresh documents list after a short delay to allow crawler to process
        setTimeout(() => {
          if (site?.chat_token) {
            fetchFileDocuments(site.chat_token);
            fetchCrawlerDocuments(site.chat_token);
          }
        }, 2000);
      }

    } catch (error) {
      console.error('Error starting crawler:', error);
      setIsCrawling(false); // Reset state on error
      toast({
        title: 'Crawler failed',
        description: error instanceof Error ? error.message : 'There was a problem starting the crawler.',
        variant: 'destructive',
      });
    }
  };

  // Handle stop crawler
  const handleStopCrawler = async () => {
    if (!site?.chat_token) return;

    try {
      const result = await stop_crawler(site.chat_token);
      console.log('Stop crawler result:', result);

      if (result.status === 'not running') {
        toast({
          title: 'No crawler running',
          description: 'There is no crawler task currently running for this site.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Crawler stopped',
          description: 'The crawler task has been stopped successfully.',
        });

        // Reset crawler state
        setIsCrawling(false);
        setCrawlerStatus(null);
      }

    } catch (error) {
      console.error('Error stopping crawler:', error);
      toast({
        title: 'Stop crawler failed',
        description: error instanceof Error ? error.message : 'There was a problem stopping the crawler.',
        variant: 'destructive',
      });
    }
  };

  // Handle document deletion
  const handleDeleteDocument = async () => {
    if (!documentToDelete || !site?.chat_token) return;

    try {
      // Call Next.js API route in admin/sites/api instead of backend directly
      const response = await fetch(`/admin/sites/api/documents/delete?documentId=${documentToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${site.chat_token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error deleting document: ${response.statusText}`);
      }

      // Remove the deleted document from the list
      setDocuments(prev => prev.filter(doc => doc.id !== documentToDelete));

      toast({
        title: 'Document deleted',
        description: 'The document has been removed successfully.',
      });

    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Error deleting document',
        description: 'There was a problem deleting the document.',
        variant: 'destructive',
      });
    } finally {
      setDocumentToDelete(null);
    }
  };

  // Format file size
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Documents for {site?.name || 'Site'}</CardTitle>
          <CardDescription>Manage documents for this site</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="crawler" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Crawler Website
              {isCrawling && <Badge variant="secondary" className="ml-1">Running</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-4">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Search documents..."
                  className="max-w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" disabled={!site?.chat_token}>
                      <Plus className="mr-2 h-4 w-4" /> Add Document
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload a new document</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="file">Select File</Label>
                        <Input
                          id="file"
                          type="file"
                          accept=".pdf,.docx,.txt,.md"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                        />
                        {isUploading && (
                          <div className="space-y-2 mt-4">
                            <div className="flex justify-between text-sm">
                              <span>Uploading...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Debug Info */}
            <div className="px-6 py-2 bg-gray-100 text-xs">
              Debug: {totalDocs} total docs, {totalPages} pages, page {currentPage}, showing {documents.length} docs on current page
            </div>

            {/* Pagination Controls */}
            {totalDocs > 0 && totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {endIndex} of {totalDocs} documents
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-muted-foreground mr-2">Items per page:</span>
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={(value) => {
                        setItemsPerPage(Number(value));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-20 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            size="sm"
                            onClick={() => goToPage(pageNumber)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <span className="text-sm text-muted-foreground ml-2">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              </div>
            )}
            <div className='mt-6 overflow-auto h-[calc(100vh-352px)]'>
              {isLoading ? (
                <div className="text-center py-10">Loading documents...</div>
              ) : !site?.chat_token ? (
                <div className="text-center py-10 text-red-500">
                  <AlertTriangle className="mx-auto h-12 w-12 opacity-50 mb-2" />
                  <p>Missing Chat Token</p>
                  <p className="text-sm mt-1 text-muted-foreground">
                    This site doesn't have a chat token configured. Documents cannot be accessed.
                  </p>
                </div>
              ) : (
                <>
                  {filteredDocuments.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      <FileText className="mx-auto h-12 w-12 opacity-50 mb-2" />
                      <p>No documents found</p>
                      <p className="text-sm mt-1">
                        {searchTerm ? "Try a different search term." : "Upload a document to get started."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {paginatedDocuments.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <FileText className="h-10 w-10 text-blue-500" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <div className="flex space-x-4 text-sm text-muted-foreground">
                                <span>{formatSize(doc.size)}</span>
                                <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                                <span className={`${doc.status === 'completed' ? 'text-green-500' :
                                    doc.status === 'error' ? 'text-red-500' :
                                      'text-amber-500'
                                  }`}>
                                  {doc.status === 'completed' ? 'Ready' :
                                    doc.status === 'error' ? 'Error' :
                                      'Processing...'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => toast({
                              title: "Document View",
                              description: "Document viewer is coming soon."
                            })}>View</Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the document. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-500 hover:bg-red-600"
                                    onClick={() => {
                                      setDocumentToDelete(doc.id);
                                      handleDeleteDocument();
                                    }}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="crawler" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Crawler Management</h3>
              <div className="flex items-center gap-2">
                {/* Crawl Website Button */}
                <Dialog open={isCrawlerModalOpen} onOpenChange={setIsCrawlerModalOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" disabled={!site?.chat_token || isCrawling}>
                      <Globe className="mr-2 h-4 w-4" />
                      {isCrawling ? 'Crawling...' : 'Crawl Website'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crawl Website Data</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="crawler-url">Website URL</Label>
                        <Input
                          id="crawler-url"
                          type="url"
                          placeholder="https://example.com"
                          value={crawlerUrl}
                          onChange={(e) => setCrawlerUrl(e.target.value)}
                          disabled={isCrawling}
                        />
                        <p className="text-sm text-muted-foreground">
                          Enter the URL of the website you want to crawl for documents.
                        </p>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsCrawlerModalOpen(false)}
                          disabled={isCrawling}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCrawlerDataAutomatic}
                          disabled={isCrawling || !crawlerUrl.trim()}
                        >
                          {isCrawling ? 'Starting Crawler...' : 'Start Crawling'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {isCrawling && (
                  <Button
                    onClick={handleStopCrawler}
                    variant="destructive"
                    size="sm"
                  >
                    <Square className="mr-2 h-4 w-4" />
                    Stop Crawler
                  </Button>
                )}
              </div>
            </div>

            {(crawlerStatus || isCrawling) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Current Crawler Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {crawlerStatus?.url && (
                      <div className="flex justify-between rounded-lg p-4 items-center space-y-1 bg-muted">
                        <span className="text-sm">{crawlerStatus.url}</span>
                        <Badge variant={
                          crawlerStatus?.status === 'success' ? 'default' :
                            crawlerStatus?.status === 'failed' ? 'destructive' :
                              crawlerStatus?.status === 'processing' ? 'secondary' : 'outline'
                        }>
                          {crawlerStatus?.status || (isCrawling ? 'Starting...' : 'Idle')}
                        </Badge>
                      </div>
                    )}
                    
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm">Crawler History</CardTitle>
                {crawlerHistory.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCrawlerHistory([])}
                  >
                    Clear History
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {crawlerHistory.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No crawler activity yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {crawlerHistory.map((entry, index) => (
                        <div key={index} className="border-b pb-2 last:border-b-0">
                          <div className="flex items-center justify-between">
                            <Badge variant={
                              entry.status === 'success' ? 'default' :
                                entry.status === 'failed' ? 'destructive' :
                                  'secondary'
                            }>
                              {entry.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
                          </div>
                          <div className="text-sm mt-1">
                            <div><strong>URL:</strong> {entry.url}</div>
                            <div><strong>Message:</strong> {entry.message}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Crawler Documents Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm">Crawler Documents</CardTitle>
                <Input
                  placeholder="Search crawler documents..."
                  className="max-w-[250px]"
                  value={crawlerSearchTerm}
                  onChange={(e) => setCrawlerSearchTerm(e.target.value)}
                />
              </CardHeader>

              <CardContent>
                {/* Crawler Pagination Controls */}
                {crawlerTotalDocs > 0 && crawlerTotalPages > 1 && (
                  <div className="flex items-center justify-between pb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        Showing {((crawlerCurrentPage - 1) * crawlerItemsPerPage) + 1} to {Math.min(crawlerCurrentPage * crawlerItemsPerPage, crawlerTotalDocs)} of {crawlerTotalDocs} crawler documents
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Items per page:</span>
                        <Select value={crawlerItemsPerPage.toString()} onValueChange={(value) => setCrawlerItemsPerPage(Number(value))}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToCrawlerPreviousPage}
                          disabled={crawlerCurrentPage <= 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {Array.from({ length: Math.min(5, crawlerTotalPages) }, (_, i) => {
                          let pageNumber;
                          if (crawlerTotalPages <= 5) {
                            pageNumber = i + 1;
                          } else if (crawlerCurrentPage <= 3) {
                            pageNumber = i + 1;
                          } else if (crawlerCurrentPage >= crawlerTotalPages - 2) {
                            pageNumber = crawlerTotalPages - 4 + i;
                          } else {
                            pageNumber = crawlerCurrentPage - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNumber}
                              variant={crawlerCurrentPage === pageNumber ? "default" : "outline"}
                              size="sm"
                              onClick={() => goToCrawlerPage(pageNumber)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNumber}
                            </Button>
                          );
                        })}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToCrawlerNextPage}
                          disabled={crawlerCurrentPage >= crawlerTotalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>

                      <span className="text-sm text-muted-foreground ml-2">
                        Page {crawlerCurrentPage} of {crawlerTotalPages}
                      </span>
                    </div>
                  </div>
                )}
                {isCrawlerLoading ? (
                  <div className="text-center py-10">Loading crawler documents...</div>
                ) : paginatedCrawlerDocuments.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <FileText className="mx-auto h-12 w-12 opacity-50 mb-2" />
                    <p>No crawler documents found</p>
                    <p className="text-sm mt-1">
                      {crawlerSearchTerm ? "Try a different search term." : "Start crawling a website to see documents here."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paginatedCrawlerDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-blue-500" />
                          <div>
                            <h3 className="font-medium">{doc.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Created: {new Date(doc.createdAt).toLocaleDateString()} • Type: {doc.type}
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDocumentToDelete(doc.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Document</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{doc.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    handleDeleteDocument();
                                  }}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}


              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}