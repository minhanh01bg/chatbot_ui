import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const skip = searchParams.get('skip') || '0';
    const limit = searchParams.get('limit') || '10';
    const format = searchParams.get('format') || 'file';

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
      `${backendUrl}/api/v1/get_documents?page=${skip}&page_size=${limit}&format=${format}`,
      {
        method: 'GET',
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
    console.error('Get documents API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
