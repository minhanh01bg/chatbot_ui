'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import Link from 'next/link';
import { cancelMySubscription } from '@/services/subscription.service';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function SubscriptionCancelPage() {

  // Optionally, you could add a button to allow the user to cancel their subscription from this page.
  // Example cancel handler (not used in the current UI, but ready for future use):
  const router = useRouter();
  const { id } = useParams();
  
  const handleCancelSubscription = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await cancelMySubscription(id as string);
      // Optionally, redirect or show a success message
      router.push('/subscriptions');
    } catch (err: any) {
      setError(err.message || 'Failed to cancel subscription');
    } finally {
      setIsLoading(false);
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="text-center py-8">
          <XCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Payment Cancelled</h2>
          <p className="text-muted-foreground mb-6">
            Your PayPal payment was cancelled. No charges have been made to your account.
          </p>
          
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