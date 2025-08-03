export interface DashboardStats {
  total_questions: number;
  total_sessions: number;
  percent_good: number;
  percent_change: number;
  direction: 'increase' | 'decrease' | 'no_change';
  total_tokens: number;
  total_cost: number;
  cost_change: number;
  tokens_change: number;
}

export interface DashboardRequest {
  siteKey: string;
  rangeDays?: number;
}

class DashboardService {
  async getSiteDashboardStats(siteKey: string, rangeDays?: number, authToken?: string): Promise<DashboardStats> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8001';
      
      const params = new URLSearchParams();
      if (rangeDays) {
        params.append('range_days', rangeDays.toString());
      }

      const response = await fetch(`${backendUrl}/api/v1/dashboard?${params}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ site_key: siteKey }),
      });

      if (!response.ok) {
        throw new Error(`Dashboard API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  async getMultipleSitesStats(siteKeys: string[], rangeDays?: number, authToken?: string): Promise<Record<string, DashboardStats>> {
    const stats: Record<string, DashboardStats> = {};
    
    try {
      await Promise.all(
        siteKeys.map(async (siteKey) => {
          try {
            const siteStats = await this.getSiteDashboardStats(siteKey, rangeDays, authToken);
            stats[siteKey] = siteStats;
          } catch (error) {
            console.error(`Error fetching stats for site ${siteKey}:`, error);
            // Provide default stats for failed requests
            stats[siteKey] = {
              total_questions: 0,
              total_sessions: 0,
              percent_good: 0,
              percent_change: 0,
              direction: 'no_change',
              total_tokens: 0,
              total_cost: 0,
              cost_change: 0,
              tokens_change: 0,
            };
          }
        })
      );
    } catch (error) {
      console.error('Error fetching multiple sites stats:', error);
    }

    return stats;
  }
}

export const dashboardService = new DashboardService(); 