'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Sparkles, Shield, Users, Globe } from 'lucide-react';
import { Plan } from '@/types/plan';
import { subscribeToPlan } from '@/services/plan.service';
import { useToast } from '@/components/ui/use-toast';
import { useCurrentUser } from '@/hooks/use-current-user';
import PaymentModal from './PaymentModal';

interface PlanCardProps {
  plan: Plan;
  isPopular?: boolean;
}

export default function PlanCard({ plan, isPopular = false }: PlanCardProps) {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { toast } = useToast();
  const { user, isLoading: isUserLoading, isAuthenticated } = useCurrentUser();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTokens = (tokens: number) => {
    if (tokens >= 1000000) {
      return (tokens / 1000000).toFixed(1) + 'M';
    } else if (tokens >= 1000) {
      return (tokens / 1000).toFixed(0) + 'K';
    }
    return tokens.toString();
  };

  const handleSubscribe = async () => {
    if (!plan.is_self_sigup_allowed) {
      toast({
        title: 'Contact Required',
        description: 'This plan requires contacting our sales team.',
        variant: 'default',
      });
      return;
    }

    if (!isAuthenticated || !user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to subscribe to a plan.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubscribing(true);
    try {
      const result = await subscribeToPlan(plan.id, user.id, user.accessToken);
      toast({
        title: 'Success!',
        description: `Successfully subscribed to ${plan.name} plan. Your subscription is now active.`,
      });
      console.log('Subscription result:', result);

      // Refresh the page after a short delay to show updated subscription
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast({
        title: 'Subscription Failed',
        description: error instanceof Error ? error.message : 'Failed to subscribe to plan.',
        variant: 'destructive',
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <Card className={`relative h-full flex flex-col border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 ${
      isPopular 
        ? 'border-2 border-purple-500 shadow-2xl scale-105 bg-gradient-to-br from-purple-50 to-blue-50' 
        : 'border border-purple-100 hover:border-purple-300'
    }`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 text-sm font-semibold shadow-lg">
            <Star className="w-4 h-4 mr-2 fill-current" />
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-center mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isPopular 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
              : 'bg-gradient-to-r from-purple-500 to-blue-500'
          }`}>
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
        <CardDescription className="text-gray-600 mt-2">
          {plan.description}
        </CardDescription>
        <div className="mt-6">
          <div className="text-4xl font-bold text-gray-900">
            {plan.price === 0 ? 'Free' : `$${plan.price}`}
          </div>
          {plan.price > 0 && (
            <div className="text-gray-500 mt-1">/{plan.period}</div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-6">
          {/* Limits */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <Shield className="w-4 h-4 mr-2 text-purple-600" />
              Plan Limits
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{plan.limits.number_of_sites} sites</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{plan.limits.number_of_documents} documents</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{formatFileSize(plan.limits.file_size)} file size</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{plan.limits.number_of_faqs} FAQs</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{plan.limits.number_of_crawlers} crawlers</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{formatTokens(plan.limits.number_token_chat)} chat tokens</span>
              </li>
            </ul>
          </div>

          {/* Features */}
          {plan.features && plan.features.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Zap className="w-4 h-4 mr-2 text-blue-600" />
                Features
              </h4>
              <ul className="space-y-2 text-sm">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Zap className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-6">
        <Button
          className={`w-full py-3 text-lg font-semibold ${
            isPopular 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg' 
              : 'bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50'
          }`}
          onClick={() => {
            if (!plan.is_self_sigup_allowed) {
              toast({
                title: 'Contact Required',
                description: 'This plan requires contacting our sales team.',
                variant: 'default',
              });
              return;
            }

            if (!isAuthenticated) {
              toast({
                title: 'Authentication Required',
                description: 'Please log in to subscribe to a plan.',
                variant: 'destructive',
              });
              return;
            }

            if (plan.price === 0) {
              handleSubscribe();
            } else {
              setShowPaymentModal(true);
            }
          }}
          disabled={isSubscribing || isUserLoading || (!isAuthenticated && plan.is_self_sigup_allowed)}
        >
          {isSubscribing ? 'Subscribing...' :
           !isAuthenticated && plan.is_self_sigup_allowed ? 'Login Required' :
           plan.is_self_sigup_allowed ?
           (plan.price === 0 ? 'Get Started' : 'Subscribe Now') :
           'Contact Sales'}
        </Button>

        {/* Payment Modal */}
        <PaymentModal
          plan={plan}
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onDirectSubscribe={handleSubscribe}
          isSubscribing={isSubscribing}
          isPopular={isPopular}
        />
      </CardFooter>
    </Card>
  );
}
