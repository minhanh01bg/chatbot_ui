interface Site {
  _id: string;
  name: string;
  description: string;
  url: string;
  created_at: string;
  updated_at: string;
  document_count: number;
}

interface SitesResponse {
  sites: Site[];
//   total: number;
//   skip: number;
//   limit: number;
}

export const get_sites = async (): Promise<SitesResponse> => {
  try {
    const response = await fetch(`/admin/sites/api`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching sites: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch sites:', error);
    throw error;
  }
}

export const get_site_by_id = async (id: string): Promise<Site> => {
  try {
    const response = await fetch(`/admin/sites/api/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching site: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch site with id ${id}:`, error);
    throw error;
  }
}

// Lấy tất cả documents thuộc về một site cụ thể
export const get_site_documents = async (siteId: string, skip: number = 0, limit: number = 10) => {
  try {
    const response = await fetch(`/admin/sites/api/${siteId}/documents?skip=${skip}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching site documents: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch documents for site ${siteId}:`, error);
    throw error;
  }
}

// Thêm site mới
export const create_site = async (siteData: Omit<Site, '_id' | 'created_at' | 'updated_at' | 'document_count'>) => {
  try {
    const response = await fetch('/admin/sites/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(siteData),
    });

    if (!response.ok) {
      throw new Error(`Error creating site: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to create site:', error);
    throw error;
  }
}

// Cập nhật site
export const update_site = async (id: string, siteData: Partial<Omit<Site, '_id' | 'created_at' | 'updated_at'>>) => {
  try {
    const response = await fetch(`/admin/sites/api/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(siteData),
    });

    if (!response.ok) {
      throw new Error(`Error updating site: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to update site ${id}:`, error);
    throw error;
  }
}

// Xóa site
export const delete_site = async (id: string) => {
  try {
    const response = await fetch(`/admin/sites/api/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error deleting site: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to delete site ${id}:`, error);
    throw error;
  }
} 