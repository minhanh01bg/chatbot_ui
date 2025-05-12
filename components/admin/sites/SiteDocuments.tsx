'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, FileText, AlertTriangle, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { get_site_documents_with_token } from '@/services/document.service';

// Define API document interface (from backend)
interface ApiDocument {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  vectorstore_id: string;
  file_name: string;
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

interface Site {
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

export default function SiteDocuments({ siteId, site }: SiteDocumentsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch documents when component mounts or site changes
  useEffect(() => {
    console.log('Site in SiteDocuments:', site);
    
    // If we have a site with chat_token, fetch documents
    if (site?.chat_token) {
      fetchSiteDocuments(site.chat_token);
    } else {
      setIsLoading(false);
      console.warn('No chat_token found for site:', site);
      toast({
        title: 'Missing token',
        description: 'No chat token found for this site. Documents cannot be fetched.',
        variant: 'destructive',
      });
    }
  }, [site, toast]);

  // Fetch documents using chat_token
  const fetchSiteDocuments = async (chatToken: string) => {
    try {
      console.log('Fetching documents with token:', chatToken.substring(0, 10) + '...');
      console.log('Site ID:', siteId);
      
      const data = await get_site_documents_with_token(siteId, chatToken);
      console.log('Documents fetched successfully:', data);
      
      // Map the API documents to our UI document format
      const formattedDocuments: Document[] = (data.documents || []).map((doc: ApiDocument) => ({
        id: doc._id,
        name: doc.title || doc.file_name,
        siteId: siteId,
        status: 'completed' as const, // Type assertion to match enum 
        createdAt: doc.created_at,
        size: 0, // Default size
        type: doc.file_name?.split('.').pop() || 'unknown'
      }));
      
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

  // Filter documents based on search term
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      
      // Use consistent backend URL
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8002';
      console.log("Using backend URL for upload:", backendUrl);
      
      // Direct call to backend API with chat_token
      const response = await fetch(`${backendUrl}/api/v1/upload_document`, {
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
        fetchSiteDocuments(site.chat_token);
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
      // Use consistent backend URL
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8002';
      console.log("Using backend URL for delete:", backendUrl);
      
      // Direct call to backend API with chat_token
      const response = await fetch(`${backendUrl}/api/v1/documents/${documentToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${site.chat_token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error deleting document: ${response.statusText}`);
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
      </CardHeader>
      
      <CardContent>
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
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-10 w-10 text-blue-500" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <div className="flex space-x-4 text-sm text-muted-foreground">
                          <span>{formatSize(doc.size)}</span>
                          <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                          <span className={`${
                            doc.status === 'completed' ? 'text-green-500' : 
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
      </CardContent>
    </Card>
  );
}