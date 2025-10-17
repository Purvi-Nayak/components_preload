import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useRef, useState } from "react";

interface ApiCache {
  data: any;
  timestamp: number;
  expiresIn: number;
}

interface UseApiPreloaderResult {
  prefetchApiData: (
    endpoint: string,
    cacheKey: string,
    expiresIn?: number
  ) => Promise<any>;
  getCachedData: (cacheKey: string) => any;
  loadingStates: Record<string, boolean>;
  loadTimes: Record<string, number>;
  clearApiCache: () => Promise<void>;
  isDataCached: (cacheKey: string) => boolean;
  preloadAllApis: () => Promise<void>;
}

/**
 * Enhanced API preloading hook with JSONPlaceholder integration
 * Demonstrates real-world API performance optimization
 */
export const useApiPreloader = (): UseApiPreloaderResult => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );
  const [loadTimes, setLoadTimes] = useState<Record<string, number>>({});
  const preloadedData = useRef<Record<string, any>>({});

  const prefetchApiData = useCallback(
    async (
      endpoint: string,
      cacheKey: string,
      expiresIn: number = 300000 // 5 minutes default
    ): Promise<any> => {
      const startTime = performance.now();
      setLoadingStates((prev) => ({ ...prev, [cacheKey]: true }));

      try {
        console.log(`🔄 Starting API preload for: ${endpoint}`);

        // Check cache first
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
          const parsedCache: ApiCache = JSON.parse(cached);
          if (Date.now() - parsedCache.timestamp < parsedCache.expiresIn) {
            preloadedData.current[cacheKey] = parsedCache.data;
            const loadTime =
              Math.round((performance.now() - startTime) * 100) / 100;
            setLoadTimes((prev) => ({ ...prev, [cacheKey]: loadTime }));
            setLoadingStates((prev) => ({ ...prev, [cacheKey]: false }));

            console.log(`✅ Cache hit for ${endpoint}: ${loadTime}ms`);
            return parsedCache.data;
          } else {
            console.log(
              `🗑️ Cache expired for ${endpoint}, fetching fresh data`
            );
          }
        }

        // Fetch fresh data from JSONPlaceholder
        console.log(
          `🌐 Fetching fresh data from: https://jsonplaceholder.typicode.com${endpoint}`
        );
        const response = await fetch(
          `https://jsonplaceholder.typicode.com${endpoint}`
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Cache the data
        const cacheData: ApiCache = {
          data,
          timestamp: Date.now(),
          expiresIn,
        };

        await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
        preloadedData.current[cacheKey] = data;

        const loadTime =
          Math.round((performance.now() - startTime) * 100) / 100;
        setLoadTimes((prev) => ({ ...prev, [cacheKey]: loadTime }));
        setLoadingStates((prev) => ({ ...prev, [cacheKey]: false }));

        console.log(
          `📊 Fresh API load for ${endpoint}: ${loadTime}ms (${
            data.length || 1
          } items)`
        );
        return data;
      } catch (error) {
        console.error(`❌ API preload failed for ${endpoint}:`, error);
        setLoadingStates((prev) => ({ ...prev, [cacheKey]: false }));
        throw error;
      }
    },
    []
  );

  const getCachedData = useCallback((cacheKey: string) => {
    return preloadedData.current[cacheKey] || null;
  }, []);

  const isDataCached = useCallback((cacheKey: string): boolean => {
    return !!preloadedData.current[cacheKey];
  }, []);

  const clearApiCache = useCallback(async () => {
    console.log("🗑️ Clearing all API cache...");

    try {
      const cacheKeys = [
        "posts_cache",
        "users_cache",
        "albums_cache",
        "comments_cache",
        "todos_cache",
      ];

      await Promise.all(cacheKeys.map((key) => AsyncStorage.removeItem(key)));

      preloadedData.current = {};
      setLoadTimes({});
      setLoadingStates({});

      console.log("✅ All API cache cleared successfully");
    } catch (error) {
      console.error("❌ Error clearing API cache:", error);
    }
  }, []);

  const preloadAllApis = useCallback(async () => {
    console.log("🚀 Starting bulk API preload...");
    const startTime = performance.now();

    try {
      await Promise.all([
        prefetchApiData("/posts", "posts_cache"),
        prefetchApiData("/users", "users_cache"),
        prefetchApiData("/albums", "albums_cache"),
        prefetchApiData("/comments", "comments_cache"),
        prefetchApiData("/todos", "todos_cache"),
      ]);

      const totalTime = Math.round((performance.now() - startTime) * 100) / 100;
      console.log(`🎉 Bulk API preload completed in ${totalTime}ms`);
    } catch (error) {
      console.error("❌ Bulk preload failed:", error);
    }
  }, [prefetchApiData]);

  return {
    prefetchApiData,
    getCachedData,
    loadingStates,
    loadTimes,
    clearApiCache,
    isDataCached,
    preloadAllApis,
  };
};
