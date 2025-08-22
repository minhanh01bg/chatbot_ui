import { NextRequest, NextResponse } from 'next/server';

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * API route that serves as a proxy for getting user info from Google token
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
    // Extract token from request
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    console.log("Getting user info with Google token");

    // Replace localhost with 127.0.0.1 to avoid IPv6 issues
    const apiUrl = NEXT_PUBLIC_BACKEND_URL.replace('localhost', '127.0.0.1');
    console.log("Making request to:", `${apiUrl}/auth/get_user_info`);

    // Create URLSearchParams for the email parameter
    // The backend endpoint expects email as query parameter from the verify_google_token dependency
    // We need to decode the JWT token to get the email, but since this is handled by the backend
    // we'll pass the token as Authorization header and let backend handle it
    const url = new URL(`${apiUrl}/auth/get_user_info`);
    
    // Forward request to backend
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      cache: 'no-store'
    });

    console.log("Backend response status:", response.status);
    
    // Get response data
    const data = await response.json();
    console.log("Backend response received with access_token:", !!data.access_token);
    console.log("Backend response role:", data.role);
    
    // Create response with cookies
    const res = NextResponse.json(data, { status: response.status });
    
    // Set access token to cookie if request was successful (same as login)
    if (response.ok && data.access_token) {
      console.log("Setting access_token cookie, token length:", data.access_token.length);
      console.log("User data from backend:", JSON.stringify(data.user));
      
      // Set access token cookie for authentication
      res.cookies.set('access_token', data.access_token, {
        path: '/',
        httpOnly: false, // Allow client-side access for API calls
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      
      // Set user information cookies for client-side access
      if (data.user) {
        if (data.user.id) {
          res.cookies.set('user_id', data.user.id.toString(), {
            path: '/',
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 1 week
          });
        }
        
        if (data.user.identifier) {
          res.cookies.set('user_identifier', data.user.identifier, {
            path: '/',
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 1 week
          });
        }
      }

      // Set role cookie (default to user if not provided)
      const userRole = data.role || 'user';
      res.cookies.set('user_role', userRole, {
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      console.log("Role cookie set:", userRole);
      
      // Store brand_logos in cookie if available
      if (data.brand_logos) {
        res.cookies.set('brand_logos', JSON.stringify(data.brand_logos), {
          path: '/',
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7 // 1 week
        });
      }
      
      // Add debugging header
      res.headers.set('X-Set-Cookies', 'true');
      
      console.log("Access token and user info cookies set successfully");
    }
    
    return res;
  } catch (error) {
    console.error('Get user info proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to get user info' },
      { status: 500 }
    );
  }
}