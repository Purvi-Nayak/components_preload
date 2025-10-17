/**
 * Network-Aware Preloading Utility
 * Adjusts preloading strategy based on network conditions
 */

import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { imageCache } from "./imageCache";

type NetworkType = "wifi" | "cellular" | "none" | "unknown";
type PreloadStrategy = "aggressive" | "conservative" | "minimal" | "offline";

interface NetworkAwareConfig {
  maxConcurrentDownloads: number;
  maxImageSize: number; // in KB
  enablePredictiveLoading: boolean;
  enableBackgroundSync: boolean;
}

interface NetworkState {
  type: NetworkType;
  isConnected: boolean;
  isExpensive: boolean;
  strength?: number;
}

class NetworkAwarePreloader {
  private currentNetworkState: NetworkState = {
    type: "unknown",
    isConnected: false,
    isExpensive: false,
  };

  private strategies: Record<NetworkType, NetworkAwareConfig> = {
    wifi: {
      maxConcurrentDownloads: 6,
      maxImageSize: 2048, // 2MB
      enablePredictiveLoading: true,
      enableBackgroundSync: true,
    },
    cellular: {
      maxConcurrentDownloads: 3,
      maxImageSize: 512, // 512KB
      enablePredictiveLoading: true,
      enableBackgroundSync: false,
    },
    none: {
      maxConcurrentDownloads: 0,
      maxImageSize: 0,
      enablePredictiveLoading: false,
      enableBackgroundSync: false,
    },
    unknown: {
      maxConcurrentDownloads: 2,
      maxImageSize: 256, // 256KB
      enablePredictiveLoading: false,
      enableBackgroundSync: false,
    },
  };

  constructor() {
    this.initializeNetworkMonitoring();
  }

  private async initializeNetworkMonitoring(): Promise<void> {
    // Get initial network state
    const state = await NetInfo.fetch();
    this.updateNetworkState(state);

    // Subscribe to network changes
    NetInfo.addEventListener(this.updateNetworkState.bind(this));
  }

  private updateNetworkState(state: NetInfoState): void {
    const networkType = this.mapNetworkType(state.type);

    this.currentNetworkState = {
      type: networkType,
      isConnected: state.isConnected ?? false,
      isExpensive: this.isConnectionExpensive(state),
      strength: this.getConnectionStrength(state),
    };

    console.log(
      `📶 NetworkAware: Network state updated`,
      this.currentNetworkState
    );
  }

  private mapNetworkType(type: string | null): NetworkType {
    if (!type) return "unknown";

    switch (type.toLowerCase()) {
      case "wifi":
        return "wifi";
      case "cellular":
      case "4g":
      case "3g":
      case "2g":
        return "cellular";
      case "none":
        return "none";
      default:
        return "unknown";
    }
  }

  private isConnectionExpensive(state: NetInfoState): boolean {
    // Consider cellular connections as expensive
    if (state.type === "cellular") return true;

    // Check if the connection is metered
    if ("isConnectionExpensive" in state && state.isConnectionExpensive) {
      return true;
    }

    return false;
  }

  private getConnectionStrength(state: NetInfoState): number | undefined {
    if (state.type === "cellular" && state.details) {
      // @ts-ignore - cellular details might have strength
      return state.details.strength;
    }
    return undefined;
  }

  getCurrentStrategy(): PreloadStrategy {
    const { type, isConnected } = this.currentNetworkState;

    if (!isConnected) return "offline";

    switch (type) {
      case "wifi":
        return "aggressive";
      case "cellular":
        return "conservative";
      case "none":
        return "offline";
      default:
        return "minimal";
    }
  }

  getConfig(): NetworkAwareConfig {
    return this.strategies[this.currentNetworkState.type];
  }

  async intelligentPreload(
    assets: string[],
    priority: "high" | "medium" | "low" = "medium"
  ): Promise<boolean[]> {
    const strategy = this.getCurrentStrategy();
    const config = this.getConfig();

    console.log(
      `📶 NetworkAware: Starting intelligent preload with ${strategy} strategy`
    );

    if (strategy === "offline") {
      console.log(`📶 NetworkAware: Offline mode - skipping preload`);
      return assets.map(() => false);
    }

    // Filter assets based on network conditions
    const filteredAssets = this.filterAssetsByStrategy(assets, strategy);

    if (filteredAssets.length === 0) {
      console.log(`📶 NetworkAware: No assets to preload after filtering`);
      return assets.map(() => false);
    }

    // Batch assets based on concurrent download limit
    const batches = this.createBatches(
      filteredAssets,
      config.maxConcurrentDownloads
    );
    const results: boolean[] = [];

    for (const batch of batches) {
      console.log(
        `📶 NetworkAware: Processing batch of ${batch.length} assets`
      );
      const batchResults = await imageCache.preloadImages(batch, priority);
      results.push(...batchResults);

      // Add delay between batches on cellular to be conservative
      if (this.currentNetworkState.type === "cellular") {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    return results;
  }

  private filterAssetsByStrategy(
    assets: string[],
    strategy: PreloadStrategy
  ): string[] {
    switch (strategy) {
      case "aggressive":
        return assets; // Load all assets
      case "conservative":
        return assets.slice(0, Math.ceil(assets.length * 0.7)); // Load 70% of assets
      case "minimal":
        return assets.slice(0, Math.ceil(assets.length * 0.3)); // Load 30% of assets
      case "offline":
        return []; // Load nothing
      default:
        return assets.slice(0, 1); // Load only first asset
    }
  }

  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  shouldEnablePredictiveLoading(): boolean {
    const config = this.getConfig();
    return (
      config.enablePredictiveLoading && this.currentNetworkState.isConnected
    );
  }

  shouldEnableBackgroundSync(): boolean {
    const config = this.getConfig();
    return config.enableBackgroundSync && this.currentNetworkState.isConnected;
  }

  getNetworkInfo(): {
    type: NetworkType;
    strategy: PreloadStrategy;
    isConnected: boolean;
    isExpensive: boolean;
    config: NetworkAwareConfig;
  } {
    return {
      type: this.currentNetworkState.type,
      strategy: this.getCurrentStrategy(),
      isConnected: this.currentNetworkState.isConnected,
      isExpensive: this.currentNetworkState.isExpensive,
      config: this.getConfig(),
    };
  }

  // Preload critical assets regardless of network (for essential app functionality)
  async preloadCriticalAssets(assets: string[]): Promise<boolean[]> {
    console.log(`📶 NetworkAware: Preloading ${assets.length} critical assets`);

    if (!this.currentNetworkState.isConnected) {
      console.log(`📶 NetworkAware: No connection - skipping critical preload`);
      return assets.map(() => false);
    }

    // Critical assets are loaded with high priority and minimal batching
    const batches = this.createBatches(assets, 2); // Small batches for critical assets
    const results: boolean[] = [];

    for (const batch of batches) {
      const batchResults = await imageCache.preloadImages(batch, "high");
      results.push(...batchResults);
    }

    return results;
  }
}

export const networkAwarePreloader = new NetworkAwarePreloader();
export type { NetworkAwareConfig, NetworkState, PreloadStrategy };
