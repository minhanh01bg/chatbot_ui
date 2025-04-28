// services/chat.service.ts

export async function sendMessageToAI(payload: {
    question: string;
    chat_history: { type: 'assistant' | 'user'; content: string }[];
    session_id: string;
  }) {
    const response = await fetch(process.env.AI_SERVER_URL || 'http://localhost:8001/api/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.AI_SERVER_TOKEN || 'your-hardcoded-token-here'}`,
      },
      body: JSON.stringify(payload),
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch from AI server');
    }
  
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }
  
    return reader;
  }
  