import { Image } from "expo-image";
import { useCallback, useRef, useState } from "react";

interface PreloadStatus {
  [key: string]: "loading" | "loaded" | "failed" | "not-loaded";
}

interface UseImagePreloadResult {
  preloadStatus: PreloadStatus;
  preloadImages: (imageUris: string[]) => Promise<boolean>;
  preloadComponent: (
    componentName: string,
    assets: string[]
  ) => Promise<boolean>;
  preloadAllScreens: () => Promise<void>;
  clearAllCache: () => void;
  isPreloading: boolean;
}

/**
 * Custom hook for image and component preloading
 * Uses functional components with arrow function pattern
 */
export const useImagePreload = (): UseImagePreloadResult => {
  const [preloadStatus, setPreloadStatus] = useState<PreloadStatus>({});
  const [isPreloading, setIsPreloading] = useState<boolean>(false);
  const cachedImages = useRef<Set<string>>(new Set());

  // Preload images using expo-image prefetch with better caching
  const preloadImages = useCallback(
    async (imageUris: string[]): Promise<boolean> => {
      try {
        console.log("🚀 Starting to preload images:", imageUris);
        const promises = imageUris.map(async (uri) => {
          if (cachedImages.current.has(uri)) {
            console.log("✅ Image already cached:", uri);
            return true;
          }

          console.log("📥 Preloading image:", uri);
          await Image.prefetch(uri);
          cachedImages.current.add(uri);
          console.log("✅ Image preloaded successfully:", uri);
          return true;
        });

        await Promise.all(promises);
        console.log("🎉 All images preloaded successfully");
        return true;
      } catch (error) {
        console.error("❌ Failed to preload images:", error);
        return false;
      }
    },
    []
  );

  // Clear all cached data
  const clearAllCache = useCallback(() => {
    console.log("🗑️ Clearing all cache...");
    setPreloadStatus({});
    cachedImages.current.clear();
    // Clear expo-image cache
    Image.clearMemoryCache();
    Image.clearDiskCache();
    console.log("✅ Cache cleared successfully");
  }, []);

  // Preload a specific component with its assets (REAL performance, no artificial delays)
  const preloadComponent = useCallback(
    async (componentName: string, assets: string[]): Promise<boolean> => {
      console.log(`🔄 Starting REAL preload for component: ${componentName}`);

      setPreloadStatus((prev) => ({
        ...prev,
        [componentName]: "loading",
      }));

      try {
        // NO artificial delays - measure real preload time
        const startTime = performance.now();
        await preloadImages(assets);
        const endTime = performance.now();

        console.log(
          `⏱️ REAL preload time for ${componentName}: ${
            Math.round((endTime - startTime) * 100) / 100
          }ms`
        );

        setPreloadStatus((prev) => ({
          ...prev,
          [componentName]: "loaded",
        }));

        console.log(`✅ Component preloaded successfully: ${componentName}`);
        return true;
      } catch (error) {
        console.error(`❌ Failed to preload ${componentName}:`, error);
        setPreloadStatus((prev) => ({
          ...prev,
          [componentName]: "failed",
        }));
        return false;
      }
    },
    [preloadImages]
  );

  // Preload all screens for the demo with REAL large images
  const preloadAllScreens = useCallback(async (): Promise<void> => {
    console.log("🚀 Starting to preload all screens with REAL large images...");
    setIsPreloading(true);

    // Use LARGER images (1200x800) that will actually take time to download
    const screensToPreload = [
      {
        name: "gallery",
        assets: [
          "https://picsum.photos/1200/800?random=1",
          "https://picsum.photos/1200/800?random=5",
          "https://picsum.photos/1200/800?random=6",
        ],
      },
      { name: "profile", assets: ["https://picsum.photos/1200/800?random=2"] },
      {
        name: "dashboard",
        assets: ["https://picsum.photos/1200/800?random=3"],
      },
      { name: "settings", assets: ["https://picsum.photos/1200/800?random=4"] },
    ];

    try {
      // Preload one by one to show progress (NO artificial delays)
      for (const { name, assets } of screensToPreload) {
        console.log(
          `⏳ Preloading ${name} with ${assets.length} large images...`
        );
        await preloadComponent(name, assets);
      }

      console.log(
        "🎉 All screens preloaded successfully with REAL large images!"
      );
    } catch (error) {
      console.error("❌ Error preloading screens:", error);
    } finally {
      setIsPreloading(false);
    }
  }, [preloadComponent]);

  return {
    preloadStatus,
    preloadImages,
    preloadComponent,
    preloadAllScreens,
    clearAllCache,
    isPreloading,
  };
};
