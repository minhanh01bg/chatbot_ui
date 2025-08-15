'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  FileText, 
  AlertTriangle, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Upload,
  File,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  MoreVertical,
  Calendar,
  Clock,
  Download,
  Eye,
  Edit,
  Copy,
  Check,
  X,
  Sparkles,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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

// File type icons mapping
const getFileIcon = (type: string, name: string) => {
  const extension = name.split('.').pop()?.toLowerCase();
  
  if (type === 'image' || ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension || '')) {
    return <FileImage className="w-5 h-5" />;
  }
  if (type === 'video' || ['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension || '')) {
    return <FileVideo className="w-5 h-5" />;
  }
  if (type === 'audio' || ['mp3', 'wav', 'flac', 'aac'].includes(extension || '')) {
    return <FileAudio className="w-5 h-5" />;
  }
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')) {
    return <FileArchive className="w-5 h-5" />;
  }
  return <FileText className="w-5 h-5" />;
};

// File type colors
const getFileColor = (type: string, name: string) => {
  const extension = name.split('.').pop()?.toLowerCase();
  
  if (type === 'image' || ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension || '')) {
    return 'from-pink-500 to-rose-500';
  }
  if (type === 'video' || ['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension || '')) {
    return 'from-purple-500 to-indigo-500';
  }
  if (type === 'audio' || ['mp3', 'wav', 'flac', 'aac'].includes(extension || '')) {
    return 'from-green-500 to-emerald-500';
  }
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')) {
    return 'from-orange-500 to-red-500';
  }
  return 'from-blue-500 to-cyan-500';
};

