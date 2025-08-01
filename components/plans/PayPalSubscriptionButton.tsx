'use client';

import { useEffect, useRef, useState } from 'react';
import { Plan } from '@/types/plan';
import { useToast } from '@/components/ui/use-toast';
import { useCurrentUser } from '@/hooks/use-current-user';

interface PayPalSubscriptionButtonProps {
  plan: Plan;
  onSuccess?: (subscriptionId: string) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function PayPalSubscriptionButton({ 
  plan, 
  onSuccess, 
  onError, 
  onCancel 
}: PayPalSubscriptionButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, isAuthenticated } = useCurrentUser();

  useEffect(() => {
    // Load PayPal SDK
    const loadPayPalScript = () => {
      if (window.paypal) {
        initializePayPalButton();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
      script.async = true;
      script.onload = () => {
        initializePayPalButton();
      };
      script.onerror = () => {
        setError('Failed to load PayPal SDK');
        setIsLoading(false);
      };
      document.body.appendChild(script);
    };

    const initializePayPalButton = () => {
      if (!window.paypal || !paypalRef.current) {
        setError('PayPal SDK not available');
        setIsLoading(false);
        return;
      }

      // Clear any existing PayPal buttons
      paypalRef.current.innerHTML = '';

      try {
        window.paypal.Buttons({
          createSubscription: async function(data: any, actions: any) {
            try {
              // Create PayPal plan first if needed
              const paypalPlanId = await createPayPalPlan(plan);
              
              return actions.subscription.create({
                'plan_id': paypalPlanId
              });
            } catch (error) {
              console.error('Error creating subscription:', error);
              toast({
                title: 'Error',
                description: 'Failed to create subscription. Please try again.',
                variant: 'destructive',
              });
              throw error;
            }
          },
          onApprove: async function(data: any, actions: any) {
            try {
              console.log('PayPal subscription approved:', data.subscriptionID);
              
              // Save subscription to our backend
              await saveSubscriptionToBackend(data.subscriptionID, plan.id);
              
              toast({
                title: 'Success!',
                description: `Successfully subscribed to ${plan.name} plan!`,
              });

              if (onSuccess) {
                onSuccess(data.subscriptionID);
              }

              // Refresh page to show updated subscription
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            } catch (error) {
              console.error('Error processing subscription:', error);
              toast({
                title: 'Error',
                description: 'Subscription created but failed to save. Please contact support.',
                variant: 'destructive',
              });
              if (onError) {
                onError(error);
              }
            }
          },
          onError: function(err: any) {
            console.error('PayPal error:', err);
            toast({
              title: 'Payment Error',
              description: 'There was an error processing your payment. Please try again.',
              variant: 'destructive',
            });
            if (onError) {
              onError(err);
            }
          },
          onCancel: function(data: any) {
            console.log('PayPal subscription cancelled:', data);
            toast({
              title: 'Cancelled',
              description: 'Subscription was cancelled.',
            });
            if (onCancel) {
              onCancel();
            }
          },
          style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'subscribe'
          }
        }).render(paypalRef.current);

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing PayPal button:', error);
        setError('Failed to initialize PayPal button');
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user) {
      loadPayPalScript();
    }

    return () => {
      // Cleanup: remove PayPal script if component unmounts
      const scripts = document.querySelectorAll('script[src*="paypal.com"]');
      scripts.forEach(script => script.remove());
    };
  }, [plan, isAuthenticated, user]);

  const createPayPalPlan = async (plan: Plan): Promise<string> => {
    try {
      const response = await fetch('/api/paypal/create-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          name: plan.name,
          description: plan.description,
          price: plan.price,
          period: plan.period
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create PayPal plan');
      }

      const data = await response.json();
      return data.paypalPlanId;
    } catch (error) {
      console.error('Error creating PayPal plan:', error);
      throw error;
    }
  };

  const saveSubscriptionToBackend = async (subscriptionId: string, planId: string) => {
    try {
      const response = await fetch('/api/subscriptions/paypal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paypalSubscriptionId: subscriptionId,
          planId: planId,
          userId: user?.id,
          accessToken: user?.accessToken
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving subscription:', error);
      throw error;
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="text-center p-4 border rounded-lg bg-muted">
        <p className="text-muted-foreground">Please log in to subscribe</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 border rounded-lg bg-destructive/10">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center p-4 border rounded-lg">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-muted-foreground">Loading PayPal...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div ref={paypalRef} className="w-full"></div>
    </div>
  );
}
