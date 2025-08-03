import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Dashboard API GET called');
    
    // Get authorization header from the request
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const rangeDays = searchParams.get('rangeDays') || '7';

    const rangeDaysNumber = parseInt(rangeDays);
    
    // Get backend URL from environment variables
    const backendUrl = process.env.BACKEND_URL?.replace('localhost', '127.0.0.1') || 'http://127.0.0.1:8001';

    // Forward the request to FastAPI backend
    const params = new URLSearchParams();
    if (rangeDaysNumber) {
      params.append('range_days', rangeDaysNumber.toString());
    }

    // Get request body if it exists
    let requestBody = {};
    try {
      requestBody = await request.json();
    } catch {
      // No body provided, use empty object
    }

    console.log('Forwarding to backend:', `${backendUrl}/api/v1/dashboard?${params}`);
    console.log('Request body:', requestBody);
    
    const backendResponse = await fetch(
      `${backendUrl}/api/v1/dashboard?${params}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader, // Forward the auth header
        },
        body: JSON.stringify(requestBody),
      }
    );

    // Get response data
    const responseData = await backendResponse.json();
    console.log('Backend response status:', backendResponse.status);
    console.log('Backend response data:', responseData);

    // Return the response with the same status code
    return NextResponse.json(responseData, {
      status: backendResponse.status
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Dashboard API POST called');
    console.log('Request URL:', request.url);
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    // Get authorization header from the request
    const authHeader = request.headers.get('authorization');
    console.log('Authorization header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader) {
      console.log('No authorization header, returning 401');
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    // Get rangeDays from query parameters
    const { searchParams } = new URL(request.url);
    const rangeDays = searchParams.get('rangeDays') || '7';
    const rangeDaysNumber = parseInt(rangeDays);

    // Get request body
    const body = await request.json();

    // Get backend URL from environment variables
    const backendUrl = process.env.BACKEND_URL?.replace('localhost', '127.0.0.1') || 'http://127.0.0.1:8001';

    // Forward the request to FastAPI backend
    const params = new URLSearchParams();
    if (rangeDaysNumber) {
      params.append('range_days', rangeDaysNumber.toString());
    }

    console.log('Forwarding to backend:', `${backendUrl}/api/v1/dashboard?${params}`);
    console.log('Request body:', body);
    console.log('Backend request headers:', {
      'Content-Type': 'application/json',
      'Authorization': authHeader ? 'Bearer [HIDDEN]' : 'Missing'
    });
    
    const backendResponse = await fetch(
      `${backendUrl}/api/v1/dashboard?${params}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader, // Forward the auth header
        },
        body: JSON.stringify(body),
      }
    );
    
    console.log('Backend request completed, status:', backendResponse.status);

    // Get response data
    const responseData = await backendResponse.json();
    console.log('Backend response status:', backendResponse.status);
    console.log('Backend response data:', responseData);

    // Return the response with the same status code
    return NextResponse.json(responseData, {
      status: backendResponse.status
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 