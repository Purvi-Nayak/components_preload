import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Asset } from "expo-asset";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  ImageStyle,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { analytics } from "../utils/analytics";
import { imageCache } from "../utils/imageCache";
import { performanceMonitor } from "../utils/performanceMonitor";

interface GalleryItem {
  id: number;
  uri: string;
  title: string;
}

interface Metrics {
  [key: string]: number;
}

export default function GalleryScreen(): React.JSX.Element {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [preloadedImages, setPreloadedImages] = useState<Set<number>>(
    new Set()
  );
  const [isPreloading, setIsPreloading] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<Metrics>({});
  const navigationHistoryRef = useRef<string[]>([]);

  // Gallery images
  const galleryData: GalleryItem[] = [
    { id: 1, uri: "https://picsum.photos/400/300?random=1", title: "Sunset" },
    {
      id: 2,
      uri: "https://picsum.photos/400/300?random=2",
      title: "Mountains",
    },
    { id: 3, uri: "https://picsum.photos/400/300?random=3", title: "Ocean" },
    { id: 4, uri: "https://picsum.photos/400/300?random=4", title: "Forest" },
    { id: 5, uri: "https://picsum.photos/400/300?random=7", title: "City" },
    { id: 6, uri: "https://picsum.photos/400/300?random=6", title: "Desert" },
  ];

  // Predictive preloading based on navigation pattern
  const predictivePreload = async (): Promise<void> => {
    const history = navigationHistoryRef.current;

    if (
      history.length >= 2 &&
      history[history.length - 1] === "Gallery" &&
      history[history.length - 2] === "Gallery"
    ) {
      console.log(
        "🔮 Predictive: User likely to visit Profile next, preloading..."
      );

      const profileAssets: string[] = [
        "https://picsum.photos/400/400?random=100",
        "https://picsum.photos/400/300?random=101",
      ];

      try {
        const measurementId = performanceMonitor.startMeasurement(
          "predictive-profile-preload"
        );

        await Promise.all(
          profileAssets.map((uri) => Asset.fromURI(uri).downloadAsync())
        );

        const duration = performanceMonitor.endMeasurement(measurementId);

        if (duration) {
          analytics.recordPreload(duration);
        }

        console.log("✅ Profile assets preloaded successfully");
      } catch (error) {
        console.error("❌ Profile asset preloading failed:", error);
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const startTime = Date.now();

      navigationHistoryRef.current.push("Gallery");
      predictivePreload();

      // Record screen load time
      analytics.recordScreenLoad("Gallery", Date.now() - startTime);

      return () => {};
    }, [])
  );

  const preloadNextBatch = async (
    startIndex: number = 0,
    batchSize: number = 3
  ): Promise<void> => {
    setIsPreloading(true);
    const measurementId = performanceMonitor.startMeasurement(
      `gallery-batch-${startIndex}`
    );

    const batch = galleryData.slice(startIndex, startIndex + batchSize);

    try {
      const results = await imageCache.preloadImages(
        batch.map((item) => item.uri),
        "medium"
      );

      results.forEach((success, index) => {
        if (success) {
          setPreloadedImages((prev) => new Set([...prev, batch[index].id]));
        }
      });

      const duration = performanceMonitor.endMeasurement(measurementId);

      if (duration) {
        setMetrics((prev) => ({
          ...prev,
          [`batch_${startIndex}`]: duration,
        }));
      }

      console.log(
        `✅ Preloaded batch ${startIndex}-${
          startIndex + batchSize
        } in ${duration}ms`
      );
    } catch (error) {
      performanceMonitor.endMeasurement(measurementId);
      console.error("Preloading failed:", error);
    } finally {
      setIsPreloading(false);
    }
  };

  const handleImageLoad = (imageId: number) => {
    const startTime = Date.now();

    return () => {
      const loadTime = Date.now() - startTime;
      setMetrics((prev) => ({
        ...prev,
        [`image_${imageId}`]: loadTime,
      }));
      analytics.recordScreenLoad("GalleryImage", loadTime);
    };
  };

  const handlePreloadAll = async (): Promise<void> => {
    if (isPreloading) return;

    const measurementId = performanceMonitor.startMeasurement(
      "gallery-preload-all"
    );
    setIsPreloading(true);

    try {
      const uris = galleryData.map((item) => item.uri);
      const results = await imageCache.preloadImages(uris, "high");

      results.forEach((success, index) => {
        if (success) {
          setPreloadedImages(
            (prev) => new Set([...prev, galleryData[index].id])
          );
        }
      });

      const duration = performanceMonitor.endMeasurement(measurementId);
      console.log(`✅ Preloaded all images in ${duration}ms`);
    } catch (error) {
      performanceMonitor.endMeasurement(measurementId);
      console.error("Failed to preload all images:", error);
    } finally {
      setIsPreloading(false);
    }
  };

  useEffect(() => {
    setImages(galleryData);
    preloadNextBatch(0, 3);

    const timer = setTimeout(() => {
      preloadNextBatch(3, 3);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="images" size={30} color="#2196F3" />
        <Text style={styles.title}>Gallery with Predictive Loading</Text>
      </View>

      <View style={styles.statusBar}>
        <View style={styles.statusItem}>
          <Ionicons
            name={isPreloading ? "cloud-download" : "checkmark-circle"}
            size={20}
            color={isPreloading ? "#FF9800" : "#4CAF50"}
          />
          <Text style={styles.statusText}>
            {isPreloading
              ? "Preloading..."
              : `${preloadedImages.size}/${galleryData.length} Preloaded`}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.preloadButton,
            isPreloading && styles.preloadButtonDisabled,
          ]}
          onPress={handlePreloadAll}
          disabled={isPreloading}
        >
          <Text style={styles.preloadButtonText}>
            {isPreloading ? "Loading..." : "Preload All"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color="#2196F3" />
        <Text style={styles.infoText}>
          Visit this screen twice, then navigate to Profile. Profile assets will
          be preloaded!
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.grid}>
          {images.map((item) => (
            <View key={item.id} style={styles.imageCard}>
              <Image
                source={{ uri: item.uri }}
                style={styles.image}
                onLoad={handleImageLoad(item.id)}
              />

              {preloadedImages.has(item.id) && (
                <View style={styles.preloadBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.badgeText}>Cached</Text>
                </View>
              )}

              <View style={styles.imageInfo}>
                <Text style={styles.imageTitle}>{item.title}</Text>
                {metrics[`image_${item.id}`] && (
                  <Text style={styles.loadTime}>
                    {metrics[`image_${item.id}`]}ms
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.metricsSection}>
          <Text style={styles.metricsTitle}>Load Performance Metrics</Text>
          {Object.entries(metrics).map(([key, value]) => (
            <View key={key} style={styles.metricRow}>
              <Text style={styles.metricKey}>{key}:</Text>
              <Text style={styles.metricValue}>{value}ms</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  } as ViewStyle,
  header: {
    backgroundColor: "#fff",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  } as ViewStyle,
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  } as TextStyle,
  statusBar: {
    backgroundColor: "#fff",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  } as ViewStyle,
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,
  statusText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
    fontWeight: "500",
  } as TextStyle,
  preloadButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  } as ViewStyle,
  preloadButtonDisabled: {
    backgroundColor: "#999",
  } as ViewStyle,
  preloadButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  } as TextStyle,
  infoBox: {
    backgroundColor: "#E3F2FD",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 8,
  } as ViewStyle,
  infoText: {
    fontSize: 12,
    color: "#1976D2",
    marginLeft: 8,
    flex: 1,
  } as TextStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 15,
    justifyContent: "space-between",
  } as ViewStyle,
  imageCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  } as ViewStyle,
  image: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  } as ImageStyle,
  preloadBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(76, 175, 80, 0.9)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  } as ViewStyle,
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 2,
  } as TextStyle,
  imageInfo: {
    padding: 10,
  } as ViewStyle,
  imageTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  } as TextStyle,
  loadTime: {
    fontSize: 10,
    color: "#666",
  } as TextStyle,
  metricsSection: {
    margin: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  } as ViewStyle,
  metricsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  } as TextStyle,
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  } as ViewStyle,
  metricKey: {
    fontSize: 12,
    color: "#666",
  } as TextStyle,
  metricValue: {
    fontSize: 12,
    color: "#2196F3",
    fontWeight: "bold",
  } as TextStyle,
});
