interface Message {
  type: 'assistant' | 'user';
  content: string;
}

export const sendChatMessage = async (
  message: string,
  chatHistory: Message[],
  sessionId: string,
  onChunkReceived: (chunk: string) => void
) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    //   Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODA5YjM0MTc5Y2FhN2VkM2ZiOWQ0ZmQiLCJ1c2VybmFtZSI6ImFkbWluIn0.a9r_nESBoFT9N6eRlh1WbHhVWGuqBij7adx_6uIfqBs'
    },
    body: JSON.stringify({
      question: message,
      chat_history: chatHistory,
      session_id: sessionId
    })
  });

  if (!response.ok) throw new Error('Network response was not ok');

  const reader = response.body?.getReader();
  if (!reader) return;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = new TextDecoder().decode(value);
    onChunkReceived(text);
  }
};

