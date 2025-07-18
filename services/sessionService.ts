import { SessionResponse, ChatHistoryResponse, SessionData } from '@/types/session';

export const getSessions = async (page = 1, pageSize = 10): Promise<SessionResponse> => {
  const response = await fetch(`/api/sessions?page=${page}&pageSize=${pageSize}`, {
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
  const response = await fetch(`/api/history?session_id=${sessionId}`, {
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
    const response = await fetch(`/api/sessions`, {
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

export const deleteSession = async (
  sessionId: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  try {
    const response = await fetch(`/api/sessions?session_id=${sessionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete session');
    }

    const result = await response.json();
    onSuccess?.();
    return result;
  } catch (error) {
    onError?.(error as Error);
    throw error;
  }
};