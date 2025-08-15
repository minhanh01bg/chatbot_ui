'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Sparkles, CheckCircle, AlertCircle, Clock, Users, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { getMySubscriptions } from '@/services/subscription.service';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';
import type { Subscription } from '@/types/plan';
import { cancelMySubscription } from '@/services/subscription.service';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Footer } from '@/components/footer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function SubscriptionsPage() {
  const { data: session, status } = useSession();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [subscriptionToCancel, setSubscriptionToCancel] = useState<Subscription | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedRef = useRef(false);

  const loadSubscriptions = async () => {
    if (session?.accessToken && !hasLoadedRef.current) {
      setIsLoading(true);
      try {
        const subscriptions = await getMySubscriptions(session.accessToken);
        setSubscriptions(subscriptions);
        hasLoadedRef.current = true;
      } catch (error) {
        console.error('Failed to load subscriptions:', error);
        toast.error('Failed to load subscriptions');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Only load when session is authenticated and not loading
  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken && !hasLoadedRef.current) {
      loadSubscriptions();
    }
  }, [session, status]);

  // Refresh data when page becomes visible (e.g., when returning from success page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && session?.accessToken && hasLoadedRef.current) {
        // Only refresh if we've already loaded once
        loadSubscriptions();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="text-3xl text-purple-600 font-semibold">My Subscriptions</span>
              </div>
              <p className="text-gray-600">Manage your subscription and billing details</p>
            </div>
          </div>

          <Link href="/plans">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Browse Plans
            </Button>
          </Link>
        </div>

        {/* Subscription Content */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="md" text="Loading subscriptions..." />
          </div>
        ) : subscriptions.length === 0 ? (
          <Card className="max-w-2xl mx-auto border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">No Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <div className="space-y-6">
                <div className="text-gray-600">
                  <p className="text-lg max-w-md mx-auto mb-8">
                    You don't have any active subscriptions yet. Browse our plans to get started with premium features.
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <Link href="/plans">
                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3 text-lg">
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
                <Card key={subscription.id} className={`border-l-4 ${getBorderColor()} border-0 shadow-xl bg-white/80 backdrop-blur-sm`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${getIconBgColor()} rounded-xl flex items-center justify-center`}>
                          <CreditCard className={`w-6 h-6 ${getIconColor()}`} />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-gray-900">{(subscription as any).product_name}</CardTitle>
                          <p className="text-gray-600">{getStatusText()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBgColor()}`}>
                          {subscription.status}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
                       <div className="bg-gray-50 rounded-lg p-4">
                         <p className="text-gray-500 mb-1">Plan</p>
                         <p className="font-semibold text-gray-900">{(subscription as any).product_name}</p>
                       </div>
                       <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-500 mb-1">Price</p>
                          <p className="font-semibold text-gray-900">${subscription.plan_price}</p>
                       </div>
                       <div className="bg-gray-50 rounded-lg p-4">
                         <p className="text-gray-500 mb-1">Created</p>
                         <p className="font-semibold text-gray-900">
                           {new Date(subscription.created_at).toLocaleDateString()}
                         </p>
                       </div>
                       <div className="bg-gray-50 rounded-lg p-4">
                         <p className="text-gray-500 mb-1">Expires</p>
                         <p className="font-semibold text-gray-900">
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
                       <Button variant="outline" className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50">
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
                           className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
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
            
            <div className="flex justify-center pt-8">
              <Link href="/plans">
                <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                  <CreditCard className="w-4 h-4 mr-2" />
                  View All Plans
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Subscription Benefits
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Enjoy premium features and exclusive benefits with your subscription
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Unlimited Access</h3>
              <p className="text-gray-600">Get unlimited conversations and advanced AI features</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Priority Support</h3>
              <p className="text-gray-600">Get priority customer support and faster response times</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Features</h3>
              <p className="text-gray-600">Collaborate with your team and share conversations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer variant="simple" />

      {/* Cancel Confirmation Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Cancel Subscription</DialogTitle>
            <DialogDescription className="text-gray-600 text-lg">
              Are you sure you want to cancel your subscription to{' '}
              <span className="font-semibold text-gray-900">{(subscriptionToCancel as any)?.product_name}</span>?
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
              className="border-purple-200 text-purple-600 hover:bg-purple-50"
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
