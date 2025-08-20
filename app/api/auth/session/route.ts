import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';

export async function GET(request: NextRequest) {
  try {
    // Get NextAuth session
    const session = await auth();
    
    // Get cookies
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    
    const accessToken = cookieStore.get('access_token')?.value;
    const clientAccessToken = cookieStore.get('client_access_token')?.value;
    const tokenExpiredAt = cookieStore.get('token_expired_at')?.value;
    const userId = cookieStore.get('user_id')?.value;
    const userIdentifier = cookieStore.get('user_identifier')?.value;

    // Return the actual session data with token if available
    const responseData = {
      user: session?.user ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      } : null,
      accessToken: (session as any)?.accessToken || clientAccessToken || accessToken,
      role: (session as any)?.role, // Add role to response
      expires: session?.expires,
      // Debug info
      debug: {
        sessionExists: !!session,
        sessionAccessToken: (session as any)?.accessToken ? 'exists' : null,
        sessionRole: (session as any)?.role, // Add role to debug
        cookieAccessToken: accessToken ? 'exists' : null,
        clientCookieToken: clientAccessToken ? 'exists' : null,
        userId: userId,
        userIdentifier: userIdentifier,
        timestamp: new Date().toISOString(),
      }
    };

    // Add caching headers to reduce redundant calls
    const response = NextResponse.json(responseData);
    
    // Cache for 30 seconds to reduce redundant calls
    response.headers.set('Cache-Control', 'private, max-age=30, stale-while-revalidate=60');
    response.headers.set('ETag', `"${JSON.stringify(responseData).length}-${Date.now()}"`);
    
    return response;
  } catch (error) {
    console.error('Error getting session debug info:', error);
    
    // Return a more detailed error response for debugging
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
