'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Plan } from '@/types/plan';
import { createPayPalSubscription, redirectToPayPal } from '@/services/paypal.service';
import { useToast } from '@/components/ui/use-toast';

interface PayPalSubscriptionButtonProps {
  plan: Plan;
  onSuccess?: (subscriptionId: string) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function PayPalSubscriptionButton({
  plan,
  onSuccess,
  onError,
  onCancel,
  className = '',
  disabled = false
}: PayPalSubscriptionButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayPalSubscription = async () => {
    if (!plan.id) {
      toast({
        title: 'Error',
        description: 'Invalid plan selected.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Create PayPal subscription
      const subscriptionData = await createPayPalSubscription(plan.id);
      
      console.log('PayPal subscription created:', subscriptionData);

      // Show success message
      toast({
        title: 'Redirecting to PayPal',
        description: 'You will be redirected to PayPal to complete your payment.',
      });

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(subscriptionData.subscription_id);
      }

      // Redirect to PayPal approval URL
      redirectToPayPal(subscriptionData.approval_url);

    } catch (error) {
      console.error('PayPal subscription error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to create PayPal subscription';
      
      toast({
        title: 'Payment Error',
        description: errorMessage,
        variant: 'destructive',
      });

      // Call error callback if provided
      if (onError) {
        onError(error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handlePayPalSubscription}
      disabled={disabled || isProcessing}
      className={`w-full ${className}`}
      variant="default"
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <div className="w-4 h-4 mr-2 bg-white rounded-sm flex items-center justify-center">
            <span className="text-blue-600 font-bold text-xs">PP</span>
          </div>
          Subscribe with PayPal
        </>
      )}
    </Button>
  );
}
