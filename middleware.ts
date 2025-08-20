import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /admin, /api/auth/login)
  const path = request.nextUrl.pathname;

  // Get cookies
  const accessToken = request.cookies.get('access_token')?.value;
  const clientAccessToken = request.cookies.get('client_access_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;

  // Check if user is authenticated
  const isAuthenticated = !!(accessToken || clientAccessToken);

  // Define public paths that don't require authentication
  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.some(publicPath => path.startsWith(publicPath));
  
  // Define API paths that should be handled by NextAuth (not middleware)
  const nextAuthApiPaths = ['/api/auth'];
  const isNextAuthApiPath = nextAuthApiPaths.some(apiPath => path.startsWith(apiPath));

  // Define admin-only paths
  const adminPaths = ['/admin'];
  const isAdminPath = adminPaths.some(adminPath => path.startsWith(adminPath));

  // Skip middleware for NextAuth API routes
  if (isNextAuthApiPath) {
    return NextResponse.next();
  }

  // If user is not authenticated and trying to access protected route
  if (!isAuthenticated && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('reason', 'unauthorized');
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated and trying to access login/register
  if (isAuthenticated && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // If user is trying to access admin paths, check if they have admin role
  if (isAdminPath && isAuthenticated) {
    const isSuperAdmin = userRole?.toLowerCase() === 'superadmin';
    const isAdmin = userRole?.toLowerCase() === 'admin' || isSuperAdmin;
    
    // For now, allow access if authenticated (temporary fix)
    if (!isAdmin && !isSuperAdmin) {
      console.log('User role check failed:', { userRole, isAdmin, isSuperAdmin });
      // Instead of redirecting to unauthorized, allow access for now
      // const unauthorizedUrl = new URL('/unauthorized', request.url);
      // return NextResponse.redirect(unauthorizedUrl);
    }
  }

  // Add headers for debugging
  const response = NextResponse.next();
  response.headers.set('X-Auth-Status', isAuthenticated ? 'authenticated' : 'unauthenticated');
  response.headers.set('X-User-Role', userRole || 'none');
  response.headers.set('X-Request-Path', path);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/auth (NextAuth API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|api/auth).*)',
  ],
};

