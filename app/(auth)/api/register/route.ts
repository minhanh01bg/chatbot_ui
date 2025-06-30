import { NextRequest, NextResponse } from 'next/server';

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * API route that serves as a proxy for registration
 * This prevents exposing the backend URL directly to the client
 */
export async function POST(request: NextRequest) {
  if (!NEXT_PUBLIC_BACKEND_URL) {
    console.error('Server configuration error: Missing API configuration');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    // Extract registration data from request
    const userData = await request.json();

    // Replace localhost with 127.0.0.1 to avoid IPv6 issues
    const apiUrl = NEXT_PUBLIC_BACKEND_URL.replace('localhost', '127.0.0.1');

    // Create FormData for backend request
    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('password', userData.password);

    // Forward request to backend
    const response = await fetch(`${apiUrl}/api/v1/register`, {
      method: 'POST',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: formData,
      cache: 'no-store'
    });

    // Handle existing user error
    if (response.status === 409) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Get response data
    const data = await response.json();
    
    // Return backend response
    return NextResponse.json(
      data,
      { status: response.status }
    );
  } catch (error) {
    console.error('Registration proxy error');
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
} 