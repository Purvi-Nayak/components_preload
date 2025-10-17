/**
 * Preload Queue Utility
 * Manages a priority-based queue for asset preloading
 */

import { Asset } from "expo-asset";
import { imageCache } from "./imageCache";
import { networkAwarePreloader } from "./networkAwarePreload";
import { performanceMonitor } from "./performanceMonitor";

export type Priority = "critical" | "high" | "medium" | "low";

interface QueueItem {
  id: string;
  uri: string;
  priority: Priority;
  type: "image" | "asset" | "font" | "data";
  addedAt: number;
  retryCount: number;
  maxRetries: number;
  metadata?: Record<string, any>;
}

interface QueueStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  byPriority: Record<Priority, number>;
}

class PreloadQueue {
  private queue: QueueItem[] = [];
  private processing = new Set<string>();
  private completed = new Set<string>();
  private failed = new Set<string>();
  private isProcessing = false;
  private maxConcurrent = 3;
  private processingDelay = 100; // ms between processing batches

  /**
   * Add an item to the preload queue
   */
  add(
    uri: string,
    priority: Priority = "medium",
    type: "image" | "asset" | "font" | "data" = "image",
    options?: {
      maxRetries?: number;
      metadata?: Record<string, any>;
    }
  ): string {
    const id = `${type}-${uri}-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Check if already in queue or completed
    if (this.isInQueue(uri) || this.completed.has(uri)) {
      console.log(`🗂️ PreloadQueue: URI already queued or completed - ${uri}`);
      return id;
    }

    const item: QueueItem = {
      id,
      uri,
      priority,
      type,
      addedAt: Date.now(),
      retryCount: 0,
      maxRetries: options?.maxRetries ?? 3,
      metadata: options?.metadata,
    };

    this.queue.push(item);
    this.sortQueue();

    console.log(`🗂️ PreloadQueue: Added ${priority} priority ${type} - ${uri}`);

    // Start processing if not already running
    if (!this.isProcessing) {
      this.startProcessing();
    }

    return id;
  }

  /**
   * Add multiple items to the queue
   */
  addBatch(
    items: Array<{
      uri: string;
      priority?: Priority;
      type?: "image" | "asset" | "font" | "data";
      metadata?: Record<string, any>;
    }>
  ): string[] {
    const ids: string[] = [];

    items.forEach((item) => {
      const id = this.add(item.uri, item.priority, item.type, {
        metadata: item.metadata,
      });
      ids.push(id);
    });

    console.log(`🗂️ PreloadQueue: Added batch of ${items.length} items`);
    return ids;
  }

  /**
   * Remove an item from the queue
   */
  remove(id: string): boolean {
    const index = this.queue.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.queue.splice(index, 1);
      console.log(`🗂️ PreloadQueue: Removed item ${id}`);
      return true;
    }
    return false;
  }

  /**
   * Clear all items from the queue
   */
  clear(): void {
    this.queue = [];
    this.processing.clear();
    this.completed.clear();
    this.failed.clear();
    this.isProcessing = false;
    console.log(`🗂️ PreloadQueue: Queue cleared`);
  }

  /**
   * Pause queue processing
   */
  pause(): void {
    this.isProcessing = false;
    console.log(`🗂️ PreloadQueue: Processing paused`);
  }

  /**
   * Resume queue processing
   */
  resume(): void {
    if (!this.isProcessing && this.queue.length > 0) {
      this.startProcessing();
    }
  }

  /**
   * Set maximum concurrent processing items
   */
  setMaxConcurrent(max: number): void {
    this.maxConcurrent = Math.max(1, max);
    console.log(`🗂️ PreloadQueue: Max concurrent set to ${this.maxConcurrent}`);
  }

  /**
   * Get queue statistics
   */
  getStats(): QueueStats {
    const byPriority: Record<Priority, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    this.queue.forEach((item) => {
      byPriority[item.priority]++;
    });

    return {
      total:
        this.queue.length +
        this.processing.size +
        this.completed.size +
        this.failed.size,
      pending: this.queue.length,
      processing: this.processing.size,
      completed: this.completed.size,
      failed: this.failed.size,
      byPriority,
    };
  }

  /**
   * Get items by priority
   */
  getItemsByPriority(priority: Priority): QueueItem[] {
    return this.queue.filter((item) => item.priority === priority);
  }

  /**
   * Get failed items
   */
  getFailedItems(): string[] {
    return Array.from(this.failed);
  }

  /**
   * Retry failed items
   */
  retryFailed(): void {
    const failedItems = Array.from(this.failed);
    this.failed.clear();

    failedItems.forEach((uri) => {
      this.add(uri, "high", "image");
    });

    console.log(`🗂️ PreloadQueue: Retrying ${failedItems.length} failed items`);
  }

  private isInQueue(uri: string): boolean {
    return (
      this.queue.some((item) => item.uri === uri) || this.processing.has(uri)
    );
  }

  private sortQueue(): void {
    const priorityOrder: Record<Priority, number> = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    this.queue.sort((a, b) => {
      // Sort by priority first, then by addedAt time
      const priorityDiff =
        priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.addedAt - b.addedAt;
    });
  }

  private async startProcessing(): Promise<void> {
    if (this.isProcessing) return;

    this.isProcessing = true;
    console.log(`🗂️ PreloadQueue: Started processing queue`);

    while (this.isProcessing && this.queue.length > 0) {
      await this.processBatch();

      // Small delay between batches
      if (this.processingDelay > 0) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.processingDelay)
        );
      }
    }

    this.isProcessing = false;
    console.log(`🗂️ PreloadQueue: Finished processing queue`);
  }

  private async processBatch(): Promise<void> {
    const availableSlots = this.maxConcurrent - this.processing.size;
    if (availableSlots <= 0) {
      // Wait for some processing to complete
      await new Promise((resolve) => setTimeout(resolve, 500));
      return;
    }

    const itemsToProcess = this.queue.splice(0, availableSlots);

    const processingPromises = itemsToProcess.map((item) =>
      this.processItem(item)
    );

    await Promise.allSettled(processingPromises);
  }

  private async processItem(item: QueueItem): Promise<void> {
    this.processing.add(item.uri);

    try {
      const measurementId = performanceMonitor.startMeasurement(
        `preload-${item.type}-${item.priority}`,
        { uri: item.uri, type: item.type, priority: item.priority }
      );

      let success = false;

      switch (item.type) {
        case "image":
          success = await this.preloadImage(item.uri);
          break;
        case "asset":
          success = await this.preloadAsset(item.uri);
          break;
        case "font":
          success = await this.preloadFont(item.uri);
          break;
        case "data":
          success = await this.preloadData(item.uri);
          break;
      }

      performanceMonitor.endMeasurement(measurementId);

      if (success) {
        this.completed.add(item.uri);
        console.log(
          `🗂️ PreloadQueue: Successfully processed ${item.type} - ${item.uri}`
        );
      } else {
        await this.handleFailure(item);
      }
    } catch (error) {
      console.error(
        `🗂️ PreloadQueue: Error processing ${item.type} - ${item.uri}`,
        error
      );
      await this.handleFailure(item);
    } finally {
      this.processing.delete(item.uri);
    }
  }

  private async handleFailure(item: QueueItem): Promise<void> {
    item.retryCount++;

    if (item.retryCount < item.maxRetries) {
      // Add back to queue for retry
      console.log(
        `🗂️ PreloadQueue: Retrying ${item.uri} (attempt ${
          item.retryCount + 1
        }/${item.maxRetries})`
      );
      this.queue.unshift(item); // Add to front of queue
      this.sortQueue();
    } else {
      // Max retries reached
      this.failed.add(item.uri);
      console.error(
        `🗂️ PreloadQueue: Failed to process ${item.uri} after ${item.maxRetries} attempts`
      );
    }
  }

  private async preloadImage(uri: string): Promise<boolean> {
    if (networkAwarePreloader.shouldEnablePredictiveLoading()) {
      return await imageCache.preloadImage(uri, "medium");
    }
    return false;
  }

  private async preloadAsset(uri: string): Promise<boolean> {
    try {
      await Asset.fromURI(uri).downloadAsync();
      return true;
    } catch (error) {
      console.error(`Failed to preload asset: ${uri}`, error);
      return false;
    }
  }

  private async preloadFont(uri: string): Promise<boolean> {
    // Font preloading would be handled differently
    // This is a placeholder implementation
    console.log(`Font preloading not implemented for: ${uri}`);
    return false;
  }

  private async preloadData(uri: string): Promise<boolean> {
    try {
      const response = await fetch(uri, { method: "HEAD" });
      return response.ok;
    } catch (error) {
      console.error(`Failed to preload data: ${uri}`, error);
      return false;
    }
  }
}

export const preloadQueue = new PreloadQueue();
export type { QueueItem, QueueStats };
