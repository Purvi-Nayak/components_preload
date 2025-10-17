import { ApiDataScreen } from "@/src/components/ApiDataScreen";
import { useBehaviorTracking } from "@/src/hooks/useBehaviorTracking";
import { useImagePreload } from "@/src/hooks/useImagePreload";
import { usePerformanceMetrics } from "@/src/hooks/usePerformanceMetrics";
import React, { useEffect, useState } from "react";

export default function ApiDataTab() {
  const { startLoadTime, endLoadTime } = usePerformanceMetrics();
  const { preloadImages } = useImagePreload();
  const { trackNavigation } = useBehaviorTracking();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const screenName = "api-data";
    const startTime = performance.now();

    console.log(
      `📱 Navigated to: ${screenName} at ${new Date().toLocaleTimeString()}`
    );
    trackNavigation(screenName);

    // Simulate component initialization time
    const initTimer = setTimeout(() => {
      const endTime = performance.now();
      const loadTime = Math.round((endTime - startTime) * 100) / 100;
      console.log(`⚡ ${screenName} loaded in ${loadTime}ms`);

      setIsLoading(false);

      // Predictive preloading for likely next screens
      const galleryImages = [
        "https://picsum.photos/1200/800?random=40",
        "https://picsum.photos/1200/800?random=41",
        "https://picsum.photos/1200/800?random=42",
      ];
      preloadImages(galleryImages);
    }, 100);

    return () => clearTimeout(initTimer);
  }, [trackNavigation, preloadImages]);

  return <ApiDataScreen isLoading={isLoading} />;
}
