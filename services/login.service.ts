const BACKEND_URL = process.env.BACKEND_URL;

/**
 * Hàm đăng nhập - gọi API login và lấy token
 * @param email Email của người dùng
 * @param password Mật khẩu của người dùng
 * @returns Response từ API chứa access_token và token_type
 */
export const login = async (email: string, password: string) => {
    const timestamp = Date.now();
    const response = await fetch(`${BACKEND_URL}/api/v1/login?t=${timestamp}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        },
        body: JSON.stringify({ email, password }),
        cache: 'no-store'
    });

    if (!response.ok) {
        console.error('Login API error:', response.status, response.statusText);
        throw new Error('Failed to login');
    }

    return response.json();
};

/**
 * Hàm đăng ký người dùng mới
 * @param email Email của người dùng mới
 * @param password Mật khẩu của người dùng mới
 * @returns Response từ API
 */
export const register = async (email: string, password: string) => {
    const timestamp = Date.now();
    const response = await fetch(`${BACKEND_URL}/api/v1/register?t=${timestamp}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        },
        body: JSON.stringify({ email, password }),
        cache: 'no-store'
    });

    if (!response.ok) {
        console.error('Register API error:', response.status, response.statusText);
        throw new Error('Failed to register');
    }

    return response.json();
};

/**
 * Tạo headers với token xác thực từ session
 * @param session Session từ NextAuth chứa accessToken và tokenType
 * @returns Headers cho API request
 */
export const createAuthHeaders = (session: any) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    };

    // Thêm Authorization header nếu có token
    if (session?.accessToken) {
        const tokenType = session.tokenType || 'Bearer';
        headers['Authorization'] = `${tokenType} ${session.accessToken}`;
    }

    return headers;
};

/**
 * Gọi API với xác thực dùng token trong session
 * Sử dụng hàm này cho các API call cần xác thực người dùng
 * 
 * @param endpoint Đường dẫn API (không bao gồm BACKEND_URL)
 * @param options Tùy chọn fetch (method, body, v.v.)
 * @param session Session từ NextAuth chứa accessToken
 * @returns Dữ liệu trả về từ API dạng JSON
 * 
 * @example
 * // Lấy thông tin người dùng
 * const userData = await fetchWithAuth('/api/v1/user/profile', { method: 'GET' }, session);
 */
export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}, session: any) => {
    const url = `${BACKEND_URL}${endpoint}`;
    const timestamp = Date.now();
    
    // Tạo headers với token xác thực từ session
    const headers = createAuthHeaders(session);
    
    // Gộp với headers từ options nếu có
    const mergedHeaders = {
        ...headers,
        ...(options.headers || {})
    };

    const response = await fetch(`${url}?t=${timestamp}`, {
        ...options,
        headers: mergedHeaders,
        cache: 'no-store'
    });

    if (!response.ok) {
        console.error(`API error (${endpoint}):`, response.status, response.statusText);
        throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
};


