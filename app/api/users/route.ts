import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace('localhost', '127.0.0.1') || 'http://127.0.0.1:8001';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    // Check if user is authenticated and has superadmin role
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has superadmin role
    if (session.user.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Access denied. Superadmin role required.' },
        { status: 403 }
      );
    }

    // Get access token
    let accessToken = (session as any).accessToken;

    // Try to get from cookies as fallback
    if (!accessToken) {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      accessToken = cookieStore.get('access_token')?.value ||
                   cookieStore.get('client_access_token')?.value;
    }

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token not found' },
        { status: 401 }
      );
    }

    // Make request to backend to get all users
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'Failed to fetch users' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 