import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';

export async function GET(request: NextRequest) {
  try {
    let userId: string | undefined;
    let accessToken: string | undefined;

    // Try to get from NextAuth session first
    const session = await auth();
    if (session?.user?.id) {
      userId = session.user.id;
      accessToken = (session as any).accessToken;
    }

    // Try to get from cookies as fallback (for Google OAuth)
    if (!accessToken) {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      accessToken = cookieStore.get('access_token')?.value ||
                   cookieStore.get('client_access_token')?.value;
    }

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token not found' },
        { status: 401 }
      );
    }

    // For Google OAuth users, use a placeholder ID - backend will resolve from token
    if (!userId) {
      userId = 'oauth-user';
    }

    // Make request to backend to get current subscription
    const response = await fetch(`${BACKEND_URL}/api/v1/subscriptions/${userId}/current`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (response.status === 404) {
      // No subscription found
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'Failed to fetch subscription' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching current subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
