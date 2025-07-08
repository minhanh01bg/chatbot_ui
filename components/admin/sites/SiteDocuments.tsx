'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DocumentsTab from './tabs/DocumentsTab';
import CrawlerTab from './tabs/CrawlerTab';
import { Site } from '@/types/site';

interface SiteDocumentsProps {
  siteId: string;
  site: Site;
}

export default function SiteDocuments({ siteId, site }: SiteDocumentsProps) {
  const [activeTab, setActiveTab] = useState('documents');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Documents for {site?.name || 'Site'}</CardTitle>
          <CardDescription>Manage documents for this site</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="crawler" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Crawler Status
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-4">
            <DocumentsTab siteId={siteId} site={site} />
          </TabsContent>

          <TabsContent value="crawler" className="space-y-4">
            <CrawlerTab siteId={siteId} site={site} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}