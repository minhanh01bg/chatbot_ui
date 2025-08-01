import { compare } from 'bcrypt-ts';
import NextAuth, { type User, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { jwtDecode } from 'jwt-decode';

import { getUser } from '@/lib/db/queries';
import { login as loginService } from '../../services/login.service';
import { cookies } from 'next/headers';

import { authConfig } from './auth.config';

interface ExtendedSession extends Session {
  user: User;
}

// Extend User type to support additional fields we need
interface CustomUser extends User {
  accessToken?: string;
  tokenType?: string;
  username?: string;
  email?: string;
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
            userIdentifier: loginResponse?.user?.identifier
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
            username: loginResponse.user.identifier, // Use identifier from backend
            name: loginResponse.user.identifier, // Use identifier as display name
            email: loginResponse.user.identifier.includes('@') ? loginResponse.user.identifier : null, // Set email if identifier is email
            accessToken: loginResponse.access_token,
            tokenType: loginResponse.token_type
          };

          console.log('Authentication successful for user ID:', user.id);
          
          // Set the access token in the user object that will be passed to the JWT callback
          return user;
        } catch (error) {
          console.error('Authentication error:', error);
          console.error('Error details:', JSON.stringify(error instanceof Error ? { message: error.message, stack: error.stack } : error));
          return null;
        }
      }
    }),
  ],
  callbacks: {
    // Add timestamp to ensure token is always refreshed
    async jwt({ token, user }) {
      console.log('JWT callback called with:', {
        hasUser: !!user,
        hasToken: !!token,
        tokenId: token?.id,
        tokenAccessToken: token?.accessToken ? 'exists' : 'none'
      });

      if (user) {
        const customUser = user as CustomUser;
        token.id = customUser.id;
        // Save token from API response to JWT
        token.accessToken = customUser.accessToken;
        token.tokenType = customUser.tokenType;
        // Add timestamp to mark token creation time
        token.createdAt = Date.now();

        // For debugging
        console.log('JWT callback: User provided, access token stored in token object', {
          userId: customUser.id,
          hasAccessToken: !!customUser.accessToken,
          tokenType: customUser.tokenType
        });
      }

      // Check if token needs refresh
      const shouldRefreshTime = Math.floor((Date.now() - (token.createdAt as number || 0)) / 1000);
      // If token exists for more than 30 minutes, mark for refresh
      if (shouldRefreshTime > 30 * 60) {
        token.needsRefresh = true;
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
      console.log('Session callback called with:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        hasToken: !!token,
        tokenAccessToken: token?.accessToken ? 'exists' : 'none'
      });

      if (session.user) {
        session.user.id = token.id as string;
        // Add token information to session
        (session as any).accessToken = token.accessToken;
        (session as any).tokenType = token.tokenType;
        // Add timestamp information
        (session as any).createdAt = token.createdAt;
        (session as any).needsRefresh = token.needsRefresh;

        // For debugging
        console.log('Session callback: Token added to session', {
          userId: session.user.id,
          hasAccessToken: !!token.accessToken,
          tokenType: token.tokenType
        });
      }

      return session;
    },
  },
});
