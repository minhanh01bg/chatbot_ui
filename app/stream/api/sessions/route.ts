import { NextResponse } from 'next/server';
import { getChatSessions, createSession } from '@/services/session.service';

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
