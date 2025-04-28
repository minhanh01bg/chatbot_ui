import { SessionResponse, ChatHistoryResponse, SessionData } from '@/types/session';

export const getSessions = async (page = 1, pageSize = 10): Promise<SessionResponse> => {
  const response = await fetch(`/stream/api/sessions?page=${page}&pageSize=${pageSize}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch sessions');
  }

  const data = await response.json();
  return data as SessionResponse;
};

export const getChatHistory = async (sessionId: string): Promise<ChatHistoryResponse> => {
  const response = await fetch(`/stream/api/history?session_id=${sessionId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch chat history');
  }

  const data = await response.json();
  return data as ChatHistoryResponse;
};

export const createSession = async (): Promise<SessionData> => {
    const response = await fetch(`/stream/api/sessions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to create session');
    }

    return response.json();
};