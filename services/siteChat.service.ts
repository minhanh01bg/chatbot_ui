// Site-specific chat service using site tokens

import { SiteSessionsResponse } from '@/types/session';

export interface SiteChatMessage {
  question: string;
  session_id: string;
  chat_history: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface SiteSession {
  site_id: string;
  session_id: string;
  created_time: string;
  updated_time: string;
  first_question: string;
  question_count: number;
}

export interface SiteSessionsResponse {
  page: number;
  page_size: number;
  total_records: number;
  total_pages: number;
  data: SiteSession[];
}

export const sendSiteChatMessage = async (
  message: {
    question: string;
    session_id: string;
    chat_history: Array<{
      role: 'user' | 'assistant';
      content: string;
    }>;
  },
  siteToken: string
): Promise<ReadableStreamDefaultReader<Uint8Array>> => {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace('localhost', '127.0.0.1') || 'http://127.0.0.1:8001';
  
  const response = await fetch(`${BACKEND_URL}/api/v1/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${siteToken}`,
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to send message');
  }

  return response.body.getReader();
};

export const getSiteSessions = async (
  siteToken: string,
  page: number = 1,
  pageSize: number = 10
): Promise<SiteSessionsResponse> => {
  const response = await fetch(
    `/api/sites/chat/sessions?page=${page}&page_size=${pageSize}&site_token=${encodeURIComponent(siteToken)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch sessions: ${response.statusText}`);
  }

  return await response.json();
};

export const getSiteChatHistory = async (
  sessionId: string,
  siteToken: string,
  page: number = 1,
  pageSize: number = 10
) => {
  const response = await fetch(
    `/api/sites/chat/history?session_id=${sessionId}&page=${page}&page_size=${pageSize}&site_token=${encodeURIComponent(siteToken)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch chat history: ${response.statusText}`);
  }

  return await response.json();
};
