import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/session';


// GET /admin/sites/api/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const siteId = params.id;
    
    // Get user token from session
    const userToken = session.accessToken;

    if (!userToken) {
      return NextResponse.json({ error: 'No access token found' }, { status: 401 });
    }

    // Make request to backend API
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/sites/${siteId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'Failed to fetch site' }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching site ${params.id}:`, error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the site' },
      { status: 500 }
    );
  }
}

// PUT /admin/sites/api/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const siteId = params.id;
    const updateData = await request.json();
    
    // Get user token from session
    const userToken = session.accessToken;

    if (!userToken) {
      return NextResponse.json({ error: 'No access token found' }, { status: 401 });
    }

    // Make request to backend API
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/sites/${siteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
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

// DELETE /admin/sites/api/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const siteId = params.id;
    
    // Get user token from session
    const userToken = session.accessToken;

    if (!userToken) {
      return NextResponse.json({ error: 'No access token found' }, { status: 401 });
    }

    // Make request to backend API
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/sites/${siteId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
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