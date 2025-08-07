import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace('localhost', '127.0.0.1');

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const server_token = searchParams.get('server_token');
  const subscription_id = searchParams.get('subscription_id');
  const ba_token = searchParams.get('ba_token');
  const token = searchParams.get('token');
  if (!token || !subscription_id || !ba_token || !server_token) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }
  const response = await fetch(`${BACKEND_URL}/api/v1/subscriptions/success`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${server_token}`,
    },
    body: JSON.stringify({
      subscription_id,
      ba_token,
      token,
    }),
  });
  return NextResponse.json(await response.json());
}