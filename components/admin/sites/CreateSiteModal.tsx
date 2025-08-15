'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Loader2, 
  Globe, 
  Key, 
  Sparkles, 
  Zap, 
  Activity, 
  Languages, 
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { LanguageSelector } from '@/components/ui/language-selector';
import { createSite, CreateSiteData } from '@/services/site.service';
import { useToast } from '@/components/ui/use-toast';

interface CreateSiteModalProps {
  onSiteCreated?: () => void;
}

export default function CreateSiteModal({ onSiteCreated }: CreateSiteModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<CreateSiteData>({
    name: '',
    domain: '',
    openai_api_key: '',
    model_type: 'gpt-3.5-turbo',
    language: 'en',
    force_language: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Site name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Site name must be at least 2 characters';
    }

    if (!formData.domain.trim()) {
      newErrors.domain = 'Domain is required';
    } else {
      const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!domainRegex.test(formData.domain)) {
        newErrors.domain = 'Please enter a valid domain name (e.g., example.com)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      await createSite(formData);
      
      toast({
        title: 'Success!',
        description: 'Site created successfully! Your AI chatbot is ready to deploy.',
      });
      
      // Reset form
      setFormData({
        name: '',
        domain: '',
        openai_api_key: '',
        model_type: 'gpt-3.5-turbo',
        language: 'en',
        force_language: false,
      });
      setErrors({});
      
      setOpen(false);
      onSiteCreated?.();
    } catch (error) {
      console.error('Error creating site:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create site',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateSiteData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const getModelInfo = (modelType: string) => {
    switch (modelType) {
      case 'gpt-4':
      case 'gpt-4-turbo':
      case 'gpt-4o':
        return {
          icon: <Sparkles className="h-4 w-4" />,
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          description: 'Most advanced model for complex tasks'
        };
      case 'gpt-4o-mini':
        return {
          icon: <Zap className="h-4 w-4" />,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          description: 'Fast and efficient for most use cases'
        };
      default:
        return {
          icon: <Activity className="h-4 w-4" />,
          color: 'bg-green-100 text-green-800 border-green-200',
          description: 'Balanced performance and cost'
        };
    }
  };

  const modelInfo = getModelInfo(formData.model_type);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
          <Plus className="h-4 w-4" />
          Create Site
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto border-0 shadow-2xl">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
            <Globe className="h-6 w-6 text-purple-600" />
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Create New AI Site
          </DialogTitle>
          <DialogDescription className="text-gray-600 max-w-md mx-auto text-sm">
            Set up your AI-powered chatbot site with advanced configuration options and deployment ready features.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-0 shadow-sm bg-gradient-to-r from-white to-gray-50/30">
            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                    <Globe className="h-5 w-5 text-purple-600" />
                    Basic Information
                  </CardTitle>
              <CardDescription>
                Essential details for your AI chatbot site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Site Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="My Awesome AI Site"
                    className={`transition-all duration-200 ${errors.name ? 'border-red-300 focus:border-red-500' : 'focus:border-purple-500'}`}
                    required
                  />
                  {errors.name && (
                    <div className="flex items-center gap-1 text-red-500 text-xs">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domain" className="text-sm font-medium">
                    Domain *
                  </Label>
                  <Input
                    id="domain"
                    value={formData.domain}
                    onChange={(e) => handleInputChange('domain', e.target.value)}
                    placeholder="example.com"
                    className={`transition-all duration-200 ${errors.domain ? 'border-red-300 focus:border-red-500' : 'focus:border-purple-500'}`}
                    required
                  />
                  {errors.domain && (
                    <div className="flex items-center gap-1 text-red-500 text-xs">
                      <AlertCircle className="h-3 w-3" />
                      {errors.domain}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Configuration */}
          <Card className="border-0 shadow-sm bg-gradient-to-r from-white to-gray-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-purple-600" />
                AI Configuration
              </CardTitle>
              <CardDescription>
                Configure your AI model and API settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* OpenAI API Key */}
              <div className="space-y-2">
                <Label htmlFor="openai_api_key" className="text-sm font-medium flex items-center gap-2">
                  <Key className="h-4 w-4 text-gray-500" />
                  OpenAI API Key
                </Label>
                <Input
                  id="openai_api_key"
                  type="password"
                  value={formData.openai_api_key}
                  onChange={(e) => handleInputChange('openai_api_key', e.target.value)}
                  placeholder="sk-..."
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Optional. System default will be used if not provided.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Model Type */}
                <div className="space-y-2">
                  <Label htmlFor="model_type" className="text-sm font-medium">
                    AI Model
                  </Label>
                  <select
                    id="model_type"
                    value={formData.model_type}
                    onChange={(e) => handleInputChange('model_type', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                    aria-label="Model Type"
                  >
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="gpt-4o-mini">GPT-4o Mini</option>
                  </select>
                  <Badge variant="outline" className={`text-xs ${modelInfo.color} flex items-center gap-1 w-fit`}>
                    {modelInfo.icon}
                    {modelInfo.description}
                  </Badge>
                </div>

                {/* Language */}
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-sm font-medium flex items-center gap-2">
                    <Languages className="h-4 w-4 text-gray-500" />
                    Language
                  </Label>
                  <LanguageSelector
                    value={formData.language}
                    onValueChange={(value) => handleInputChange('language', value)}
                    placeholder="Select language..."
                  />
                </div>
              </div>

              {/* Force Language */}
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="force_language"
                  checked={formData.force_language}
                  onChange={(e) => handleInputChange('force_language', e.target.checked)}
                  aria-label="Force Language"
                  className="mt-1 h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div className="flex flex-col">
                  <Label htmlFor="force_language" className="text-sm font-medium leading-none cursor-pointer">
                    Force Language Response
                  </Label>
                  <p className="text-xs text-gray-600 mt-1">
                    Bot will only respond in the selected language, regardless of user input
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Site...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Site
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
