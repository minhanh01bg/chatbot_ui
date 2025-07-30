'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

import { Plus, FileText, AlertTriangle, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { get_site_documents_with_token } from '@/services/document.service';
import { Site, ApiDocument, Document } from '@/types/site';

interface DocumentsTabProps {
  siteId: string;
  site: Site;
}

export default function DocumentsTab({ siteId, site }: DocumentsTabProps) {
  const { toast } = useToast();
  
  // Documents state
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocs, setTotalDocs] = useState(0);

  // Fetch documents when component mounts, site changes, or pagination changes
  useEffect(() => {
    if (site?.chat_token) {
      fetchFileDocuments(site.chat_token);
    } else {
      setIsLoading(false);
      console.warn('No chat_token found for site:', site);
      toast({
        title: 'Missing token',
        description: 'No chat token found for this site. Documents cannot be fetched.',
        variant: 'destructive',
      });
    }
  }, [site, toast, currentPage, itemsPerPage]);

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
      console.error('Error fetching file documents:', error);
      console.error('Error details:', { siteId, tokenLength: chatToken?.length });
      toast({
        title: 'Error fetching documents',
        description: 'There was a problem loading your documents.',
        variant: 'destructive',
      });
      setIsLoading(false);
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

  // Server-side pagination - documents are already paginated
  const paginatedDocuments = filteredDocuments;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalDocs);

  console.log('Documents state:', { 
    totalDocs, 
    totalPages, 
    currentPage, 
    itemsPerPage,
    documentsLength: documents.length,
    filteredLength: filteredDocuments.length 
  });
  console.log('Current page:', currentPage);
  console.log('Items per page:', itemsPerPage);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Reset to first page when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

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

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !site?.chat_token) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Call Next.js API route in admin/sites/api instead of backend directly
      const response = await fetch('/api/sites/documents/upload', {
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
        description: `${file.name} has been uploaded successfully.`,
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

  // Handle document deletion
  const handleDeleteDocument = async () => {
    if (!documentToDelete || !site?.chat_token) return;

    try {
      // Call Next.js API route in admin/sites/api instead of backend directly
      const response = await fetch(`/api/sites/documents/delete?documentId=${documentToDelete}`, {
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

  return (
    <div className="flex flex-col h-full">
      {/* Header with search and upload */}
      <div className="flex items-center gap-4 flex-shrink-0 mb-4">
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

      {/* Debug Info */}
      <div className="px-6 py-2 bg-gray-100 text-xs flex-shrink-0 mb-4">
        Debug: {totalDocs} total docs, {totalPages} pages, page {currentPage}, showing {documents.length} docs on current page
      </div>

      {/* Pagination Controls */}
      {totalDocs > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between flex-shrink-0 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {endIndex} of {totalDocs} documents
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Items per page:</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
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
                onClick={goToPreviousPage}
                disabled={currentPage <= 1}
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
                disabled={currentPage >= totalPages}
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

      {/* Documents Content */}
      <div className='flex-1 min-h-0 overflow-auto'>
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
            {paginatedDocuments.length === 0 ? (
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
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <h3 className="font-medium">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Created: {new Date(doc.createdAt).toLocaleDateString()} •
                          Type: {doc.type} •
                          Status: {doc.status === 'completed' ? 'Ready' :
                                   doc.status === 'processing' ? 'Processing' :
                                   doc.status === 'uploading' ? 'Uploading' :
                                   'Processing...'}
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
          </>
        )}
      </div>
    </div>
  );
}
