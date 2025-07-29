'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Grid, List } from 'lucide-react';
import { Plan } from '@/types/plan';
import { getPublicPlans } from '@/services/plan.service';
import PlanCard from '@/components/plans/PlanCard';
import PlanComparison from '@/components/plans/PlanComparison';
import CurrentSubscription from '@/components/plans/CurrentSubscription';
import { useToast } from '@/components/ui/use-toast';
import { useCurrentUser } from '@/hooks/use-current-user';
import Link from 'next/link';

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'comparison'>('cards');
  const { toast } = useToast();
  const { isAuthenticated } = useCurrentUser();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        const fetchedPlans = await getPublicPlans();
        setPlans(fetchedPlans);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load plans';
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

    fetchPlans();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading plans...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-center text-destructive">Error Loading Plans</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Determine which plan should be marked as popular (you can customize this logic)
  const getPopularPlanIndex = () => {
    if (plans.length <= 1) return -1;
    // Mark the middle plan as popular, or the second plan if there are multiple
    return Math.min(1, Math.floor(plans.length / 2));
  };

  const popularPlanIndex = getPopularPlanIndex();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Select the perfect plan for your needs. Upgrade or downgrade at any time.
          </p>

          {/* View Mode Toggle */}
          {plans.length > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('cards')}
              >
                <Grid className="w-4 h-4 mr-2" />
                Cards
              </Button>
              <Button
                variant={viewMode === 'comparison' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('comparison')}
              >
                <List className="w-4 h-4 mr-2" />
                Compare
              </Button>
            </div>
          )}
        </div>

        {/* Current Subscription or Login Prompt */}
        {isAuthenticated ? (
          <div className="mb-8">
            <CurrentSubscription />
          </div>
        ) : (
          <div className="mb-8">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  Sign in to view your current subscription and manage your plans.
                </p>
                <Link href="/login">
                  <Button>Sign In</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Plans Content */}
        {plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No plans available at the moment.</p>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div key={plan.id} className="flex">
                <PlanCard
                  plan={plan}
                  isPopular={index === popularPlanIndex}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <PlanComparison plans={plans} />
          </div>
        )}



        {/* Additional Info */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Need Help Choosing?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Not sure which plan is right for you? Our team is here to help you find the perfect solution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline">
                  Contact Sales
                </Button>
                <Button variant="outline">
                  View Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
