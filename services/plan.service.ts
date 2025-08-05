import { Plan } from '@/types/plan';

// All API calls go through Next.js API routes for better security

export class PlanService {
  static async getPlans(): Promise<Plan[]> {
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
  }

  static async getPublicPlans(): Promise<Plan[]> {
    return this.getPlans();
  }

export const getPlan = async (planId: string): Promise<Plan> => {
  try {
    const response = await fetch(`/api/plans/${planId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error fetching plan: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch plan:', error);
    throw error;
  }
};

// Legacy function - use subscription.service.ts for new code
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
