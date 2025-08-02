import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('=== /api/test-auth called ===');
    
    // Get session from NextAuth
    const session = await auth();
    
    console.log('Session in test-auth:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userName: session?.user?.name,
      hasAccessToken: !!(session as any)?.accessToken
    });
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { 
          authenticated: false,
          error: 'No session or user ID found',
          session: session
        },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email
      },
      hasAccessToken: !!(session as any)?.accessToken,
      sessionExpires: session.expires
    });
    
  } catch (error) {
    console.error('Error in test-auth:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 