import { ProfileScreen } from "@/src/components/ProfileScreen";
import { useBehaviorTracking } from "@/src/hooks/useBehaviorTracking";
import { useImagePreload } from "@/src/hooks/useImagePreload";
import { usePerformanceMetrics } from "@/src/hooks/usePerformanceMetrics";
import React, { useEffect } from "react";

export default function ProfileTab() {
  const { preloadStatus, preloadComponent } = useImagePreload();
  const { trackNavigation, predictNextScreen } = useBehaviorTracking();
  const { startLoadTime, endLoadTime } = usePerformanceMetrics();

  useEffect(() => {
    const screenName = "profile";
    const wasPreloaded = preloadStatus[screenName] === "loaded";

    startLoadTime(screenName);
    trackNavigation(screenName);

    // Simulate component load time with artificial delay for demo purposes
    const timer = setTimeout(
      () => {
        endLoadTime(screenName, wasPreloaded);

        // Predict and preload next screen
        const nextScreen = predictNextScreen();
        if (nextScreen && preloadStatus[nextScreen] !== "loaded") {
          const assetsMap: { [key: string]: string[] } = {
            gallery: ["https://picsum.photos/400/300?random=1"],
            dashboard: ["https://picsum.photos/400/300?random=3"],
            settings: ["https://picsum.photos/400/300?random=4"],
          };
          if (assetsMap[nextScreen]) {
            console.log(`🔮 Predictive preloading: ${nextScreen}`);
            preloadComponent(nextScreen, assetsMap[nextScreen]);
          }
        }
      },
      wasPreloaded ? 50 : 800
    ); // Much more dramatic difference

    return () => clearTimeout(timer);
  }, [preloadStatus]);

  const isLoading = preloadStatus.profile === "loading";

  return <ProfileScreen isLoading={isLoading} />;
}
