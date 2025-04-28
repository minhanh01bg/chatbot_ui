export interface SessionData {
    _id: string;
    session_id: string;
    created_time: string;   // chú ý: datetime từ BE trả về là dạng string ISO
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

// import { SessionResponse } from '@/types/session';  // import interface mới nè

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
