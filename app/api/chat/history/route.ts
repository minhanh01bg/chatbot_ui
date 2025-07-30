import { NextResponse } from 'next/server';
import { getChatHistory } from '@/services/session.service';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('session_id');

        if (!sessionId) {
            return NextResponse.json(
                { error: 'Session ID is required' },
                { status: 400 }
            );
        }
        const history = await getChatHistory(sessionId);
        return NextResponse.json(history);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch chat history' },
            { status: 500 }
        );
    }
}
