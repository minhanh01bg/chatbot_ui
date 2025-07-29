'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap } from 'lucide-react';
import { Plan } from '@/types/plan';
import { subscribeToPlan } from '@/services/plan.service';
import { useToast } from '@/components/ui/use-toast';
import { useCurrentUser } from '@/hooks/use-current-user';

interface PlanCardProps {
  plan: Plan;
  isPopular?: boolean;
}

export default function PlanCard({ plan, isPopular = false }: PlanCardProps) {
  const [isSubscribing, setIsSubscribing] = useState(false);
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
    <Card className={`relative h-full flex flex-col ${isPopular ? 'border-primary shadow-lg scale-105' : ''}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-3 py-1">
            <Star className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {plan.description}
        </CardDescription>
        <div className="mt-4">
          <div className="text-4xl font-bold">
            {plan.price === 0 ? 'Free' : `$${plan.price}`}
          </div>
          {plan.price > 0 && (
            <div className="text-sm text-muted-foreground">/{plan.period}</div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-4">
          {/* Limits */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Plan Limits:</h4>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                <span>{plan.limits.number_of_sites} sites</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                <span>{plan.limits.number_of_documents} documents</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                <span>{formatFileSize(plan.limits.file_size)} file size</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                <span>{plan.limits.number_of_faqs} FAQs</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                <span>{plan.limits.number_of_crawlers} crawlers</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                <span>{formatTokens(plan.limits.number_token_chat)} chat tokens</span>
              </li>
            </ul>
          </div>

          {/* Features */}
          {plan.features && plan.features.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Features:</h4>
              <ul className="space-y-1 text-sm">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Zap className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          onClick={handleSubscribe}
          disabled={isSubscribing || isUserLoading || (!isAuthenticated && plan.is_self_sigup_allowed)}
          variant={isPopular ? 'default' : 'outline'}
        >
          {isSubscribing ? 'Subscribing...' :
           !isAuthenticated && plan.is_self_sigup_allowed ? 'Login Required' :
           plan.is_self_sigup_allowed ?
           (plan.price === 0 ? 'Get Started' : 'Subscribe Now') :
           'Contact Sales'}
        </Button>
      </CardFooter>
    </Card>
  );
}
