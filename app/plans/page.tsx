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
import AuthDebug from '@/components/debug/AuthDebug';
import { debugAuthState, formatTokenForDisplay } from '@/lib/auth-utils';
import { clearAuthData } from '@/services/auth.service';
import Link from 'next/link';

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'comparison'>('cards');
  const [mounted, setMounted] = useState(false);
  const [storageInfo, setStorageInfo] = useState({
    hasLocalStorageToken: false,
    hasLocalStorageUserId: false,
    hasLocalStorageIdentifier: false,
    hasCookieToken: false,
    localStorageUserId: '',
    localStorageIdentifier: ''
  });
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: userLoading } = useCurrentUser();

  // Client-side storage info
  useEffect(() => {
    setMounted(true);

    // Get storage info safely on client side
    const hasLocalStorageToken = !!localStorage.getItem('access_token');
    const hasLocalStorageUserId = !!localStorage.getItem('user_id');
    const hasLocalStorageIdentifier = !!localStorage.getItem('user_identifier');
    const hasCookieToken = document.cookie.includes('client_access_token');
    const localStorageUserId = localStorage.getItem('user_id') || '';
    const localStorageIdentifier = localStorage.getItem('user_identifier') || '';

    setStorageInfo({
      hasLocalStorageToken,
      hasLocalStorageUserId,
      hasLocalStorageIdentifier,
      hasCookieToken,
      localStorageUserId,
      localStorageIdentifier
    });
  }, []);

  // Debug log
  useEffect(() => {
    console.log('Plans page - Auth state:', {
      isAuthenticated,
      userLoading,
      user: user ? {
        id: user.id,
        name: user.name,
        hasToken: !!user.accessToken,
        accessToken: formatTokenForDisplay(user.accessToken)
      } : null,
      storageInfo: mounted ? storageInfo : 'not mounted'
    });
  }, [isAuthenticated, userLoading, user, mounted, storageInfo]);

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

        {/* Authentication Debug Info */}
        <div className="mb-4">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-lg">Authentication Status</CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <div className="text-sm space-y-2">
                <div><strong>Status:</strong> {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}</div>
                <div><strong>Loading:</strong> {userLoading ? '⏳ Loading...' : '✅ Loaded'}</div>
                <div><strong>User ID:</strong> {user?.id || 'None'}</div>
                <div><strong>Has Token:</strong> {user?.accessToken ? '✅ Yes' : '❌ No'}</div>
                <div><strong>localStorage token:</strong> {storageInfo.hasLocalStorageToken ? '✅ Has token' : '❌ No token'}</div>
                <div><strong>localStorage user_id:</strong> {storageInfo.localStorageUserId || 'None'}</div>
                <div><strong>localStorage identifier:</strong> {storageInfo.localStorageIdentifier || 'None'}</div>
                <div><strong>Cookies:</strong> {storageInfo.hasCookieToken ? '✅ Has token' : '❌ No token'}</div>
                <div className="pt-2 space-x-2">
                  <Button
                    onClick={() => {
                      debugAuthState();
                      window.location.reload();
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Debug & Refresh
                  </Button>
                  <Button
                    onClick={() => {
                      clearAuthData();
                      window.location.reload();
                    }}
                    variant="destructive"
                    size="sm"
                  >
                    Clear Auth & Refresh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Subscription or Login Prompt */}
        {userLoading ? (
          <div className="mb-8">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="text-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground">Loading authentication...</p>
              </CardContent>
            </Card>
          </div>
        ) : isAuthenticated ? (
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

      {/* Debug Component */}
      <AuthDebug />
    </div>
  );
}
