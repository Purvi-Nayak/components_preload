import { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface MobileResponsiveHook {
  // Device Detection
  device: {
    type: "small-phone" | "phone" | "tablet" | "large-tablet" | "foldable";
    isPortrait: boolean;
    isLandscape: boolean;
    width: number;
    height: number;
  };

  // Safe Areas
  safe: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };

  // Responsive Design System
  scale: {
    space: (size: number) => number;
    font: (size: number) => number;
    radius: (size: number) => number;
    icon: (size: number) => number;
  };

  // Layout Helpers
  layout: {
    columns: number;
    gridGap: number;
    contentPadding: number;
    cardPadding: number;
  };

  // Quick Checks
  is: {
    smallScreen: boolean;
    mediumScreen: boolean;
    largeScreen: boolean;
    portrait: boolean;
    landscape: boolean;
  };
}

export const useMobileResponsive = (): MobileResponsiveHook => {
  const [screen, setScreen] = useState(Dimensions.get("window"));
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const listener = Dimensions.addEventListener("change", ({ window }) => {
      setScreen(window);
    });
    return () => listener?.remove();
  }, []);

  const { width, height } = screen;
  const isPortrait = height > width;
  const isLandscape = width > height;

  // Device Type Detection
  const getDeviceType = ():
    | "small-phone"
    | "phone"
    | "tablet"
    | "large-tablet"
    | "foldable" => {
    if (width <= 375) return "small-phone";
    if (width < 768) return "phone";
    if (width < 1024) return "tablet";
    if (width >= 1024) return "large-tablet";

    // Foldable detection
    if (width > 600 && height > 800 && isPortrait) return "foldable";
    return "phone";
  };

  const deviceType = getDeviceType();

  // Scaling Functions
  const getScaleMultiplier = () => {
    switch (deviceType) {
      case "small-phone":
        return 0.85;
      case "phone":
        return 1;
      case "tablet":
        return 1.2;
      case "large-tablet":
        return 1.4;
      case "foldable":
        return 1.1;
      default:
        return 1;
    }
  };

  const scale = getScaleMultiplier();

  // Layout Configuration
  const getLayoutConfig = () => {
    const baseColumns = isLandscape
      ? deviceType === "small-phone"
        ? 2
        : deviceType === "phone"
        ? 2
        : deviceType === "tablet"
        ? 3
        : 4
      : deviceType === "small-phone"
      ? 1
      : deviceType === "phone"
      ? 1
      : deviceType === "tablet"
      ? 2
      : 3;

    return {
      columns: baseColumns,
      gridGap: Math.round(12 * scale),
      contentPadding: Math.round(16 * scale),
      cardPadding: Math.round(14 * scale),
    };
  };

  return {
    device: {
      type: deviceType,
      isPortrait,
      isLandscape,
      width,
      height,
    },

    safe: {
      top: insets.top,
      bottom: insets.bottom,
      left: insets.left,
      right: insets.right,
    },

    scale: {
      space: (size: number) => Math.round(size * scale),
      font: (size: number) => Math.round(size * scale),
      radius: (size: number) => Math.round(size * scale),
      icon: (size: number) => Math.round(size * scale),
    },

    layout: getLayoutConfig(),

    is: {
      smallScreen: deviceType === "small-phone",
      mediumScreen: deviceType === "phone",
      largeScreen: ["tablet", "large-tablet", "foldable"].includes(deviceType),
      portrait: isPortrait,
      landscape: isLandscape,
    },
  };
};
