import { NextRequest, NextResponse } from 'next/server';

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * API route that serves as a proxy for reset password
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
    // Extract reset data from request
    const resetData = await request.json();
    console.log("Reset password request received:", JSON.stringify({
      hasToken: !!resetData.token,
      hasPassword: !!resetData.new_password
    }));

    // Validate required fields
    if (!resetData.token || !resetData.new_password) {
      return NextResponse.json(
        { error: 'Token và mật khẩu mới là bắt buộc' },
        { status: 400 }
      );
    }

    // Replace localhost with 127.0.0.1 to avoid IPv6 issues
    const apiUrl = NEXT_PUBLIC_BACKEND_URL.replace('localhost', '127.0.0.1');
    console.log("Making request to:", `${apiUrl}/api/v1/reset_password`);

    // Forward request to backend
    const response = await fetch(`${apiUrl}/api/v1/reset_password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: JSON.stringify({
        token: resetData.token,
        new_password: resetData.new_password
      }),
      cache: 'no-store'
    });

    console.log("Backend reset password response status:", response.status);
    
    // Get response data
    const data = await response.json();
    console.log("Backend reset password response received");
    
    // Return response from backend
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('Reset password proxy error:', error);
    return NextResponse.json(
      { error: 'Đổi mật khẩu thất bại' },
      { status: 500 }
    );
  }
}