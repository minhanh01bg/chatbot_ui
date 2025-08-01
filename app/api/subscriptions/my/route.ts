import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request: NextRequest) {
  try {
    if (!NEXT_PUBLIC_BACKEND_URL) {
      console.error('Backend URL not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Get session from NextAuth
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get access token from session or request headers
    const accessToken = (session as any)?.accessToken || 
                       request.headers.get('authorization')?.replace('Bearer ', '');

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 401 }
      );
    }

    // Replace localhost with 127.0.0.1 to avoid IPv6 issues
    const apiUrl = NEXT_PUBLIC_BACKEND_URL.replace('localhost', '127.0.0.1');
    
    console.log('Fetching user subscription:', {
      userId: session.user.id,
      url: `${apiUrl}/api/v1/subscriptions/my`
    });

    // Forward request to backend
    const response = await fetch(`${apiUrl}/api/v1/subscriptions/my`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
      cache: 'no-store'
    });

    console.log('Backend response status:', response.status);

    if (response.status === 404) {
      // No subscription found - this is normal for users without subscriptions
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend subscription fetch failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      return NextResponse.json(
        { error: `Failed to fetch subscription: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Subscription data received:', {
      hasSubscription: !!data,
      subscriptionId: data?.id,
      planName: data?.plan_name,
      status: data?.status
    });

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
