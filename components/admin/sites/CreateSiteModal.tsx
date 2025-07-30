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
import { Plus, Loader2 } from 'lucide-react';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.domain.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Name and domain are required fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      await createSite(formData);
      
      toast({
        title: 'Success',
        description: 'Site created successfully!',
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
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Site
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Site</DialogTitle>
          <DialogDescription>
            Create a new site with AI chatbot functionality. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Site Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Site Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="My Awesome Site"
                required
              />
            </div>

            {/* Domain */}
            <div className="space-y-2">
              <Label htmlFor="domain">Domain *</Label>
              <Input
                id="domain"
                value={formData.domain}
                onChange={(e) => handleInputChange('domain', e.target.value)}
                placeholder="example.com"
                required
              />
            </div>
          </div>

          {/* OpenAI API Key */}
          <div className="space-y-2">
            <Label htmlFor="openai_api_key">OpenAI API Key</Label>
            <Input
              id="openai_api_key"
              type="password"
              value={formData.openai_api_key}
              onChange={(e) => handleInputChange('openai_api_key', e.target.value)}
              placeholder="sk-..."
            />
            <p className="text-xs text-muted-foreground">
              Optional. If not provided, the system default will be used.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Model Type */}
            <div className="space-y-2">
              <Label htmlFor="model_type">Model Type</Label>
              <select
                id="model_type"
                value={formData.model_type}
                onChange={(e) => handleInputChange('model_type', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-4o-mini">GPT-4o Mini</option>
              </select>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <LanguageSelector
                value={formData.language}
                onValueChange={(value) => handleInputChange('language', value)}
                placeholder="Select language..."
              />
            </div>
          </div>

          {/* Force Language */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="force_language"
              checked={formData.force_language}
              onChange={(e) => handleInputChange('force_language', e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <div className="flex flex-col">
              <Label htmlFor="force_language" className="text-sm font-medium leading-none cursor-pointer">
                Force Language
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Bot will only respond in the selected language
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Site
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
