import { Plan } from '@/types/plan';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';

export const getPublicPlans = async (): Promise<Plan[]> => {
  try {
    // Use Next.js API route for better security
    const response = await fetch('/api/plans', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching plans: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch plans:', error);
    throw error;
  }
};

export const subscribeToPlan = async (planId: string, userId?: string, accessToken?: string): Promise<any> => {
  try {
    // Use Next.js API route for better security and session handling
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
      throw new Error(errorData.error || `Error subscribing to plan: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to subscribe to plan:', error);
    throw error;
  }
};
