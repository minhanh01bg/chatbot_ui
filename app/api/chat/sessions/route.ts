import { NextResponse } from 'next/server';
import { getChatSessions, createSession, deleteSession } from '@/services/session.service';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '10');

        const sessions = await getChatSessions(page, pageSize);
        return NextResponse.json(sessions);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch sessions' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await createSession();
        return NextResponse.json(session);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create session' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('session_id');
        if (!sessionId) {
            return NextResponse.json(
                { error: 'Session ID is required' },
                { status: 400 }
            );
        }
        await deleteSession(sessionId);
        return NextResponse.json({ message: 'Session deleted successfully' });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete session' },
            { status: 500 }
        );
    }
}
