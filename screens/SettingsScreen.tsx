import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { analytics } from "../utils/analytics";
import { imageCache } from "../utils/imageCache";
import { storage, UserPreferences } from "../utils/storage";

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: boolean;
  onPress: () => void;
}

interface SettingRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

export default function SettingsScreen(): React.JSX.Element {
  const [settings, setSettings] = useState<UserPreferences>({
    autoPreload: true,
    predictiveLoading: true,
    networkAwareLoading: true,
    cacheSize: "medium",
    imageQuality: "high",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const userPrefs = await storage.loadUserPreferences();
      setSettings(userPrefs);
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const updateSetting = async <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await storage.saveUserPreferences(newSettings);
      console.log(`Setting ${key} updated to:`, value);
    } catch (error) {
      console.error(`Failed to update setting ${key}:`, error);
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "This will remove all cached images and data. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              imageCache.clearCache();
              analytics.reset();
              Alert.alert("Success", "Cache cleared successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to clear cache");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      "Reset Settings",
      "This will reset all settings to default values. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              const defaultSettings: UserPreferences = {
                autoPreload: true,
                predictiveLoading: true,
                networkAwareLoading: true,
                cacheSize: "medium",
                imageQuality: "high",
              };
              setSettings(defaultSettings);
              await storage.saveUserPreferences(defaultSettings);
              Alert.alert("Success", "Settings reset successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to reset settings");
            }
          },
        },
      ]
    );
  };

  const getCacheInfo = () => {
    const info = imageCache.getCacheInfo();
    return `${info.size}/${info.maxSize} items (${info.hitRate} hit rate)`;
  };

  const SettingItem: React.FC<SettingItemProps> = ({
    icon,
    label,
    value,
    onPress,
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color="#666" />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onPress}
        trackColor={{ false: "#E0E0E0", true: "#2196F3" }}
        thumbColor={value ? "#fff" : "#f4f3f4"}
      />
    </View>
  );

  const SettingRow: React.FC<SettingRowProps> = ({ icon, label, value }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color="#666" />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <Text style={styles.settingValue}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="settings" size={30} color="#2196F3" />
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Performance Settings</Text>

        <SettingItem
          icon="flash"
          label="Auto Preload Assets"
          value={settings.autoPreload}
          onPress={() => updateSetting("autoPreload", !settings.autoPreload)}
        />

        <SettingItem
          icon="analytics"
          label="Predictive Loading"
          value={settings.predictiveLoading}
          onPress={() =>
            updateSetting("predictiveLoading", !settings.predictiveLoading)
          }
        />

        <SettingItem
          icon="wifi"
          label="Network-Aware Loading"
          value={settings.networkAwareLoading}
          onPress={() =>
            updateSetting("networkAwareLoading", !settings.networkAwareLoading)
          }
        />
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Cache Configuration</Text>

        <SettingRow
          icon="folder"
          label="Cache Size"
          value={
            settings.cacheSize.charAt(0).toUpperCase() +
            settings.cacheSize.slice(1)
          }
        />
        <SettingRow
          icon="image"
          label="Image Quality"
          value={
            settings.imageQuality.charAt(0).toUpperCase() +
            settings.imageQuality.slice(1)
          }
        />
        <SettingRow
          icon="server"
          label="Current Cache"
          value={getCacheInfo()}
        />
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Data Management</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleClearCache}
          disabled={isLoading}
        >
          <Ionicons name="trash" size={20} color="#F44336" />
          <Text style={styles.actionButtonText}>Clear Cache</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleResetSettings}
          disabled={isLoading}
        >
          <Ionicons name="refresh" size={20} color="#FF9800" />
          <Text style={styles.actionButtonText}>Reset Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Predictive Preloading Demo</Text>
          <Text style={styles.infoText}>Version 1.0.0</Text>
          <Text style={styles.infoText}>
            This app demonstrates advanced asset preloading techniques using
            Expo and React Native.
          </Text>
          <Text style={styles.infoText}>
            Features include predictive navigation, network-aware loading, and
            performance analytics.
          </Text>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Performance Tips</Text>

        <View style={styles.tipItem}>
          <Ionicons name="bulb" size={20} color="#FFB300" />
          <Text style={styles.tipText}>
            Enable Auto Preload for fastest performance
          </Text>
        </View>

        <View style={styles.tipItem}>
          <Ionicons name="bulb" size={20} color="#FFB300" />
          <Text style={styles.tipText}>
            Use WiFi for best preloading experience
          </Text>
        </View>

        <View style={styles.tipItem}>
          <Ionicons name="bulb" size={20} color="#FFB300" />
          <Text style={styles.tipText}>
            Clear cache periodically to free up space
          </Text>
        </View>
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
  settingsSection: {
    backgroundColor: "#fff",
    marginTop: 15,
    marginHorizontal: 15,
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  } as TextStyle,
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  } as ViewStyle,
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  } as ViewStyle,
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  } as ViewStyle,
  settingLabel: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  } as TextStyle,
  settingValue: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  } as TextStyle,
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  } as ViewStyle,
  actionButtonText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  } as TextStyle,
  infoCard: {
    padding: 15,
  } as ViewStyle,
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  } as TextStyle,
  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  } as TextStyle,
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  } as ViewStyle,
  tipText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 15,
    flex: 1,
  } as TextStyle,
  footer: {
    padding: 30,
    alignItems: "center",
  } as ViewStyle,
  footerText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  } as TextStyle,
});
