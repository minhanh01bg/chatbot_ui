'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Star } from 'lucide-react';
import { Plan } from '@/types/plan';
// import PayPalSubscriptionButton from './PayPalSubscriptionButton';
import { useToast } from '@/components/ui/use-toast';

interface PaymentModalProps {
  plan: Plan;
  isOpen: boolean;
  onClose: () => void;
  onDirectSubscribe: () => void;
  isSubscribing: boolean;
  isPopular?: boolean;
}

type PaymentMethod = 'paypal' | 'direct';

export default function PaymentModal({ 
  plan, 
  isOpen, 
  onClose, 
  onDirectSubscribe, 
  isSubscribing,
  isPopular = false 
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paypal');
  const { toast } = useToast();

  const handlePayPalSuccess = (subscriptionId: string) => {
    toast({
      title: 'Success!',
      description: `Successfully subscribed to ${plan.name} plan via PayPal!`,
    });
    onClose();
  };

  const handlePayPalError = (error: any) => {
    toast({
      title: 'Payment Error',
      description: 'There was an error processing your PayPal payment. Please try again.',
      variant: 'destructive',
    });
  };

  const handlePayPalCancel = () => {
    toast({
      title: 'Payment Cancelled',
      description: 'PayPal payment was cancelled.',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Subscribe to {plan.name}
            {isPopular && (
              <Badge className="bg-primary text-primary-foreground">
                <Star className="w-3 h-3 mr-1" />
                Popular
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Choose your preferred payment method to subscribe to the {plan.name} plan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  ${plan.price}
                </div>
                <div className="text-sm text-muted-foreground">/{plan.period}</div>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <h4 className="font-medium">Select Payment Method</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={paymentMethod === 'paypal' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('paypal')}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                  PP
                </div>
                <span className="text-sm">PayPal</span>
              </Button>
              
              <Button
                variant={paymentMethod === 'direct' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('direct')}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <CreditCard className="w-8 h-8" />
                <span className="text-sm">Direct</span>
              </Button>
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-4">
            {paymentMethod === 'paypal' ? (
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  PayPal integration is being set up. Please use direct payment for now.
                </div>
                <Button
                  className="w-full"
                  onClick={() => setPaymentMethod('direct')}
                  variant="outline"
                >
                  Use Direct Payment Instead
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  Subscribe directly through our secure payment system.
                </div>
                <Button
                  className="w-full"
                  onClick={() => {
                    onDirectSubscribe();
                    onClose();
                  }}
                  disabled={isSubscribing}
                >
                  {isSubscribing ? 'Processing...' : `Subscribe for $${plan.price}/${plan.period}`}
                </Button>
              </div>
            )}
          </div>

          {/* Cancel Button */}
          <div className="flex justify-center">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
