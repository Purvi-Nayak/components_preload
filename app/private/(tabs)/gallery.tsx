import { GalleryScreen } from "@/src/components/GalleryScreen";
import { useBehaviorTracking } from "@/src/hooks/useBehaviorTracking";
import { useImagePreload } from "@/src/hooks/useImagePreload";
import { usePerformanceMetrics } from "@/src/hooks/usePerformanceMetrics";
import React, { useEffect } from "react";

export default function GalleryTab() {
  const { preloadStatus, preloadComponent } = useImagePreload();
  const { trackNavigation, predictNextScreen } = useBehaviorTracking();
  const { startLoadTime, endLoadTime } = usePerformanceMetrics();

  useEffect(() => {
    const screenName = "gallery";
    const wasPreloaded = preloadStatus[screenName] === "loaded";

    console.log(`🎬 Gallery tab loading - preloaded: ${wasPreloaded}`);
    startLoadTime(screenName);
    trackNavigation(screenName);

    // NO artificial delays - just measure real component mount time
    const timer = setTimeout(
      () => {
        endLoadTime(screenName, wasPreloaded);

        // Predict and preload next screen
        const nextScreen = predictNextScreen();
        if (nextScreen && preloadStatus[nextScreen] !== "loaded") {
          const assetsMap: { [key: string]: string[] } = {
            profile: ["https://picsum.photos/1200/800?random=2"],
            dashboard: ["https://picsum.photos/1200/800?random=3"],
            settings: ["https://picsum.photos/1200/800?random=4"],
          };
          if (assetsMap[nextScreen]) {
            console.log(`🔮 Predictive preloading: ${nextScreen}`);
            preloadComponent(nextScreen, assetsMap[nextScreen]);
          }
        }
      },
      10 // Minimal delay just for component mounting
    );

    return () => clearTimeout(timer);
  }, [preloadStatus]);

  const isLoading = preloadStatus.gallery === "loading";

  return <GalleryScreen isLoading={isLoading} />;
}
