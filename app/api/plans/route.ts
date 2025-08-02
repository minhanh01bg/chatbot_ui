import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace('localhost', '127.0.0.1') || 'http://127.0.0.1:8001';

export async function GET(request: NextRequest) {
  try {
    console.log('Plans API: Fetching from backend:', `${BACKEND_URL}/api/v1/plans`);
    
    const response = await fetch(`${BACKEND_URL}/api/v1/plans`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Plans API: Backend error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch plans' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Plans API: Received data:', data);
    
    // Transform the data to match the expected frontend format
    const transformedPlans = data.map((plan: any) => ({
      id: plan.id,
      name: plan.product_name, // Map product_name to name
      description: plan.description,
      price: plan.price,
      period: `${plan.billing_interval_count} ${plan.billing_interval_unit.toLowerCase()}${plan.billing_interval_count > 1 ? 's' : ''}`, // Create period string
      limits: plan.limits,
      features: plan.features || [],
      created_at: plan.created_at,
      updated_at: plan.updated_at,
      is_self_sigup_allowed: true // Default to true, adjust as needed
    }));

    console.log('Plans API: Transformed plans:', transformedPlans);
    return NextResponse.json(transformedPlans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
