// app/api/chat/route.ts

import { NextResponse } from 'next/server';
import { sendMessageToAI } from '@/services/chat.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const reader = await sendMessageToAI({
      question: body.question,
      chat_history: body.chat_history,
      session_id: body.session_id,
    });

    const stream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('API /chat error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
