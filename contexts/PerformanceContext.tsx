import { createContext } from "react";

// Types
export type PreloadStatus = "pending" | "loading" | "loaded" | "failed";

export interface PreloadStatusState {
  fonts: PreloadStatus;
  localAssets: PreloadStatus;
  remoteAssets: PreloadStatus;
  criticalData: PreloadStatus;
}

export interface PerformanceMetrics {
  [key: string]: number;
}

export interface PerformanceContextType {
  addMetric: (key: string, value: number) => void;
  metrics: PerformanceMetrics;
  preloadStatus: PreloadStatusState;
}

// Performance monitoring context
export const PerformanceContext = createContext<PerformanceContextType>({
  addMetric: () => {},
  metrics: {},
  preloadStatus: {
    fonts: "pending",
    localAssets: "pending",
    remoteAssets: "pending",
    criticalData: "pending",
  },
});
