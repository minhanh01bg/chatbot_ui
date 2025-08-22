import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';
    
    // First, establish session with backend
    const sessionResponse = await fetch(`${backendUrl}/auth/google`, {
      method: 'GET',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
        'User-Agent': request.headers.get('user-agent') || '',
        'Accept': request.headers.get('accept') || 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'manual' // Don't follow redirects automatically
    });

    if (sessionResponse.status === 302) {
      const location = sessionResponse.headers.get('location');
      if (location) {
        // Copy any Set-Cookie headers from backend to client
        const setCookieHeaders = sessionResponse.headers.get('set-cookie');
        const response = NextResponse.redirect(location);
        
        if (setCookieHeaders) {
          response.headers.set('Set-Cookie', setCookieHeaders);
        }
        
        return response;
      }
    }
    
    // Fallback redirect
    return NextResponse.redirect(`${backendUrl}/auth/google`);
    
  } catch (error) {
    console.error('Error establishing session with backend:', error);
    // Fallback: direct redirect
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';
    return NextResponse.redirect(`${backendUrl}/auth/google`);
  }
}