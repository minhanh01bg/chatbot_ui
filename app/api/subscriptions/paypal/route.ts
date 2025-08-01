import { NextRequest, NextResponse } from 'next/server';

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface PayPalSubscriptionRequest {
  paypalSubscriptionId: string;
  planId: string;
  userId?: string;
  accessToken?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { paypalSubscriptionId, planId, userId, accessToken }: PayPalSubscriptionRequest = await request.json();

    if (!NEXT_PUBLIC_BACKEND_URL) {
      console.error('Backend URL not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (!paypalSubscriptionId || !planId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify PayPal subscription status
    const subscriptionDetails = await verifyPayPalSubscription(paypalSubscriptionId);
    
    if (subscriptionDetails.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'PayPal subscription is not active' },
        { status: 400 }
      );
    }

    // Save subscription to our backend
    const backendResponse = await saveSubscriptionToBackend({
      paypalSubscriptionId,
      planId,
      userId,
      accessToken,
      subscriptionDetails
    });

    return NextResponse.json({
      success: true,
      subscription: backendResponse,
      paypalSubscriptionId,
      status: subscriptionDetails.status
    });

  } catch (error) {
    console.error('Error processing PayPal subscription:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}

async function verifyPayPalSubscription(subscriptionId: string) {
  const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
  const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
  const PAYPAL_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://api.paypal.com' 
    : 'https://api.sandbox.paypal.com';

  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal credentials not configured');
  }

  // Get PayPal access token
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const tokenResponse = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!tokenResponse.ok) {
    throw new Error('Failed to get PayPal access token');
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  // Get subscription details
  const subscriptionResponse = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (!subscriptionResponse.ok) {
    throw new Error('Failed to verify PayPal subscription');
  }

  return await subscriptionResponse.json();
}

async function saveSubscriptionToBackend({
  paypalSubscriptionId,
  planId,
  userId,
  accessToken,
  subscriptionDetails
}: {
  paypalSubscriptionId: string;
  planId: string;
  userId?: string;
  accessToken?: string;
  subscriptionDetails: any;
}) {
  const apiUrl = NEXT_PUBLIC_BACKEND_URL!.replace('localhost', '127.0.0.1');
  
  const requestBody = {
    plan_id: planId,
    user_id: userId,
    paypal_subscription_id: paypalSubscriptionId,
    paypal_subscription_status: subscriptionDetails.status,
    paypal_subscription_data: subscriptionDetails,
    payment_method: 'paypal'
  };

  console.log('Saving PayPal subscription to backend:', {
    url: `${apiUrl}/api/v1/subscriptions/paypal`,
    planId,
    userId,
    paypalSubscriptionId,
    status: subscriptionDetails.status
  });

  const response = await fetch(`${apiUrl}/api/v1/subscriptions/paypal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken ? `Bearer ${accessToken}` : '',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Backend subscription creation failed:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData
    });
    throw new Error(`Failed to save subscription to backend: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Backend subscription created successfully:', data);
  
  return data;
}
