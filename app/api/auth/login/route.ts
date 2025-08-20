import { NextRequest, NextResponse } from 'next/server';

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * API route that serves as a proxy for login
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
    // Extract credentials from request
    const credentials = await request.json();
    console.log("Login credentials received:", JSON.stringify({
      identifier: credentials.identifier || credentials.username,
      hasPassword: !!credentials.password
    }));

    // Replace localhost with 127.0.0.1 to avoid IPv6 issues
    const apiUrl = NEXT_PUBLIC_BACKEND_URL.replace('localhost', '127.0.0.1');
    console.log("Making request to:", `${apiUrl}/api/v1/login`);

    // Create FormData for backend request
    const formData = new FormData();
    // Backend expects 'username' field, but we send identifier (which can be username or email)
    formData.append('identifier', credentials.identifier || credentials.username);
    formData.append('password', credentials.password);

    // Forward request to backend
    const response = await fetch(`${apiUrl}/api/v1/login`, {
      method: 'POST',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: formData,
      cache: 'no-store'
    });

    console.log("Backend response status:", response.status);
    
    // Get response data
    const data = await response.json();
    console.log("Backend response received with access_token:", !!data.access_token);
    console.log("Backend response role:", data.role);
    
    // Create response with cookies
    const res = NextResponse.json(data, { status: response.status });
    
    // Set access token to cookie if login was successful
    if (response.ok && data.access_token) {
      console.log("Setting access_token cookie, token length:", data.access_token.length);
      console.log("User data from backend:", JSON.stringify(data.user));
      
      // Critical settings for proper cookie functioning:
      // 1. path='/' ensures cookie is available across the entire site
      // 2. sameSite='lax' ensures cookie is sent with most navigation requests
      // 3. secure=false for local development (would be true in production)
      // 4. httpOnly=true for the server-only cookie to prevent client JS access
      res.cookies.set('access_token', data.access_token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      
      // Also set a non-httpOnly cookie for client-side JavaScript
      res.cookies.set('client_access_token', data.access_token, {
        path: '/',
        httpOnly: false,
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

      // Set role cookie (default to superadmin if not provided)
      const userRole = data.role || 'user';
      res.cookies.set('user_role', userRole, {
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      console.log("Role cookie set:", userRole);
      
      // Add debugging header
      res.headers.set('X-Set-Cookies', 'true');
      
      console.log("Access token and user info cookies set successfully");
    }
    
    return res;
  } catch (error) {
    console.error('Login proxy error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
} 
