'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Package,
  Star,
  TrendingUp,
  DollarSign,
  Calendar,
  Tag,
  Grid,
  List,
  Layers,
  Users,
  CreditCard,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Product Interface
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: 'active' | 'inactive' | 'draft';
  stock: number;
  rating: number;
  sales: number;
  image: string;
  createdAt: string;
  tags: string[];
  paypalProductId?: string;
}

// Plan Interface
interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly' | 'lifetime';
  status: 'active' | 'inactive' | 'draft';
  maxUsers: number;
  maxProjects: number;
  maxStorage: number;
  subscribers: number;
  revenue: number;
  productId?: string; // Reference to Product
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Chatbot Solution',
    description: 'Advanced AI-powered chatbot with natural language processing capabilities',
    price: 299.99,
    category: 'AI Tools',
    status: 'active',
    stock: 50,
    rating: 4.8,
    sales: 1250,
    image: '/api/placeholder/300/200',
    createdAt: '2024-01-15',
    tags: ['AI', 'Chatbot', 'Premium'],
    paypalProductId: 'PROD_001'
  },
  {
    id: '2',
    name: 'Basic Chatbot Package',
    description: 'Simple chatbot solution for small businesses',
    price: 99.99,
    category: 'AI Tools',
    status: 'active',
    stock: 100,
    rating: 4.5,
    sales: 890,
    image: '/api/placeholder/300/200',
    createdAt: '2024-01-10',
    tags: ['AI', 'Chatbot', 'Basic'],
    paypalProductId: 'PROD_002'
  }
];

const mockPlans: Plan[] = [
  {
    id: '1',
    name: 'Starter Plan',
    description: 'Perfect for small teams and startups',
    price: 29,
    billingCycle: 'monthly',
    status: 'active',
    maxUsers: 5,
    maxProjects: 10,
    maxStorage: 10,
    subscribers: 1250,
    revenue: 36250,
    productId: '1'
  },
  {
    id: '2',
    name: 'Professional Plan',
    description: 'Ideal for growing businesses',
    price: 99,
    billingCycle: 'monthly',
    status: 'active',
    maxUsers: 25,
    maxProjects: 50,
    maxStorage: 100,
    subscribers: 890,
    revenue: 88110,
    productId: '2'
  }
];

