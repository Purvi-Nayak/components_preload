import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Image } from "expo-image";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";

interface ProfileScreenProps {
  isLoading?: boolean;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  isLoading = false,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.tint} />
        <ThemedText style={styles.loadingText}>Loading Profile...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedView style={styles.avatarContainer}>
            <Image
              source={{ uri: "https://picsum.photos/400/300?random=2" }}
              style={styles.avatar}
              contentFit="cover"
              transition={300}
            />
          </ThemedView>
          <ThemedText type="title">👤 User Profile</ThemedText>
          <ThemedText style={styles.subtitle}>
            Professional photographer & UI/UX Designer
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.statsContainer}>
          <ThemedView style={styles.statItem}>
            <ThemedText type="subtitle">42</ThemedText>
            <ThemedText style={styles.statLabel}>Photos</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statItem}>
            <ThemedText type="subtitle">1.2k</ThemedText>
            <ThemedText style={styles.statLabel}>Followers</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statItem}>
            <ThemedText type="subtitle">847</ThemedText>
            <ThemedText style={styles.statLabel}>Following</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">📝 About</ThemedText>
          <ThemedText style={styles.description}>
            Passionate about capturing moments and creating beautiful user
            experiences. Love to explore new places and document the journey
            through photography.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">🎯 Skills</ThemedText>
          <ThemedView style={styles.skillsContainer}>
            {["Photography", "UI Design", "React Native", "TypeScript"].map(
              (skill, index) => (
                <ThemedView key={index} style={styles.skillTag}>
                  <ThemedText style={styles.skillText}>{skill}</ThemedText>
                </ThemedView>
              )
            )}
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.infoBox}>
          <ThemedText type="subtitle">⚡ Performance Note</ThemedText>
          <ThemedText style={styles.infoText}>
            This profile loaded instantly thanks to predictive preloading! The
            system detected your navigation pattern and preloaded this content.
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
    marginBottom: 30,
  },
  avatarContainer: {
    marginBottom: 16,
    borderRadius: 60,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  avatar: {
    width: 120,
    height: 120,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
    paddingVertical: 20,
    borderRadius: 12,
    backgroundColor: "rgba(10, 126, 164, 0.05)",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    marginTop: 4,
    fontSize: 14,
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  skillTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(10, 126, 164, 0.2)",
  },
  skillText: {
    fontSize: 12,
    fontWeight: "600",
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    marginTop: 20,
  },
  infoText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
});
