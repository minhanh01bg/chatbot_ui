import { compare } from 'bcrypt-ts';
import NextAuth, { type User, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { jwtDecode } from 'jwt-decode';

import { getUser } from '@/lib/db/queries';
import { login as loginService } from '../../services/login.service';

import { authConfig } from './auth.config';

interface ExtendedSession extends Session {
  user: User;
  accessToken?: string;
  role?: string;
}

// Extend User type to support additional fields we need
interface CustomUser extends User {
  accessToken?: string;
  tokenType?: string;
  username?: string;
  email?: string;
  role?: string;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  session: {
    // Use "jwt" strategy for easier management, with shorter maxAge to avoid long caching
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour instead of default 30 days
    updateAge: 60 * 5, // Update session every 5 minutes instead of default 24 hours
  },
  providers: [
    Credentials({
      credentials: {},
      async authorize({ username, password }: any) {
        try {
          console.log('Authentication attempt initiated for identifier:', username);

          if (!username || !password) {
            console.error('Authentication failed: Missing credentials');
            return null;
          }

          const loginResponse = await loginService(username, password);

          console.log('Login service response received:', {
            hasResponse: !!loginResponse,
            hasAccessToken: !!loginResponse?.access_token,
            hasUser: !!loginResponse?.user,
            userId: loginResponse?.user?.id,
            userIdentifier: loginResponse?.user?.identifier,
            userRole: loginResponse?.role
          });
          
          if (!loginResponse) {
            console.error('Authentication failed: No response from login service');
            return null;
          }
          
          if (!loginResponse.access_token) {
            console.error('Authentication failed: Invalid response format - missing access_token');
            console.error('Response structure:', JSON.stringify(Object.keys(loginResponse)));
            return null;
          }
          
          if (!loginResponse.user || !loginResponse.user.id || !loginResponse.user.identifier) {
            console.error('Authentication failed: Invalid user data in response');
            console.error('User data:', JSON.stringify(loginResponse.user));
            return null;
          }

          // Create user object from response
          const user: CustomUser = {
            id: loginResponse.user.id,
            name: loginResponse.user.identifier,
            email: loginResponse.user.identifier.includes('@') ? loginResponse.user.identifier : undefined,
            accessToken: loginResponse.access_token,
            tokenType: loginResponse.token_type,
            role: loginResponse.role || 'superadmin', // Default to superadmin for now
          };

          console.log('User object created:', {
            id: user.id,
            name: user.name,
            hasAccessToken: !!user.accessToken,
            role: user.role
          });

          return user;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user?: CustomUser }) {
      if (user) {
        // User just signed in
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.tokenType = user.tokenType;
        token.role = user.role;
        token.createdAt = Date.now();
        token.needsRefresh = false;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: any;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
        // Add token information to session
        (session as any).accessToken = token.accessToken;
        (session as any).tokenType = token.tokenType;
        (session as any).role = token.role || 'superadmin'; // Ensure role is always present
        // Add timestamp information
        (session as any).createdAt = token.createdAt;
        (session as any).needsRefresh = token.needsRefresh;
      }

      return session;
    },
  },
});
