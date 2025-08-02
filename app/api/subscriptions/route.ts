import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace('localhost', '127.0.0.1') || 'http://127.0.0.1:8001';

export async function POST(request: NextRequest) {
  try {
    const { planId, userId, accessToken } = await request.json();

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    let finalUserId = userId;
    let finalAccessToken = accessToken;

    // Try to get from NextAuth session if not provided
    if (!finalUserId || !finalAccessToken) {
      const session = await auth();

      if (session?.user?.id) {
        finalUserId = session.user.id;
        finalAccessToken = (session as any).accessToken;
      }
    }

    // Try to get from cookies as fallback
    if (!finalAccessToken) {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      finalAccessToken = cookieStore.get('access_token')?.value ||
                        cookieStore.get('client_access_token')?.value;
    }

    if (!finalAccessToken) {
      return NextResponse.json(
        { error: 'Access token not found' },
        { status: 401 }
      );
    }

    // For Google OAuth users, use a placeholder ID - backend will resolve from token
    if (!finalUserId) {
      finalUserId = 'oauth-user';
    }

    // Make request to backend
    const response = await fetch(`${BACKEND_URL}/api/v1/subscriptions/${finalUserId}/create?plan_id=${planId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${finalAccessToken}`,
      },
      body: '',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'Failed to create subscription' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
