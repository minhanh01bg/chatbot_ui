'use client';

import { useState, useEffect } from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { ProductService } from '@/services/product.service';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Loader2, Edit, Trash2, Eye, Plus } from 'lucide-react';
import CreateProductModal from './CreateProductModal';

export default function ProductsList() {
  const { user, isAuthenticated, isSuperAdmin } = useCurrentUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    if (!isAuthenticated || !user?.accessToken) {
      setError('Authentication required');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const fetchedProducts = await ProductService.getProducts(user.accessToken);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch products');
      toast.error('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [isAuthenticated, user]);

  const handleProductCreated = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    toast.success('Product created successfully!');
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!user?.accessToken) {
      toast.error('Authentication required');
      return;
    }

    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await ProductService.deleteProduct(productId, user.accessToken);
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete product');
    }
  };

  const formatLimits = (limits: any) => {
    const formatted = [];
    if (limits.sites) formatted.push(`${limits.sites} sites`);
    if (limits.documents) formatted.push(`${limits.documents} documents`);
    if (limits.users) formatted.push(`${limits.users} users`);
    if (limits.api_calls) formatted.push(`${limits.api_calls} API calls`);
    if (limits.storage_gb) formatted.push(`${limits.storage_gb}GB storage`);
    return formatted.join(', ');
  };

  const formatFeatures = (features: string[]) => {
    return features.slice(0, 2).join(', ') + (features.length > 2 ? ` +${features.length - 2} more` : '');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading products...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Access denied. Super admin privileges required.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchProducts}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Products</CardTitle>
            <CardDescription>
              Manage your subscription products and plans
            </CardDescription>
          </div>
          <CreateProductModal onProductCreated={handleProductCreated} />
        </div>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No products found</p>
            <CreateProductModal onProductCreated={handleProductCreated} />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Limits</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {product.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {product.period}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatLimits(product.limits)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatFeatures(product.features)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={product.is_active ? "default" : "secondary"}>
                        {product.is_active ? "Active" : "Inactive"}
                      </Badge>
                      {product.is_custom && (
                        <Badge variant="outline">Custom</Badge>
                      )}
                      {product.is_self_sigup_allowed && (
                        <Badge variant="outline">Self Signup</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // TODO: Implement view product details
                          toast.info('View product details - coming soon');
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // TODO: Implement edit product
                          toast.info('Edit product - coming soon');
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
} 