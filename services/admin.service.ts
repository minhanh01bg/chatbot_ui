import { auth } from '@/app/(auth)/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface User {
  _id: string;
  email: string;
  username?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdminSubscriptionCreate {
  planId: string;
  userId: string;
}

export interface UserSubscriptionResponse {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export class AdminService {
  private static async getAccessToken(): Promise<string | null> {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    if (session.user.role !== 'superadmin') {
      throw new Error('Access denied. Superadmin role required.');
    }

    let accessToken = (session as any).accessToken;
    
    if (!accessToken) {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      accessToken = cookieStore.get('access_token')?.value ||
                   cookieStore.get('client_access_token')?.value;
    }

    return accessToken;
  }

  static async getAllUsers(): Promise<User[]> {
    const accessToken = await this.getAccessToken();
    
    if (!accessToken) {
      throw new Error('Access token not found');
    }

    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch users');
    }

    return response.json();
  }

  static async createSubscription(data: AdminSubscriptionCreate): Promise<UserSubscriptionResponse> {
    const accessToken = await this.getAccessToken();
    
    if (!accessToken) {
      throw new Error('Access token not found');
    }

    const response = await fetch(`${API_BASE_URL}/api/subscriptions/admin`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId: data.planId,
        userId: data.userId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to create subscription');
    }

    return response.json();
  }
} 