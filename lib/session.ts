import { cookies } from 'next/headers';

// Simulate getting a server session for API routes
export async function getServerSession() {
  // In a real app, this would use next-auth to get the session
  // For now, we'll simulate a session with a hardcoded user and token
  
  // You could extract this from cookies in a real implementation
  const cookieStore = cookies();
  // For testing, return a dummy session
  // In production, this would validate the session from cookies
  return {
    user: {
      id: '67fcbf9a757cac1148b1ac3f',
      name: 'Admin User',
      email: 'admin@example.com',
    },
    // Use an environment variable token or a hardcoded one for testing
    accessToken: process.env.NEXT_PUBLIC_TEST_API_TOKEN || 
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2ZjYmY5YTc1N2NhYzExN..."
  };
} 