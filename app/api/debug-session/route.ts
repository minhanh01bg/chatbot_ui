import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getServerSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    // Get all cookies directly
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const accessTokenCookie = cookieStore.get('access_token')?.value;
    const clientAccessTokenCookie = cookieStore.get('client_access_token')?.value;
    
    // Get session which should include the token
    const session = await getServerSession();
    
    // Prepare response with detailed debugging info
    const responseData = {
      cookies: {
        all: allCookies.map(c => c.name),
        hasAccessToken: !!accessTokenCookie,
        hasClientAccessToken: !!clientAccessTokenCookie,
        accessTokenPreview: accessTokenCookie 
          ? `${accessTokenCookie.substring(0, 10)}...` 
          : null,
        clientAccessTokenPreview: clientAccessTokenCookie 
          ? `${clientAccessTokenCookie.substring(0, 10)}...` 
          : null,
      },
      session: {
        hasUser: !!session?.user,
        hasAccessToken: !!session?.accessToken,
        accessTokenPreview: session?.accessToken 
          ? `${session.accessToken.substring(0, 10)}...` 
          : null,
      },
      request: {
        hasAuthHeader: !!request.headers.get('authorization'),
        authHeaderPreview: request.headers.get('authorization')
          ? `${request.headers.get('authorization')?.substring(0, 15)}...`
          : null,
      }
    };
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in debug session endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to get debug session info' },
      { status: 500 }
    );
  }
} 