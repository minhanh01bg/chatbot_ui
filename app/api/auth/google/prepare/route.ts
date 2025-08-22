import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';
    
    // Call backend để prepare session
    const response = await fetch(`${backendUrl}/auth/google/prepare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000',
      },
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({ 
        success: true,
        redirectUrl: `${backendUrl}/auth/google`,
        sessionId: data.sessionId || null
      });
    }
    
    return NextResponse.json({ 
      success: false,
      redirectUrl: `${backendUrl}/auth/google`
    });
    
  } catch (error) {
    console.error('Error preparing Google OAuth session:', error);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';
    return NextResponse.json({ 
      success: false,
      redirectUrl: `${backendUrl}/auth/google`
    });
  }
}