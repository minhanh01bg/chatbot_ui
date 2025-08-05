'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { getMySubscriptions } from '@/services/subscription.service';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Subscription } from '@/types/plan';

export default function SubscriptionsPage() {
  const { data: session } = useSession();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    if (session?.accessToken) {
      getMySubscriptions(session.accessToken).then((subscriptions) => {
        setSubscriptions(subscriptions);
      });
    }
  }, [session]);

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

        {/* Subscription Content */}
        {subscriptions.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <CreditCard className="w-6 h-6" />
                No Active Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <div className="space-y-6">
                <div className="text-muted-foreground">
                  <CreditCard className="w-20 h-20 mx-auto mb-6 opacity-40" />
                  <h3 className="text-xl font-semibold mb-2">No Active Subscriptions</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    You don't have any active subscriptions yet. Browse our plans to get started with premium features.
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <Link href="/plans">
                    <Button size="lg" className="px-8">
                      Browse Plans
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {subscriptions.map((subscription) => (
              <Card key={subscription.id} className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{subscription.product_name}</CardTitle>
                        <p className="text-sm text-muted-foreground">Active Subscription</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {subscription.status}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-5 text-sm">
                     <div>
                       <p className="text-muted-foreground">Plan</p>
                       <p className="font-medium">{subscription.product_name}</p>
                     </div>
                     <div>
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-medium">${subscription.plan_price}</p>
                     </div>
                     <div>
                       <p className="text-muted-foreground">Created</p>
                       <p className="font-medium">
                         {new Date(subscription.created_at).toLocaleDateString()}
                       </p>
                     </div>
                     <div>
                       <p className="text-muted-foreground">Expires</p>
                       <p className="font-medium">
                         {subscription.expired_at 
                           ? new Date(subscription.expired_at).toLocaleDateString()
                           : 'No expiry'
                         }
                       </p>
                     </div>
                   </div>
                </CardContent>
                <CardContent className="pt-0">
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1">
                      Manage Billing
                    </Button>
                    <Button variant="destructive" className="flex-1">
                      Cancel Subscription
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="flex justify-center pt-6">
              <Link href="/plans">
                <Button variant="outline">
                  <CreditCard className="w-4 h-4 mr-2" />
                  View All Plans
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
