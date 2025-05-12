import NextAuth from 'next-auth';

import { authConfig } from '@/app/(auth)/auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/login (authentication API route)
     * - api/register (registration API route)
     * - api/auth-proxy (authenticated API proxy route)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    // '/((?!api/login|api/register|api/auth-proxy|_next/static|_next/image|favicon.ico).*)',
  ],
};

