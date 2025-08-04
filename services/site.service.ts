import { Site } from '@/types/site';
import { getClientAuthToken } from '@/lib/auth-utils';

export interface CreateSiteData {
  name: string;
  domain: string;
  openai_api_key?: string;
  model_type?: string;
  language?: string;
  force_language?: boolean;
}

export const getSites = async (skip = 0, limit = 10): Promise<Site[]> => {
  const response = await fetch(`/api/sites?skip=${skip}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch sites');
  }

  const data = await response.json();
  return data;
};

export const getSiteById = async (siteId: string): Promise<Site> => {
  const accessToken = getClientAuthToken();
  
  if (!accessToken) {
    throw new Error('Access token not found');
  }

  const response = await fetch(`/api/sites/${siteId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch site');
  }

  const data = await response.json();
  return data;
};

export const createSite = async (siteData: CreateSiteData): Promise<Site> => {
  const accessToken = getClientAuthToken();
  
  if (!accessToken) {
    throw new Error('Access token not found');
  }

  const response = await fetch('/api/admin/sites/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(siteData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create site');
  }

  return response.json();
};

export const updateSite = async (siteId: string, siteData: Partial<Site>): Promise<Site> => {
  const response = await fetch(`/api/sites/${siteId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(siteData),
  });

  if (!response.ok) {
    throw new Error('Failed to update site');
  }

  return response.json();
};

export const deleteSite = async (siteId: string, accessToken: string): Promise<void> => {
  const response = await fetch(`/api/sites/${siteId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete site');
  }
}; 