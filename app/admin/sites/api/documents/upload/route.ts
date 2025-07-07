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

    // Get the form data from the request
    const formData = await request.formData();
    
    // Validate that we have a file
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Get backend URL from environment variables
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8001';
    
    // Create new FormData for backend request
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    // Forward the request to FastAPI backend
    const backendResponse = await fetch(
      `${backendUrl}/api/v1/add_documents`,
      {
        method: 'POST',
        headers: {
          'Authorization': authHeader, // Forward the auth header
          // Don't set Content-Type for FormData, let the browser set it with boundary
        },
        body: backendFormData,
      }
    );

    // Get response data
    const responseData = await backendResponse.json();

    // Return the response with the same status code
    return NextResponse.json(responseData, { 
      status: backendResponse.status 
    });

  } catch (error) {
    console.error('Upload document API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
