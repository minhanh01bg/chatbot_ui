'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, CreditCard, Settings, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { Subscription } from '@/types/plan';

export default function SubscriptionsPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated, isLoading: userLoading } = useCurrentUser();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchSubscription();
    } else if (!userLoading && !isAuthenticated) {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, userLoading]);

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/subscriptions/my', {
        headers: {
          'Authorization': `Bearer ${user?.accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setSubscription(null);
          setError(null);
        } else {
          throw new Error('Failed to fetch subscription');
        }
      } else {
        const data = await response.json();
        setSubscription(data);
        setError(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load subscription';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'expired':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'inactive':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (userLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading subscription...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-center">Authentication Required</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Please log in to view your subscription details.
                </p>
                <Link href="/login">
                  <Button>Sign In</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/plans">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Plans
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">My Subscription</h1>
              <p className="text-muted-foreground">Manage your subscription and billing</p>
            </div>
          </div>
          
          <Link href="/plans">
            <Button>
              Browse Plans
            </Button>
          </Link>
        </div>

        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Subscription */}
        {subscription ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Current Subscription
                    </CardTitle>
                    <CardDescription>
                      Your active subscription details
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(subscription.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(subscription.status)}
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{subscription.plan_name}</h3>
                    <p className="text-2xl font-bold text-primary">
                      ${subscription.plan_price}
                      <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>Started: {new Date(subscription.created_at).toLocaleDateString()}</span>
                    </div>
                    {subscription.expired_at && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {subscription.status === 'active' ? 'Renews' : 'Expired'}: {' '}
                          {new Date(subscription.expired_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Subscription
                  </Button>
                  <Link href="/plans">
                    <Button variant="outline" size="sm">
                      Change Plan
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Billing History */}
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  Your recent billing and payment history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Billing history will be displayed here</p>
                  <p className="text-sm">This feature is coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Active Subscription</CardTitle>
              <CardDescription>
                You don't have an active subscription yet
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <div className="space-y-4">
                <div className="text-muted-foreground">
                  <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Ready to get started?</p>
                  <p>Choose a plan that fits your needs and start your subscription today.</p>
                </div>
                
                <div className="flex gap-2 justify-center">
                  <Link href="/plans">
                    <Button>
                      Browse Plans
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
