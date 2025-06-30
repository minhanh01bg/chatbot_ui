/**
 * Login function - call login API and get token
 * @param username User's username
 * @param password User's password
 * @returns API response containing access_token and token_type
 */
export const login = async (username: string, password: string) => {
    console.log('Login attempt initiated');
    try {
        // Sử dụng đường dẫn tương đối đơn giản - đã được loại trừ khỏi middleware
        const response = await fetch("http://localhost:3000/api/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
            body: JSON.stringify({ username, password }),
            cache: 'no-store'
        });

        console.log('Fetch response received:', {
            status: response.status,
            statusText: response.statusText,
            contentType: response.headers.get('content-type'),
            ok: response.ok
        });

        if (!response.ok) {
            console.error('Login API error:', {
                status: response.status,
                statusText: response.statusText
            });
            throw new Error(`Login failed: ${response.statusText}`);
        }

        // Kiểm tra content-type trước khi parse JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            // Không phải JSON, đọc nội dung dưới dạng text để debug
            const textResponse = await response.text();
            console.error('Non-JSON response received:', {
                contentType,
                responsePreview: textResponse.substring(0, 500)
            });
            throw new Error('Invalid response format - not JSON');
        }

        const data = await response.json();
        console.log('Login successful, response has data:', !!data);
        
        if (!data || !data.access_token) {
            console.error('Login response missing required data:', JSON.stringify(data));
            throw new Error('Invalid response format - missing access_token');
        }
        
        // Store token client-side
        if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', data.access_token);
            document.cookie = `client_access_token=${data.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
            console.log('Login service: saved access token to localStorage and client cookie');
        }
        
        return data;
    } catch (error) {
        console.error('Login request failed with error:', error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            console.error('Network error - check if server is running or endpoint is correct');
        }
        // console.error('Error details:', JSON.stringify(error instanceof Error ? { message: error.message, stack: error.stack } : error));
        throw error;
    }
};

/**
 * Register function - register a new user
 * @param username New user's username
 * @param password New user's password
 * @returns API response
 */
export const register = async (username: string, password: string) => {
    console.log('Registration attempt initiated');

    try {
        // Sử dụng đường dẫn tương đối đơn giản - đã được loại trừ khỏi middleware
        const response = await fetch("/api/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
            body: JSON.stringify({ username, password }),
            cache: 'no-store'
        });

        console.log('Register response received:', {
            status: response.status,
            statusText: response.statusText,
            contentType: response.headers.get('content-type'),
            ok: response.ok
        });

        if (!response.ok) {
            console.error('Registration API error:', {
                status: response.status,
                statusText: response.statusText
            });
            
            // Kiểm tra response là HTML hay JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('text/html')) {
                // Nếu là HTML, hiển thị phần đầu của nó để debug
                const textResponse = await response.text();
                console.error('HTML response received instead of JSON:', textResponse.substring(0, 500));
                throw new Error(`Registration failed: HTML response received - middleware issue`);
            }
            
            throw new Error(`Registration failed: ${response.statusText}`);
        }

        // Kiểm tra content-type trước khi parse JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            // Không phải JSON, đọc nội dung dưới dạng text để debug
            const textResponse = await response.text();
            console.error('Non-JSON response received:', {
                contentType,
                responsePreview: textResponse.substring(0, 500)
            });
            throw new Error('Invalid response format - not JSON');
        }

        const data = await response.json();
        console.log('Registration successful');

        return data;
    } catch (error) {
        console.error('Registration request failed with error:', error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            console.error('Network error - check if server is running or endpoint is correct');
        }
        console.error('Error details:', JSON.stringify(error instanceof Error ? { message: error.message, stack: error.stack } : error));
        throw error;
    }
};

/**
 * Call API with authentication using session token
 * Use this function for API calls that require user authentication
 * 
 * @param endpoint API endpoint path on the backend
 * @param options Fetch options (method, body, etc.)
 * @param session NextAuth session containing accessToken
 * @returns JSON data from API response
 * 
 * @example
 * // Get user profile
 * const userData = await fetchWithAuth('/api/v1/user/profile', { method: 'GET' }, session);
 */
export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}, session: any) => {
    try {
        // Sử dụng đường dẫn tương đối đơn giản
        const proxyUrl = '/api/auth-proxy';
        console.log('Making authenticated request via proxy to endpoint:', endpoint);
        
        // Create proxy request payload
        const proxyRequest = {
            endpoint, // Backend endpoint path
            method: options.method || 'GET',
            body: options.body ? JSON.parse(options.body as string) : undefined
        };

        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
            body: JSON.stringify(proxyRequest),
            cache: 'no-store'
        });

        console.log('Auth proxy response received:', {
            status: response.status,
            statusText: response.statusText,
            contentType: response.headers.get('content-type'),
            ok: response.ok
        });

        if (!response.ok) {
            console.error(`API error:`, {
                status: response.status,
                statusText: response.statusText
            });
            
            // Kiểm tra response là HTML hay JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('text/html')) {
                // Nếu là HTML, hiển thị phần đầu của nó để debug
                const textResponse = await response.text();
                console.error('HTML response received instead of JSON:', textResponse.substring(0, 500));
                throw new Error(`API request failed: HTML response received - middleware issue`);
            }
            
            throw new Error(`API request failed: ${response.statusText}`);
        }

        // Kiểm tra content-type trước khi parse JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            // Không phải JSON, đọc nội dung dưới dạng text để debug
            const textResponse = await response.text();
            console.error('Non-JSON response received:', {
                contentType,
                responsePreview: textResponse.substring(0, 500)
            });
            throw new Error('Invalid response format - not JSON');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API request failed with error:', error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            console.error('Network error - check if server is running or endpoint is correct');
        }
        console.error('Error details:', JSON.stringify(error instanceof Error ? { message: error.message, stack: error.stack } : error));
        throw error;
    }
};


