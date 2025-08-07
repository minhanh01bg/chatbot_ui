export interface PayPalSubscriptionResponse {
//   subscription_id: string;
  approval_url: string;
  status: string;
  expired_at: string;
  plan_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface PayPalSubscriptionRequest {
  plan_id: string;
}

/**
 * Create a PayPal subscription for the current user
 * @param planId - The ID of the plan to subscribe to
 * @returns Promise with subscription details including approval URL
 */
export const createPayPalSubscription = async (planId: string): Promise<PayPalSubscriptionResponse> => {
  try {
    const response = await fetch('/api/subscriptions/paypal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan_id: planId
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error creating PayPal subscription: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to create PayPal subscription:', error);
    throw error;
  }
};

/**
 * Redirect user to PayPal approval URL
 * @param approvalUrl - The PayPal approval URL
 */
export const redirectToPayPal = (approvalUrl: string) => {
  if (typeof window !== 'undefined') {
    // Add return and cancel URLs to PayPal approval URL if not already present
    const returnUrl = `${window.location.origin}/subscriptions/success`;
    const cancelUrl = `${window.location.origin}/subscriptions/cancel`;
    const separator = approvalUrl.includes('?') ? '&' : '?';
    const finalUrl = `${approvalUrl}${separator}return_url=${encodeURIComponent(returnUrl)}&cancel_url=${encodeURIComponent(cancelUrl)}`;
    
    window.location.href = finalUrl;
  }
};

/**
 * Check if PayPal subscription was approved
 * @param subscriptionId - The PayPal subscription ID
 * @returns Promise with subscription status
 */
export const checkPayPalSubscriptionStatus = async (subscriptionId: string): Promise<any> => {
  try {
    const response = await fetch(`/api/subscriptions/paypal/${subscriptionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error checking subscription status: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to check subscription status:', error);
    throw error;
  }
}; 