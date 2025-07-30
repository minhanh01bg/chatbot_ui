'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Subscription } from '@/types/plan';

export default function CurrentSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useCurrentUser();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/subscriptions/current');

        if (response.status === 404) {
          // No subscription found
          setSubscription(null);
          setError(null);
          return;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch subscription');
        }

        const data = await response.json();

        // Validate subscription data
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid subscription data received');
        }

        console.log('CurrentSubscription: Received data:', data);
        setSubscription(data);
        setError(null);
      } catch (err) {
        console.error('CurrentSubscription: Error fetching subscription:', err);
        setError(err instanceof Error ? err.message : 'Failed to load subscription');
        setSubscription(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-destructive">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">No active subscription found.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Choose a plan below to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = () => {
    if (!subscription?.status) return <Clock className="w-4 h-4 text-yellow-500" />;

    switch (subscription.status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusVariant = () => {
    if (!subscription?.status) return 'secondary';

    switch (subscription.status) {
      case 'active':
        return 'default';
      case 'expired':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Current Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">{subscription.plan_name || 'Unknown Plan'}</h3>
              <p className="text-sm text-muted-foreground">
                {subscription.plan_price === 0 ? 'Free Plan' :
                 subscription.plan_price ? `$${subscription.plan_price}` : 'Price not available'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <Badge variant={getStatusVariant()}>
                {subscription.status ?
                  subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1) :
                  'Unknown'
                }
              </Badge>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Started:</span>
              <span>{new Date(subscription.created_at).toLocaleDateString()}</span>
            </div>
            {subscription.expired_at && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expires:</span>
                <span>{new Date(subscription.expired_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {subscription.status === 'expired' && (
            <div className="pt-2">
              <Button variant="outline" size="sm" className="w-full">
                Renew Subscription
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
