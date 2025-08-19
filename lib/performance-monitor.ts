interface PerformanceMetric {
  endpoint: string;
  timestamp: number;
  duration: number;
  success: boolean;
  error?: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private readonly MAX_METRICS = 100;

  trackApiCall(endpoint: string, startTime: number, success: boolean, error?: string) {
    const duration = Date.now() - startTime;
    
    this.metrics.push({
      endpoint,
      timestamp: Date.now(),
      duration,
      success,
      error,
    });

    // Keep only the last MAX_METRICS entries
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS);
    }

    // Log slow calls
    if (duration > 1000) {
      console.warn(`Slow API call detected: ${endpoint} took ${duration}ms`);
    }

    // Log failed calls
    if (!success) {
      console.error(`API call failed: ${endpoint} - ${error}`);
    }
  }

  getMetrics(endpoint?: string): PerformanceMetric[] {
    if (endpoint) {
      return this.metrics.filter(m => m.endpoint === endpoint);
    }
    return [...this.metrics];
  }

  getAverageResponseTime(endpoint?: string): number {
    const relevantMetrics = this.getMetrics(endpoint);
    if (relevantMetrics.length === 0) return 0;
    
    const totalDuration = relevantMetrics.reduce((sum, m) => sum + m.duration, 0);
    return totalDuration / relevantMetrics.length;
  }

  getCallCount(endpoint?: string): number {
    return this.getMetrics(endpoint).length;
  }

  getRecentCalls(minutes: number = 5): PerformanceMetric[] {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    return this.metrics.filter(m => m.timestamp > cutoff);
  }

  clearMetrics(): void {
    this.metrics = [];
  }

  generateReport(): string {
    const recentCalls = this.getRecentCalls();
    const sessionCalls = recentCalls.filter(m => m.endpoint.includes('/api/auth/session'));
    
    return `
Performance Report (Last 5 minutes):
- Total API calls: ${recentCalls.length}
- Session API calls: ${sessionCalls.length}
- Average session response time: ${this.getAverageResponseTime('/api/auth/session').toFixed(2)}ms
- Failed calls: ${recentCalls.filter(m => !m.success).length}
    `.trim();
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export utility function for tracking
export const trackApiCall = (endpoint: string, startTime: number, success: boolean, error?: string) => {
  performanceMonitor.trackApiCall(endpoint, startTime, success, error);
}; 