import { NextRequest, NextResponse } from 'next/server';

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request: NextRequest) {
  try {
    console.log('=== /api/test-backend called ===');
    console.log('Environment variables:', {
      NEXT_PUBLIC_BACKEND_URL: NEXT_PUBLIC_BACKEND_URL,
      NODE_ENV: process.env.NODE_ENV
    });

    // Use environment variable or fallback to default
    const backendUrl = NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';
    
    if (!backendUrl) {
      return NextResponse.json(
        { error: 'Backend URL not configured' },
        { status: 500 }
      );
    }

    // Test basic connectivity - try multiple endpoints
    const apiUrl = backendUrl.replace('localhost', '127.0.0.1');
    const testUrls = [
      `${apiUrl}/api/v1/health`,
      `${apiUrl}/api/v1/`,
      `${apiUrl}/`,
      `${apiUrl}/health`
    ];

    console.log('Testing backend connectivity:', {
      originalUrl: backendUrl,
      modifiedUrl: apiUrl,
      testUrls: testUrls
    });

    // Try each endpoint
    for (const testUrl of testUrls) {
      try {
        console.log(`Testing endpoint: ${testUrl}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(testUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        console.log(`Backend test response for ${testUrl}:`, {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        });

        if (response.ok) {
          const data = await response.text();
          return NextResponse.json({
            success: true,
            message: 'Backend is reachable',
            endpoint: testUrl,
            status: response.status,
            data: data
          });
        } else if (response.status !== 404) {
          // If it's not 404, the server is reachable but endpoint doesn't exist
          return NextResponse.json({
            success: true,
            message: 'Backend is reachable but endpoint not found',
            endpoint: testUrl,
            status: response.status,
            statusText: response.statusText
          });
        }
      } catch (fetchError) {
        console.error(`Fetch error for ${testUrl}:`, fetchError);
        
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          console.log(`Timeout for ${testUrl}`);
          continue; // Try next endpoint
        }
        
        // For other errors, continue trying
        continue;
      }
    }
    
    // If we get here, none of the endpoints worked
    return NextResponse.json({
      success: false,
      message: 'Failed to connect to backend - all endpoints failed',
      testedUrls: testUrls
    });

  } catch (error) {
    console.error('Test backend error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 