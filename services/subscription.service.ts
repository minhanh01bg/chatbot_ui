import { Subscription } from '@/types/plan';

// Subscription-related API calls

export const createSubscription = async (planId: string, userId?: string, accessToken?: string) => {
  try {
    const response = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        planId,
        userId,
        accessToken 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error creating subscription: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to create subscription:', error);
    throw error;
  }
};

export const getCurrentSubscription = async (): Promise<Subscription | null> => {
  try {
    const response = await fetch('/api/subscriptions/current', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      return null; // No subscription found
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error fetching subscription: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch current subscription:', error);
    throw error;
  }
};

export const getSubscription = async (subscriptionId: string): Promise<Subscription> => {
  try {
    const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error fetching subscription: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch subscription:', error);
    throw error;
  }
};

export const updateSubscription = async (subscriptionId: string, updateData: Partial<Subscription>) => {
  try {
    const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error updating subscription: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to update subscription:', error);
    throw error;
  }
};

export const cancelSubscription = async (subscriptionId: string) => {
  try {
    const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error canceling subscription: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    throw error;
  }
};

export const cancelMySubscription = async (subscriptionId: string) => {
  try {
    const response = await fetch(`/api/subscriptions/my/${subscriptionId}/cancel`, {
      method: 'POST',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error canceling subscription: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    throw error;
  }
}

export const getMySubscriptions = async (accessToken: string): Promise<Subscription[]> => {
  try {
    const response = await fetch('/api/subscriptions/my', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error fetching subscriptions: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch subscriptions:', error);
    throw error;
  }
}