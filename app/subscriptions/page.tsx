'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { getMySubscriptions } from '@/services/subscription.service';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import type { Subscription } from '@/types/plan';
import { cancelMySubscription } from '@/services/subscription.service';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function SubscriptionsPage() {
  const { data: session } = useSession();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [subscriptionToCancel, setSubscriptionToCancel] = useState<Subscription | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (session?.accessToken) {
      getMySubscriptions(session.accessToken).then((subscriptions) => {
        setSubscriptions(subscriptions);
      });
    }
  }, [session]);

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!subscriptionToCancel) return;
    
    setIsCancelling(true);
    try {
      await cancelMySubscription(subscriptionId);
      setSubscriptions(subscriptions.filter((subscription) => subscription.id !== subscriptionId));
      toast.success('Subscription canceled successfully');
      setIsCancelDialogOpen(false);
      setSubscriptionToCancel(null);
    } catch (error) {
      toast.error('Failed to cancel subscription');
      console.error('Failed to cancel subscription:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  const openCancelDialog = (subscription: Subscription) => {
    setSubscriptionToCancel(subscription);
    setIsCancelDialogOpen(true);
  };

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
            {subscriptions.map((subscription) => {
              const isActive = subscription.status === 'active';
              const isCancelled = subscription.status === 'cancelled';
              const isExpired = subscription.status === 'expired';
              
              const getBorderColor = () => {
                if (isActive) return 'border-l-green-500';
                if (isCancelled || isExpired) return 'border-l-red-500';
                return 'border-l-gray-500';
              };
              
              const getIconBgColor = () => {
                if (isActive) return 'bg-green-100';
                if (isCancelled || isExpired) return 'bg-red-100';
                return 'bg-gray-100';
              };
              
              const getIconColor = () => {
                if (isActive) return 'text-green-600';
                if (isCancelled || isExpired) return 'text-red-600';
                return 'text-gray-600';
              };
              
              const getStatusBgColor = () => {
                if (isActive) return 'bg-green-100 text-green-800';
                if (isCancelled || isExpired) return 'bg-red-100 text-red-800';
                return 'bg-gray-100 text-gray-800';
              };
              
              const getStatusText = () => {
                if (isActive) return 'Active Subscription';
                if (isCancelled) return 'Cancelled Subscription';
                if (isExpired) return 'Expired Subscription';
                return 'Subscription';
              };
              
              return (
                <Card key={subscription.id} className={`border-l-4 ${getBorderColor()}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${getIconBgColor()} rounded-full flex items-center justify-center`}>
                          <CreditCard className={`w-5 h-5 ${getIconColor()}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{(subscription as any).product_name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{getStatusText()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBgColor()}`}>
                          {subscription.status}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-5 text-sm">
                       <div>
                         <p className="text-muted-foreground">Plan</p>
                         <p className="font-medium">{(subscription as any).product_name}</p>
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
                       
                       {isActive && (
                         <Button 
                           variant="destructive" 
                           className="flex-1" 
                           onClick={() => openCancelDialog(subscription)}
                         >
                           Cancel Subscription
                         </Button>
                       )}
                       
                       {(isCancelled || isExpired) && (
                         <Button 
                           variant="default" 
                           className="flex-1"
                           asChild
                         >
                           <Link href="/plans">
                             Renew Subscription
                           </Link>
                         </Button>
                       )}
                     </div>
                   </CardContent>
                </Card>
              );
            })}
            
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

      {/* Cancel Confirmation Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription to{' '}
              <span className="font-semibold">{(subscriptionToCancel as any)?.product_name}</span>?
              <br />
              <br />
              This action cannot be undone. You will lose access to premium features at the end of your current billing period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCancelDialogOpen(false);
                setSubscriptionToCancel(null);
              }}
              disabled={isCancelling}
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={() => subscriptionToCancel && handleCancelSubscription(subscriptionToCancel.id)}
              disabled={isCancelling}
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
