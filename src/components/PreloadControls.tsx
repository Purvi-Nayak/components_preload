import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";

interface PreloadStatus {
  [key: string]: "loading" | "loaded" | "failed" | "not-loaded";
}

interface PreloadControlsProps {
  preloadStatus: PreloadStatus;
  isPreloading: boolean;
  onPreloadAll: () => void;
  onClearCache: () => void;
}

export const PreloadControls: React.FC<PreloadControlsProps> = ({
  preloadStatus,
  isPreloading,
  onPreloadAll,
  onClearCache,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "loaded":
        return "#4CAF50";
      case "loading":
        return "#FF9800";
      case "failed":
        return "#F44336";
      default:
        return colors.icon;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "loaded":
        return "✅";
      case "loading":
        return "⏳";
      case "failed":
        return "❌";
      default:
        return "⚪";
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        🎛️ Preload Controls
      </ThemedText>

      <ThemedView style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={onPreloadAll}
          disabled={isPreloading}
        >
          {isPreloading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <ThemedText style={styles.buttonText}>🚀 Preload All</ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={onClearCache}
          disabled={isPreloading}
        >
          <ThemedText style={[styles.buttonText, { color: colors.text }]}>
            🗑️ Clear Cache
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.statusContainer}>
        <ThemedText style={styles.statusTitle}>📊 Preload Status:</ThemedText>
        {["gallery", "profile", "dashboard", "settings"].map((screen) => (
          <ThemedView key={screen} style={styles.statusRow}>
            <ThemedText style={styles.statusIcon}>
              {getStatusIcon(preloadStatus[screen] || "not-loaded")}
            </ThemedText>
            <ThemedText style={styles.statusLabel}>
              {screen.charAt(0).toUpperCase() + screen.slice(1)}:
            </ThemedText>
            <ThemedText
              style={[
                styles.statusValue,
                {
                  color: getStatusColor(preloadStatus[screen] || "not-loaded"),
                },
              ]}
            >
              {preloadStatus[screen] || "not loaded"}
            </ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(10, 126, 164, 0.05)",
    marginVertical: 8,
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  primaryButton: {
    backgroundColor: "#2196F3",
  },
  secondaryButton: {
    backgroundColor: "rgba(10, 126, 164, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(10, 126, 164, 0.3)",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  statusContainer: {
    gap: 8,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  statusIcon: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
  },
  statusLabel: {
    fontSize: 14,
    flex: 1,
  },
  statusValue: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
