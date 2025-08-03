import { auth } from '@/app/(auth)/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    
    console.log('Debug Session API - Full session:', JSON.stringify(session, null, 2));
    
    return NextResponse.json({
      authenticated: !!session,
      user: session?.user ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email
      } : null,
      accessToken: !!(session as any)?.accessToken,
      tokenType: (session as any)?.tokenType,
      role: (session as any)?.role,
      createdAt: (session as any)?.createdAt,
      needsRefresh: (session as any)?.needsRefresh,
      fullSession: session
    });
  } catch (error) {
    console.error('Debug Session API Error:', error);
    return NextResponse.json({ error: 'Failed to get session' }, { status: 500 });
  }
} 