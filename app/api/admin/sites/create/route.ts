import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace('localhost', '127.0.0.1') || 'http://127.0.0.1:8001';

export async function POST(request: NextRequest) {
  try {
    // Get access token from Authorization header first, then fallback to cookies
    const authHeader = request.headers.get('authorization');
    let token = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '');
    } else {
      // Fallback to cookies
      const accessToken = request.cookies.get('access_token')?.value;
      const clientToken = request.cookies.get('client_access_token')?.value;
      token = accessToken || clientToken;
    }

    // Debug logging
    console.log('Create site API: Token check:', {
      hasAuthHeader: !!authHeader,
      hasAccessToken: !!token,
      tokenLength: token?.length || 0,
      allCookies: request.cookies.getAll().map(cookie => ({ name: cookie.name, hasValue: !!cookie.value }))
    });

    if (!token) {
      console.error('Create site API: No access token found');
      return NextResponse.json(
        { error: 'Authentication required - No token provided' },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error('Create site API: Failed to parse request body:', error);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    const { name, domain, openai_api_key, model_type, language, force_language } = body;

    console.log('Create site API: Request body:', {
      name,
      domain,
      hasOpenAIKey: !!openai_api_key,
      model_type,
      language,
      force_language
    });

    // Validate required fields
    if (!name || !domain) {
      console.error('Create site API: Missing required fields:', { name, domain });
      return NextResponse.json(
        { error: 'Name and domain are required' },
        { status: 400 }
      );
    }

    // Validate model_type if provided
    const validModels = ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o', 'gpt-4o-mini'];
    if (model_type && !validModels.includes(model_type)) {
      console.error('Create site API: Invalid model_type:', model_type);
      return NextResponse.json(
        { error: 'Invalid model_type provided' },
        { status: 400 }
      );
    }

    // Validate language if provided
    const validLanguages = ['en', 'vi', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'];
    if (language && !validLanguages.includes(language)) {
      console.error('Create site API: Invalid language:', language);
      return NextResponse.json(
        { error: 'Invalid language provided' },
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
        statusText: response.statusText,
        responseText: await response.text().catch(() => 'Unable to read response text')
      });
      return NextResponse.json(
        { error: errorData.detail || errorData.error || 'Failed to create site' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Create site API: Success response:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Create site API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
