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

export const get_documents = async (skip: number = 0, limit: number = 10): Promise<DocumentsResponse> => {
  try {
    const response = await fetch(`/admin/documents/api?skip=${skip}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
}

export const get_document_by_id = async (id: string): Promise<Document> => {
  try {
    const response = await fetch(`/admin/documents/api/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching document: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch document with id ${id}:`, error);
    throw error;
  }
}