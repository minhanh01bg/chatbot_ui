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
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'comparison'>('cards');
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: userLoading } = useCurrentUser();
  const { data: session, status: sessionStatus } = useSession();

  // Debug log
  console.log('Plans page - Auth state:', {
    // Custom hook
    isAuthenticated,
    userLoading,
    user: user ? {
      id: user.id,
      name: user.name,
      hasToken: !!user.accessToken
    } : null,
    // NextAuth session
    sessionStatus,
    hasSession: !!session,
    sessionUser: session?.user,
    sessionAccessToken: !!(session as any)?.accessToken,
    // Full session object for debugging
    fullSession: session
  });

  // Simple client-side auth check
  const [clientAuth, setClientAuth] = useState({ isAuthenticated: false, isLoading: true });

  useEffect(() => {
    // Check client-side authentication
    const checkClientAuth = () => {
      if (typeof window === 'undefined') return;

      const hasLocalStorageToken = !!localStorage.getItem('access_token');
      const hasCookieToken = document.cookie.includes('client_access_token');
      const isAuth = hasLocalStorageToken || hasCookieToken;

      console.log('Client auth check:', { hasLocalStorageToken, hasCookieToken, isAuth });

      setClientAuth({ isAuthenticated: isAuth, isLoading: false });
    };

    // Check immediately
    checkClientAuth();

    // Also check after a short delay for hydration
    const timeout = setTimeout(checkClientAuth, 1000);
    return () => clearTimeout(timeout);
  }, []);

  // Sync token from NextAuth session to localStorage/cookies
  useEffect(() => {
    const syncTokenFromSession = async () => {
      if (sessionStatus === 'authenticated' && session) {
        // Try to get token from session
        const token = (session as any).accessToken;

        if (token) {
          // Check if token is already synced
          const hasLocalStorageToken = !!localStorage.getItem('access_token');
          const hasCookieToken = document.cookie.includes('client_access_token');

          if (!hasLocalStorageToken || !hasCookieToken) {
            console.log('Syncing token from NextAuth session to localStorage/cookies');

            // Store in localStorage
            localStorage.setItem('access_token', token);

            // Set client-side cookie
            document.cookie = `client_access_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

            // Update client auth state
            setClientAuth({ isAuthenticated: true, isLoading: false });

            console.log('Token synced successfully');
          } else {
            // Token already exists, just update client auth state
            setClientAuth({ isAuthenticated: true, isLoading: false });
          }
        } else {
          // Session is authenticated but no token yet, try to fetch session again
          console.log('Session authenticated but no token, trying to fetch session...');
          try {
            const response = await fetch('/api/auth/session');
            const sessionData = await response.json();

            if (sessionData?.accessToken) {
              console.log('Got token from session API, storing...');
              localStorage.setItem('access_token', sessionData.accessToken);
              document.cookie = `client_access_token=${sessionData.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
              setClientAuth({ isAuthenticated: true, isLoading: false });
            } else {
              // Still no token, but session is authenticated, so consider as authenticated
              console.log('No token available but session is authenticated');
              setClientAuth({ isAuthenticated: true, isLoading: false });
            }
          } catch (error) {
            console.error('Failed to fetch session:', error);
            // Still consider authenticated if NextAuth says so
            setClientAuth({ isAuthenticated: true, isLoading: false });
          }
        }
      } else if (sessionStatus === 'unauthenticated') {
        // Clear auth state if session is unauthenticated
        setClientAuth({ isAuthenticated: false, isLoading: false });
      }
    };

    syncTokenFromSession();
  }, [session, sessionStatus]);

  // Use NextAuth session as primary since it's working
  const finalUserLoading = clientAuth.isLoading && userLoading && sessionStatus === 'loading';
  const finalIsAuthenticated = clientAuth.isAuthenticated || isAuthenticated || sessionStatus === 'authenticated';



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
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>

            {finalIsAuthenticated && (
              <Link href="/subscriptions">
                <Button variant="outline" size="sm">
                  My Subscription
                </Button>
              </Link>
            )}
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

        {/* Debug Authentication Status */}
        <div className="mb-4">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-lg">Debug: Authentication Status</CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <div className="text-sm space-y-2">
                <div><strong>Client Auth Loading:</strong> {clientAuth.isLoading ? '⏳ Loading...' : '✅ Loaded'}</div>
                <div><strong>Client Auth Status:</strong> {clientAuth.isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}</div>
                <div><strong>Custom Hook Loading:</strong> {userLoading ? '⏳ Loading...' : '✅ Loaded'}</div>
                <div><strong>Custom Hook Status:</strong> {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}</div>
                <div><strong>NextAuth Status:</strong> {sessionStatus}</div>
                <div><strong>Final Loading:</strong> {finalUserLoading ? '⏳ Loading...' : '✅ Loaded'}</div>
                <div><strong>Final Authenticated:</strong> {finalIsAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}</div>

                {typeof window !== 'undefined' && (
                  <>
                    <div><strong>localStorage token:</strong> {localStorage.getItem('access_token') ? '✅ Has token' : '❌ No token'}</div>
                    <div><strong>Cookie token:</strong> {document.cookie.includes('client_access_token') ? '✅ Has token' : '❌ No token'}</div>
                    <div><strong>All cookies:</strong> {document.cookie || 'No cookies'}</div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Subscription or Login Prompt */}
        {finalUserLoading ? (
          <div className="mb-8">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="text-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground">Loading authentication...</p>
              </CardContent>
            </Card>
          </div>
        ) : finalIsAuthenticated ? (
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
