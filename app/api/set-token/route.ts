import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token, expired_at } = await request.json();

    if (!token) {
      return NextResponse.json({ success: false, error: 'No token provided' }, { status: 400 });
    }

    console.log(`Setting token cookie from API, token length: ${token.length}`);
    if (expired_at) {
      console.log(`Token expires at: ${expired_at}`);
    }

    // Create response with token set in cookies
    const response = NextResponse.json({
      success: true,
      message: 'Token cookie set successfully',
      tokenPreview: `${token.substring(0, 10)}...`,
      expired_at
    });
    
    // Set the server-accessible cookie with common settings known to work
    response.cookies.set('access_token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',  // Important: 'lax' allows cookie to be sent in navigation requests
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    
    // Set a client-accessible cookie version
    response.cookies.set('client_access_token', token, {
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    // Set expired_at cookie if provided
    if (expired_at) {
      response.cookies.set('token_expired_at', expired_at, {
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
    }

    return response;
  } catch (error) {
    console.error('Error setting token cookie:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to set token cookie' },
      { status: 500 }
    );
  }
} 