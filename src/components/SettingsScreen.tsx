import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Image } from "expo-image";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";

interface SettingsScreenProps {
  isLoading?: boolean;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  isLoading = false,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.tint} />
        <ThemedText style={styles.loadingText}>Loading Settings...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">⚙️ App Settings</ThemedText>
          <ThemedText style={styles.subtitle}>
            Customize your preloading preferences
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">🚀 Preloading Options</ThemedText>
          <ThemedView style={styles.optionsList}>
            <ThemedView style={styles.optionItem}>
              <ThemedView style={styles.optionContent}>
                <ThemedText style={styles.optionTitle}>Auto Preload</ThemedText>
                <ThemedText style={styles.optionDescription}>
                  Automatically preload content based on your usage patterns
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.toggle}>
                <ThemedText style={styles.toggleText}>ON</ThemedText>
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.optionItem}>
              <ThemedView style={styles.optionContent}>
                <ThemedText style={styles.optionTitle}>WiFi Only</ThemedText>
                <ThemedText style={styles.optionDescription}>
                  Only preload when connected to WiFi to save mobile data
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.toggle}>
                <ThemedText style={styles.toggleText}>ON</ThemedText>
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.optionItem}>
              <ThemedView style={styles.optionContent}>
                <ThemedText style={styles.optionTitle}>
                  Predictive Learning
                </ThemedText>
                <ThemedText style={styles.optionDescription}>
                  Learn from your behavior to improve preloading accuracy
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.toggle}>
                <ThemedText style={styles.toggleText}>ON</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">📊 Performance Stats</ThemedText>
          <ThemedView style={styles.statsGrid}>
            <ThemedView style={styles.statCard}>
              <ThemedText style={styles.statValue}>127</ThemedText>
              <ThemedText style={styles.statLabel}>Assets Preloaded</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statCard}>
              <ThemedText style={styles.statValue}>42%</ThemedText>
              <ThemedText style={styles.statLabel}>Time Saved</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">🔧 Advanced</ThemedText>
          <ThemedView style={styles.advancedContainer}>
            <Image
              source={{ uri: "https://picsum.photos/400/300?random=4" }}
              style={styles.advancedImage}
              contentFit="cover"
              transition={300}
            />
            <ThemedText style={styles.advancedText}>
              Fine-tune preloading algorithms and caching strategies for optimal
              performance.
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.infoBox}>
          <ThemedText type="subtitle">💡 Did You Know?</ThemedText>
          <ThemedText style={styles.infoText}>
            This settings screen was also preloaded! The app predicted you'd
            visit settings after checking the dashboard, showcasing intelligent
            navigation patterns.
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
  section: {
    marginBottom: 30,
  },
  optionsList: {
    marginTop: 12,
    gap: 12,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(10, 126, 164, 0.05)",
  },
  optionContent: {
    flex: 1,
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 12,
    opacity: 0.7,
    lineHeight: 16,
  },
  toggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(76, 175, 80, 0.2)",
  },
  toggleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4CAF50",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 152, 0, 0.1)",
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
  advancedContainer: {
    marginTop: 12,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(10, 126, 164, 0.05)",
  },
  advancedImage: {
    width: "100%",
    height: 150,
  },
  advancedText: {
    padding: 16,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 193, 7, 0.1)",
    marginTop: 20,
  },
  infoText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
});
