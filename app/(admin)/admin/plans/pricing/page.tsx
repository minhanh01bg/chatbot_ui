'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, DollarSign, TrendingUp, Users, Calendar } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface PricingTier {
  id: string;
  planName: string;
  billingCycle: 'monthly' | 'yearly' | 'lifetime';
  price: number;
  originalPrice?: number;
  currency: string;
  status: 'active' | 'inactive' | 'promotional';
  features: string[];
  maxUsers: number;
  maxProjects: number;
  maxStorage: number;
  isPopular: boolean;
  isCustom: boolean;
  subscribers: number;
  revenue: number;
  createdAt: string;
}

const mockPricingTiers: PricingTier[] = [
  {
    id: '1',
    planName: 'Starter',
    billingCycle: 'monthly',
    price: 29,
    currency: 'USD',
    status: 'active',
    features: ['Up to 5 team members', 'Basic analytics', 'Email support'],
    maxUsers: 5,
    maxProjects: 10,
    maxStorage: 10,
    isPopular: false,
    isCustom: false,
    subscribers: 1250,
    revenue: 36250,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    planName: 'Starter',
    billingCycle: 'yearly',
    price: 290,
    originalPrice: 348,
    currency: 'USD',
    status: 'active',
    features: ['Up to 5 team members', 'Basic analytics', 'Email support', '2 months free'],
    maxUsers: 5,
    maxProjects: 10,
    maxStorage: 10,
    isPopular: false,
    isCustom: false,
    subscribers: 890,
    revenue: 258100,
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    planName: 'Professional',
    billingCycle: 'monthly',
    price: 99,
    currency: 'USD',
    status: 'active',
    features: ['Up to 25 team members', 'Advanced analytics', 'Priority support', 'Advanced integrations'],
    maxUsers: 25,
    maxProjects: 50,
    maxStorage: 100,
    isPopular: true,
    isCustom: false,
    subscribers: 650,
    revenue: 64350,
    createdAt: '2024-01-12'
  },
  {
    id: '4',
    planName: 'Professional',
    billingCycle: 'yearly',
    price: 990,
    originalPrice: 1188,
    currency: 'USD',
    status: 'active',
    features: ['Up to 25 team members', 'Advanced analytics', 'Priority support', 'Advanced integrations', '2 months free'],
    maxUsers: 25,
    maxProjects: 50,
    maxStorage: 100,
    isPopular: true,
    isCustom: false,
    subscribers: 420,
    revenue: 415800,
    createdAt: '2024-01-08'
  },
  {
    id: '5',
    planName: 'Enterprise',
    billingCycle: 'monthly',
    price: 299,
    currency: 'USD',
    status: 'active',
    features: ['Unlimited team members', 'Enterprise analytics', 'Dedicated support', 'Custom branding'],
    maxUsers: -1,
    maxProjects: -1,
    maxStorage: 1000,
    isPopular: false,
    isCustom: false,
    subscribers: 180,
    revenue: 53820,
    createdAt: '2024-01-20'
  }
];

