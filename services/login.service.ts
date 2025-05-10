/**
 * Login function - call login API and get token
 * @param email User's email
 * @param password User's password
 * @returns API response containing access_token and token_type
 */
export const login = async (email: string, password: string) => {
    console.log('Login attempt initiated');
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
            body: JSON.stringify({ email, password }),
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error('Login API error:', {
                status: response.status,
                statusText: response.statusText
            });
            throw new Error(`Login failed: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Login successful');
        
        return data;
    } catch (error) {
        console.error('Login request failed');
        throw error;
    }
};

/**
 * Register function - register a new user
 * @param email New user's email
 * @param password New user's password
 * @returns API response
 */
export const register = async (email: string, password: string) => {
    console.log('Registration attempt initiated');

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
            body: JSON.stringify({ email, password }),
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error('Registration API error:', {
                status: response.status,
                statusText: response.statusText
            });
            throw new Error(`Registration failed: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Registration successful');

        return data;
    } catch (error) {
        console.error('Registration request failed');
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
        // Create proxy request payload
        const proxyRequest = {
            endpoint, // Backend endpoint path
            method: options.method || 'GET',
            body: options.body ? JSON.parse(options.body as string) : undefined
        };

        const response = await fetch('/api/auth-proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
            body: JSON.stringify(proxyRequest),
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error(`API error:`, {
                status: response.status,
                statusText: response.statusText
            });
            throw new Error(`API request failed: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('API request failed');
        throw error;
    }
};


