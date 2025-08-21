import { NextRequest, NextResponse } from 'next/server';

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * API route that serves as a proxy for forgot password
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
    // Extract email from request
    const forgotData = await request.json();
    console.log("Forgot password request received:", JSON.stringify({
      hasEmail: !!forgotData.email
    }));

    // Validate required fields
    if (!forgotData.email) {
      return NextResponse.json(
        { error: 'Email là bắt buộc' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotData.email)) {
      return NextResponse.json(
        { error: 'Địa chỉ email không hợp lệ' },
        { status: 400 }
      );
    }

    // Replace localhost with 127.0.0.1 to avoid IPv6 issues
    const apiUrl = NEXT_PUBLIC_BACKEND_URL.replace('localhost', '127.0.0.1');
    console.log("Making request to:", `${apiUrl}/api/v1/forgot_password`);

    // Forward request to backend
    const response = await fetch(`${apiUrl}/api/v1/forgot_password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: JSON.stringify({
        email: forgotData.email
      }),
      cache: 'no-store'
    });

    console.log("Backend forgot password response status:", response.status);
    
    // Get response data
    const data = await response.json();
    console.log("Backend forgot password response received");
    
    // Return response from backend
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('Forgot password proxy error:', error);
    return NextResponse.json(
      { error: 'Gửi email thất bại' },
      { status: 500 }
    );
  }
}