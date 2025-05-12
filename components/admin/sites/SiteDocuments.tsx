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

interface Document {
  id: string;
  name: string;
  siteId: string;
  status: 'processing' | 'completed' | 'error';
  createdAt: string;
  size: number;
  type: string;
}

interface SiteDocumentsProps {
  siteId: string;
}

export default function SiteDocuments({ siteId }: SiteDocumentsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch documents for the site
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        
        // Use the new API endpoint
        const response = await fetch(`/admin/sites/api/${siteId}/documents`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error fetching documents: ${response.statusText}`);
        }
        
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast({
          title: 'Error fetching documents',
          description: 'There was a problem loading your documents.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [siteId, toast]);

  // Filter documents based on search term
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Using XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      
      xhr.open('POST', `/admin/sites/api/${siteId}/documents`);
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (progressEvent) => {
        if (progressEvent.lengthComputable) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });
      
      // Handle response
      xhr.onload = function() {
        if (this.status >= 200 && this.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            setDocuments(prev => [...prev, response]);
            
            toast({
              title: 'Document uploaded',
              description: 'Your document has been uploaded successfully and is now processing.',
            });
            
            router.refresh();
          } catch (e) {
            console.error('Error parsing response:', e);
          }
        } else {
          console.error('Error uploading document:', xhr.statusText);
          toast({
            title: 'Error uploading document',
            description: 'There was a problem uploading your document.',
            variant: 'destructive',
          });
        }
        
        setIsUploading(false);
        setUploadProgress(0);
      };
      
      xhr.onerror = () => {
        console.error('Network error during upload');
        toast({
          title: 'Network error',
          description: 'There was a network problem uploading your document.',
          variant: 'destructive',
        });
        
        setIsUploading(false);
        setUploadProgress(0);
      };
      
      xhr.send(formData);
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Error uploading document',
        description: 'There was a problem uploading your document.',
        variant: 'destructive',
      });
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;
    
    try {
      const response = await fetch(`/admin/sites/api/${siteId}/documents/${documentToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
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
      router.refresh();
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Documents</CardTitle>
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
              <Button size="sm">
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
                    <div className="flex items-center space-x-2">
                      {doc.status === 'error' && (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setDocumentToDelete(doc.id)}
                          >
                            <Trash2 className="h-5 w-5 text-muted-foreground hover:text-red-500" />
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