/**
 * Performance Analytics Utility
 * Tracks and analyzes app performance metrics
 */

interface PerformanceMetrics {
  preloadTimes: number[];
  cacheHits: number;
  cacheMisses: number;
  totalRequests: number;
  screenLoadTimes: { [screenName: string]: number[] };
}

interface AnalyticsReport {
  avgPreloadTime: number;
  cacheHitRate: number;
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  avgScreenLoadTimes: { [screenName: string]: number };
}

class PerformanceAnalytics {
  private metrics: PerformanceMetrics = {
    preloadTimes: [],
    cacheHits: 0,
    cacheMisses: 0,
    totalRequests: 0,
    screenLoadTimes: {},
  };

  recordPreload(duration: number): void {
    this.metrics.preloadTimes.push(duration);
    console.log(`📊 Analytics: Preload recorded - ${duration}ms`);
  }

  recordCacheHit(): void {
    this.metrics.cacheHits++;
    this.metrics.totalRequests++;
    console.log(`📊 Analytics: Cache hit recorded`);
  }

  recordCacheMiss(): void {
    this.metrics.cacheMisses++;
    this.metrics.totalRequests++;
    console.log(`📊 Analytics: Cache miss recorded`);
  }

  recordScreenLoad(screenName: string, duration: number): void {
    if (!this.metrics.screenLoadTimes[screenName]) {
      this.metrics.screenLoadTimes[screenName] = [];
    }
    this.metrics.screenLoadTimes[screenName].push(duration);
    console.log(
      `📊 Analytics: Screen load recorded - ${screenName}: ${duration}ms`
    );
  }

  getAveragePreloadTime(): number {
    if (this.metrics.preloadTimes.length === 0) return 0;
    const sum = this.metrics.preloadTimes.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.metrics.preloadTimes.length);
  }

  getCacheHitRate(): number {
    if (this.metrics.totalRequests === 0) return 0;
    return (
      Math.round(
        (this.metrics.cacheHits / this.metrics.totalRequests) * 100 * 10
      ) / 10
    );
  }

  getAverageScreenLoadTime(screenName: string): number {
    const times = this.metrics.screenLoadTimes[screenName];
    if (!times || times.length === 0) return 0;
    const sum = times.reduce((a, b) => a + b, 0);
    return Math.round(sum / times.length);
  }

  getReport(): AnalyticsReport {
    const avgScreenLoadTimes: { [screenName: string]: number } = {};

    Object.keys(this.metrics.screenLoadTimes).forEach((screenName) => {
      avgScreenLoadTimes[screenName] =
        this.getAverageScreenLoadTime(screenName);
    });

    return {
      avgPreloadTime: this.getAveragePreloadTime(),
      cacheHitRate: this.getCacheHitRate(),
      totalRequests: this.metrics.totalRequests,
      cacheHits: this.metrics.cacheHits,
      cacheMisses: this.metrics.cacheMisses,
      avgScreenLoadTimes,
    };
  }

  reset(): void {
    this.metrics = {
      preloadTimes: [],
      cacheHits: 0,
      cacheMisses: 0,
      totalRequests: 0,
      screenLoadTimes: {},
    };
    console.log(`📊 Analytics: Metrics reset`);
  }

  exportData(): string {
    return JSON.stringify(this.metrics, null, 2);
  }
}

export const analytics = new PerformanceAnalytics();
export type { AnalyticsReport, PerformanceMetrics };
