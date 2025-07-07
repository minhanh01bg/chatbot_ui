import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Get authorization header from the request
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    // Get backend URL from environment variables
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8001';
    
    // Forward the request to FastAPI backend
    const backendResponse = await fetch(
      `${backendUrl}/api/v1/documents/${documentId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader, // Forward the auth header
        },
      }
    );

    // Get response data
    const responseData = await backendResponse.json().catch(() => ({}));

    // Return the response with the same status code
    return NextResponse.json(responseData, { 
      status: backendResponse.status 
    });

  } catch (error) {
    console.error('Delete document API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
