import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace('localhost', '127.0.0.1');

export async function POST(request: NextRequest) {
  try {
    // Get the session to verify authentication
    const session = await auth();
    let accessToken: string | undefined;

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

    // Get the request body
    const body = await request.json();
    const { plan_id } = body;

    if (!plan_id) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    // Call the backend API to create PayPal subscription
    const response = await fetch(`${BACKEND_URL}/api/v1/subscriptions/create_subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        plan_id: plan_id
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Backend API error:', errorData);
      
      return NextResponse.json(
        { error: errorData.detail || 'Failed to create subscription' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Return the subscription data including approval URL
    return NextResponse.json({
      subscription_id: data.subscription_id,
      approval_url: data.approval_url,
      status: data.status,
      expired_at: data.expired_at,
      plan_id: data.plan_id,
      user_id: data.user_id,
      created_at: data.created_at,
      updated_at: data.updated_at
    });

  } catch (error) {
    console.error('PayPal subscription creation error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
