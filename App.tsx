import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

// Import contexts
import {
  PerformanceContext,
  PerformanceMetrics,
  PreloadStatus,
  PreloadStatusState,
} from "./contexts/PerformanceContext";

// Import screens
import DashboardScreen from "./screens/DashboardScreen";
import GalleryScreen from "./screens/GalleryScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";

// Import utilities
import { networkAwarePreloader } from "./utils/networkAwarePreload";
import { performanceMonitor } from "./utils/performanceMonitor";
import { storage } from "./utils/storage";

const Tab = createBottomTabNavigator();

export default function App(): React.JSX.Element {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [preloadStatus, setPreloadStatus] = useState<PreloadStatusState>({
    fonts: "pending",
    localAssets: "pending",
    remoteAssets: "pending",
    criticalData: "pending",
  });

  // Add performance metric
  const addMetric = useCallback((key: string, value: number) => {
    setMetrics((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Preload fonts
  const loadFonts = async (): Promise<boolean> => {
    const measurementId = performanceMonitor.startMeasurement("fonts-load");
    setPreloadStatus((prev) => ({ ...prev, fonts: "loading" }));

    try {
      await Font.loadAsync({
        ...Ionicons.font,
        // Add custom fonts here if you have them
        // 'CustomFont-Regular': require('./assets/fonts/CustomFont-Regular.ttf'),
        // 'CustomFont-Bold': require('./assets/fonts/CustomFont-Bold.ttf'),
      });

      const loadTime = performanceMonitor.endMeasurement(measurementId) || 0;
      addMetric("fontLoadTime", loadTime);
      setPreloadStatus((prev) => ({ ...prev, fonts: "loaded" }));
      setLoadingProgress((prev) => prev + 25);

      return true;
    } catch (error) {
      console.error("Font loading failed:", error);
      performanceMonitor.endMeasurement(measurementId);
      setPreloadStatus((prev) => ({ ...prev, fonts: "failed" }));
      return false;
    }
  };

  // Preload local assets (bundled with app)
  const loadLocalAssets = async (): Promise<boolean> => {
    const measurementId =
      performanceMonitor.startMeasurement("local-assets-load");
    setPreloadStatus((prev) => ({ ...prev, localAssets: "loading" }));

    try {
      // Preload local images that are bundled with the app
      // Replace with your actual local assets
      const localAssets: any[] = [
        // require('./assets/images/icon.png'),
        // require('./assets/images/splash-icon.png'),
        // Add more local assets here
      ];

      if (localAssets.length > 0) {
        await Asset.loadAsync(localAssets);
      }

      const loadTime = performanceMonitor.endMeasurement(measurementId) || 0;
      addMetric("localAssetsLoadTime", loadTime);
      setPreloadStatus((prev) => ({ ...prev, localAssets: "loaded" }));
      setLoadingProgress((prev) => prev + 25);

      return true;
    } catch (error) {
      console.error("Local asset loading failed:", error);
      performanceMonitor.endMeasurement(measurementId);
      setPreloadStatus((prev) => ({ ...prev, localAssets: "failed" }));
      return false;
    }
  };

  // Preload remote assets (from network)
  const loadRemoteAssets = async (): Promise<boolean> => {
    const measurementId =
      performanceMonitor.startMeasurement("remote-assets-load");
    setPreloadStatus((prev) => ({ ...prev, remoteAssets: "loading" }));

    try {
      // Preload remote images that will be used frequently
      const remoteImages: string[] = [
        "https://picsum.photos/400/300?random=1",
        "https://picsum.photos/400/300?random=2",
        "https://picsum.photos/400/300?random=3",
      ];

      await networkAwarePreloader.intelligentPreload(remoteImages, "high");

      const loadTime = performanceMonitor.endMeasurement(measurementId) || 0;
      addMetric("remoteAssetsLoadTime", loadTime);
      setPreloadStatus((prev) => ({ ...prev, remoteAssets: "loaded" }));
      setLoadingProgress((prev) => prev + 25);

      return true;
    } catch (error) {
      console.error("Remote asset loading failed:", error);
      performanceMonitor.endMeasurement(measurementId);
      setPreloadStatus((prev) => ({ ...prev, remoteAssets: "failed" }));
      return false;
    }
  };

  // Preload critical data (API calls, AsyncStorage, etc.)
  const loadCriticalData = async (): Promise<boolean> => {
    const measurementId =
      performanceMonitor.startMeasurement("critical-data-load");
    setPreloadStatus((prev) => ({ ...prev, criticalData: "loading" }));

    try {
      // Load user preferences and app configuration
      await Promise.all([
        storage.loadUserPreferences(),
        storage.loadAppConfig(),
        storage.loadNavigationHistory(),
      ]);

      const loadTime = performanceMonitor.endMeasurement(measurementId) || 0;
      addMetric("criticalDataLoadTime", loadTime);
      setPreloadStatus((prev) => ({ ...prev, criticalData: "loaded" }));
      setLoadingProgress((prev) => prev + 25);

      return true;
    } catch (error) {
      console.error("Critical data loading failed:", error);
      performanceMonitor.endMeasurement(measurementId);
      setPreloadStatus((prev) => ({ ...prev, criticalData: "failed" }));
      return false;
    }
  };

  // Main initialization function
  const initializeApp = async (): Promise<void> => {
    const totalMeasurementId =
      performanceMonitor.startMeasurement("app-initialization");

    try {
      // Load critical resources first (fonts and local assets)
      await Promise.all([loadFonts(), loadLocalAssets()]);

      // Then load non-critical resources in parallel
      await Promise.all([loadRemoteAssets(), loadCriticalData()]);

      const totalLoadTime =
        performanceMonitor.endMeasurement(totalMeasurementId) || 0;
      addMetric("totalLoadTime", totalLoadTime);

      // Small delay to show the splash screen
      await new Promise((resolve) => setTimeout(resolve, 500));

      setIsReady(true);

      console.log("🚀 App initialization completed successfully");
      performanceMonitor.logSummary();
    } catch (error) {
      console.error("App initialization failed:", error);
      performanceMonitor.endMeasurement(totalMeasurementId);
      // In production, you might want to show an error screen
      setIsReady(true); // Still proceed to app
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  // Loading screen
  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#2196F3" />

        <View style={styles.logoContainer}>
          <Ionicons name="flash" size={80} color="#2196F3" />
          <Text style={styles.appName}>Performance Demo</Text>
          <Text style={styles.appSubtitle}>Predictive Asset Preloading</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${loadingProgress}%` }]}
            />
          </View>
          <Text style={styles.progressText}>{loadingProgress}% loaded</Text>
        </View>

        <View style={styles.statusContainer}>
          <StatusItem label="Fonts" status={preloadStatus.fonts} />
          <StatusItem label="Local Assets" status={preloadStatus.localAssets} />
          <StatusItem
            label="Remote Assets"
            status={preloadStatus.remoteAssets}
          />
          <StatusItem
            label="Critical Data"
            status={preloadStatus.criticalData}
          />
        </View>

        <Text style={styles.loadingTip}>
          🔥 Pro tip: All these assets are being preloaded for instant access!
        </Text>
      </View>
    );
  }

  // Main app
  return (
    <PerformanceContext.Provider value={{ addMetric, metrics, preloadStatus }}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap;

              switch (route.name) {
                case "Home":
                  iconName = focused ? "home" : "home-outline";
                  break;
                case "Gallery":
                  iconName = focused ? "images" : "images-outline";
                  break;
                case "Profile":
                  iconName = focused ? "person" : "person-outline";
                  break;
                case "Dashboard":
                  iconName = focused ? "stats-chart" : "stats-chart-outline";
                  break;
                case "Settings":
                  iconName = focused ? "settings" : "settings-outline";
                  break;
                default:
                  iconName = "home";
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#2196F3",
            tabBarInactiveTintColor: "gray",
            headerShown: false,
            tabBarStyle: {
              elevation: 8,
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              backgroundColor: "#fff",
              borderTopWidth: 1,
              borderTopColor: "#E0E0E0",
            },
          })}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{ tabBarLabel: "Home" }}
          />
          <Tab.Screen
            name="Gallery"
            component={GalleryScreen}
            options={{ tabBarLabel: "Gallery" }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ tabBarLabel: "Profile" }}
          />
          <Tab.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ tabBarLabel: "Analytics" }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ tabBarLabel: "Settings" }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PerformanceContext.Provider>
  );
}

// Status item component for loading screen
interface StatusItemProps {
  label: string;
  status: PreloadStatus;
}

const StatusItem: React.FC<StatusItemProps> = ({ label, status }) => {
  const getStatusIcon = (): React.JSX.Element => {
    switch (status) {
      case "loading":
        return <ActivityIndicator size="small" color="#2196F3" />;
      case "loaded":
        return <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />;
      case "failed":
        return <Ionicons name="close-circle" size={20} color="#F44336" />;
      default:
        return <Ionicons name="ellipse-outline" size={20} color="#999" />;
    }
  };

  const getStatusColor = (): string => {
    switch (status) {
      case "loaded":
        return "#4CAF50";
      case "loading":
        return "#2196F3";
      case "failed":
        return "#F44336";
      default:
        return "#999";
    }
  };

  return (
    <View style={styles.statusItem}>
      <Text style={styles.statusLabel}>{label}</Text>
      <View style={styles.statusRight}>
        {getStatusIcon()}
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {status}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  } as ViewStyle,
  logoContainer: {
    alignItems: "center",
    marginBottom: 60,
  } as ViewStyle,
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
  } as TextStyle,
  appSubtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  } as TextStyle,
  progressContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
  } as ViewStyle,
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 15,
  } as ViewStyle,
  progressFill: {
    height: "100%",
    backgroundColor: "#2196F3",
    borderRadius: 4,
  } as ViewStyle,
  progressText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  } as TextStyle,
  statusContainer: {
    width: "100%",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  } as ViewStyle,
  statusItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  } as ViewStyle,
  statusLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  } as TextStyle,
  statusRight: {
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,
  statusText: {
    fontSize: 12,
    marginLeft: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
  } as TextStyle,
  loadingTip: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 20,
  } as TextStyle,
});
