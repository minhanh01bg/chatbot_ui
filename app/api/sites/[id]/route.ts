import { NextRequest, NextResponse } from 'next/server';

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// PUT /api/sites/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get access token directly from request cookies with fallback to client token
    const accessToken = request.cookies.get('access_token')?.value;
    const clientToken = request.cookies.get('client_access_token')?.value;
    const token = accessToken || clientToken;
    
    // Check authorization
    if (!token) {
      console.error('Site Detail API: No access token found in cookies');
      return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 });
    }

    const siteId = params.id;
    const updateData = await request.json();

    // Make request to backend API
    const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/v1/sites/${siteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'Failed to update site' }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error updating site ${params.id}:`, error);
    return NextResponse.json(
      { error: 'An error occurred while updating the site' },
      { status: 500 }
    );
  }
}

// DELETE /api/sites/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get access token directly from request cookies with fallback to client token
    const accessToken = request.cookies.get('access_token')?.value;
    const clientToken = request.cookies.get('client_access_token')?.value;
    const token = accessToken || clientToken;
    
    // Check authorization
    if (!token) {
      console.error('Site Detail API: No access token found in cookies');
      return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 });
    }

    const siteId = params.id;

    // Make request to backend API
    const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/v1/sites/${siteId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'Failed to delete site' }, 
        { status: response.status }
      );
    }

    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting site ${params.id}:`, error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the site' },
      { status: 500 }
    );
  }
} 
