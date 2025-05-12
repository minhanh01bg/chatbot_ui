import { cookies } from 'next/headers';

// Get server session for API routes
export async function getServerSession() {
  // Get cookies from the request
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  console.log('Session debug: All cookies:', JSON.stringify(allCookies.map(c => c.name)));
  
  // Try to get token from HTTP-only cookie first
  const accessToken = cookieStore.get('access_token')?.value;
  console.log('Session debug: access_token cookie:', accessToken ? `Found (${accessToken.length} chars)` : 'Not found');
  
  // Fall back to client-accessible cookie if needed
  const clientToken = cookieStore.get('client_access_token')?.value;
  console.log('Session debug: client_access_token cookie:', clientToken ? 'Found' : 'Not found');
  
  // Use whichever token is available
  const token = accessToken || clientToken;
  
  // Return a session object with the token
  return {
    user: {
      id: '67fcbf9a757cac1148b1ac3f',
      name: 'Admin User',
      email: 'admin@example.com',
    },
    accessToken: token
  };
} 