import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL;

// GET /admin/sites/api
export async function GET(request: NextRequest) {
  try {
    console.log('Sites API: Request received');
    
    // Log all available cookies for debugging
    const allCookies = request.cookies.getAll();
    console.log('Sites API: All cookies available:', JSON.stringify(allCookies.map(c => c.name)));
    
    // Get access token directly from request cookies
    const accessToken = request.cookies.get('access_token')?.value;
    console.log('Sites API: Direct cookie access token:', accessToken ? `Found token of length ${accessToken.length}` : 'No token');
    // Try client token as fallback
    const clientToken = request.cookies.get('client_access_token')?.value;
    console.log('Sites API: Client token fallback:', clientToken ? 'Available' : 'Not available');
    
    // Use the appropriate token
    const token = accessToken || clientToken;
    
    // Check authorization
    if (!token) {
      console.error('Sites API: No access token found in cookies');
      return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 });
    }

    // Call backend API with the token
    console.log('Sites API: Using token for authorization');
    const response = await fetch(`${BACKEND_URL}/api/v1/sites`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Backend API error:', response.status, errorData);
      return NextResponse.json(
        { error: errorData.detail || 'Failed to fetch sites' }, 
        { status: response.status }
      );
    }

    const data = await response.json();

    // Handle different response formats
    // If data is an array, it's directly the sites
    if (Array.isArray(data)) {
      console.log('Sites API: Response is an array of sites');
      return NextResponse.json({
        sites: data,
        total: data.length
      });
    } 
    // If data has sites property, use that structure
    else if (data.sites) {
      console.log('Sites API: Response has sites property');
      return NextResponse.json({
        sites: data.sites,
        total: data.total || data.sites.length
      });
    } 
    // Fallback - just use the data as is
    else {
      console.log('Sites API: Unknown response format, using as is');
      return NextResponse.json({
        sites: [data],
        total: 1
      });
    }
  } catch (error) {
    console.error('Error fetching sites:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching sites' },
      { status: 500 }
    );
  }
} 