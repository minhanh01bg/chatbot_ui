import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * API route that serves as a general-purpose proxy for authenticated requests
 * This prevents exposing the backend URL directly to the client
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (!NEXT_PUBLIC_BACKEND_URL) {
      console.error('Server configuration error: Missing API configuration');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Extract request data
    const { endpoint, method, body } = await request.json();
    
    if (!endpoint) {
      return NextResponse.json(
        { error: 'Missing endpoint parameter' },
        { status: 400 }
      );
    }

    // Replace localhost with 127.0.0.1 to avoid IPv6 issues
    const apiUrl = NEXT_PUBLIC_BACKEND_URL.replace('localhost', '127.0.0.1');
    const url = `${apiUrl}${endpoint}`;
    
    // Forward request to backend with authorization
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    };

    // Add authorization header
    if (token.accessToken) {
      const tokenType = token.tokenType || 'Bearer';
      headers['Authorization'] = `${tokenType} ${token.accessToken}`;
    }

    // Make request to backend
    const response = await fetch(url, {
      method: method || 'GET',
      headers,
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store'
    });

    // Get response data
    const data = await response.json();
    
    // Return backend response
    return NextResponse.json(
      data,
      { status: response.status }
    );
  } catch (error) {
    console.error('API proxy error');
    return NextResponse.json(
      { error: 'Request failed' },
      { status: 500 }
    );
  }
} 
