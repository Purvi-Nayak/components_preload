/**
 * Performance Monitor Utility
 * Measures and tracks performance metrics for various operations
 */

import { analytics } from "./analytics";

interface PerformanceMeasurement {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

interface PerformanceReport {
  measurements: PerformanceMeasurement[];
  summary: {
    totalMeasurements: number;
    averageDuration: number;
    shortestDuration: number;
    longestDuration: number;
  };
}

class PerformanceMonitor {
  private activeMeasurements: Map<string, PerformanceMeasurement> = new Map();
  private completedMeasurements: PerformanceMeasurement[] = [];
  private maxMeasurements = 1000; // Keep last 1000 measurements

  /**
   * Start measuring performance for a named operation
   */
  startMeasurement(name: string, metadata?: Record<string, any>): string {
    const measurementId = `${name}-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const measurement: PerformanceMeasurement = {
      name,
      startTime: Date.now(),
      metadata,
    };

    this.activeMeasurements.set(measurementId, measurement);
    console.log(
      `⏱️ PerformanceMonitor: Started measuring "${name}" (${measurementId})`
    );

    return measurementId;
  }

  /**
   * End a measurement and record the duration
   */
  endMeasurement(measurementId: string): number | null {
    const measurement = this.activeMeasurements.get(measurementId);

    if (!measurement) {
      console.warn(
        `⏱️ PerformanceMonitor: No active measurement found for ID: ${measurementId}`
      );
      return null;
    }

    const endTime = Date.now();
    const duration = endTime - measurement.startTime;

    const completedMeasurement: PerformanceMeasurement = {
      ...measurement,
      endTime,
      duration,
    };

    this.completedMeasurements.push(completedMeasurement);
    this.activeMeasurements.delete(measurementId);

    // Record in analytics if it's a preload operation
    if (
      measurement.name.toLowerCase().includes("preload") ||
      measurement.name.toLowerCase().includes("load")
    ) {
      analytics.recordPreload(duration);
    }

    // Cleanup old measurements
    if (this.completedMeasurements.length > this.maxMeasurements) {
      this.completedMeasurements = this.completedMeasurements.slice(
        -this.maxMeasurements
      );
    }

    console.log(
      `⏱️ PerformanceMonitor: Completed "${measurement.name}" in ${duration}ms`
    );

    return duration;
  }

  /**
   * Measure an async function and return both result and duration
   */
  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<{ result: T; duration: number }> {
    const measurementId = this.startMeasurement(name, metadata);

    try {
      const result = await fn();
      const duration = this.endMeasurement(measurementId) || 0;

      return { result, duration };
    } catch (error) {
      this.endMeasurement(measurementId);
      throw error;
    }
  }

  /**
   * Measure a synchronous function and return both result and duration
   */
  measureSync<T>(
    name: string,
    fn: () => T,
    metadata?: Record<string, any>
  ): { result: T; duration: number } {
    const measurementId = this.startMeasurement(name, metadata);

    try {
      const result = fn();
      const duration = this.endMeasurement(measurementId) || 0;

      return { result, duration };
    } catch (error) {
      this.endMeasurement(measurementId);
      throw error;
    }
  }

  /**
   * Get measurements by name pattern
   */
  getMeasurements(namePattern?: string): PerformanceMeasurement[] {
    if (!namePattern) {
      return [...this.completedMeasurements];
    }

    const regex = new RegExp(namePattern, "i");
    return this.completedMeasurements.filter((m) => regex.test(m.name));
  }

  /**
   * Get active measurements (still running)
   */
  getActiveMeasurements(): PerformanceMeasurement[] {
    return Array.from(this.activeMeasurements.values());
  }

  /**
   * Get performance statistics for a specific operation
   */
  getStats(namePattern: string): {
    count: number;
    averageDuration: number;
    minDuration: number;
    maxDuration: number;
    totalDuration: number;
  } | null {
    const measurements = this.getMeasurements(namePattern).filter(
      (m) => m.duration !== undefined
    ) as (PerformanceMeasurement & { duration: number })[];

    if (measurements.length === 0) {
      return null;
    }

    const durations = measurements.map((m) => m.duration);
    const totalDuration = durations.reduce(
      (sum, duration) => sum + duration,
      0
    );

    return {
      count: measurements.length,
      averageDuration: Math.round(totalDuration / measurements.length),
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      totalDuration,
    };
  }

  /**
   * Generate a performance report
   */
  generateReport(): PerformanceReport {
    const completedWithDuration = this.completedMeasurements.filter(
      (m) => m.duration !== undefined
    ) as (PerformanceMeasurement & { duration: number })[];

    if (completedWithDuration.length === 0) {
      return {
        measurements: [],
        summary: {
          totalMeasurements: 0,
          averageDuration: 0,
          shortestDuration: 0,
          longestDuration: 0,
        },
      };
    }

    const durations = completedWithDuration.map((m) => m.duration);
    const totalDuration = durations.reduce(
      (sum, duration) => sum + duration,
      0
    );

    return {
      measurements: [...this.completedMeasurements],
      summary: {
        totalMeasurements: this.completedMeasurements.length,
        averageDuration: Math.round(totalDuration / durations.length),
        shortestDuration: Math.min(...durations),
        longestDuration: Math.max(...durations),
      },
    };
  }

  /**
   * Clear all measurements
   */
  clear(): void {
    this.completedMeasurements = [];
    this.activeMeasurements.clear();
    console.log(`⏱️ PerformanceMonitor: All measurements cleared`);
  }

  /**
   * Log performance summary to console
   */
  logSummary(): void {
    const report = this.generateReport();

    console.log(`⏱️ PerformanceMonitor Summary:`);
    console.log(`  Total measurements: ${report.summary.totalMeasurements}`);
    console.log(`  Average duration: ${report.summary.averageDuration}ms`);
    console.log(`  Shortest duration: ${report.summary.shortestDuration}ms`);
    console.log(`  Longest duration: ${report.summary.longestDuration}ms`);
    console.log(`  Active measurements: ${this.activeMeasurements.size}`);
  }

  /**
   * Export measurements as JSON
   */
  exportData(): string {
    return JSON.stringify(
      {
        completedMeasurements: this.completedMeasurements,
        activeMeasurements: Array.from(this.activeMeasurements.values()),
        summary: this.generateReport().summary,
        timestamp: new Date().toISOString(),
      },
      null,
      2
    );
  }

  /**
   * Monitor memory usage (basic implementation)
   */
  checkMemoryUsage(): { used: number; total: number } {
    // This is a simplified version - in production you might use more sophisticated memory monitoring
    try {
      const memoryInfo = (global.performance as any)?.memory;
      if (memoryInfo) {
        return {
          used: Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024), // MB
          total: Math.round(memoryInfo.totalJSHeapSize / 1024 / 1024), // MB
        };
      }
    } catch (error) {
      console.warn("Memory monitoring not available");
    }

    return { used: 0, total: 0 };
  }
}

export const performanceMonitor = new PerformanceMonitor();
export type { PerformanceMeasurement, PerformanceReport };
