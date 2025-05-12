import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/session';

const BACKEND_API_URL = 'http://127.0.0.1:8002/api/v1';

// GET /admin/sites/api/[id]/documents
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
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const skip = searchParams.get('skip') || '0';
    const limit = searchParams.get('limit') || '10';
    
    // First fetch the site to get its chat_token
    const accessToken = session.accessToken;
    if (!accessToken) {
      return NextResponse.json({ error: 'No access token found' }, { status: 401 });
    }
    
    // Get the site details to obtain the chat_token
    const siteResponse = await fetch(`${process.env.BACKEND_URL}/api/v1/sites/${siteId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!siteResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch site details' }, { status: 404 });
    }
    
    const siteData = await siteResponse.json();
    
    // Use the chat_token from the site data
    const chatToken = siteData.chat_token;
    
    if (!chatToken) {
      return NextResponse.json({ error: 'No chat token found for this site' }, { status: 401 });
    }

    // Make request to backend API with the site's chat_token
    const response = await fetch(`${BACKEND_API_URL}/get_documents?skip=${skip}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${chatToken}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'Failed to fetch documents' }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching documents for site ${params.id}:`, error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the documents' },
      { status: 500 }
    );
  }
}

// POST /admin/sites/api/[id]/documents
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const siteId = params.id;
    
    // Get user token from session for accessing site details
    const accessToken = session.accessToken;
    if (!accessToken) {
      return NextResponse.json({ error: 'No access token found' }, { status: 401 });
    }
    
    // Get the site details to obtain the chat_token
    const siteResponse = await fetch(`${process.env.BACKEND_URL}/api/v1/sites/${siteId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!siteResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch site details' }, { status: 404 });
    }
    
    const siteData = await siteResponse.json();
    
    // Use the chat_token from the site data
    const chatToken = siteData.chat_token;
    
    if (!chatToken) {
      return NextResponse.json({ error: 'No chat token found for this site' }, { status: 401 });
    }

    // Check if it's a FormData request
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      
      // Make request to backend API with the site's chat_token
      const response = await fetch(`${BACKEND_API_URL}/upload_document`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${chatToken}`
          // Don't set Content-Type for FormData, it will be set automatically with boundary
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return NextResponse.json(
          { error: errorData.detail || 'Failed to upload document' }, 
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);
    } else {
      // Handle JSON request
      const jsonData = await request.json();
      
      // Make request to backend API with JSON
      const response = await fetch(`${BACKEND_API_URL}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${chatToken}`
        },
        body: JSON.stringify(jsonData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return NextResponse.json(
          { error: errorData.detail || 'Failed to create document' }, 
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error(`Error creating document for site ${params.id}:`, error);
    return NextResponse.json(
      { error: 'An error occurred while creating the document' },
      { status: 500 }
    );
  }
} 