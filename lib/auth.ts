// Since next-auth types are causing issues, let's create our own types
// for our demo implementation

// User type definition
interface User {
  id: string;
  name?: string;
  email?: string;
  accessToken?: string;
}

// Token type definition
interface Token {
  id?: string;
  name?: string;
  email?: string;
  accessToken?: string;
}

// Session type definition
interface Session {
  user: User;
  accessToken?: string;
}

// Define the auth options interface
export interface AuthOptions {
  providers: any[];
  callbacks: {
    jwt: (params: { token: Token; user?: User }) => Promise<Token>;
    session: (params: { session: Session; token: Token }) => Promise<Session>;
  };
  session: {
    strategy: string;
  };
  secret: string;
}

// This holds your auth configuration
export const authOptions: AuthOptions = {
  // Your auth providers will go here
  providers: [],
  
  // Add custom callbacks to handle token extraction
  callbacks: {
    async jwt({ token, user }: { token: Token; user?: User }) {
      // If user is passed, this means user just signed in
      if (user) {
        token.id = user.id;
        // You would extract the access token here from user object
        token.accessToken = user.accessToken;
      }
      return token;
    },
    
    async session({ session, token }: { session: Session; token: Token }) {
      if (token) {
        if (token.id) {
          session.user.id = token.id;
        }
        // Pass the access token to the client
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  
  // Custom session strategy
  session: {
    strategy: 'jwt',
  },
  
  // Secret for signing cookies
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-here',
};

// For direct API usage - this gets the token from cookies or falls back to the test token
export const getTokenForAPI = async () => {
  try {
    // Try to get token from cookies first
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const tokenFromCookie = cookieStore.get('access_token')?.value;
    
    if (tokenFromCookie) {
      console.log('Using access token from cookie for API call');
      return tokenFromCookie;
    }
  } catch (e) {
    console.error('Error getting token from cookie:', e);
  }
  
  // Fall back to environment variable or hardcoded test token
  return process.env.NEXT_PUBLIC_TEST_API_TOKEN || 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2ZjYmY5YTc1N2NhYzExN...";
}; 