/**
 * Storage Utility
 * Manages AsyncStorage operations for user behavior and app data persistence
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys
const STORAGE_KEYS = {
  NAVIGATION_HISTORY: "navigation_history",
  USER_PREFERENCES: "user_preferences",
  CACHE_SETTINGS: "cache_settings",
  PERFORMANCE_DATA: "performance_data",
  PRELOAD_PATTERNS: "preload_patterns",
  APP_CONFIG: "app_config",
} as const;

interface NavigationHistoryEntry {
  screen: string;
  timestamp: number;
  duration?: number;
}

interface UserPreferences {
  autoPreload: boolean;
  predictiveLoading: boolean;
  networkAwareLoading: boolean;
  cacheSize: "small" | "medium" | "large";
  imageQuality: "low" | "medium" | "high";
}

interface CacheSettings {
  maxCacheSize: number;
  maxCacheAge: number; // in milliseconds
  enableOfflineMode: boolean;
  preferWifiForLargeDownloads: boolean;
}

interface PreloadPattern {
  fromScreen: string;
  toScreen: string;
  count: number;
  confidence: number;
  lastUpdated: number;
}

interface AppConfig {
  version: string;
  lastUpdateCheck: number;
  features: Record<string, boolean>;
}

class StorageManager {
  /**
   * Navigation History Management
   */
  async saveNavigationHistory(
    history: NavigationHistoryEntry[]
  ): Promise<boolean> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.NAVIGATION_HISTORY,
        JSON.stringify(history)
      );
      console.log(
        `💾 Storage: Navigation history saved (${history.length} entries)`
      );
      return true;
    } catch (error) {
      console.error("💾 Storage: Failed to save navigation history", error);
      return false;
    }
  }

  async loadNavigationHistory(): Promise<NavigationHistoryEntry[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.NAVIGATION_HISTORY);
      if (data) {
        const history = JSON.parse(data);
        console.log(
          `💾 Storage: Navigation history loaded (${history.length} entries)`
        );
        return history;
      }
      return [];
    } catch (error) {
      console.error("💾 Storage: Failed to load navigation history", error);
      return [];
    }
  }


  async addNavigationEntry(
    screen: string,
    duration?: number
  ): Promise<boolean> {
    try {
      const history = await this.loadNavigationHistory();
      const entry: NavigationHistoryEntry = {
        screen,
        timestamp: Date.now(),
        duration,
      };

      history.push(entry);

      // Keep only last 100 entries
      if (history.length > 100) {
        history.splice(0, history.length - 100);
      }

      return await this.saveNavigationHistory(history);
    } catch (error) {
      console.error("💾 Storage: Failed to add navigation entry", error);
      return false;
    }
  }

  /**
   * User Preferences Management
   */
  async saveUserPreferences(preferences: UserPreferences): Promise<boolean> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PREFERENCES,
        JSON.stringify(preferences)
      );
      console.log(`💾 Storage: User preferences saved`);
      return true;
    } catch (error) {
      console.error("💾 Storage: Failed to save user preferences", error);
      return false;
    }
  }

  async loadUserPreferences(): Promise<UserPreferences> {
    const defaultPreferences: UserPreferences = {
      autoPreload: true,
      predictiveLoading: true,
      networkAwareLoading: true,
      cacheSize: "medium",
      imageQuality: "high",
    };

    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (data) {
        const preferences = { ...defaultPreferences, ...JSON.parse(data) };
        console.log(`💾 Storage: User preferences loaded`);
        return preferences;
      }
      return defaultPreferences;
    } catch (error) {
      console.error("💾 Storage: Failed to load user preferences", error);
      return defaultPreferences;
    }
  }

  async updateUserPreference<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ): Promise<boolean> {
    try {
      const preferences = await this.loadUserPreferences();
      preferences[key] = value;
      return await this.saveUserPreferences(preferences);
    } catch (error) {
      console.error(`💾 Storage: Failed to update preference ${key}`, error);
      return false;
    }
  }

  /**
   * Cache Settings Management
   */
  async saveCacheSettings(settings: CacheSettings): Promise<boolean> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.CACHE_SETTINGS,
        JSON.stringify(settings)
      );
      console.log(`💾 Storage: Cache settings saved`);
      return true;
    } catch (error) {
      console.error("💾 Storage: Failed to save cache settings", error);
      return false;
    }
  }

  async loadCacheSettings(): Promise<CacheSettings> {
    const defaultSettings: CacheSettings = {
      maxCacheSize: 100, // MB
      maxCacheAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      enableOfflineMode: true,
      preferWifiForLargeDownloads: true,
    };

    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CACHE_SETTINGS);
      if (data) {
        const settings = { ...defaultSettings, ...JSON.parse(data) };
        console.log(`💾 Storage: Cache settings loaded`);
        return settings;
      }
      return defaultSettings;
    } catch (error) {
      console.error("💾 Storage: Failed to load cache settings", error);
      return defaultSettings;
    }
  }

  /**
   * Preload Patterns Management (for ML prediction)
   */
  async savePreloadPatterns(patterns: PreloadPattern[]): Promise<boolean> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.PRELOAD_PATTERNS,
        JSON.stringify(patterns)
      );
      console.log(
        `💾 Storage: Preload patterns saved (${patterns.length} patterns)`
      );
      return true;
    } catch (error) {
      console.error("💾 Storage: Failed to save preload patterns", error);
      return false;
    }
  }

  async loadPreloadPatterns(): Promise<PreloadPattern[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PRELOAD_PATTERNS);
      if (data) {
        const patterns = JSON.parse(data);
        console.log(
          `💾 Storage: Preload patterns loaded (${patterns.length} patterns)`
        );
        return patterns;
      }
      return [];
    } catch (error) {
      console.error("💾 Storage: Failed to load preload patterns", error);
      return [];
    }
  }

  async updatePreloadPattern(
    fromScreen: string,
    toScreen: string
  ): Promise<boolean> {
    try {
      const patterns = await this.loadPreloadPatterns();
      const existingPattern = patterns.find(
        (p) => p.fromScreen === fromScreen && p.toScreen === toScreen
      );

      if (existingPattern) {
        existingPattern.count++;
        existingPattern.lastUpdated = Date.now();
        existingPattern.confidence = Math.min(100, existingPattern.count * 5);
      } else {
        patterns.push({
          fromScreen,
          toScreen,
          count: 1,
          confidence: 5,
          lastUpdated: Date.now(),
        });
      }

      return await this.savePreloadPatterns(patterns);
    } catch (error) {
      console.error("💾 Storage: Failed to update preload pattern", error);
      return false;
    }
  }

  /**
   * Performance Data Management
   */
  async savePerformanceData(data: any): Promise<boolean> {
    try {
      const timestamp = Date.now();
      const performanceEntry = {
        timestamp,
        data,
      };

      await AsyncStorage.setItem(
        STORAGE_KEYS.PERFORMANCE_DATA,
        JSON.stringify(performanceEntry)
      );
      console.log(`💾 Storage: Performance data saved`);
      return true;
    } catch (error) {
      console.error("💾 Storage: Failed to save performance data", error);
      return false;
    }
  }

  async loadPerformanceData(): Promise<any> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PERFORMANCE_DATA);
      if (data) {
        const performanceEntry = JSON.parse(data);
        console.log(`💾 Storage: Performance data loaded`);
        return performanceEntry.data;
      }
      return null;
    } catch (error) {
      console.error("💾 Storage: Failed to load performance data", error);
      return null;
    }
  }

  /**
   * App Configuration Management
   */
  async saveAppConfig(config: AppConfig): Promise<boolean> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.APP_CONFIG,
        JSON.stringify(config)
      );
      console.log(`💾 Storage: App config saved`);
      return true;
    } catch (error) {
      console.error("💾 Storage: Failed to save app config", error);
      return false;
    }
  }

  async loadAppConfig(): Promise<AppConfig> {
    const defaultConfig: AppConfig = {
      version: "1.0.0",
      lastUpdateCheck: 0,
      features: {
        predictiveLoading: true,
        networkAwarePreloading: true,
        advancedAnalytics: true,
      },
    };

    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.APP_CONFIG);
      if (data) {
        const config = { ...defaultConfig, ...JSON.parse(data) };
        console.log(`💾 Storage: App config loaded`);
        return config;
      }
      return defaultConfig;
    } catch (error) {
      console.error("💾 Storage: Failed to load app config", error);
      return defaultConfig;
    }
  }

  /**
   * Utility Methods
   */
  async clearAll(): Promise<boolean> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
      console.log(`💾 Storage: All data cleared`);
      return true;
    } catch (error) {
      console.error("💾 Storage: Failed to clear all data", error);
      return false;
    }
  }

  async clearSpecific(keys: string[]): Promise<boolean> {
    try {
      await AsyncStorage.multiRemove(keys);
      console.log(`💾 Storage: Specific data cleared (${keys.length} keys)`);
      return true;
    } catch (error) {
      console.error("💾 Storage: Failed to clear specific data", error);
      return false;
    }
  }

  async getStorageInfo(): Promise<{
    usedSpace: number;
    keys: string[];
    totalItems: number;
  }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let usedSpace = 0;

      // Rough estimation of used space
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          usedSpace += value.length;
        }
      }

      return {
        usedSpace: Math.round(usedSpace / 1024), // KB
        keys: [...keys],
        totalItems: keys.length,
      };
    } catch (error) {
      console.error("💾 Storage: Failed to get storage info", error);
      return {
        usedSpace: 0,
        keys: [],
        totalItems: 0,
      };
    }
  }

  async exportAllData(): Promise<string> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const data: Record<string, any> = {};

      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          try {
            data[key] = JSON.parse(value);
          } catch {
            data[key] = value;
          }
        }
      }

      return JSON.stringify(
        {
          exportTimestamp: Date.now(),
          version: "1.0.0",
          data,
        },
        null,
        2
      );
    } catch (error) {
      console.error("💾 Storage: Failed to export data", error);
      return JSON.stringify({ error: "Failed to export data" });
    }
  }
}

export const storage = new StorageManager();
export { STORAGE_KEYS };
export type {
  AppConfig,
  CacheSettings,
  NavigationHistoryEntry,
  PreloadPattern,
  UserPreferences,
};
