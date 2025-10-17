import { useCallback, useRef, useState } from "react";

interface NavigationPattern {
  from: string;
  to: string;
  timestamp: number;
}

interface UseBehaviorTrackingResult {
  userBehavior: string[];
  navigationPatterns: NavigationPattern[];
  trackNavigation: (screen: string) => void;
  predictNextScreen: () => string | null;
  clearBehavior: () => void;
  getBehaviorAnalytics: () => {
    mostVisited: string;
    commonPatterns: { pattern: string; count: number }[];
    navigationCount: number;
  };
}

/**
 * Custom hook for tracking user behavior and predicting navigation
 * Uses functional components with arrow function pattern
 */
export const useBehaviorTracking = (): UseBehaviorTrackingResult => {
  const [userBehavior, setUserBehavior] = useState<string[]>([]);
  const [navigationPatterns, setNavigationPatterns] = useState<
    NavigationPattern[]
  >([]);
  const lastScreenRef = useRef<string>("");

  // Track user navigation between screens
  const trackNavigation = useCallback((screen: string) => {
    const timestamp = Date.now();

    setUserBehavior((prev) => [...prev, screen].slice(-10)); // Keep last 10 navigations

    if (lastScreenRef.current && lastScreenRef.current !== screen) {
      setNavigationPatterns((prev) =>
        [
          ...prev,
          {
            from: lastScreenRef.current,
            to: screen,
            timestamp,
          },
        ].slice(-20)
      ); // Keep last 20 patterns
    }

    lastScreenRef.current = screen;
  }, []);

  // Predict next screen based on behavior patterns
  const predictNextScreen = useCallback((): string | null => {
    if (userBehavior.length < 2) return null;

    const recentBehavior = userBehavior.slice(-3);

    // Pattern 1: If user visited same screen twice in a row, predict next likely screen
    const lastTwo = recentBehavior.slice(-2);
    if (lastTwo[0] === lastTwo[1]) {
      if (lastTwo[0] === "gallery") return "profile";
      if (lastTwo[0] === "profile") return "dashboard";
      if (lastTwo[0] === "dashboard") return "settings";
    }

    // Pattern 2: Common sequential patterns
    const sequentialPatterns = [
      ["home", "gallery", "profile"],
      ["gallery", "profile", "dashboard"],
      ["profile", "dashboard", "settings"],
    ];

    for (const pattern of sequentialPatterns) {
      if (recentBehavior.length >= 2) {
        const lastTwoInBehavior = recentBehavior.slice(-2);
        for (let i = 0; i < pattern.length - 1; i++) {
          if (
            pattern[i] === lastTwoInBehavior[0] &&
            pattern[i + 1] === lastTwoInBehavior[1]
          ) {
            if (i + 2 < pattern.length) {
              return pattern[i + 2];
            }
          }
        }
      }
    }

    // Pattern 3: Most frequently visited after current screen
    const currentScreen = recentBehavior[recentBehavior.length - 1];
    const patternsFromCurrent = navigationPatterns.filter(
      (p) => p.from === currentScreen
    );

    if (patternsFromCurrent.length > 0) {
      const destinationCounts: { [key: string]: number } = {};
      patternsFromCurrent.forEach((p) => {
        destinationCounts[p.to] = (destinationCounts[p.to] || 0) + 1;
      });

      const mostCommon = Object.entries(destinationCounts).sort(
        ([, a], [, b]) => b - a
      )[0];

      return mostCommon ? mostCommon[0] : null;
    }

    return null;
  }, [userBehavior, navigationPatterns]);

  // Clear behavior data
  const clearBehavior = useCallback(() => {
    setUserBehavior([]);
    setNavigationPatterns([]);
    lastScreenRef.current = "";
  }, []);

  // Get analytics about user behavior
  const getBehaviorAnalytics = useCallback(() => {
    const screenCounts: { [key: string]: number } = {};
    userBehavior.forEach((screen) => {
      screenCounts[screen] = (screenCounts[screen] || 0) + 1;
    });

    const mostVisited =
      Object.entries(screenCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "";

    const patternCounts: { [key: string]: number } = {};
    navigationPatterns.forEach((pattern) => {
      const patternKey = `${pattern.from} → ${pattern.to}`;
      patternCounts[patternKey] = (patternCounts[patternKey] || 0) + 1;
    });

    const commonPatterns = Object.entries(patternCounts)
      .map(([pattern, count]) => ({ pattern, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      mostVisited,
      commonPatterns,
      navigationCount: userBehavior.length,
    };
  }, [userBehavior, navigationPatterns]);

  return {
    userBehavior,
    navigationPatterns,
    trackNavigation,
    predictNextScreen,
    clearBehavior,
    getBehaviorAnalytics,
  };
};
