// Authentication-related API calls

export const setAuthToken = async (token: string, expiredAt?: string) => {
  try {
    const response = await fetch('/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        token,
        expired_at: expiredAt 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error setting token: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to set auth token:', error);
    throw error;
  }
};

export const getSessionDebugInfo = async () => {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error fetching session: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch session debug info:', error);
    throw error;
  }
};

export const clearAuthData = () => {
  // Clear localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_expired_at');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_identifier');
    localStorage.removeItem('user_role');
  }

  // Clear cookies
  if (typeof document !== 'undefined') {
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
  }
};
