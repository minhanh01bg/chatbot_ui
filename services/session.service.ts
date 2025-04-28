export interface SessionData {
    _id: string;
    session_id: string;
    created_time: string;
    updated_time: string;
    first_question?: string;
    question_count: number;
}

export interface SessionResponse {
    page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
    data: SessionData[];
}

const BACKEND_URL = process.env.BACKEND_URL;

export const getChatSessions = async (page: number = 1, pageSize: number = 10): Promise<SessionResponse> => {
    const response = await fetch(
        `${BACKEND_URL}/api/v1/chat_sessions?page=${page}&page_size=${pageSize}`,
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
