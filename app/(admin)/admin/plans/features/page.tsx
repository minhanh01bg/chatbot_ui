'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Zap, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
  type: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'beta';
  plans: string[];
  usage: number;
  createdAt: string;
  icon: string;
}

const mockFeatures: Feature[] = [
  {
    id: '1',
    name: 'Team Collaboration',
    description: 'Real-time collaboration tools for team members',
    category: 'Collaboration',
    type: 'basic',
    status: 'active',
    plans: ['Starter', 'Professional', 'Enterprise'],
    usage: 1250,
    createdAt: '2024-01-15',
    icon: '👥'
  },
  {
    id: '2',
    name: 'Advanced Analytics',
    description: 'Comprehensive analytics and reporting dashboard',
    category: 'Analytics',
    type: 'premium',
    status: 'active',
    plans: ['Professional', 'Enterprise'],
    usage: 890,
    createdAt: '2024-01-10',
    icon: '📊'
  },
  {
    id: '3',
    name: 'API Access',
    description: 'Full API access for custom integrations',
    category: 'Development',
    type: 'enterprise',
    status: 'active',
    plans: ['Enterprise'],
    usage: 320,
    createdAt: '2024-01-20',
    icon: '🔌'
  },
  {
    id: '4',
    name: 'Custom Branding',
    description: 'White-label solution with custom branding',
    category: 'Branding',
    type: 'enterprise',
    status: 'active',
    plans: ['Enterprise'],
    usage: 150,
    createdAt: '2024-01-25',
    icon: '🎨'
  },
  {
    id: '5',
    name: 'Priority Support',
    description: '24/7 priority customer support',
    category: 'Support',
    type: 'premium',
    status: 'active',
    plans: ['Professional', 'Enterprise'],
    usage: 650,
    createdAt: '2024-01-12',
    icon: '🎧'
  },
  {
    id: '6',
    name: 'AI-Powered Insights',
    description: 'Machine learning insights and recommendations',
    category: 'AI',
    type: 'premium',
    status: 'beta',
    plans: ['Professional', 'Enterprise'],
    usage: 280,
    createdAt: '2024-01-18',
    icon: '🤖'
  }
];

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>(mockFeatures);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || feature.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || feature.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddFeature = (featureData: Omit<Feature, 'id' | 'createdAt' | 'usage'>) => {
    const newFeature: Feature = {
      ...featureData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      usage: 0
    };
    setFeatures([newFeature, ...features]);
    setIsAddDialogOpen(false);
  };

  const handleDeleteFeature = (featureId: string) => {
    setFeatures(features.filter(f => f.id !== featureId));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'basic': return 'bg-green-100 text-green-800';
      case 'premium': return 'bg-blue-100 text-blue-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'beta': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalUsage = features.reduce((sum, f) => sum + f.usage, 0);
  const activeFeatures = features.filter(f => f.status === 'active').length;
  const betaFeatures = features.filter(f => f.status === 'beta').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feature Management</h1>
          <p className="text-gray-600 mt-1">Manage plan features and capabilities</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Feature
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Feature</DialogTitle>
            </DialogHeader>
            <AddFeatureForm onSubmit={handleAddFeature} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="beta">Beta</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center justify-end">
              <Badge variant="secondary">{filteredFeatures.length} features</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Features</p>
                <p className="text-2xl font-bold text-gray-900">{features.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Features</p>
                <p className="text-2xl font-bold text-gray-900">{activeFeatures}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Beta Features</p>
                <p className="text-2xl font-bold text-gray-900">{betaFeatures}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsage.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.map((feature) => (
          <Card key={feature.id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{feature.icon}</div>
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900">{feature.name}</CardTitle>
                    <p className="text-sm text-gray-500">{feature.category}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteFeature(feature.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <Badge className={getTypeColor(feature.type)}>
                  {feature.type}
                </Badge>
                <Badge className={getStatusColor(feature.status)}>
                  {feature.status}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Plans:</span> {feature.plans.join(', ')}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Usage:</span> {feature.usage.toLocaleString()} users
                </div>
              </div>
              
              <div className="mt-4 text-xs text-gray-400">
                Created: {feature.createdAt}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Add Feature Form Component
function AddFeatureForm({ onSubmit }: { onSubmit: (data: Omit<Feature, 'id' | 'createdAt' | 'usage'>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    type: 'basic' as const,
    status: 'active' as const,
    plans: [] as string[],
    icon: '⚡'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      description: formData.description,
      category: formData.category,
      type: formData.type,
      status: formData.status,
      plans: formData.plans,
      icon: formData.icon
    });
  };

  const availablePlans = ['Starter', 'Professional', 'Enterprise'];
  const icons = ['⚡', '👥', '📊', '🔌', '🎨', '🎧', '🤖', '🔒', '📱', '🌐'];

  const togglePlan = (plan: string) => {
    setFormData({
      ...formData,
      plans: formData.plans.includes(plan)
        ? formData.plans.filter(p => p !== plan)
        : [...formData.plans, plan]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Feature Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
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
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="beta">Beta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Icon</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {icons.map(icon => (
              <button
                key={icon}
                type="button"
                className={`text-xl p-2 rounded ${formData.icon === icon ? 'bg-blue-100 border-2 border-blue-500' : 'hover:bg-gray-100'}`}
                onClick={() => setFormData({ ...formData, icon })}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Label>Available Plans</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {availablePlans.map(plan => (
            <button
              key={plan}
              type="button"
              className={`px-3 py-1 rounded-full text-sm ${
                formData.plans.includes(plan)
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-100 text-gray-600 border border-gray-300'
              }`}
              onClick={() => togglePlan(plan)}
            >
              {plan}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600">
          Add Feature
        </Button>
      </div>
    </form>
  );
} 