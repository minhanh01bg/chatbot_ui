import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace('localhost', '127.0.0.1') || 'http://127.0.0.1:8001';

// POST /api/subscriptions/my/[id]/cancel - Cancel subscription
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    let accessToken: string | undefined;
    const session = await auth();
    if (session?.user?.id) {
      accessToken = (session as any).accessToken;
    }
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
    console.log('Attempting to cancel subscription:', {
      subscriptionId: params.id,
      backendUrl: `${BACKEND_URL}/api/v1/subscriptions/my/${params.id}/cancel`,
      hasAccessToken: !!accessToken
    });

    const response = await fetch(`${BACKEND_URL}/api/v1/subscriptions/my/${params.id}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Backend response status:', response.status);

    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
        errorData = { detail: 'Failed to parse error response' };
      }
      
      console.error('Backend error response:', errorData);
      return NextResponse.json(
        { 
          error: errorData.detail || 'Failed to cancel subscription',
          status: response.status,
          subscriptionId: params.id
        },
        { status: response.status }
      );
    }
    return NextResponse.json({ message: 'Subscription canceled successfully' });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