export default function ProductsAndPlansPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [plans, setPlans] = useState<Plan[]>(mockPlans);
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isAddPlanDialogOpen, setIsAddPlanDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const categories = ['all', 'AI Tools', 'Analytics', 'Marketing', 'Development'];
  const statuses = ['all', 'active', 'inactive', 'draft'];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Filter plans
  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || plan.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Product handlers
  const handleAddProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProducts([newProduct, ...products]);
    setIsAddProductDialogOpen(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    // Also remove associated plans
    setPlans(plans.filter(p => p.productId !== productId));
  };

  // Plan handlers
  const handleAddPlan = (planData: Omit<Plan, 'id' | 'subscribers' | 'revenue'>) => {
    const newPlan: Plan = {
      ...planData,
      id: Date.now().toString(),
      subscribers: 0,
      revenue: 0
    };
    setPlans([newPlan, ...plans]);
    setIsAddPlanDialogOpen(false);
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
  };

  const handleDeletePlan = (planId: string) => {
    setPlans(plans.filter(p => p.id !== planId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products & Plans</h1>
          <p className="text-gray-600 mt-1">Manage your products and subscription plans</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">
                <Package className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <AddProductForm onSubmit={handleAddProduct} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddPlanDialogOpen} onOpenChange={setIsAddPlanDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Layers className="w-4 h-4 mr-2" />
                Add Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Plan</DialogTitle>
              </DialogHeader>
              <AddPlanForm onSubmit={handleAddPlan} products={products} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products" className="flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center space-x-2">
            <Layers className="w-4 h-4" />
            <span>Plans ({plans.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          {/* Filters and Search */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status === 'all' ? 'All Status' : status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Products</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {products.filter(p => p.status === 'active').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Sales</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${products.reduce((sum, p) => sum + p.sales, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Star className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid/List */}
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard
                      product={product}
                      onEdit={handleEditProduct}
                      onDelete={handleDeleteProduct}
                      getStatusColor={getStatusColor}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductListItem
                      product={product}
                      onEdit={handleEditProduct}
                      onDelete={handleDeleteProduct}
                      getStatusColor={getStatusColor}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search plans..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center justify-end">
                  <Badge variant="secondary">{filteredPlans.length} plans</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plans Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Layers className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Plans</p>
                    <p className="text-2xl font-bold text-gray-900">{plans.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {plans.reduce((sum, p) => sum + p.subscribers, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${plans.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Plans</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {plans.filter(p => p.status === 'active').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">{plan.name}</CardTitle>
                      <p className="text-gray-600 text-sm mt-1">{plan.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditPlan(plan)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeletePlan(plan.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600">/{plan.billingCycle}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(plan.status)}>
                      {plan.status}
                    </Badge>
                    <div className="text-sm text-gray-500">
                      {plan.subscribers} subscribers
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Team Members:</span>
                      <span className="font-medium">
                        {plan.maxUsers === -1 ? 'Unlimited' : `Up to ${plan.maxUsers}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Projects:</span>
                      <span className="font-medium">
                        {plan.maxProjects === -1 ? 'Unlimited' : `Up to ${plan.maxProjects}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Storage:</span>
                      <span className="font-medium">{plan.maxStorage} GB</span>
                    </div>
                    {plan.productId && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Linked Product:</span>
                        <span className="font-medium">
                          {products.find(p => p.id === plan.productId)?.name || 'Unknown'}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <EditProductForm
              product={editingProduct}
              onSubmit={(updatedProduct) => {
                setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
                setEditingProduct(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Plan Dialog */}
      <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
          </DialogHeader>
          {editingPlan && (
            <EditPlanForm
              plan={editingPlan}
              products={products}
              onSubmit={(updatedPlan) => {
                setPlans(plans.map(p => p.id === updatedPlan.id ? updatedPlan : p));
                setEditingPlan(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Product Card Component
function ProductCard({ 
  product, 
  onEdit, 
  onDelete, 
  getStatusColor 
}: { 
  product: Product; 
  onEdit: (product: Product) => void; 
  onDelete: (id: string) => void; 
  getStatusColor: (status: string) => string;
}) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(product)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(product.id)} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-purple-600 transition-colors">
              {product.name}
            </h3>
            <Badge className={getStatusColor(product.status)}>
              {product.status}
            </Badge>
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-gray-900">${product.price}</span>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{product.rating}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Stock: {product.stock}</span>
            <span>Sales: {product.sales}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-3">
            {product.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Product List Item Component
function ProductListItem({ 
  product, 
  onEdit, 
  onDelete, 
  getStatusColor 
}: { 
  product: Product; 
  onEdit: (product: Product) => void; 
  onDelete: (id: string) => void; 
  getStatusColor: (status: string) => string;
}) {
  return (
    <Card className="hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(product.status)}>
                  {product.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(product)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(product.id)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-1">{product.description}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span>Category: {product.category}</span>
              <span>Stock: {product.stock}</span>
              <span>Sales: {product.sales}</span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{product.rating}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">${product.price}</div>
            <div className="flex flex-wrap gap-1 mt-2 justify-end">
              {product.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Add Product Form Component
function AddProductForm({ onSubmit }: { onSubmit: (data: Omit<Product, 'id' | 'createdAt'>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    status: 'draft' as const,
    stock: '',
    tags: '',
    paypalProductId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      status: formData.status,
      stock: parseInt(formData.stock),
      rating: 0,
      sales: 0,
      image: '/api/placeholder/300/200',
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      paypalProductId: formData.paypalProductId || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {['AI Tools', 'Analytics', 'Marketing', 'Development'].map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="paypalProductId">PayPal Product ID</Label>
          <Input
            id="paypalProductId"
            value={formData.paypalProductId}
            onChange={(e) => setFormData({ ...formData, paypalProductId: e.target.value })}
            placeholder="PROD_XXXXX"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="AI, Chatbot, Premium"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600">
          Add Product
        </Button>
      </div>
    </form>
  );
}

// Add Plan Form Component
function AddPlanForm({ 
  onSubmit, 
  products 
}: { 
  onSubmit: (data: Omit<Plan, 'id' | 'subscribers' | 'revenue'>) => void;
  products: Product[];
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    billingCycle: 'monthly' as const,
    status: 'draft' as const,
    maxUsers: '',
    maxProjects: '',
    maxStorage: '',
    productId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      billingCycle: formData.billingCycle,
      status: formData.status,
      maxUsers: parseInt(formData.maxUsers),
      maxProjects: parseInt(formData.maxProjects),
      maxStorage: parseInt(formData.maxStorage),
      productId: formData.productId || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="plan-name">Plan Name</Label>
          <Input
            id="plan-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="plan-price">Price ($)</Label>
          <Input
            id="plan-price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="plan-description">Description</Label>
        <Textarea
          id="plan-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="billingCycle">Billing Cycle</Label>
          <Select value={formData.billingCycle} onValueChange={(value: any) => setFormData({ ...formData, billingCycle: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="lifetime">Lifetime</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="plan-status">Status</Label>
          <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="maxUsers">Max Users (-1 for unlimited)</Label>
          <Input
            id="maxUsers"
            type="number"
            value={formData.maxUsers}
            onChange={(e) => setFormData({ ...formData, maxUsers: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="maxProjects">Max Projects (-1 for unlimited)</Label>
          <Input
            id="maxProjects"
            type="number"
            value={formData.maxProjects}
            onChange={(e) => setFormData({ ...formData, maxProjects: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="maxStorage">Max Storage (GB)</Label>
          <Input
            id="maxStorage"
            type="number"
            value={formData.maxStorage}
            onChange={(e) => setFormData({ ...formData, maxStorage: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="productId">Linked Product (Optional)</Label>
        <Select value={formData.productId} onValueChange={(value) => setFormData({ ...formData, productId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a product to link" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No product linked</SelectItem>
            {products.map(product => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600">
          Add Plan
        </Button>
      </div>
    </form>
  );
}

// Edit Product Form Component
function EditProductForm({ 
  product, 
  onSubmit 
}: { 
  product: Product; 
  onSubmit: (product: Product) => void;
}) {
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    category: product.category,
    status: product.status,
    stock: product.stock.toString(),
    tags: product.tags.join(', '),
    paypalProductId: product.paypalProductId || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...product,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      status: formData.status,
      stock: parseInt(formData.stock),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      paypalProductId: formData.paypalProductId || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-name">Product Name</Label>
          <Input
            id="edit-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="edit-price">Price ($)</Label>
          <Input
            id="edit-price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="edit-description">Description</Label>
        <Textarea
          id="edit-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['AI Tools', 'Analytics', 'Marketing', 'Development'].map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="edit-status">Status</Label>
          <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-stock">Stock</Label>
          <Input
            id="edit-stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="edit-paypalProductId">PayPal Product ID</Label>
          <Input
            id="edit-paypalProductId"
            value={formData.paypalProductId}
            onChange={(e) => setFormData({ ...formData, paypalProductId: e.target.value })}
            placeholder="PROD_XXXXX"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
        <Input
          id="edit-tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="AI, Chatbot, Premium"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600">
          Update Product
        </Button>
      </div>
    </form>
  );
}

// Edit Plan Form Component
function EditPlanForm({ 
  plan, 
  products,
  onSubmit 
}: { 
  plan: Plan; 
  products: Product[];
  onSubmit: (plan: Plan) => void;
}) {
  const [formData, setFormData] = useState({
    name: plan.name,
    description: plan.description,
    price: plan.price.toString(),
    billingCycle: plan.billingCycle,
    status: plan.status,
    maxUsers: plan.maxUsers.toString(),
    maxProjects: plan.maxProjects.toString(),
    maxStorage: plan.maxStorage.toString(),
    productId: plan.productId || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...plan,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      billingCycle: formData.billingCycle,
      status: formData.status,
      maxUsers: parseInt(formData.maxUsers),
      maxProjects: parseInt(formData.maxProjects),
      maxStorage: parseInt(formData.maxStorage),
      productId: formData.productId || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-plan-name">Plan Name</Label>
          <Input
            id="edit-plan-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="edit-plan-price">Price ($)</Label>
          <Input
            id="edit-plan-price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="edit-plan-description">Description</Label>
        <Textarea
          id="edit-plan-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-billingCycle">Billing Cycle</Label>
          <Select value={formData.billingCycle} onValueChange={(value: any) => setFormData({ ...formData, billingCycle: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="lifetime">Lifetime</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="edit-plan-status">Status</Label>
          <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="edit-maxUsers">Max Users (-1 for unlimited)</Label>
          <Input
            id="edit-maxUsers"
            type="number"
            value={formData.maxUsers}
            onChange={(e) => setFormData({ ...formData, maxUsers: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="edit-maxProjects">Max Projects (-1 for unlimited)</Label>
          <Input
            id="edit-maxProjects"
            type="number"
            value={formData.maxProjects}
            onChange={(e) => setFormData({ ...formData, maxProjects: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="edit-maxStorage">Max Storage (GB)</Label>
          <Input
            id="edit-maxStorage"
            type="number"
            value={formData.maxStorage}
            onChange={(e) => setFormData({ ...formData, maxStorage: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="edit-productId">Linked Product (Optional)</Label>
        <Select value={formData.productId} onValueChange={(value) => setFormData({ ...formData, productId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a product to link" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No product linked</SelectItem>
            {products.map(product => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600">
          Update Plan
        </Button>
      </div>
    </form>
  );
} 