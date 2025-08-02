import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace('localhost', '127.0.0.1') || 'http://127.0.0.1:8001';

// GET /api/plans/[id] - Get specific plan details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Plan by ID API: Fetching from backend:', `${BACKEND_URL}/api/v1/plans/${params.id}`);
    
    const response = await fetch(`${BACKEND_URL}/api/v1/plans/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Plan by ID API: Backend error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch plan' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Plan by ID API: Received data:', data);
    
    // Transform the data to match the expected frontend format
    const transformedPlan = {
      id: data.id,
      name: data.product_name, // Map product_name to name
      description: data.description,
      price: data.price,
      period: `${data.billing_interval_count} ${data.billing_interval_unit.toLowerCase()}${data.billing_interval_count > 1 ? 's' : ''}`, // Create period string
      limits: data.limits,
      features: data.features || [],
      created_at: data.created_at,
      updated_at: data.updated_at,
      is_self_sigup_allowed: true // Default to true, adjust as needed
    };

    console.log('Plan by ID API: Transformed plan:', transformedPlan);
    return NextResponse.json(transformedPlan);
  } catch (error) {
    console.error('Error fetching plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
