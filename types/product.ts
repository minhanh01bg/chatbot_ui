export interface Limits {
  sites?: number;
  documents?: number;
  users?: number;
  api_calls?: number;
  storage_gb?: number;
  [key: string]: number | undefined;
}

export interface CreateProduct {
  name: string;
  limits: Limits;
  period: string;
  features: string[];
  is_custom?: boolean;
  description: string;
  is_self_sigup_allowed?: boolean;
}

export interface Product extends CreateProduct {
  id: string;
  created_at: string;
  updated_at: string;
  is_active?: boolean;
  price?: number;
  currency?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  period: string;
  price: number;
  currency: string;
  limits: {
    sites: number;
    documents: number;
    users: number;
    api_calls: number;
    storage_gb: number;
  };
  features: string[];
  is_custom: boolean;
  is_self_sigup_allowed: boolean;
  is_active: boolean;
} 