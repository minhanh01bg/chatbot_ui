import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Helper function to check authentication from cookies
function isAuthenticated(request: NextRequest): boolean {
  const userId = request.cookies.get('user_id')?.value
  const userRole = request.cookies.get('user_role')?.value
  const userIdentifier = request.cookies.get('user_identifier')?.value
  
  // Check if user has essential authentication cookies
  return !!(userId && userRole && userIdentifier)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  try {
    // Check authentication using cookies instead of NextAuth
    const authenticated = isAuthenticated(request)

    // Check if user is trying to access protected routes
    const isProtectedRoute = pathname.startsWith('/admin') || 
                           pathname.startsWith('/chat')

    // Check if user is trying to access auth routes while already authenticated
    const isAuthRoute = pathname.startsWith('/login') || 
                       pathname.startsWith('/register') ||
                       pathname.startsWith('/auth')

    if (isProtectedRoute) {
      // If not authenticated and trying to access protected route, redirect to login
      if (!authenticated) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('reason', 'unauthorized')
        return NextResponse.redirect(loginUrl)
      }
    }

    if (isAuthRoute && authenticated) {
      // If user is authenticated and trying to access auth routes, redirect to admin
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    // Add security headers
    const response = NextResponse.next()
    
    // Security headers
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    
    // Content Security Policy
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https://vercel.live https://api.vercel.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
    
    response.headers.set('Content-Security-Policy', csp)

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    
    // On error, allow the request to continue but log the error
    const response = NextResponse.next()
    
    // Still add security headers even on error
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}

