'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getMySubscriptions } from '@/services/subscription.service';
import Link from 'next/link';

export default function SubscriptionSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isActivating, setIsActivating] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const subscriptionId = searchParams.get('subscription_id');
  const token = searchParams.get('token');
  const payerId = searchParams.get('PayerID');
  const serverToken = searchParams.get('server_token');
  const baToken = searchParams.get('ba_token');
  const { data: session } = useSession();

  useEffect(() => {
    const activateSubscription = async () => {
      if (!subscriptionId || !token || !serverToken || !baToken) {
        setError('Missing required parameters');
        setIsLoading(false);
        return;
      }

      try {
        setIsActivating(true);
        
        // Call the success API to activate the subscription
        const response = await fetch(`/api/subscriptions/success?subscription_id=${subscriptionId}&token=${token}&server_token=${serverToken}&ba_token=${baToken}`);
        
        if (!response.ok) {
          throw new Error('Failed to activate subscription');
        }

        const result = await response.json();
        
        if (result.success) {
          // Wait a moment for PayPal to process the payment
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Check if subscription is now active by getting my subscriptions
          if (session?.accessToken) {
            try {
                             const subscriptions = await getMySubscriptions(session.accessToken);
               const activeSubscription = subscriptions.find(sub => 
                 sub.id === subscriptionId
               );
               
               if (activeSubscription) {
                 setSubscriptionStatus(activeSubscription);
                 
                 if (activeSubscription.status === 'active') {
                  toast({
                    title: 'Payment Successful!',
                    description: 'Your subscription has been activated successfully.',
                  });
                  
                  // Auto redirect to my subscriptions after 3 seconds
                  setTimeout(() => {
                    router.push('/subscriptions');
                  }, 3000);
                } else {
                  toast({
                    title: 'Payment Processing',
                    description: 'Your payment is being processed. Please wait a moment.',
                  });
                }
              } else {
                toast({
                  title: 'Payment Processing',
                  description: 'Your payment is being processed. Please check your subscriptions in a moment.',
                });
              }
            } catch (error) {
              console.error('Error checking subscription status:', error);
              toast({
                title: 'Payment Successful!',
                description: 'Your subscription has been activated successfully.',
              });
              
              // Auto redirect to my subscriptions after 3 seconds
              setTimeout(() => {
                router.push('/subscriptions');
              }, 3000);
            }
          } else {
            toast({
              title: 'Payment Successful!',
              description: 'Your subscription has been activated successfully.',
            });
            
            // Auto redirect to my subscriptions after 3 seconds
            setTimeout(() => {
              router.push('/subscriptions');
            }, 3000);
          }
        } else {
          throw new Error(result.error || 'Failed to activate subscription');
        }
      } catch (err) {
        console.error('Error activating subscription:', err);
        setError('Failed to activate subscription. Please contact support.');
        toast({
          title: 'Activation Error',
          description: 'Unable to activate your subscription. Please contact support.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
        setIsActivating(false);
      }
    };

    activateSubscription();
  }, [subscriptionId, token, serverToken, baToken, toast, router]);

  if (isLoading || isActivating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {isActivating ? 'Activating Subscription' : 'Processing Payment'}
            </h2>
            <p className="text-muted-foreground">
              {isActivating 
                ? 'Please wait while we activate your subscription...'
                : 'Please wait while we verify your payment...'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Payment Error</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="space-y-2">
              <Link href="/plans">
                <Button className="w-full">Back to Plans</Button>
              </Link>
              <Link href="/subscriptions">
                <Button variant="outline" className="w-full">View Subscriptions</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isSuccess = subscriptionStatus?.status === 'active';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="text-center py-8">
          {isSuccess ? (
            <>
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Payment Successful!</h2>
              <p className="text-muted-foreground mb-4">
                Your subscription has been activated successfully.
                <br />
                <span className="text-sm text-blue-600">Redirecting to My Subscriptions...</span>
              </p>
              
              {subscriptionStatus && (
                <div className="bg-muted/50 rounded-lg p-4 mb-4 text-left">
                  <h3 className="font-medium mb-2">Subscription Details:</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Status:</strong> {subscriptionStatus.status}</div>
                    <div><strong>Plan ID:</strong> {subscriptionStatus.plan_id}</div>
                    <div><strong>Product:</strong> {subscriptionStatus.product_name}</div>
                    <div><strong>Price:</strong> ${subscriptionStatus.plan_price}</div>
                    {subscriptionStatus.expired_at && (
                      <div><strong>Expires:</strong> {new Date(subscriptionStatus.expired_at).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Payment Processing</h2>
              <p className="text-muted-foreground mb-4">
                Your payment is being processed. You will receive a confirmation email once it's complete.
              </p>
              
              {subscriptionStatus && (
                <div className="bg-muted/50 rounded-lg p-4 mb-4 text-left">
                  <h3 className="font-medium mb-2">Current Status:</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Status:</strong> {subscriptionStatus.status}</div>
                    <div><strong>Product:</strong> {subscriptionStatus.product_name}</div>
                    <div><strong>Price:</strong> ${subscriptionStatus.plan_price}</div>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="space-y-2">
            <Link href="/subscriptions">
              <Button className="w-full">View My Subscriptions</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">Go to Dashboard</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 