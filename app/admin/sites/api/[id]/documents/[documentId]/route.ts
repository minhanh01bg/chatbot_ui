import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/session';

const BACKEND_API_URL = 'http://localhost:8002/api/v1';

// GET /admin/sites/api/[id]/documents/[documentId]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; documentId: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: siteId, documentId } = params;
    
    // Get user token from session
    const userToken = session.accessToken;

    if (!userToken) {
      return NextResponse.json({ error: 'No access token found' }, { status: 401 });
    }

    // Make request to backend API
    const response = await fetch(`${BACKEND_API_URL}/sites/${siteId}/documents/${documentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'Failed to fetch document' }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching document ${params.documentId}:`, error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the document' },
      { status: 500 }
    );
  }
}

// PATCH /admin/sites/api/[id]/documents/[documentId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; documentId: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: siteId, documentId } = params;
    const updateData = await request.json();
    
    // Get user token from session
    const userToken = session.accessToken;

    if (!userToken) {
      return NextResponse.json({ error: 'No access token found' }, { status: 401 });
    }

    // Make request to backend API
    const response = await fetch(`${BACKEND_API_URL}/sites/${siteId}/documents/${documentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'Failed to update document' }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error updating document ${params.documentId}:`, error);
    return NextResponse.json(
      { error: 'An error occurred while updating the document' },
      { status: 500 }
    );
  }
}

// DELETE /admin/sites/api/[id]/documents/[documentId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; documentId: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: siteId, documentId } = params;
    
    // Get user token from session
    const userToken = session.accessToken;

    if (!userToken) {
      return NextResponse.json({ error: 'No access token found' }, { status: 401 });
    }

    // Make request to backend API
    const response = await fetch(`${BACKEND_API_URL}/sites/${siteId}/documents/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'Failed to delete document' }, 
        { status: response.status }
      );
    }

    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting document ${params.documentId}:`, error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the document' },
      { status: 500 }
    );
  }
} 