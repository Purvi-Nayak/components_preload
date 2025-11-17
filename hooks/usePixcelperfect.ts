import { useCallback, useEffect, useState } from "react";
import { Dimensions, PixelRatio, Platform, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface PixelPerfectHook {
  // Device Information
  device: {
    width: number;
    height: number;
    type: DeviceType;
    category: DeviceCategory;
    orientation: "portrait" | "landscape";
    aspectRatio: number;
    pixelDensity: number;
    isNotched: boolean;
  };

  // Perfect Measurements
  screen: {
    usableWidth: number;
    usableHeight: number;
    safeWidth: number;
    safeHeight: number;
    statusBarHeight: number;
  };

  // Responsive Design System
  scale: {
    // Scaling functions with pixel-perfect rounding
    width: (percentage: number) => number;
    height: (percentage: number) => number;
    size: (baseSize: number) => number;
    font: (baseSize: number) => number;
    radius: (baseSize: number) => number;
    space: (baseSize: number) => number;
  };

  // Layout System
  layout: {
    columns: (maxColumns?: number) => number;
    grid: (itemCount: number, maxCols?: number) => GridLayout;
    container: ContainerLayout;
    card: CardLayout;
  };

  // Pixel Perfect Utilities
  perfect: {
    // Calculate exact dimensions with no sub-pixels
    itemWidth: (columns: number, gap: number, padding: number) => number;
    distribute: (
      totalSpace: number,
      items: number,
      minSize: number
    ) => number[];
    center: (containerSize: number, contentSize: number) => number;

    // Responsive breakpoint checker
    is: DeviceCheckers;

    // Advanced layout calculator
    flexGrid: (items: any[], options?: FlexGridOptions) => FlexGridResult;
  };

  // Event handlers
  onOrientationChange: (
    callback: (orientation: "portrait" | "landscape") => void
  ) => void;
}

type DeviceType =
  | "small-phone"
  | "phone"
  | "large-phone"
  | "small-tablet"
  | "tablet"
  | "large-tablet"
  | "foldable";
type DeviceCategory = "phone" | "tablet" | "foldable";

interface GridLayout {
  columns: number;
  itemWidth: number;
  gap: number;
  rows: number;
}

interface ContainerLayout {
  padding: number;
  margin: number;
  maxWidth: number;
}

interface CardLayout {
  padding: number;
  borderRadius: number;
  shadowRadius: number;
  elevation: number;
}

interface DeviceCheckers {
  smallPhone: boolean;
  phone: boolean;
  largePhone: boolean;
  tablet: boolean;
  largeTablet: boolean;
  foldable: boolean;
  portrait: boolean;
  landscape: boolean;
  compact: boolean;
  regular: boolean;
  large: boolean;
}

interface FlexGridOptions {
  maxColumns?: number;
  minItemWidth?: number;
  gap?: number;
  padding?: number;
}

interface FlexGridResult {
  columns: number;
  itemWidth: number;
  itemHeight?: number;
  gap: number;
  containerStyle: object;
  itemStyle: (index: number) => object;
}

export const usePixelPerfect = (): PixelPerfectHook => {
  // State management
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));
  const [orientationCallbacks, setOrientationCallbacks] = useState<
    Array<(orientation: "portrait" | "landscape") => void>
  >([]);
  const insets = useSafeAreaInsets();

  // Screen measurements
  const { width, height } = dimensions;
  const pixelDensity = PixelRatio.get();
  const isLandscape = width > height;
  const aspectRatio = Math.round((width / height) * 100) / 100;

  // Status bar height calculation
  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight || 0 : insets.top;

  // Detect notched devices
  const isNotched = insets.top > 20 || insets.bottom > 0;

  // Device type detection with precise breakpoints
  const getDeviceType = useCallback((): DeviceType => {
    if (width <= 375) return "small-phone";
    if (width <= 414) return "phone";
    if (width <= 480) return "large-phone";
    if (width <= 768) return "small-tablet";
    if (width <= 1024) return "tablet";
    if (width >= 1024) return "large-tablet";

    // Foldable detection (unfolded state)
    if (width > 600 && height > 800 && !isLandscape && aspectRatio > 0.7) {
      return "foldable";
    }

    return "phone";
  }, [width, height, isLandscape, aspectRatio]);

  const deviceType = getDeviceType();

  // Device category
  const deviceCategory: DeviceCategory = deviceType.includes("tablet")
    ? "tablet"
    : deviceType === "foldable"
    ? "foldable"
    : "phone";

  // Orientation change handler
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      const newOrientation =
        window.width > window.height ? "landscape" : "portrait";
      const oldOrientation =
        dimensions.width > dimensions.height ? "landscape" : "portrait";

      setDimensions(window);

      if (newOrientation !== oldOrientation) {
        orientationCallbacks.forEach((callback) => callback(newOrientation));
      }
    });

    return () => subscription?.remove();
  }, [dimensions, orientationCallbacks]);

  // Scaling system with pixel-perfect calculations
  const getScaleMultiplier = useCallback(() => {
    const baseScales = {
      "small-phone": 0.85,
      phone: 1.0,
      "large-phone": 1.1,
      "small-tablet": 1.2,
      tablet: 1.3,
      "large-tablet": 1.5,
      foldable: 1.15,
    };

    const baseScale = baseScales[deviceType];

    // Adjust for pixel density
    const densityMultiplier =
      pixelDensity > 2.5 ? 1.05 : pixelDensity > 2 ? 1.02 : 1;

    return baseScale * densityMultiplier;
  }, [deviceType, pixelDensity]);

  const scaleMultiplier = getScaleMultiplier();

  // Perfect scaling functions
  const scale = {
    width: (percentage: number): number =>
      Math.floor((width * percentage) / 100),

    height: (percentage: number): number =>
      Math.floor((height * percentage) / 100),

    size: (baseSize: number): number => Math.floor(baseSize * scaleMultiplier),

    font: (baseSize: number): number => Math.ceil(baseSize * scaleMultiplier),

    radius: (baseSize: number): number =>
      Math.floor(baseSize * scaleMultiplier),

    space: (baseSize: number): number => Math.floor(baseSize * scaleMultiplier),
  };

  // Usable screen dimensions
  const usableWidth = width;
  const usableHeight = height - statusBarHeight;
  const safeWidth = width - insets.left - insets.right;
  const safeHeight = height - insets.top - insets.bottom;

  // Dynamic layout system
  const layout = {
    columns: (maxColumns = 6): number => {
      const breakpoints = {
        "small-phone": { portrait: 1, landscape: 2 },
        phone: { portrait: 2, landscape: 3 },
        "large-phone": { portrait: 2, landscape: 3 },
        "small-tablet": { portrait: 2, landscape: 4 },
        tablet: { portrait: 3, landscape: 4 },
        "large-tablet": { portrait: 4, landscape: 6 },
        foldable: { portrait: 3, landscape: 4 },
      };

      const cols = isLandscape
        ? breakpoints[deviceType].landscape
        : breakpoints[deviceType].portrait;

      return Math.min(cols, maxColumns);
    },

    grid: (itemCount: number, maxCols = 6): GridLayout => {
      const columns = layout.columns(maxCols);
      const gap = scale.space(12);
      const padding = scale.space(16);

      const availableWidth = safeWidth - padding * 2;
      const totalGapWidth = gap * (columns - 1);
      const itemWidth = Math.floor((availableWidth - totalGapWidth) / columns);
      const rows = Math.ceil(itemCount / columns);

      return { columns, itemWidth, gap, rows };
    },

    container: {
      padding: scale.space(16),
      margin: scale.space(8),
      maxWidth: deviceCategory === "tablet" ? scale.width(90) : safeWidth,
    },

    card: {
      padding: scale.space(14),
      borderRadius: scale.radius(8),
      shadowRadius: scale.size(4),
      elevation: deviceCategory === "phone" ? 2 : 4,
    },
  };

  // Pixel perfect utilities
  const perfect = {
    itemWidth: (columns: number, gap: number, padding: number): number => {
      const availableWidth = safeWidth - padding * 2;
      const totalGapWidth = gap * (columns - 1);
      return Math.floor((availableWidth - totalGapWidth) / columns);
    },

    distribute: (
      totalSpace: number,
      items: number,
      minSize: number
    ): number[] => {
      const sizes: number[] = [];
      const availablePerItem = Math.floor(totalSpace / items);
      const actualSize = Math.max(availablePerItem, minSize);

      for (let i = 0; i < items; i++) {
        sizes.push(actualSize);
      }

      return sizes;
    },

    center: (containerSize: number, contentSize: number): number =>
      Math.floor((containerSize - contentSize) / 2),

    is: {
      smallPhone: deviceType === "small-phone",
      phone: deviceType === "phone",
      largePhone: deviceType === "large-phone",
      tablet: deviceCategory === "tablet",
      largeTablet: deviceType === "large-tablet",
      foldable: deviceType === "foldable",
      portrait: !isLandscape,
      landscape: isLandscape,
      compact: width < 768,
      regular: width >= 768 && width < 1024,
      large: width >= 1024,
    },

    flexGrid: (items: any[], options: FlexGridOptions = {}): FlexGridResult => {
      const {
        maxColumns = 6,
        minItemWidth = scale.size(120),
        gap = scale.space(12),
        padding = scale.space(16),
      } = options;

      const availableWidth = safeWidth - padding * 2;
      const maxPossibleColumns = Math.floor(
        (availableWidth + gap) / (minItemWidth + gap)
      );
      const columns = Math.min(maxPossibleColumns, maxColumns, items.length);

      const totalGapWidth = gap * (columns - 1);
      const itemWidth = Math.floor((availableWidth - totalGapWidth) / columns);

      return {
        columns,
        itemWidth,
        gap,
        containerStyle: {
          paddingHorizontal: padding,
          paddingTop: insets.top + scale.space(8),
          paddingBottom: insets.bottom + scale.space(8),
        },
        itemStyle: (index: number) => ({
          width: itemWidth,
          marginRight: (index + 1) % columns === 0 ? 0 : gap,
          marginBottom: gap,
        }),
      };
    },
  };

  // Orientation change handler
  const onOrientationChange = useCallback(
    (callback: (orientation: "portrait" | "landscape") => void) => {
      setOrientationCallbacks((prev) => [...prev, callback]);
    },
    []
  );

  return {
    device: {
      width,
      height,
      type: deviceType,
      category: deviceCategory,
      orientation: isLandscape ? "landscape" : "portrait",
      aspectRatio,
      pixelDensity,
      isNotched,
    },

    screen: {
      usableWidth,
      usableHeight,
      safeWidth,
      safeHeight,
      statusBarHeight,
    },

    scale,
    layout,
    perfect,
    onOrientationChange,
  };
};
