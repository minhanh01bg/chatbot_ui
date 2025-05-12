import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/session';

const BACKEND_URL = process.env.BACKEND_URL;

// GET /admin/sites/api
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    // const skip = searchParams.get('skip') || '0';
    // const limit = searchParams.get('limit') || '10';

    // Get user token from session
    const userToken = session.accessToken;
    console.log('userToken', userToken);
    if (!userToken) {
      return NextResponse.json({ error: 'No access token found' }, { status: 401 });
    }

    // Make request to backend API
    const response = await fetch(`${BACKEND_URL}/api/v1/sites`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'Failed to fetch sites' }, 
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the data with the same structure expected by the frontend
    return NextResponse.json({
      sites: data.sites || [],
      total: data.total || 0,
    //   skip: parseInt(skip),
    //   limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Error fetching sites:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching sites' },
      { status: 500 }
    );
  }
} 