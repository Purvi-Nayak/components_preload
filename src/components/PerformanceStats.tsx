import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet } from "react-native";

interface PerformanceStatsProps {
  currentLoadTime: number | null;
  lastScreen: string;
  wasPreloaded: boolean;
  totalNavigations: number;
  averagePreloadedTime: number;
  averageNonPreloadedTime: number;
  performanceImprovement: number;
}

export const PerformanceStats: React.FC<PerformanceStatsProps> = ({
  currentLoadTime,
  lastScreen,
  wasPreloaded,
  totalNavigations,
  averagePreloadedTime,
  averageNonPreloadedTime,
  performanceImprovement,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        ⚡ Performance Metrics
      </ThemedText>

      {currentLoadTime !== null && (
        <ThemedView style={styles.currentLoadContainer}>
          <ThemedView style={styles.loadTimeRow}>
            <ThemedText style={styles.loadTimeLabel}>
              Last Load Time:
            </ThemedText>
            <ThemedText
              style={[
                styles.loadTimeValue,
                { color: wasPreloaded ? "#4CAF50" : "#FF9800" },
              ]}
            >
              {currentLoadTime}ms
            </ThemedText>
            <ThemedText style={styles.loadTimeStatus}>
              {wasPreloaded ? "⚡ Preloaded" : "🐌 Not Preloaded"}
            </ThemedText>
          </ThemedView>
          <ThemedText style={styles.loadTimeScreen}>
            Screen: {lastScreen.charAt(0).toUpperCase() + lastScreen.slice(1)}
          </ThemedText>
        </ThemedView>
      )}

      <ThemedView style={styles.statsGrid}>
        <ThemedView style={styles.statCard}>
          <ThemedText style={styles.statValue}>{totalNavigations}</ThemedText>
          <ThemedText style={styles.statLabel}>Total Navigations</ThemedText>
        </ThemedView>

        <ThemedView style={styles.statCard}>
          <ThemedText style={[styles.statValue, { color: "#4CAF50" }]}>
            {averagePreloadedTime}ms
          </ThemedText>
          <ThemedText style={styles.statLabel}>Avg Preloaded</ThemedText>
        </ThemedView>

        <ThemedView style={styles.statCard}>
          <ThemedText style={[styles.statValue, { color: "#FF9800" }]}>
            {averageNonPreloadedTime}ms
          </ThemedText>
          <ThemedText style={styles.statLabel}>Avg Regular</ThemedText>
        </ThemedView>

        <ThemedView style={styles.statCard}>
          <ThemedText style={[styles.statValue, { color: "#2196F3" }]}>
            {performanceImprovement}%
          </ThemedText>
          <ThemedText style={styles.statLabel}>Improvement</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.insightContainer}>
        <ThemedText style={styles.insightTitle}>💡 Insights</ThemedText>
        {performanceImprovement > 0 ? (
          <ThemedText style={styles.insightText}>
            Preloading is working! You're saving an average of{" "}
            {performanceImprovement}% on load times.
          </ThemedText>
        ) : (
          <ThemedText style={styles.insightText}>
            Navigate between screens to see preloading benefits in action.
          </ThemedText>
        )}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(76, 175, 80, 0.05)",
    marginVertical: 8,
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  currentLoadContainer: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginBottom: 16,
  },
  loadTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  loadTimeLabel: {
    fontSize: 14,
    flex: 1,
  },
  loadTimeValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  loadTimeStatus: {
    fontSize: 12,
  },
  loadTimeScreen: {
    fontSize: 12,
    opacity: 0.7,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 10,
    opacity: 0.7,
    textAlign: "center",
    marginTop: 2,
  },
  insightContainer: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(33, 150, 243, 0.1)",
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  insightText: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.8,
  },
});
