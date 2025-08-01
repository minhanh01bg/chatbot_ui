import { NextRequest, NextResponse } from 'next/server';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.paypal.com' 
  : 'https://api.sandbox.paypal.com';

interface PayPalPlanRequest {
  planId: string;
  name: string;
  description: string;
  price: number;
  period: string; // 'month' or 'year'
}

export async function POST(request: NextRequest) {
  try {
    const { planId, name, description, price, period }: PayPalPlanRequest = await request.json();

    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      return NextResponse.json(
        { error: 'PayPal credentials not configured' },
        { status: 500 }
      );
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Check if plan already exists in our database/cache
    const existingPlan = await checkExistingPayPalPlan(planId);
    if (existingPlan) {
      return NextResponse.json({ paypalPlanId: existingPlan });
    }

    // Create PayPal billing plan
    const paypalPlan = await createPayPalBillingPlan(accessToken, {
      planId,
      name,
      description,
      price,
      period
    });

    // Save the mapping between our plan ID and PayPal plan ID
    await savePayPalPlanMapping(planId, paypalPlan.id);

    return NextResponse.json({ 
      paypalPlanId: paypalPlan.id,
      status: 'created'
    });

  } catch (error) {
    console.error('Error creating PayPal plan:', error);
    return NextResponse.json(
      { error: 'Failed to create PayPal plan' },
      { status: 500 }
    );
  }
}

async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}

async function createPayPalBillingPlan(accessToken: string, planData: PayPalPlanRequest) {
  const billingPlan = {
    product_id: await createPayPalProduct(accessToken, planData),
    name: planData.name,
    description: planData.description,
    status: 'ACTIVE',
    billing_cycles: [
      {
        frequency: {
          interval_unit: planData.period.toUpperCase(),
          interval_count: 1
        },
        tenure_type: 'REGULAR',
        sequence: 1,
        total_cycles: 0, // 0 means infinite
        pricing_scheme: {
          fixed_price: {
            value: planData.price.toString(),
            currency_code: 'USD'
          }
        }
      }
    ],
    payment_preferences: {
      auto_bill_outstanding: true,
      setup_fee_failure_action: 'CONTINUE',
      payment_failure_threshold: 3
    }
  };

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(billingPlan),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('PayPal plan creation failed:', errorData);
    throw new Error('Failed to create PayPal billing plan');
  }

  return await response.json();
}

async function createPayPalProduct(accessToken: string, planData: PayPalPlanRequest): Promise<string> {
  const product = {
    name: planData.name,
    description: planData.description,
    type: 'SERVICE',
    category: 'SOFTWARE'
  };

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/catalogs/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('PayPal product creation failed:', errorData);
    throw new Error('Failed to create PayPal product');
  }

  const data = await response.json();
  return data.id;
}

// Simple in-memory cache for demo - in production, use database
const paypalPlanCache = new Map<string, string>();

async function checkExistingPayPalPlan(planId: string): Promise<string | null> {
  // In production, check database for existing PayPal plan mapping
  return paypalPlanCache.get(planId) || null;
}

async function savePayPalPlanMapping(planId: string, paypalPlanId: string): Promise<void> {
  // In production, save to database
  paypalPlanCache.set(planId, paypalPlanId);
  console.log(`Saved PayPal plan mapping: ${planId} -> ${paypalPlanId}`);
}
