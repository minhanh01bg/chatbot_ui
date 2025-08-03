'use client';

import { useState } from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { ProductService } from '@/services/product.service';
import { CreateProduct, ProductFormData } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Loader2 } from 'lucide-react';

interface CreateProductModalProps {
  onProductCreated?: (product: any) => void;
}

export default function CreateProductModal({ onProductCreated }: CreateProductModalProps) {
  const { user, isAuthenticated } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    period: 'monthly',
    price: 0,
    currency: 'USD',
    limits: {
      sites: 1,
      documents: 100,
      users: 1,
      api_calls: 1000,
      storage_gb: 1,
    },
    features: [''],
    is_custom: false,
    is_self_sigup_allowed: false,
    is_active: true,
  });

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLimitsChange = (field: keyof ProductFormData['limits'], value: number) => {
    setFormData(prev => ({
      ...prev,
      limits: {
        ...prev.limits,
        [field]: value
      }
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user?.accessToken) {
      toast.error('Authentication required');
      return;
    }

    // Validate form
    if (!formData.name || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.features.some(feature => !feature.trim())) {
      toast.error('Please fill in all features or remove empty ones');
      return;
    }

    setIsLoading(true);

    try {
      const productData: CreateProduct = {
        name: formData.name,
        description: formData.description,
        period: formData.period,
        limits: formData.limits,
        features: formData.features.filter(f => f.trim()),
        is_custom: formData.is_custom,
        is_self_sigup_allowed: formData.is_self_sigup_allowed,
      };

      const createdProduct = await ProductService.createProduct(productData, user.accessToken);
      
      toast.success('Product created successfully!');
      setIsOpen(false);
      onProductCreated?.(createdProduct);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        period: 'monthly',
        price: 0,
        currency: 'USD',
        limits: {
          sites: 1,
          documents: 100,
          users: 1,
          api_calls: 1000,
          storage_gb: 1,
        },
        features: [''],
        is_custom: false,
        is_self_sigup_allowed: false,
        is_active: true,
      });
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
          <DialogDescription>
            Create a new product that can be used for subscription plans.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">Billing Period *</Label>
                  <Select value={formData.period} onValueChange={(value) => handleInputChange('period', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter product description"
                  rows={3}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Limits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage Limits</CardTitle>
              <CardDescription>Set usage limits for this product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sites">Sites</Label>
                  <Input
                    id="sites"
                    type="number"
                    value={formData.limits.sites}
                    onChange={(e) => handleLimitsChange('sites', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documents">Documents</Label>
                  <Input
                    id="documents"
                    type="number"
                    value={formData.limits.documents}
                    onChange={(e) => handleLimitsChange('documents', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="users">Users</Label>
                  <Input
                    id="users"
                    type="number"
                    value={formData.limits.users}
                    onChange={(e) => handleLimitsChange('users', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api_calls">API Calls</Label>
                  <Input
                    id="api_calls"
                    type="number"
                    value={formData.limits.api_calls}
                    onChange={(e) => handleLimitsChange('api_calls', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storage_gb">Storage (GB)</Label>
                  <Input
                    id="storage_gb"
                    type="number"
                    value={formData.limits.storage_gb}
                    onChange={(e) => handleLimitsChange('storage_gb', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Features</CardTitle>
              <CardDescription>Add features included in this product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                  />
                  {formData.features.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addFeature}>
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Custom Product</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow custom configuration for this product
                  </p>
                </div>
                <Switch
                  checked={formData.is_custom}
                  onCheckedChange={(checked) => handleInputChange('is_custom', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Self Signup Allowed</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to sign up for this product directly
                  </p>
                </div>
                <Switch
                  checked={formData.is_self_sigup_allowed}
                  onCheckedChange={(checked) => handleInputChange('is_self_sigup_allowed', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Active</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this product available for use
                  </p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Product'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 