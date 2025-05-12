import { SessionResponse, ChatHistoryResponse, SessionData } from '@/types/session';
const BACKEND_URL = process.env.BACKEND_URL;

export const getChatSessions = async (page: number = 1, pageSize: number = 10): Promise<SessionResponse> => {
    const response = await fetch(
        `${BACKEND_URL}/api/v1/sessions?page=${page}&page_size=${pageSize}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch chat sessions');
    }

    return response.json();
};

export const getChatHistory = async (sessionId: string): Promise<ChatHistoryResponse> => {
    const response = await fetch(
        `${BACKEND_URL}/api/v1/chat_history?session_id=${sessionId}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch chat history');
    }

    return response.json();
};

export const createSession = async (): Promise<SessionData> => {
    const response = await fetch(
        `${BACKEND_URL}/api/v1/create_session`,
        {
            method: 'POST',
        }
    );

    if (!response.ok) {
        throw new Error('Failed to create chat session');
    }

    return response.json();
};
    
export const deleteSession = async (sessionId: string): Promise<void> => {
    const response = await fetch(
        `${BACKEND_URL}/api/v1/session/${sessionId}`,
        {
            method: 'DELETE',
        }
    );

    if (!response.ok) {
        throw new Error('Failed to delete session');
    }

    return response.json();
};