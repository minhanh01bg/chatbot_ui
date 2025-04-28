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

export interface MessageData {
    role: string;
    content: string;
    updated_time: string;
}

export interface ChatHistoryResponse {
    session_id: string;
    data: MessageData[];
}