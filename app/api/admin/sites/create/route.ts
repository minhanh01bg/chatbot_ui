import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';

export async function POST(request: NextRequest) {
  try {
    // Get access token from cookies (same pattern as other APIs)
    const accessToken = request.cookies.get('access_token')?.value;
    const clientToken = request.cookies.get('client_access_token')?.value;
    const token = accessToken || clientToken;

    // Debug logging
    console.log('Create site API: Token check:', {
      hasAccessToken: !!accessToken,
      hasClientToken: !!clientToken,
      tokenLength: token?.length || 0,
      allCookies: Array.from(request.cookies.entries()).map(([name, cookie]) => ({ name, hasValue: !!cookie.value }))
    });

    if (!token) {
      console.error('Create site API: No access token found in cookies');
      return NextResponse.json(
        { error: 'Authentication required - No token provided' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, domain, openai_api_key, model_type, language, force_language } = body;

    // Validate required fields
    if (!name || !domain) {
      return NextResponse.json(
        { error: 'Name and domain are required' },
        { status: 400 }
      );
    }

    // Forward request to backend
    console.log('Create site API: Making request to backend:', {
      url: `${BACKEND_URL}/api/v1/create_site`,
      hasToken: !!token,
      tokenPrefix: token?.substring(0, 20) + '...',
      requestData: { name, domain, model_type, language }
    });

    const response = await fetch(`${BACKEND_URL}/api/v1/create_site`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        domain,
        openai_api_key: openai_api_key || '',
        model_type: model_type || 'gpt-3.5-turbo',
        language: language || 'en',
        force_language: force_language || false
      }),
    });

    console.log('Create site API: Backend response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Create site API: Backend error:', {
        status: response.status,
        errorData,
        statusText: response.statusText
      });
      return NextResponse.json(
        { error: errorData.detail || 'Failed to create site' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Create site API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
