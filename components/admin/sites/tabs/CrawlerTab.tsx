'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Trash2, ChevronLeft, ChevronRight, Globe, Square, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { get_site_documents_with_token, crawler_data_automatic, stop_crawler } from '@/services/document.service';
import { Site, ApiDocument, Document, CrawlerStatus, CrawlerHistoryEntry } from '@/types/site';

interface CrawlerTabProps {
  siteId: string;
  site: Site;
}

export default function CrawlerTab({ siteId, site }: CrawlerTabProps) {
  const { toast } = useToast();

  // Crawler documents state
  const [crawlerDocuments, setCrawlerDocuments] = useState<Document[]>([]);
  const [isCrawlerLoading, setIsCrawlerLoading] = useState(true);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [crawlerSearchTerm, setCrawlerSearchTerm] = useState('');

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
  const [crawlerStatus, setCrawlerStatus] = useState<CrawlerStatus | null>(null);
  const [crawlerHistory, setCrawlerHistory] = useState<CrawlerHistoryEntry[]>([]);

  // WebSocket connection for crawler status
  useEffect(() => {
    if (!site?.chat_token) return;

    // Create WebSocket connection
    console.log('Connecting WebSocket for crawler status with token:', site);
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

  // Fetch crawler documents when component mounts or pagination changes
  useEffect(() => {
    if (site?.chat_token) {
      fetchCrawlerDocuments(site.chat_token);
    } else {
      setIsCrawlerLoading(false);
    }
  }, [site?.chat_token, crawlerCurrentPage, crawlerItemsPerPage]);

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

  const filteredCrawlerDocuments = crawlerSearchTerm
    ? crawlerDocuments.filter(doc =>
      doc.name.toLowerCase().includes(crawlerSearchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(crawlerSearchTerm.toLowerCase())
    )
    : crawlerDocuments;

  // Server-side pagination - documents are already paginated
  const paginatedCrawlerDocuments = filteredCrawlerDocuments;

  // Reset to first page when crawler search term changes
  useEffect(() => {
    setCrawlerCurrentPage(1);
  }, [crawlerSearchTerm]);

  // Reset to first page when items per page changes
  useEffect(() => {
    setCrawlerCurrentPage(1);
  }, [crawlerItemsPerPage]);

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

        // Refresh documents list after a short delay to allow crawler to process
        setTimeout(() => {
          if (site?.chat_token) {
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
      setCrawlerDocuments(prev => prev.filter(doc => doc.id !== documentToDelete));

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

  return (
    <div className="flex flex-col h-full">
      {/* Crawler Management Header */}
      <div className="flex items-center justify-between flex-shrink-0 mb-4">
        <Input
            placeholder="Search crawler documents..."
            className="max-w-[250px]"
            value={crawlerSearchTerm}
            onChange={(e) => setCrawlerSearchTerm(e.target.value)}
          />
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

      {/* Current Crawler Activity - Only show when crawling or has status */}
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
                <div className="flex justify-between bg-muted p-4 rounded-lg items-center">
                  <span className="text-sm">{crawlerStatus.url}</span>

                  <div className="flex items-center justify-between">
                    <Badge variant={
                      crawlerStatus?.status === 'success' ? 'default' :
                        crawlerStatus?.status === 'failed' ? 'destructive' :
                          crawlerStatus?.status === 'processing' ? 'secondary' : 'outline'
                    }>
                      {crawlerStatus?.status || (isCrawling ? 'Starting...' : 'Idle')}
                    </Badge>
                  </div>
                </div>
              )}
              
            </div>
          </CardContent>
        </Card>
      )}

      {/* Crawler History */}
      {/* <Card>
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
      </Card> */}

      {/* Crawler Documents Section */}
      <Card className="flex-1 min-h-0 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 flex-shrink-0 p-4 pb-0">
          <CardTitle className="text-md font-semibold">Crawler Documents</CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {crawlerTotalDocs} crawler documents
            </span>
          </div>
          
        </CardHeader>
        <CardContent className="flex-1 min-h-0 flex flex-col p-2">

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
            <div className="flex flex-col h-full">
              
              <div className="flex-1 min-h-0 overflow-auto">
                <div className="space-y-4 px-2 p-2">
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
              </div>
              {/* Crawler Pagination Controls */}
              {crawlerTotalDocs > 0 && crawlerTotalPages > 1 && (
                <div className="flex items-center justify-between flex-shrink-0 m-2">
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
