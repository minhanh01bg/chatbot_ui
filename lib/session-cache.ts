import { debounceAsync } from './debounce';
import { trackApiCall } from './performance-monitor';

interface SessionCache {
  data: any;
  timestamp: number;
  expiresAt: number;
}

class SessionCacheManager {
  private cache: SessionCache | null = null;
  private readonly CACHE_DURATION = 30000; // 30 seconds
  private readonly STALE_WHILE_REVALIDATE = 60000; // 60 seconds
  private debouncedRefresh: ReturnType<typeof debounceAsync>;

  constructor() {
    this.debouncedRefresh = debounceAsync(this.refreshSession.bind(this), 1000); // 1 second debounce
  }

  async getSession(forceRefresh = false): Promise<any> {
    const now = Date.now();

    // Check if we have a valid cache
    if (!forceRefresh && this.cache && now < this.cache.expiresAt) {
      console.log('SessionCache: Returning cached session data');
      return this.cache.data;
    }

    // Check if we can serve stale data while revalidating
    if (this.cache && now < this.cache.expiresAt + this.STALE_WHILE_REVALIDATE) {
      console.log('SessionCache: Serving stale data while revalidating');
      // Start revalidation in background with debouncing
      this.debouncedRefresh().catch(console.error);
      return this.cache.data;
    }

    // No cache or expired, fetch fresh data
    return this.refreshSession();
  }

  private async refreshSession(): Promise<any> {
    const startTime = Date.now();
    try {
      console.log('SessionCache: Fetching fresh session data');
      const response = await fetch('/api/auth/session', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = `Session fetch failed: ${response.status}`;
        trackApiCall('/api/auth/session', startTime, false, error);
        throw new Error(error);
      }

      const data = await response.json();
      
      // Update cache
      this.cache = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + this.CACHE_DURATION,
      };

      trackApiCall('/api/auth/session', startTime, true);
      console.log('SessionCache: Updated cache with fresh data');
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      trackApiCall('/api/auth/session', startTime, false, errorMessage);
      console.error('SessionCache: Error fetching session:', error);
      
      // Return stale data if available
      if (this.cache) {
        console.log('SessionCache: Returning stale data due to error');
        return this.cache.data;
      }
      
      throw error;
    }
  }

  clearCache(): void {
    this.cache = null;
    console.log('SessionCache: Cache cleared');
  }

  isCached(): boolean {
    return this.cache !== null && Date.now() < this.cache.expiresAt;
  }
}

// Export singleton instance
export const sessionCache = new SessionCacheManager();

// Export utility functions
export const getSession = (forceRefresh = false) => sessionCache.getSession(forceRefresh);
export const clearSessionCache = () => sessionCache.clearCache();
export const isSessionCached = () => sessionCache.isCached(); 