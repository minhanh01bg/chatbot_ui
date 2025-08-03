import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';

export async function POST(request: NextRequest) {
  try {
    console.log('=== /api/products POST called ===');
    
    // Get session from NextAuth
    const session = await auth();
    
    console.log('Session info:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userName: session?.user?.name,
      userEmail: session?.user?.email,
      hasSessionToken: !!(session as any)?.accessToken,
      sessionTokenLength: (session as any)?.accessToken?.length,
    });
    
    if (!session?.user?.id) {
      console.log('No session or user ID found');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get access token from request headers first, then fallback to session
    let accessToken = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!accessToken) {
      accessToken = (session as any)?.accessToken;
      console.log('Using session token instead');
    }

    if (!accessToken) {
      console.error('No access token found in headers or session');
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

    // Get request body
    const body = await request.json();
    
    console.log('Product creation request:', {
      name: body.name,
      period: body.period,
      isCustom: body.is_custom,
      isSelfSignupAllowed: body.is_self_sigup_allowed,
      hasLimits: !!body.limits,
      featuresCount: body.features?.length || 0
    });

    // Validate required fields
    if (!body.name || !body.period || !body.limits || !body.features) {
      return NextResponse.json(
        { error: 'Missing required fields: name, period, limits, features' },
        { status: 400 }
      );
    }

    // Forward request to backend
    const apiUrl = NEXT_PUBLIC_BACKEND_URL.replace('localhost', '127.0.0.1');
    const fullUrl = `${apiUrl}/api/v1/products`;
    
    console.log('Creating product:', {
      url: fullUrl,
      method: 'POST',
      hasAuthHeader: !!accessToken,
      authHeaderLength: accessToken?.length
    });
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
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

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend product creation failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        
        return NextResponse.json(
          { error: `Failed to create product: ${response.statusText}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      console.log('Product created successfully:', {
        productId: data?.id,
        productName: data?.name,
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
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('=== /api/products GET called ===');
    
    // Get session from NextAuth
    const session = await auth();
    
    if (!session?.user?.id) {
      console.log('No session or user ID found');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get access token from request headers first, then fallback to session
    let accessToken = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!accessToken) {
      accessToken = (session as any)?.accessToken;
      console.log('Using session token instead');
    }

    if (!accessToken) {
      console.error('No access token found in headers or session');
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 401 }
      );
    }

    // Forward request to backend
    const apiUrl = NEXT_PUBLIC_BACKEND_URL.replace('localhost', '127.0.0.1');
    const fullUrl = `${apiUrl}/api/v1/products`;
    
    console.log('Fetching products:', {
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
        },
        cache: 'no-store',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      console.log('Backend response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend products fetch failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        
        return NextResponse.json(
          { error: `Failed to fetch products: ${response.statusText}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      console.log('Products data received:', {
        productsCount: Array.isArray(data) ? data.length : 1,
        hasData: !!data
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
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 