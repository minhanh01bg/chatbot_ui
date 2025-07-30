// User-related API calls

export const getCurrentUser = async () => {
  try {
    const response = await fetch('/api/users/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error fetching user: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    throw error;
  }
};

export const updateUser = async (userData: any) => {
  try {
    const response = await fetch('/api/users/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error updating user: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
};