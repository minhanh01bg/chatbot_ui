import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace('localhost', '127.0.0.1') || 'http://127.0.0.1:8001';

// POST /api/subscriptions/[id]/cancel - Cancel subscription
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    let accessToken: string | undefined;
    const session = await auth();
    if (!session?.user?.id || (session?.user as any)?.role !== 'superadmin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    accessToken = (session as any).accessToken;
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
    const response = await fetch(`${BACKEND_URL}/api/v1/subscriptions/${resolvedParams.id}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'Failed to cancel subscription' },
        { status: response.status }
      );
    }
    return NextResponse.json({ message: 'Subscription canceled successfully' });
  } catch (error) {
    console.error('Error canceling subscription:', error);
  }
}