export default function DocumentsTab({ siteId, site }: DocumentsTabProps) {
  const { toast } = useToast();
  
  // Documents state
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocs, setTotalDocs] = useState(0);

  // Fetch documents with useCallback for optimization
  const fetchFileDocuments = useCallback(async (chatToken: string) => {
    try {
      setIsLoading(true);
      const data: any = await get_site_documents_with_token(siteId, chatToken, currentPage, itemsPerPage, 'file');

      const formattedDocuments: Document[] = (data?.list_docs || []).map((doc: ApiDocument) => ({
        id: doc._id,
        name: doc.title || doc.file_name,
        siteId: siteId,
        createdAt: doc.created_time,
        size: 0,
        type: doc.doc_type
      }));
      
      setTotalPages(data?.total_pages || 0);
      setTotalDocs(data?.total_docs || 0);
      setDocuments(formattedDocuments);
    } catch (error) {
      console.error('Error fetching file documents:', error);
      toast({
        title: 'Error fetching documents',
        description: 'There was a problem loading your documents.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [siteId, currentPage, itemsPerPage, toast]);

  // Fetch documents when component mounts or dependencies change
  useEffect(() => {
    if (site?.chat_token) {
      fetchFileDocuments(site.chat_token);
    } else {
      setIsLoading(false);
      toast({
        title: 'Missing token',
        description: 'No chat token found for this site. Documents cannot be fetched.',
        variant: 'destructive',
      });
    }
  }, [site, fetchFileDocuments, toast]);

  // Filtered documents with useMemo for performance
  const filteredDocuments = useMemo(() => {
    return searchTerm
    ? documents.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : documents;
  }, [documents, searchTerm]);

  // Pagination calculations
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalDocs);

  // Reset to first page when search term or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  // Pagination handlers
  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  // Handle file upload with progress simulation
  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !site?.chat_token) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

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
      setUploadProgress(100);

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
      clearInterval(progressInterval);
      setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(0);
      }, 500);
    }
  }, [site, toast, fetchFileDocuments]);

  // Handle document deletion
  const handleDeleteDocument = useCallback(async () => {
    if (!documentToDelete || !site?.chat_token) return;

    try {
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
  }, [documentToDelete, site, toast]);

  // Handle document selection
  const toggleDocumentSelection = useCallback((docId: string) => {
    setSelectedDocuments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(docId)) {
        newSet.delete(docId);
      } else {
        newSet.add(docId);
      }
      return newSet;
    });
  }, []);

  // Handle bulk actions
  const handleBulkDelete = useCallback(() => {
    if (selectedDocuments.size === 0) return;
    
    // For now, just clear selection
    setSelectedDocuments(new Set());
    toast({
      title: 'Bulk delete',
      description: `Selected ${selectedDocuments.size} documents for deletion.`,
    });
  }, [selectedDocuments, toast]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-3">
      {Array.from({ length: itemsPerPage }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-20"
    >
      <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <FileText className="w-12 h-12 text-purple-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {searchTerm ? 'No documents found' : 'No documents yet'}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {searchTerm 
          ? "Try adjusting your search terms or browse all documents."
          : "Upload your first document to get started with AI-powered conversations."
        }
      </p>
      {!searchTerm && (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Upload a new document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="file" className="text-gray-700">Select File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.docx,.txt,.md,.jpg,.jpeg,.png,.gif"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="bg-gray-50 border-gray-200 text-gray-900"
                />
                {isUploading && (
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-sm text-gray-600">
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
      )}
    </motion.div>
  );

  return (
    <div className="flex flex-col h-full bg-white text-gray-900">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between border-gray-200 bg-white shadow-sm"
      >
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative">
            <Search className="outline-none absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search documents..."
              className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 w-64 focus:bg-white focus:border-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}
            >
              <div className="grid grid-cols-2 gap-1 w-4 h-4">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}
            >
              <div className="space-y-1 w-4 h-4">
                <div className="bg-current rounded-sm h-0.5"></div>
                <div className="bg-current rounded-sm h-0.5"></div>
                <div className="bg-current rounded-sm h-0.5"></div>
              </div>
            </Button>
          </div>

          {/* Upload Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border border-gray-200">
              <DialogHeader>
                <DialogTitle className="text-gray-900">Upload a new document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="file" className="text-gray-700">Select File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.docx,.txt,.md,.jpg,.jpeg,.png,.gif"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="bg-gray-50 border-gray-200 text-gray-900"
                  />
                  {isUploading && (
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between text-sm text-gray-600">
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
      </motion.div>

      {/* Bulk Actions */}
      {selectedDocuments.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 bg-purple-50 border-b border-purple-200"
        >
          <span className="text-purple-700 font-medium">
            {selectedDocuments.size} document{selectedDocuments.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDocuments(new Set())}
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          </div>
        </motion.div>
      )}



      {/* Document Count Info - Fixed position outside scroll */}
      {totalDocs > 0 && (
        <div className="p-4 bg-white border-b border-gray-200">
          <span className="text-sm text-gray-600">
            Showing {startIndex + 1} to {endIndex} of {totalDocs} documents
          </span>
        </div>
      )}

      {/* Documents Content */}
      <div className="flex-1 min-h-0 overflow-auto p-4 bg-gray-50">
        {isLoading ? (
          <LoadingSkeleton />
        ) : !site?.chat_token ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Missing Chat Token</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              This site doesn't have a chat token configured. Documents cannot be accessed.
            </p>
          </motion.div>
        ) : (
          <>
            {filteredDocuments.length === 0 ? (
              <EmptyState />
            ) : (
              <AnimatePresence mode="wait">
                {viewMode === 'grid' ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-3"
                  >
                    {filteredDocuments.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`group relative bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 hover:shadow-md transition-all duration-300 cursor-pointer ${
                          selectedDocuments.has(doc.id) ? 'ring-2 ring-purple-500 bg-purple-50' : ''
                        }`}
                        onClick={() => toggleDocumentSelection(doc.id)}
                      >
                        {/* Selection Checkbox */}
                        <div className="absolute top-3 right-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                            selectedDocuments.has(doc.id)
                              ? 'bg-purple-500 border-purple-500'
                              : 'border-gray-300 group-hover:border-purple-300'
                          }`}>
                            {selectedDocuments.has(doc.id) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </div>

                        {/* File Icon */}
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`w-12 h-12 bg-gradient-to-r ${getFileColor(doc.type, doc.name)} rounded-lg flex items-center justify-center`}>
                            {getFileIcon(doc.type, doc.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate text-gray-900">{doc.name}</h3>
                            <p className="text-xs text-gray-500 capitalize">{doc.type}</p>
                          </div>
                        </div>

                        {/* File Details */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDocumentToDelete(doc.id);
                                }}
                                className="border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white border border-gray-200">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-gray-900">Delete Document</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600">
                                  Are you sure you want to delete "{doc.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-gray-200 text-gray-600 hover:bg-gray-50">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeleteDocument}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {filteredDocuments.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`group flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-300 ${
                          selectedDocuments.has(doc.id) ? 'ring-2 ring-purple-500 bg-purple-50' : ''
                        }`}
                        onClick={() => toggleDocumentSelection(doc.id)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 bg-gradient-to-r ${getFileColor(doc.type, doc.name)} rounded-lg flex items-center justify-center`}>
                            {getFileIcon(doc.type, doc.name)}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 truncate max-w-xs">{doc.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="capitalize">{doc.type}</span>
                              <span>•</span>
                              <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                            selectedDocuments.has(doc.id)
                              ? 'bg-purple-500 border-purple-500'
                              : 'border-gray-300 group-hover:border-purple-300'
                          }`}>
                            {selectedDocuments.has(doc.id) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDocumentToDelete(doc.id);
                                }}
                                className="border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white border border-gray-200">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-gray-900">Delete Document</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600">
                                  Are you sure you want to delete "{doc.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-gray-200 text-gray-600 hover:bg-gray-50">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeleteDocument}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

              
              </AnimatePresence>
            )}
          </>
        )}
      </div>

      {/* Pagination Controls - Compact version */}
      {totalDocs > 0 && totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pt-4 border-t border-gray-200 bg-white"
        >
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Items per page:</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-20 bg-white border-gray-200 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage <= 1}
                className="border-gray-200 text-gray-600 hover:bg-gray-50"
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
                      className={`w-8 h-8 p-0 ${
                        currentPage === pageNumber 
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
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
                className="border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
