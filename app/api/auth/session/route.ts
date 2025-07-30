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

    return NextResponse.json({
      session: {
        exists: !!session,
        user: session?.user ? {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
        } : null,
        accessToken: (session as any)?.accessToken ? 'exists' : null,
      },
      cookies: {
        access_token: accessToken ? 'exists' : null,
        client_access_token: clientAccessToken ? 'exists' : null,
        token_expired_at: tokenExpiredAt,
        user_id: userId,
        user_identifier: userIdentifier,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error getting session debug info:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
