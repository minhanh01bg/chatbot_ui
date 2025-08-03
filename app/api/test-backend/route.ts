import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get backend URL from environment variables
    const backendUrl = process.env.BACKEND_URL?.replace('localhost', '127.0.0.1') || 'http://127.0.0.1:8001';

    // Test basic connectivity
    const response = await fetch(`${backendUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        success: true,
        backendUrl,
        status: response.status,
        data
      });
    } else {
      return NextResponse.json({
        success: false,
        backendUrl,
        status: response.status,
        statusText: response.statusText,
        error: 'Backend health check failed'
      });
    }
  } catch (error) {
    console.error('Backend test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      backendUrl: process.env.BACKEND_URL || 'http://127.0.0.1:8001'
    }, { status: 500 });
  }
} 