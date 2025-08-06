'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Grid, List, Sparkles, Check, Star, Zap, Shield, Users, Globe, MessageSquare, Bot } from 'lucide-react';
import { Plan } from '@/types/plan';
import { PlanService } from '../../services/plan.service';
import PlanCard from '@/components/plans/PlanCard';
import PlanComparison from '@/components/plans/PlanComparison';
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

  // Simple client-side auth check
  const [clientAuth, setClientAuth] = useState({ isAuthenticated: false, isLoading: true });

  useEffect(() => {
    // Check client-side authentication
    const checkClientAuth = () => {
      if (typeof window === 'undefined') return;

      const hasLocalStorageToken = !!localStorage.getItem('access_token');
      const hasCookieToken = document.cookie.includes('client_access_token');
      const isAuth = hasLocalStorageToken || hasCookieToken;

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
            // Store in localStorage
            localStorage.setItem('access_token', token);

            // Set client-side cookie
            document.cookie = `client_access_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

            // Update client auth state
            setClientAuth({ isAuthenticated: true, isLoading: false });
          } else {
            // Token already exists, just update client auth state
            setClientAuth({ isAuthenticated: true, isLoading: false });
          }
        } else {
          // Session is authenticated but no token yet, try to fetch session again
          try {
            const response = await fetch('/api/auth/session');
            const sessionData = await response.json();

            if (sessionData?.accessToken) {
              localStorage.setItem('access_token', sessionData.accessToken);
              document.cookie = `client_access_token=${sessionData.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
              setClientAuth({ isAuthenticated: true, isLoading: false });
            } else {
              // Still no token, but session is authenticated, so consider as authenticated
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
        const fetchedPlans = await PlanService.getPublicPlans();
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
              <p className="text-gray-600">Loading plans...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center text-red-600">Error Loading Plans</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">{error}</p>
                <Button 
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-purple-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>

            {finalIsAuthenticated && (
              <Link href="/subscriptions">
                <Button variant="outline" size="sm" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                  My Subscription
                </Button>
              </Link>
            )}
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <span className="text-purple-600 font-semibold text-lg">Choose Your Perfect Plan</span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Pricing Plans
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> That Scale</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Select the perfect plan for your needs. Upgrade or downgrade at any time. 
            Start with our free plan and scale as you grow.
          </p>

          {/* View Mode Toggle */}
          {plans.length > 1 && (
            <div className="flex items-center justify-center gap-2 bg-white/50 backdrop-blur-sm rounded-full p-1 shadow-lg">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className={viewMode === 'cards' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' : 'text-gray-600 hover:text-purple-600'}
              >
                <Grid className="w-4 h-4 mr-2" />
                Cards
              </Button>
              <Button
                variant={viewMode === 'comparison' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('comparison')}
                className={viewMode === 'comparison' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' : 'text-gray-600 hover:text-purple-600'}
              >
                <List className="w-4 h-4 mr-2" />
                Compare
              </Button>
            </div>
          )}
        </div>
        {/* Plans Content */}
        {plans.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <Bot className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No plans available at the moment.</p>
            </div>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
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
          <div className="max-w-7xl mx-auto">
            <PlanComparison plans={plans} />
          </div>
        )}

        {/* Features Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the power of AI-driven conversations with enterprise-grade features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Get instant responses with our optimized AI models</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise Security</h3>
              <p className="text-gray-600">Bank-level security with end-to-end encryption</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Scale</h3>
              <p className="text-gray-600">Available worldwide with 99.9% uptime guarantee</p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-20 text-center">
          <Card className="max-w-2xl mx-auto border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">Need Help Choosing?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6 text-lg">
                Not sure which plan is right for you? Our team is here to help you find the perfect solution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                  Contact Sales
                </Button>
                <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
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
