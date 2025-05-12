import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Lấy tất cả cookies từ request
    const allCookies = request.cookies.getAll();
    
    // Hiển thị chi tiết về từng cookie
    const cookiesDetails = allCookies.map(cookie => ({
      name: cookie.name,
      value: cookie.name === 'access_token' ? 
        (cookie.value ? `${cookie.value.substring(0, 10)}... (${cookie.value.length} chars)` : 'empty') : 
        'hidden',
      domain: request.headers.get('host'),
      path: '/',
    }));

    // Kiểm tra các header liên quan
    const relevantHeaders = {
      cookie: request.headers.get('cookie'),
      host: request.headers.get('host'),
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer'),
    };

    return NextResponse.json({
      cookies: {
        count: allCookies.length,
        hasAccessToken: allCookies.some(c => c.name === 'access_token'),
        hasClientToken: allCookies.some(c => c.name === 'client_access_token'),
        details: cookiesDetails
      },
      headers: relevantHeaders,
      date: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking cookies:', error);
    return NextResponse.json(
      { error: 'Error checking cookies', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 