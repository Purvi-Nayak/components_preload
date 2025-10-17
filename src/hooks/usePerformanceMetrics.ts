import { useCallback, useRef, useState } from "react";

interface LoadTimeMetrics {
  screenName: string;
  loadTime: number;
  wasPreloaded: boolean;
  timestamp: number;
}

interface UsePerformanceMetricsResult {
  loadTimes: LoadTimeMetrics[];
  currentLoadTime: number | null;
  startLoadTime: (screenName: string) => void;
  endLoadTime: (screenName: string, wasPreloaded: boolean) => void;
  getAverageLoadTime: (preloaded?: boolean) => number;
  clearMetrics: () => void;
  getPerformanceStats: () => {
    totalNavigations: number;
    averagePreloadedTime: number;
    averageNonPreloadedTime: number;
    preloadedCount: number;
    nonPreloadedCount: number;
    performanceImprovement: number;
  };
}

/**
 * Custom hook for tracking performance metrics and load times
 * Uses functional components with arrow function pattern
 */
export const usePerformanceMetrics = (): UsePerformanceMetricsResult => {
  const [loadTimes, setLoadTimes] = useState<LoadTimeMetrics[]>([]);
  const [currentLoadTime, setCurrentLoadTime] = useState<number | null>(null);
  const loadStartTimeRef = useRef<{ [screenName: string]: number }>({});

  // Start tracking load time for a screen
  const startLoadTime = useCallback((screenName: string) => {
    const startTime = performance.now(); // Use high-precision timing
    loadStartTimeRef.current[screenName] = startTime;
    console.log(`⏱️ Starting REAL load timer for: ${screenName}`);
  }, []);

  // End tracking and record the REAL load time (no artificial delays)
  const endLoadTime = useCallback(
    (screenName: string, wasPreloaded: boolean) => {
      const endTime = performance.now(); // Use high-precision timing
      const startTime = loadStartTimeRef.current[screenName];

      if (startTime) {
        // Calculate REAL component render time in milliseconds
        const loadTime = Math.round((endTime - startTime) * 100) / 100;

        const metric: LoadTimeMetrics = {
          screenName,
          loadTime,
          wasPreloaded,
          timestamp: Date.now(),
        };

        setLoadTimes((prev) => [...prev, metric].slice(-50)); // Keep last 50 metrics
        setCurrentLoadTime(loadTime);

        console.log(
          `📊 REAL load time for ${screenName}: ${loadTime}ms (${
            wasPreloaded ? "preloaded" : "not preloaded"
          })`
        );

        // Clean up the start time
        delete loadStartTimeRef.current[screenName];
      }
    },
    []
  ); // Get average load time (optionally filtered by preloaded status)
  const getAverageLoadTime = useCallback(
    (preloaded?: boolean): number => {
      let filteredTimes = loadTimes;

      if (preloaded !== undefined) {
        filteredTimes = loadTimes.filter(
          (metric) => metric.wasPreloaded === preloaded
        );
      }

      if (filteredTimes.length === 0) return 0;

      const total = filteredTimes.reduce(
        (sum, metric) => sum + metric.loadTime,
        0
      );
      return Math.round(total / filteredTimes.length);
    },
    [loadTimes]
  );

  // Clear all metrics
  const clearMetrics = useCallback(() => {
    setLoadTimes([]);
    setCurrentLoadTime(null);
    loadStartTimeRef.current = {};
  }, []);

  // Get comprehensive performance statistics
  const getPerformanceStats = useCallback(() => {
    const preloadedMetrics = loadTimes.filter((m) => m.wasPreloaded);
    const nonPreloadedMetrics = loadTimes.filter((m) => !m.wasPreloaded);

    const averagePreloadedTime =
      preloadedMetrics.length > 0
        ? Math.round(
            preloadedMetrics.reduce((sum, m) => sum + m.loadTime, 0) /
              preloadedMetrics.length
          )
        : 0;

    const averageNonPreloadedTime =
      nonPreloadedMetrics.length > 0
        ? Math.round(
            nonPreloadedMetrics.reduce((sum, m) => sum + m.loadTime, 0) /
              nonPreloadedMetrics.length
          )
        : 0;

    const performanceImprovement =
      averageNonPreloadedTime > 0
        ? Math.round(
            ((averageNonPreloadedTime - averagePreloadedTime) /
              averageNonPreloadedTime) *
              100
          )
        : 0;

    return {
      totalNavigations: loadTimes.length,
      averagePreloadedTime,
      averageNonPreloadedTime,
      preloadedCount: preloadedMetrics.length,
      nonPreloadedCount: nonPreloadedMetrics.length,
      performanceImprovement,
    };
  }, [loadTimes]);

  return {
    loadTimes,
    currentLoadTime,
    startLoadTime,
    endLoadTime,
    getAverageLoadTime,
    clearMetrics,
    getPerformanceStats,
  };
};
