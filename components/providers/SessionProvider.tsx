'use client';

// Temporarily disabled NextAuth SessionProvider to use new authentication system
// import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface SessionProviderProps {
  children: ReactNode;
}

export default function SessionProvider({ children }: SessionProviderProps) {
  // Temporarily return children directly without NextAuth SessionProvider
  return <>{children}</>;
  
  // return (
  //   <NextAuthSessionProvider>
  //     {children}
  //   </NextAuthSessionProvider>
  // );
}
