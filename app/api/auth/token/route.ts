import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { token, expired_at, userId, userIdentifier, role } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const maxAge = 60 * 60 * 24 * 7; // 7 days

    // Set server-side cookies
    cookieStore.set('access_token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge,
      path: '/',
    });

    // Set user info cookies if provided
    if (userId) {
      cookieStore.set('user_id', userId, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: maxAge,
        path: '/',
      });
    }

    if (userIdentifier) {
      cookieStore.set('user_identifier', userIdentifier, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: maxAge,
        path: '/',
      });
    }

    if (role) {
      cookieStore.set('user_role', role, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: maxAge,
        path: '/',
      });
    }

    if (expired_at) {
      cookieStore.set('token_expired_at', expired_at, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: maxAge,
        path: '/',
      });
    }

    console.log('Server: Token and user cookies set successfully:', {
      hasToken: !!token,
      hasUserId: !!userId,
      hasUserIdentifier: !!userIdentifier,
      hasRole: !!role,
      role: role
    });

    return NextResponse.json({ 
      success: true,
      message: 'Token and user data set successfully',
      data: {
        hasToken: !!token,
        hasUserId: !!userId,
        hasUserIdentifier: !!userIdentifier,
        hasRole: !!role
      }
    });
  } catch (error) {
    console.error('Error setting token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
