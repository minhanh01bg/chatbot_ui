import { CreateProduct, Product } from '@/types/product';

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';

export class ProductService {
  private static getAuthHeaders(token: string) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  static async createProduct(productData: CreateProduct, token: string): Promise<Product> {
    try {
      console.log('Creating product:', {
        name: productData.name,
        period: productData.period,
        featuresCount: productData.features.length
      });

      const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/v1/products`, {
        method: 'POST',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Product creation failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Failed to create product: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Product created successfully:', {
        productId: data.id,
        productName: data.name
      });

      return data;
    } catch (error) {
      console.error('Product service error:', error);
      throw error;
    }
  }

  static async getProducts(token: string): Promise<Product[]> {
    try {
      console.log('Fetching products');

      const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/v1/products`, {
        method: 'GET',
        headers: this.getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Products fetch failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Products fetched successfully:', {
        count: Array.isArray(data) ? data.length : 1
      });

      return Array.isArray(data) ? data : [data];
    } catch (error) {
      console.error('Product service error:', error);
      throw error;
    }
  }

  static async getProduct(productId: string, token: string): Promise<Product> {
    try {
      console.log('Fetching product:', productId);

      const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${productId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Product fetch failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Failed to fetch product: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Product fetched successfully:', {
        productId: data.id,
        productName: data.name
      });

      return data;
    } catch (error) {
      console.error('Product service error:', error);
      throw error;
    }
  }

  static async updateProduct(productId: string, productData: Partial<CreateProduct>, token: string): Promise<Product> {
    try {
      console.log('Updating product:', productId);

      const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${productId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Product update failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Failed to update product: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Product updated successfully:', {
        productId: data.id,
        productName: data.name
      });

      return data;
    } catch (error) {
      console.error('Product service error:', error);
      throw error;
    }
  }

  static async deleteProduct(productId: string, token: string): Promise<void> {
    try {
      console.log('Deleting product:', productId);

      const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${productId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Product deletion failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Failed to delete product: ${response.statusText}`);
      }

      console.log('Product deleted successfully:', productId);
    } catch (error) {
      console.error('Product service error:', error);
      throw error;
    }
  }
} 