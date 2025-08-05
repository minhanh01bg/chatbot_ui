'use client';

import { useSuperAdmin } from '@/hooks/use-superadmin';
import { CreateSubscriptionModal } from '@/components/admin/CreateSubscriptionModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminSubscriptionsPage() {
  const { isSuperAdmin, isLoading, isAuthenticated } = useSuperAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    } else if (!isLoading && !isSuperAdmin) {
      router.push('/admin');
    }
  }, [isSuperAdmin, isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Subscriptions</h1>
        <CreateSubscriptionModal />
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Create and manage user subscriptions. Only superadmin users can access this page.
            </p>
          </CardContent>
        </Card>

        {/* Add more subscription management features here */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Subscription history and management features will be added here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 