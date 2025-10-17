import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useApiPreloader } from "@/src/hooks/useApiPreloader";
import { useBehaviorTracking } from "@/src/hooks/useBehaviorTracking";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  website: string;
  company: {
    name: string;
  };
}

interface Album {
  id: number;
  title: string;
  userId: number;
}

interface ApiDataScreenProps {
  isLoading?: boolean;
}

export const ApiDataScreen: React.FC<ApiDataScreenProps> = ({
  isLoading = false,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const {
    prefetchApiData,
    getCachedData,
    loadingStates,
    loadTimes,
    clearApiCache,
    isDataCached,
    preloadAllApis,
  } = useApiPreloader();

  const { trackNavigation, predictNextScreen } = useBehaviorTracking();

  const [currentData, setCurrentData] = useState<any>(null);
  const [currentDataType, setCurrentDataType] = useState<string>("");
  const [userBehavior, setUserBehavior] = useState<string[]>([]);

  // Predictive preloading based on user behavior
  useEffect(() => {
    if (userBehavior.length >= 2) {
      const lastTwo = userBehavior.slice(-2);

      // If user viewed posts twice, preload comments
      if (lastTwo.every((action) => action === "posts")) {
        console.log(
          "🔮 Predictive: User viewed posts twice, preloading comments..."
        );
        prefetchApiData("/comments", "comments_cache");
      }

      // If user viewed posts then users, preload albums
      if (lastTwo[0] === "posts" && lastTwo[1] === "users") {
        console.log(
          "🔮 Predictive: Posts→Users pattern detected, preloading albums..."
        );
        prefetchApiData("/albums", "albums_cache");
      }

      // If user viewed users then albums, preload todos
      if (lastTwo[0] === "users" && lastTwo[1] === "albums") {
        console.log(
          "🔮 Predictive: Users→Albums pattern detected, preloading todos..."
        );
        prefetchApiData("/todos", "todos_cache");
      }
    }
  }, [userBehavior, prefetchApiData]);

  const loadData = async (
    endpoint: string,
    cacheKey: string,
    dataType: string
  ) => {
    const startTime = performance.now();

    console.log(`📱 User requested: ${dataType}`);

    // Track user behavior
    setUserBehavior((prev) => [...prev, dataType].slice(-10)); // Keep last 10 actions
    trackNavigation(`api-${dataType}`);

    // Check if data is already preloaded
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      setCurrentData(cachedData);
      setCurrentDataType(dataType);
      const loadTime = Math.round((performance.now() - startTime) * 100) / 100;
      console.log(`⚡ ${dataType} loaded from cache in ${loadTime}ms`);
      return;
    }

    // Load fresh data
    try {
      const data = await prefetchApiData(endpoint, cacheKey);
      setCurrentData(data);
      setCurrentDataType(dataType);
    } catch (error) {
      console.error(`❌ Failed to load ${dataType}:`, error);
    }
  };

  const renderDataItem = ({ item }: { item: any }) => (
    <ThemedView style={styles.dataItem}>
      <ThemedText style={styles.itemTitle}>
        {item.title || item.name || `Item ${item.id}`}
      </ThemedText>
      <ThemedText style={styles.itemContent}>
        {item.body ||
          item.email ||
          item.website ||
          item.company?.name ||
          "No content"}
      </ThemedText>
    </ThemedView>
  );

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.tint} />
        <ThemedText style={styles.loadingText}>Loading API Data...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">🌐 API Data Preloading</ThemedText>
          <ThemedText style={styles.subtitle}>
            Real-world JSONPlaceholder API performance optimization
          </ThemedText>
        </ThemedView>

        {/* Performance Metrics */}
        <ThemedView style={styles.metricsContainer}>
          <ThemedText type="subtitle" style={styles.metricsTitle}>
            📊 Load Times:
          </ThemedText>
          {Object.keys(loadTimes).length === 0 ? (
            <ThemedText style={styles.metricText}>
              No API calls made yet
            </ThemedText>
          ) : (
            Object.entries(loadTimes).map(([key, time]) => (
              <ThemedText key={key} style={styles.metricText}>
                {key.replace("_cache", "")}: {time}ms{" "}
                {isDataCached(key) ? "⚡ (Cached)" : "🌐 (Fresh)"}
              </ThemedText>
            ))
          )}
        </ThemedView>

        {/* Behavior Tracking */}
        <ThemedView style={styles.behaviorContainer}>
          <ThemedText type="subtitle" style={styles.behaviorTitle}>
            🧠 User Behavior:
          </ThemedText>
          <ThemedText style={styles.behaviorText}>
            {userBehavior.length === 0
              ? "No actions tracked yet"
              : `Recent: ${userBehavior.slice(-5).join(" → ")}`}
          </ThemedText>
        </ThemedView>

        {/* Preload Controls */}
        <ThemedView style={styles.controlsContainer}>
          <TouchableOpacity
            style={[styles.preloadButton, { backgroundColor: colors.tint }]}
            onPress={preloadAllApis}
          >
            <ThemedText style={styles.buttonText}>
              🚀 Preload All APIs
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.clearButton, { borderColor: colors.tint }]}
            onPress={clearApiCache}
          >
            <ThemedText style={[styles.buttonText, { color: colors.tint }]}>
              🗑️ Clear Cache
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Data Loading Buttons */}
        <ThemedView style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.dataButton, { backgroundColor: "#2196f3" }]}
            onPress={() => loadData("/posts", "posts_cache", "posts")}
            disabled={loadingStates.posts_cache}
          >
            <ThemedText style={styles.buttonText}>
              📝 Posts {loadingStates.posts_cache ? "⏳" : ""}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dataButton, { backgroundColor: "#4caf50" }]}
            onPress={() => loadData("/users", "users_cache", "users")}
            disabled={loadingStates.users_cache}
          >
            <ThemedText style={styles.buttonText}>
              👥 Users {loadingStates.users_cache ? "⏳" : ""}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dataButton, { backgroundColor: "#ff9800" }]}
            onPress={() => loadData("/albums", "albums_cache", "albums")}
            disabled={loadingStates.albums_cache}
          >
            <ThemedText style={styles.buttonText}>
              📚 Albums {loadingStates.albums_cache ? "⏳" : ""}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dataButton, { backgroundColor: "#9c27b0" }]}
            onPress={() => loadData("/comments", "comments_cache", "comments")}
            disabled={loadingStates.comments_cache}
          >
            <ThemedText style={styles.buttonText}>
              💬 Comments {loadingStates.comments_cache ? "⏳" : ""}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Data Display */}
        {currentData && (
          <ThemedView style={styles.dataContainer}>
            <ThemedText type="subtitle" style={styles.dataTitle}>
              {currentDataType.toUpperCase()} ({currentData.length} items)
              {isDataCached(`${currentDataType}_cache`)
                ? " ⚡ Preloaded"
                : " 🌐 Fresh Load"}
            </ThemedText>
            <FlatList
              data={currentData.slice(0, 10)} // Show first 10 items
              renderItem={renderDataItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.dataList}
              scrollEnabled={false}
            />
          </ThemedView>
        )}

        <ThemedView style={styles.infoBox}>
          <ThemedText type="subtitle">🎯 Demo Instructions</ThemedText>
          <ThemedText style={styles.infoText}>
            1.{" "}
            <ThemedText style={styles.bold}>
              Load data without preloading
            </ThemedText>{" "}
            → Notice API delays{"\n"}
            2. <ThemedText style={styles.bold}>Tap "Preload All"</ThemedText> →
            Cache all APIs{"\n"}
            3. <ThemedText style={styles.bold}>Load data again</ThemedText> →
            Experience instant loading!{"\n"}
            4. <ThemedText style={styles.bold}>Try patterns</ThemedText> → Posts
            → Posts (triggers comment preload)
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
    alignItems: "center",
    marginBottom: 20,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
  },
  metricsContainer: {
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  metricsTitle: {
    marginBottom: 10,
  },
  metricText: {
    fontSize: 12,
    marginBottom: 5,
    fontFamily: "monospace",
  },
  behaviorContainer: {
    backgroundColor: "rgba(156, 39, 176, 0.1)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  behaviorTitle: {
    marginBottom: 8,
  },
  behaviorText: {
    fontSize: 12,
    fontFamily: "monospace",
  },
  controlsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  preloadButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  clearButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  dataButton: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  dataContainer: {
    backgroundColor: "rgba(10, 126, 164, 0.05)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  dataTitle: {
    marginBottom: 15,
  },
  dataList: {
    maxHeight: 300,
  },
  dataItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemContent: {
    fontSize: 12,
    opacity: 0.7,
    lineHeight: 18,
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(33, 150, 243, 0.1)",
  },
  infoText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  bold: {
    fontWeight: "600",
  },
});
