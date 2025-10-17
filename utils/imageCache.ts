/**
 * Image Cache Utility
 * Manages image caching and provides cache status information
 */

import { Asset } from "expo-asset";
import { analytics } from "./analytics";

interface CacheEntry {
  uri: string;
  timestamp: number;
  size?: number;
  priority: "high" | "medium" | "low";
}

interface CacheStatus {
  total: number;
  cached: number;
  pending: number;
  failed: number;
}

class ImageCache {
  private cache: Map<string, CacheEntry> = new Map();
  private failedUrls: Set<string> = new Set();
  private pendingUrls: Set<string> = new Set();
  private maxCacheSize = 100; // Maximum number of cached items

  async preloadImage(
    uri: string,
    priority: "high" | "medium" | "low" = "medium"
  ): Promise<boolean> {
    const startTime = Date.now();

    // Check if already cached
    if (this.cache.has(uri)) {
      analytics.recordCacheHit();
      console.log(`🖼️ ImageCache: Cache hit - ${uri}`);
      return true;
    }

    // Check if already failed
    if (this.failedUrls.has(uri)) {
      analytics.recordCacheMiss();
      console.log(`🖼️ ImageCache: Previously failed - ${uri}`);
      return false;
    }

    // Check if already pending
    if (this.pendingUrls.has(uri)) {
      console.log(`🖼️ ImageCache: Already pending - ${uri}`);
      return true;
    }

    this.pendingUrls.add(uri);

    try {
      console.log(`🖼️ ImageCache: Starting preload - ${uri}`);
      await Asset.fromURI(uri).downloadAsync();

      const loadTime = Date.now() - startTime;
      analytics.recordPreload(loadTime);
      analytics.recordCacheHit();

      // Add to cache
      this.cache.set(uri, {
        uri,
        timestamp: Date.now(),
        priority,
      });

      // Clean up old entries if cache is full
      if (this.cache.size > this.maxCacheSize) {
        this.cleanup();
      }

      this.pendingUrls.delete(uri);
      console.log(
        `🖼️ ImageCache: Successfully cached - ${uri} (${loadTime}ms)`
      );
      return true;
    } catch (error) {
      this.pendingUrls.delete(uri);
      this.failedUrls.add(uri);
      analytics.recordCacheMiss();
      console.error(`🖼️ ImageCache: Failed to cache - ${uri}`, error);
      return false;
    }
  }

  async preloadImages(
    uris: string[],
    priority: "high" | "medium" | "low" = "medium"
  ): Promise<boolean[]> {
    console.log(`🖼️ ImageCache: Batch preloading ${uris.length} images`);

    const results = await Promise.allSettled(
      uris.map((uri) => this.preloadImage(uri, priority))
    );

    return results.map((result) =>
      result.status === "fulfilled" ? result.value : false
    );
  }

  isCached(uri: string): boolean {
    return this.cache.has(uri);
  }

  hasFailed(uri: string): boolean {
    return this.failedUrls.has(uri);
  }

  isPending(uri: string): boolean {
    return this.pendingUrls.has(uri);
  }

  getCacheStatus(): CacheStatus {
    return {
      total: this.cache.size + this.failedUrls.size + this.pendingUrls.size,
      cached: this.cache.size,
      pending: this.pendingUrls.size,
      failed: this.failedUrls.size,
    };
  }

  getCachedUrls(): string[] {
    return Array.from(this.cache.keys());
  }

  getFailedUrls(): string[] {
    return Array.from(this.failedUrls);
  }

  getPendingUrls(): string[] {
    return Array.from(this.pendingUrls);
  }

  private cleanup(): void {
    // Remove oldest low-priority entries first
    const entries = Array.from(this.cache.entries()).sort((a, b) => {
      // Sort by priority first (high > medium > low), then by timestamp
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff =
        priorityOrder[a[1].priority] - priorityOrder[b[1].priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a[1].timestamp - b[1].timestamp;
    });

    // Remove oldest 20% of entries
    const toRemove = Math.floor(this.maxCacheSize * 0.2);
    for (let i = 0; i < toRemove && entries.length > 0; i++) {
      const [uri] = entries.shift()!;
      this.cache.delete(uri);
      console.log(`🖼️ ImageCache: Cleaned up - ${uri}`);
    }
  }

  clearCache(): void {
    this.cache.clear();
    this.failedUrls.clear();
    this.pendingUrls.clear();
    console.log(`🖼️ ImageCache: Cache cleared`);
  }

  clearFailed(): void {
    this.failedUrls.clear();
    console.log(`🖼️ ImageCache: Failed URLs cleared`);
  }

  setMaxCacheSize(size: number): void {
    this.maxCacheSize = size;
    if (this.cache.size > size) {
      this.cleanup();
    }
  }

  getCacheInfo(): { size: number; maxSize: number; hitRate: string } {
    const report = analytics.getReport();
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      hitRate: `${report.cacheHitRate}%`,
    };
  }
}

export const imageCache = new ImageCache();
export type { CacheEntry, CacheStatus };
