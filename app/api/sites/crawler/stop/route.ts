import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get authorization header from the request
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    // Get backend URL from environment variables
    const backendUrl = process.env.BACKEND_URL?.replace('localhost', '127.0.0.1') || 'http://127.0.0.1:8001';
    
    // Forward the request to FastAPI backend
    const backendResponse = await fetch(
      `${backendUrl}/api/v1/stop_crawler`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader, // Forward the auth header
        },
      }
    );

    // Get response data
    const responseData = await backendResponse.json();

    // Return the response with the same status code
    return NextResponse.json(responseData, { 
      status: backendResponse.status 
    });

  } catch (error) {
    console.error('Stop crawler API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
