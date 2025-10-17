import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet } from "react-native";

interface BehaviorInsightsProps {
  userBehavior: string[];
  mostVisited: string;
  commonPatterns: { pattern: string; count: number }[];
  navigationCount: number;
  predictedNext: string | null;
}

export const BehaviorInsights: React.FC<BehaviorInsightsProps> = ({
  userBehavior,
  mostVisited,
  commonPatterns,
  navigationCount,
  predictedNext,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        🧠 Behavior Analytics
      </ThemedText>

      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Recent Navigation:</ThemedText>
        <ThemedView style={styles.breadcrumbs}>
          {userBehavior.slice(-5).map((screen, index) => (
            <React.Fragment key={index}>
              <ThemedText style={styles.breadcrumb}>
                {screen.charAt(0).toUpperCase() + screen.slice(1)}
              </ThemedText>
              {index < userBehavior.slice(-5).length - 1 && (
                <ThemedText style={styles.arrow}>→</ThemedText>
              )}
            </React.Fragment>
          ))}
        </ThemedView>
      </ThemedView>

      {predictedNext && (
        <ThemedView style={styles.predictionContainer}>
          <ThemedText style={styles.predictionIcon}>🔮</ThemedText>
          <ThemedView style={styles.predictionContent}>
            <ThemedText style={styles.predictionTitle}>
              Next Prediction:
            </ThemedText>
            <ThemedText style={styles.predictionValue}>
              {predictedNext.charAt(0).toUpperCase() + predictedNext.slice(1)}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      )}

      <ThemedView style={styles.statsContainer}>
        <ThemedView style={styles.statItem}>
          <ThemedText style={styles.statLabel}>Most Visited:</ThemedText>
          <ThemedText style={styles.statValue}>
            {mostVisited
              ? mostVisited.charAt(0).toUpperCase() + mostVisited.slice(1)
              : "None"}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.statItem}>
          <ThemedText style={styles.statLabel}>Total Navigations:</ThemedText>
          <ThemedText style={styles.statValue}>{navigationCount}</ThemedText>
        </ThemedView>
      </ThemedView>

      {commonPatterns.length > 0 && (
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Common Patterns:</ThemedText>
          {commonPatterns.slice(0, 3).map((pattern, index) => (
            <ThemedView key={index} style={styles.patternItem}>
              <ThemedText style={styles.patternText}>
                {pattern.pattern}
              </ThemedText>
              <ThemedText style={styles.patternCount}>
                ×{pattern.count}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      )}

      <ThemedView style={styles.infoContainer}>
        <ThemedText style={styles.infoText}>
          💡 The system learns from your navigation patterns to predict and
          preload content intelligently.
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(156, 39, 176, 0.05)",
    marginVertical: 8,
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  breadcrumbs: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  breadcrumb: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(156, 39, 176, 0.2)",
    marginHorizontal: 2,
  },
  arrow: {
    fontSize: 12,
    marginHorizontal: 4,
    opacity: 0.6,
  },
  predictionContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255, 193, 7, 0.2)",
    marginBottom: 16,
  },
  predictionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  predictionContent: {
    flex: 1,
  },
  predictionTitle: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 2,
  },
  predictionValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    padding: 8,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  patternItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginBottom: 4,
  },
  patternText: {
    fontSize: 12,
    flex: 1,
  },
  patternCount: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.7,
  },
  infoContainer: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(156, 39, 176, 0.1)",
  },
  infoText: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.8,
    textAlign: "center",
  },
});
