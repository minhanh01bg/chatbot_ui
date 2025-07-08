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
    <Card className="flex flex-col h-[calc(100vh-10rem)] p-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 flex-shrink-0">
        <div>
          <CardTitle>Documents for {site?.name || 'Site'}</CardTitle>
          <CardDescription>Manage documents for this site</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 p-0">
        <div className="p-6 h-full flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="crawler" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Crawler Status
              </TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="flex-1 min-h-0 mt-4">
              <DocumentsTab siteId={siteId} site={site} />
            </TabsContent>

            <TabsContent value="crawler" className="flex-1 min-h-0 mt-4">
              <CrawlerTab siteId={siteId} site={site} />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}