import { compare } from 'bcrypt-ts';
import NextAuth, { type User, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { jwtDecode } from 'jwt-decode';

import { getUser } from '@/lib/db/queries';
import { login as loginService } from '../../services/login.service';

import { authConfig } from './auth.config';

interface ExtendedSession extends Session {
  user: User;
}

// Extend User type to support additional fields we need
interface CustomUser extends User {
  accessToken?: string;
  tokenType?: string;
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
      async authorize({ email, password }: any) {
        try {
          console.log('Authentication attempt initiated');
          const loginResponse = await loginService(email, password);
          
          if (!loginResponse || !loginResponse.access_token) {
            console.error('Authentication failed: Invalid response format');
            return null;
          }

          // Create user object from response
          const user: CustomUser = {
            id: loginResponse.user.id,
            email: loginResponse.user.email,
            name: loginResponse.user.email.split('@')[0] || null,
            accessToken: loginResponse.access_token,
            tokenType: loginResponse.token_type
          };
          
          console.log('Authentication successful');
          
          return user;
        } catch (error) {
          console.error('Authentication error');
          return null;
        }
      }
    }),
  ],
  callbacks: {
    // Add timestamp to ensure token is always refreshed
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as CustomUser;
        token.id = customUser.id;
        // Save token from API response to JWT
        token.accessToken = customUser.accessToken;
        token.tokenType = customUser.tokenType;
        // Add timestamp to mark token creation time
        token.createdAt = Date.now();
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
      if (session.user) {
        session.user.id = token.id as string;
        // Add token information to session
        (session as any).accessToken = token.accessToken;
        (session as any).tokenType = token.tokenType;
        // Add timestamp information
        (session as any).createdAt = token.createdAt;
        (session as any).needsRefresh = token.needsRefresh;
      }

      return session;
    },
  },
});
