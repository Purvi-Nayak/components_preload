import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Image,
  ImageStyle,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { analytics } from "../utils/analytics";
import { imageCache } from "../utils/imageCache";

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

export default function ProfileScreen(): React.JSX.Element {
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [wasPreloaded, setWasPreloaded] = useState<boolean>(false);

  useFocusEffect(
    React.useCallback(() => {
      const startTime = Date.now();

      // REAL cache checking - check if profile assets were actually preloaded
      const profileAssets = [
        "https://picsum.photos/300/300?random=10",
        "https://picsum.photos/400/400?random=11",
        "https://picsum.photos/500/500?random=12",
      ];

      // Check ACTUAL cache status using real imageCache
      let cacheHits = 0;
      profileAssets.forEach((uri) => {
        if (imageCache.isCached(uri)) {
          analytics.recordCacheHit();
          cacheHits++;
          console.log(`✅ Cache HIT for profile asset: ${uri}`);
        } else {
          analytics.recordCacheMiss();
          console.log(`❌ Cache MISS for profile asset: ${uri}`);
        }
      });

      setWasPreloaded(cacheHits > 0);

      const endTime = Date.now();
      const duration = endTime - startTime;
      setLoadTime(duration);

      analytics.recordScreenLoad("Profile", duration);

      console.log(
        `📊 Profile Screen - Load: ${duration}ms, Cache Hits: ${cacheHits}/${profileAssets.length}`
      );

      return () => {};
    }, [])
  );

  const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={30} color="#2196F3" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person" size={30} color="#2196F3" />
        <Text style={styles.title}>Profile Screen</Text>
      </View>

      {loadTime !== null && (
        <View style={styles.performanceCard}>
          <Ionicons
            name={wasPreloaded ? "flash" : "time"}
            size={24}
            color={wasPreloaded ? "#4CAF50" : "#FF9800"}
          />
          <View style={styles.performanceInfo}>
            <Text style={styles.performanceLabel}>Screen Load Time</Text>
            <Text style={styles.performanceValue}>{loadTime}ms</Text>
            {wasPreloaded && (
              <Text style={styles.preloadedText}>
                ✓ Assets were preloaded from Gallery!
              </Text>
            )}
          </View>
        </View>
      )}

      <View style={styles.profileCard}>
        <Image
          source={{ uri: "https://picsum.photos/400/400?random=100" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.bio}>
          Mobile Developer | Performance Enthusiast
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCard icon="images" label="Photos" value="1,234" />
        <StatCard icon="people" label="Followers" value="5.6K" />
        <StatCard icon="heart" label="Likes" value="12.3K" />
      </View>

      <View style={styles.imageGrid}>
        {[101, 102, 103, 104, 105, 106].map((num) => (
          <Image
            key={num}
            source={{ uri: `https://picsum.photos/200/200?random=${num}` }}
            style={styles.gridImage}
          />
        ))}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>About Predictive Loading</Text>
        <Text style={styles.infoText}>
          This screen's assets were preloaded when you visited the Gallery
          screen twice. This demonstrates how predictive loading can
          significantly improve user experience by anticipating user behavior.
        </Text>
      </View>
    </ScrollView>
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
  performanceCard: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  } as ViewStyle,
  performanceInfo: {
    marginLeft: 15,
    flex: 1,
  } as ViewStyle,
  performanceLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  } as TextStyle,
  performanceValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  } as TextStyle,
  preloadedText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "bold",
    marginTop: 4,
  } as TextStyle,
  profileCard: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  } as ViewStyle,
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  } as ImageStyle,
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  } as TextStyle,
  bio: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  } as TextStyle,
  statsContainer: {
    flexDirection: "row",
    marginHorizontal: 15,
    marginBottom: 15,
    justifyContent: "space-between",
  } as ViewStyle,
  statCard: {
    backgroundColor: "#fff",
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  } as ViewStyle,
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  } as TextStyle,
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  } as TextStyle,
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 15,
    marginBottom: 15,
  } as ViewStyle,
  gridImage: {
    width: "31%",
    height: 100,
    borderRadius: 8,
    margin: "1%",
  } as ImageStyle,
  infoSection: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  } as ViewStyle,
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  } as TextStyle,
  infoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  } as TextStyle,
});