export default function PricingPage() {
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>(mockPricingTiers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('all');
  const [selectedCycle, setSelectedCycle] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredTiers = pricingTiers.filter(tier => {
    const matchesSearch = tier.planName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = selectedPlan === 'all' || tier.planName === selectedPlan;
    const matchesCycle = selectedCycle === 'all' || tier.billingCycle === selectedCycle;
    
    return matchesSearch && matchesPlan && matchesCycle;
  });

  const handleAddTier = (tierData: Omit<PricingTier, 'id' | 'createdAt' | 'subscribers' | 'revenue'>) => {
    const newTier: PricingTier = {
      ...tierData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      subscribers: 0,
      revenue: 0
    };
    setPricingTiers([newTier, ...pricingTiers]);
    setIsAddDialogOpen(false);
  };

  const handleDeleteTier = (tierId: string) => {
    setPricingTiers(pricingTiers.filter(t => t.id !== tierId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'promotional': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = pricingTiers.reduce((sum, t) => sum + t.revenue, 0);
  const totalSubscribers = pricingTiers.reduce((sum, t) => sum + t.subscribers, 0);
  const activeTiers = pricingTiers.filter(t => t.status === 'active').length;
  const popularTiers = pricingTiers.filter(t => t.isPopular).length;

  const plans = ['all', ...Array.from(new Set(pricingTiers.map(t => t.planName)))];
  const cycles = ['all', 'monthly', 'yearly', 'lifetime'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pricing Management</h1>
          <p className="text-gray-600 mt-1">Manage pricing tiers and billing cycles</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Pricing Tier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Pricing Tier</DialogTitle>
            </DialogHeader>
            <AddPricingForm onSubmit={handleAddTier} />
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
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger>
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                {plans.map(plan => (
                  <SelectItem key={plan} value={plan}>
                    {plan === 'all' ? 'All Plans' : plan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCycle} onValueChange={setSelectedCycle}>
              <SelectTrigger>
                <SelectValue placeholder="Billing Cycle" />
              </SelectTrigger>
              <SelectContent>
                {cycles.map(cycle => (
                  <SelectItem key={cycle} value={cycle}>
                    {cycle === 'all' ? 'All Cycles' : cycle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center justify-end">
              <Badge variant="secondary">{filteredTiers.length} tiers</Badge>
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
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-gray-900">{totalSubscribers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tiers</p>
                <p className="text-2xl font-bold text-gray-900">{activeTiers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Popular Plans</p>
                <p className="text-2xl font-bold text-gray-900">{popularTiers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Tiers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Tiers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Plan</th>
                  <th className="text-left p-3 font-medium">Billing Cycle</th>
                  <th className="text-left p-3 font-medium">Price</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Subscribers</th>
                  <th className="text-left p-3 font-medium">Revenue</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTiers.map((tier) => (
                  <tr key={tier.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-gray-900">{tier.planName}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          {tier.isPopular && (
                            <Badge className="bg-purple-100 text-purple-800 text-xs">Popular</Badge>
                          )}
                          {tier.isCustom && (
                            <Badge className="bg-orange-100 text-orange-800 text-xs">Custom</Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="capitalize">
                        {tier.billingCycle}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-gray-900">
                          ${tier.price}
                          {tier.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ${tier.originalPrice}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {tier.billingCycle === 'monthly' && '/month'}
                          {tier.billingCycle === 'yearly' && '/year'}
                          {tier.billingCycle === 'lifetime' && 'one-time'}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(tier.status)}>
                        {tier.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="text-sm text-gray-600">
                        {tier.subscribers.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-gray-900">
                        ${tier.revenue.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteTier(tier.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Add Pricing Form Component
function AddPricingForm({ onSubmit }: { onSubmit: (data: Omit<PricingTier, 'id' | 'createdAt' | 'subscribers' | 'revenue'>) => void }) {
  const [formData, setFormData] = useState({
    planName: '',
    billingCycle: 'monthly' as const,
    price: '',
    originalPrice: '',
    currency: 'USD',
    status: 'active' as const,
    features: [] as string[],
    maxUsers: '',
    maxProjects: '',
    maxStorage: '',
    isPopular: false,
    isCustom: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      planName: formData.planName,
      billingCycle: formData.billingCycle,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      currency: formData.currency,
      status: formData.status,
      features: formData.features,
      maxUsers: parseInt(formData.maxUsers),
      maxProjects: parseInt(formData.maxProjects),
      maxStorage: parseInt(formData.maxStorage),
      isPopular: formData.isPopular,
      isCustom: formData.isCustom
    });
  };

  const availableFeatures = [
    'Up to 5 team members', 'Up to 25 team members', 'Unlimited team members',
    'Basic analytics', 'Advanced analytics', 'Enterprise analytics',
    'Email support', 'Priority support', 'Dedicated support',
    'Advanced integrations', 'Custom branding', 'API access',
    '2 months free', 'Custom integrations', 'White-label solution'
  ];

  const toggleFeature = (feature: string) => {
    setFormData({
      ...formData,
      features: formData.features.includes(feature)
        ? formData.features.filter(f => f !== feature)
        : [...formData.features, feature]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="planName">Plan Name</Label>
          <Input
            id="planName"
            value={formData.planName}
            onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
            required
          />
        </div>
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
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="originalPrice">Original Price (optional)</Label>
          <Input
            id="originalPrice"
            type="number"
            step="0.01"
            value={formData.originalPrice}
            onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
            placeholder="For discounts"
          />
        </div>
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
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
              <SelectItem value="promotional">Promotional</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="isPopular"
              checked={formData.isPopular}
              onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked })}
            />
            <Label htmlFor="isPopular">Popular Plan</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isCustom"
              checked={formData.isCustom}
              onCheckedChange={(checked) => setFormData({ ...formData, isCustom: checked })}
            />
            <Label htmlFor="isCustom">Custom Plan</Label>
          </div>
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
        <Label>Features</Label>
        <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto">
          {availableFeatures.map(feature => (
            <button
              key={feature}
              type="button"
              className={`px-3 py-1 rounded-full text-sm ${
                formData.features.includes(feature)
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-100 text-gray-600 border border-gray-300'
              }`}
              onClick={() => toggleFeature(feature)}
            >
              {feature}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600">
          Add Pricing Tier
        </Button>
      </div>
    </form>
  );
} 