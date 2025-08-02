import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('=== /api/test-token called ===');
    
    // Get token from headers
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    console.log('Token test:', {
      hasAuthHeader: !!authHeader,
      hasToken: !!token,
      tokenLength: token?.length,
      tokenStart: token?.substring(0, 10) + '...',
      allHeaders: Object.fromEntries(request.headers.entries())
    });
    
    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'No token found in Authorization header',
        headers: Object.fromEntries(request.headers.entries())
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Token received successfully',
      tokenLength: token.length,
      tokenStart: token.substring(0, 10) + '...'
    });
    
  } catch (error) {
    console.error('Error in test-token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 