import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('=== /api/debug-session called ===');
    
    // Get session from NextAuth
    const session = await auth();
    
    const debugInfo = {
      hasSession: !!session,
      sessionData: session ? {
        user: session.user ? {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
        } : null,
        expires: session.expires,
        accessToken: (session as any)?.accessToken ? 'exists' : null,
        tokenType: (session as any)?.tokenType,
        createdAt: (session as any)?.createdAt,
        needsRefresh: (session as any)?.needsRefresh,
      } : null,
      currentTime: new Date().toISOString(),
      isExpired: session?.expires ? new Date(session.expires) < new Date() : null,
      headers: {
        authorization: request.headers.get('authorization') ? 'exists' : null,
        cookie: request.headers.get('cookie') ? 'exists' : null,
      }
    };
    
    console.log('Session debug info:', debugInfo);
    
    return NextResponse.json(debugInfo);
  } catch (error) {
    console.error('Error in debug session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 