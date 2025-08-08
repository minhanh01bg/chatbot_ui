import { NextRequest, NextResponse } from 'next/server';

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// GET /api/sites
export async function GET(request: NextRequest) {
  try {
    // Log all available cookies for debugging
    const allCookies = request.cookies.getAll();

    // Get access token directly from request cookies
    const accessToken = request.cookies.get('access_token')?.value;
    // Try client token as fallback
    const clientToken = request.cookies.get('client_access_token')?.value;    
    // Use the appropriate token
    const token = accessToken || clientToken;
    
    // Check authorization
    if (!token) {
      console.error('Sites API: No access token found in cookies');
      return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 });
    }

    // Fix IPv6 issue by replacing localhost with 127.0.0.1
    const backendUrl = NEXT_PUBLIC_BACKEND_URL?.replace('localhost', '127.0.0.1') || 'http://127.0.0.1:8001';
    const response = await fetch(`${backendUrl}/api/v1/sites`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Backend API error:', response.status, errorData);
      const rawDetail = (errorData?.detail ?? errorData?.error) as any;
      let message = typeof rawDetail === 'string' ? rawDetail : undefined;
      if (Array.isArray(rawDetail)) {
        message = rawDetail.find((d: any) => typeof d?.msg === 'string')?.msg;
      }
      return NextResponse.json(
        { error: message || 'Failed to fetch sites' }, 
        { status: response.status, headers: { 'x-auth-error': '1' } }
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
