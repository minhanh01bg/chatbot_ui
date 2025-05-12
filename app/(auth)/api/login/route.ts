import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL;

/**
 * API route that serves as a proxy for login
 * This prevents exposing the backend URL directly to the client
 */
export async function POST(request: NextRequest) {
  if (!BACKEND_URL) {
    console.error('Server configuration error: Missing API configuration');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }
  
  try {
    // Extract credentials from request
    const credentials = await request.json();
    console.log("Login credentials received:", JSON.stringify({ email: credentials.email }));
    
    // Replace localhost with 127.0.0.1 to avoid IPv6 issues
    const apiUrl = BACKEND_URL.replace('localhost', '127.0.0.1');
    console.log("Making request to:", `${apiUrl}/api/v1/login`);
    
    // Forward request to backend
    const response = await fetch(`${apiUrl}/api/v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: JSON.stringify(credentials),
      cache: 'no-store'
    });

    console.log("Backend response status:", response.status);
    
    // Get response data
    const data = await response.json();
    console.log("Backend response data:", JSON.stringify(data));
    
    // Return backend response
    return NextResponse.json(
      data,
      { status: response.status }
    );
		// const res = NextResponse.json({ success: true });
    // res.cookies.set('access_token', data.access_token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   path: '/',
    //   maxAge: 60 * 60 * 24 * 7 // 1 week
    // });

    // return res;
  } catch (error) {
    console.error('Login proxy error', error);
    console.error('Error details:', JSON.stringify(error instanceof Error ? { message: error.message, stack: error.stack } : error));
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 