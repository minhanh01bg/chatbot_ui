import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request: NextRequest) {
  try {
    console.log('=== /api/subscriptions/my called ===');
    console.log('Environment variables:', {
      NEXT_PUBLIC_BACKEND_URL: NEXT_PUBLIC_BACKEND_URL,
      NODE_ENV: process.env.NODE_ENV,
      allEnvVars: Object.keys(process.env).filter(key => key.includes('BACKEND') || key.includes('URL'))
    });
    
    // Use environment variable or fallback to default
    const backendUrl = NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';
    
    if (!backendUrl) {
      console.error('Backend URL not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Get access token from request headers first
    let accessToken = request.headers.get('authorization')?.replace('Bearer ', '');
    // Get session from NextAuth as fallback
    const session = await auth();
    
    console.log('Session info:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userName: session?.user?.name,
      userEmail: session?.user?.email,
      hasSessionToken: !!(session as any)?.accessToken,
      sessionTokenLength: (session as any)?.accessToken?.length,
      sessionExpires: session?.expires,
      currentTime: new Date().toISOString()
    });
    
    // If no token in headers, try to get from session
    if (!accessToken) {
      accessToken = (session as any)?.accessToken;
      console.log('Using session token instead');
    }
    
    // Check if session is expired (only if we're using session token)
    if (!request.headers.get('authorization') && session?.expires && new Date(session.expires) < new Date()) {
      console.log('Session expired:', {
        expires: session.expires,
        currentTime: new Date().toISOString()
      });
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      );
    }
    
    // If we have a token (either from header or session), proceed
    if (!accessToken) {
      console.log('No access token found in headers or session');
      console.log('Full session object:', JSON.stringify(session, null, 2));
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 401 }
      );
    }
    
    console.log('Token info:', {
      hasToken: !!accessToken,
      tokenLength: accessToken?.length,
      tokenSource: request.headers.get('authorization') ? 'header' : 'session'
    });
    
    console.log('Final token to use:', {
      hasToken: !!accessToken,
      tokenLength: accessToken?.length,
      tokenStart: accessToken?.substring(0, 10) + '...'
    });

    // Replace localhost with 127.0.0.1 to avoid IPv6 issues
    const apiUrl = backendUrl.replace('localhost', '127.0.0.1');
    
    const fullUrl = `${apiUrl}/api/v1/subscriptions/my`;
    
    // Get user ID from session or use a default
    const userId = session?.user?.id || 'unknown';
    
    console.log('Fetching user subscription:', {
      userId: userId,
      originalUrl: backendUrl,
      modifiedUrl: apiUrl,
      fullUrl: fullUrl
    });

    // Forward request to backend
    console.log('Making fetch request to backend with:', {
      url: fullUrl,
      method: 'GET',
      hasAuthHeader: !!accessToken,
      authHeaderLength: accessToken?.length
    });
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        cache: 'no-store',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      console.log('Backend response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

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
        productName: data?.product_name,
        status: data?.status
      });

      return NextResponse.json(data);
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Fetch request failed:', fetchError);
      
      if (fetchError instanceof Error) {
        if (fetchError.name === 'AbortError') {
          return NextResponse.json(
            { error: 'Request timeout - backend not responding' },
            { status: 504 }
          );
        }
        
        return NextResponse.json(
          { error: `Network error: ${fetchError.message}` },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { error: 'Unknown network error' },
        { status: 503 }
      );
    }

  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
