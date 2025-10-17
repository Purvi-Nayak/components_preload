import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Image } from "expo-image";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";

interface GalleryScreenProps {
  isLoading?: boolean;
}

export const GalleryScreen: React.FC<GalleryScreenProps> = ({
  isLoading = false,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.tint} />
        <ThemedText style={styles.loadingText}>Loading Gallery...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">📸 Photo Gallery</ThemedText>
          <ThemedText style={styles.subtitle}>
            Explore beautiful images from around the world
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.imageGrid}>
          <ThemedView style={styles.imageContainer}>
            <Image
              source={{ uri: "https://picsum.photos/1200/800?random=1" }}
              style={styles.image}
              contentFit="cover"
              transition={300}
              onLoad={() => console.log("🖼️ Gallery image 1 loaded")}
              onError={(error) =>
                console.error("❌ Gallery image 1 failed:", error)
              }
            />
            <ThemedText style={styles.imageCaption}>
              Nature Landscape (1.2MB)
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.imageContainer}>
            <Image
              source={{ uri: "https://picsum.photos/1200/800?random=5" }}
              style={styles.image}
              contentFit="cover"
              transition={300}
              onLoad={() => console.log("🖼️ Gallery image 2 loaded")}
              onError={(error) =>
                console.error("❌ Gallery image 2 failed:", error)
              }
            />
            <ThemedText style={styles.imageCaption}>
              Urban Architecture (1.2MB)
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.imageContainer}>
            <Image
              source={{ uri: "https://picsum.photos/1200/800?random=6" }}
              style={styles.image}
              contentFit="cover"
              transition={300}
              onLoad={() => console.log("🖼️ Gallery image 3 loaded")}
              onError={(error) =>
                console.error("❌ Gallery image 3 failed:", error)
              }
            />
            <ThemedText style={styles.imageCaption}>
              Abstract Art (1.2MB)
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.infoBox}>
          <ThemedText type="subtitle">🚀 REAL Performance Test</ThemedText>
          <ThemedText style={styles.infoText}>
            These are 1200×800px images (~1.2MB each) loaded from remote
            servers.
            {"\n\n"}⚡ When preloaded: Images load instantly from cache
            {"\n"}
            🐌 When not preloaded: Images download from internet
            {"\n\n"}
            📊 Check console logs to see REAL load times without artificial
            delays!
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
  imageGrid: {
    gap: 20,
    marginBottom: 30,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 200,
  },
  imageCaption: {
    padding: 12,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(10, 126, 164, 0.1)",
    marginTop: 20,
  },
  infoText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
});
