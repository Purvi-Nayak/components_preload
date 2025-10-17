import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Image } from "expo-image";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";

interface DashboardScreenProps {
  isLoading?: boolean;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  isLoading = false,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.tint} />
        <ThemedText style={styles.loadingText}>Loading Dashboard...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">📊 Analytics Dashboard</ThemedText>
          <ThemedText style={styles.subtitle}>
            Performance insights and metrics overview
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.metricsGrid}>
          <ThemedView style={styles.metricCard}>
            <ThemedText style={styles.metricValue}>95%</ThemedText>
            <ThemedText style={styles.metricLabel}>Performance</ThemedText>
          </ThemedView>
          <ThemedView style={styles.metricCard}>
            <ThemedText style={styles.metricValue}>1.2s</ThemedText>
            <ThemedText style={styles.metricLabel}>Load Time</ThemedText>
          </ThemedView>
          <ThemedView style={styles.metricCard}>
            <ThemedText style={styles.metricValue}>847</ThemedText>
            <ThemedText style={styles.metricLabel}>Users</ThemedText>
          </ThemedView>
          <ThemedView style={styles.metricCard}>
            <ThemedText style={styles.metricValue}>42%</ThemedText>
            <ThemedText style={styles.metricLabel}>Improvement</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.chartContainer}>
          <ThemedText type="subtitle">📈 Performance Trends</ThemedText>
          <Image
            source={{ uri: "https://picsum.photos/400/300?random=3" }}
            style={styles.chartImage}
            contentFit="cover"
            transition={300}
          />
          <ThemedText style={styles.chartCaption}>
            Weekly performance metrics showing consistent improvement
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">🎯 Key Insights</ThemedText>
          <ThemedView style={styles.insightsList}>
            <ThemedView style={styles.insightItem}>
              <ThemedText style={styles.insightIcon}>⚡</ThemedText>
              <ThemedText style={styles.insightText}>
                Preloading reduced average load time by 70%
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.insightItem}>
              <ThemedText style={styles.insightIcon}>🚀</ThemedText>
              <ThemedText style={styles.insightText}>
                User engagement increased by 42% with faster navigation
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.insightItem}>
              <ThemedText style={styles.insightIcon}>📱</ThemedText>
              <ThemedText style={styles.insightText}>
                Predictive loading achieved 89% accuracy rate
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.infoBox}>
          <ThemedText type="subtitle">🔮 Predictive Loading</ThemedText>
          <ThemedText style={styles.infoText}>
            This dashboard was intelligently preloaded based on your navigation
            patterns. Machine learning algorithms predict your next actions for
            seamless UX.
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 30,
  },
  metricCard: {
    flex: 1,
    minWidth: "45%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(10, 126, 164, 0.1)",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  metricLabel: {
    marginTop: 4,
    fontSize: 12,
    opacity: 0.7,
  },
  chartContainer: {
    marginBottom: 30,
  },
  chartImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 8,
  },
  chartCaption: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  insightsList: {
    marginTop: 12,
    gap: 12,
  },
  insightItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(10, 126, 164, 0.05)",
  },
  insightIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(156, 39, 176, 0.1)",
    marginTop: 20,
  },
  infoText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
});
