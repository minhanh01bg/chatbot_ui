// Shared Site interface for admin components
export interface Site {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  chat_token?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  status?: 'active' | 'inactive';
  domain?: string;
  settings?: {
    theme?: string;
    language?: string;
    [key: string]: any;
  };
  [key: string]: any; // Allow additional properties
}

// API Document interface (from backend)
export interface ApiDocument {
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

// UI Document interface (for components)
export interface Document {
  id: string;
  name: string;
  siteId: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  size: number;
  type: string;
}

// Documents API Response
export interface DocumentsResponse {
  list_docs: ApiDocument[];
  total_docs: number;
  total_pages: number;
  current_page: number;
  page_size: number;
}

// Chat Message interface
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Crawler Status interface
export interface CrawlerStatus {
  status: string;
  message: string;
  url: string;
  end: boolean;
}

// Crawler History Entry interface
export interface CrawlerHistoryEntry {
  timestamp: string;
  status: string;
  message: string;
  url: string;
}
