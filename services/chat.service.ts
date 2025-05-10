// services/chat.service.ts

export async function sendMessageToAI(payload: {
    question: string;
    chat_history: { type: 'assistant' | 'user'; content: string }[];
    session_id: string;
  }) {
    const aiServerUrl = process.env.AI_SERVER_URL;
    if (!aiServerUrl) {
      console.error('AI server URL not configured');
      throw new Error('Server configuration error');
    }
    
    const aiServerToken = process.env.AI_SERVER_TOKEN;
    if (!aiServerToken) {
      console.error('AI server token not configured');
      throw new Error('Server configuration error');
    }

    const response = await fetch(aiServerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${aiServerToken}`,
      },
      body: JSON.stringify(payload),
    });
  
    if (!response.ok) {
      console.error('AI server response error:', response.status);
      throw new Error('Failed to fetch from AI server');
    }
  
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }
  
    return reader;
  }
  