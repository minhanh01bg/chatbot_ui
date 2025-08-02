'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { checkPayPalSubscriptionStatus } from '@/services/paypal.service';
import Link from 'next/link';

export default function SubscriptionSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const subscriptionId = searchParams.get('subscription_id');
  const token = searchParams.get('token');
  const payerId = searchParams.get('PayerID');

  useEffect(() => {
    const checkSubscription = async () => {
      if (!subscriptionId) {
        setError('No subscription ID found');
        setIsLoading(false);
        return;
      }

      try {
        // Wait a moment for PayPal to process the payment
        await new Promise(resolve => setTimeout(resolve, 2000));

        const status = await checkPayPalSubscriptionStatus(subscriptionId);
        setSubscriptionStatus(status);
        
        if (status.status === 'ACTIVE' || status.status === 'APPROVED') {
          toast({
            title: 'Payment Successful!',
            description: 'Your subscription has been activated successfully.',
          });
        } else {
          toast({
            title: 'Payment Processing',
            description: 'Your payment is being processed. Please wait a moment.',
          });
        }
      } catch (err) {
        console.error('Error checking subscription status:', err);
        setError('Failed to verify subscription status');
        toast({
          title: 'Verification Error',
          description: 'Unable to verify your subscription status. Please contact support.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, [subscriptionId, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Processing Payment</h2>
            <p className="text-muted-foreground">
              Please wait while we verify your payment...
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

  const isSuccess = subscriptionStatus?.status === 'ACTIVE' || subscriptionStatus?.status === 'APPROVED';

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
              </p>
              
              {subscriptionStatus && (
                <div className="bg-muted/50 rounded-lg p-4 mb-4 text-left">
                  <h3 className="font-medium mb-2">Subscription Details:</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Status:</strong> {subscriptionStatus.status}</div>
                    <div><strong>Plan ID:</strong> {subscriptionStatus.plan_id}</div>
                    <div><strong>Subscription ID:</strong> {subscriptionStatus.subscription_id}</div>
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
                    <div><strong>Subscription ID:</strong> {subscriptionStatus.subscription_id}</div>
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