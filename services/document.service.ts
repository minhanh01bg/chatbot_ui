interface Document {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  vectorstore_id: string;
  file_name: string;
}

interface DocumentsResponse {
  documents: Document[];
  total: number;
  skip: number;
  limit: number;
}

// Helper function to get the access token from cookie or localStorage
const getAccessToken = async (): Promise<string> => {
  // Try to get from localStorage in the browser
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) return token;
  }
  
  // If running on server, try to get from cookie
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    if (token) return token;
  } catch (e) {
    console.error('Error getting access token from cookie:', e);
  }
  
  // Fallback to empty string if no token found
  return '';
};

// Generic documents API - for app-wide documents
export const get_documents = async (skip: number = 0, limit: number = 10): Promise<DocumentsResponse> => {
  try {
    // Get the access token from cookie if available
    const response = await fetch(`/admin/documents/api?skip=${skip}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAccessToken()}`
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching documents: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch documents:', error);
    throw error;
  }
};

// Get documents for a specific site using chat_token
export const get_site_documents_with_token = async (
  siteId: string,
  chatToken: string,
  skip: number,
  limit: number,
  format: string = 'file'
): Promise<DocumentsResponse> => {
  try {
    // Call Next.js API route in admin/sites/api instead of backend directly
    const response = await fetch(`/api/sites/documents?skip=${skip}&limit=${limit}&format=${format}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${chatToken}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error fetching documents: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch documents for site ${siteId}:`, error);
    throw error;
  }
};

// Crawler data automatic API - for crawling website data (via Next.js API route)
export const crawler_data_automatic = async (url: string, chatToken: string): Promise<any> => {
  try {
    // Call Next.js API route in admin/sites/api instead of backend directly
    const response = await fetch(`/api/sites/crawler?url=${encodeURIComponent(url)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${chatToken}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `Crawler failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to start crawler for URL ${url}:`, error);
    throw error;
  }
};

// Stop crawler API - for stopping crawler process
export const stop_crawler = async (chatToken: string): Promise<any> => {
  try {
    // Call Next.js API route in admin/sites/api to stop crawler
    const response = await fetch('/api/sites/crawler/stop', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${chatToken}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `Stop crawler failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to stop crawler:', error);
    throw error;
  }
};
