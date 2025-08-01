'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/plans">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Plans
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">My Subscription</h1>
              <p className="text-muted-foreground">Manage your subscription and billing</p>
            </div>
          </div>

          <Link href="/plans">
            <Button>
              Browse Plans
            </Button>
          </Link>
        </div>

        {/* Placeholder Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Subscription Management
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="space-y-4">
              <div className="text-muted-foreground">
                <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Subscription Management</p>
                <p>This feature is being developed. You can manage your plans from the Plans page for now.</p>
              </div>

              <div className="flex gap-2 justify-center">
                <Link href="/plans">
                  <Button>
                    View Plans
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
