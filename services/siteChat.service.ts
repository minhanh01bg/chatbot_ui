// Site-specific chat service using site tokens

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
  message: SiteChatMessage,
  siteToken: string
): Promise<ReadableStreamDefaultReader<Uint8Array>> => {
  const response = await fetch('/api/sites/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...message,
      site_token: siteToken,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Chat request failed: ${response.statusText}`);
  }

  if (!response.body) {
    throw new Error('No response body received');
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
