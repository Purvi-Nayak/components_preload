import { Ionicons } from "@expo/vector-icons";
import React, { useContext } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import {
  PerformanceContext,
  PreloadStatus,
} from "../contexts/PerformanceContext";

interface MetricCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
  isTotal?: boolean;
}

interface StatusCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  status: PreloadStatus;
}

interface FeatureCardProps {
  title: string;
  description: string;
  implemented: boolean;
}

export default function HomeScreen(): React.JSX.Element {
  const { metrics, preloadStatus } = useContext(PerformanceContext);

  const formatTime = (ms: number | undefined): string => {
    return ms ? `${ms}ms` : "N/A";
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="flash" size={40} color="#2196F3" />
        <Text style={styles.title}>Performance Dashboard</Text>
        <Text style={styles.subtitle}>Complete Asset Preloading Demo</Text>
      </View>

      {/* Load Time Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⏱️ Load Time Metrics</Text>

        <MetricCard
          icon="text"
          label="Fonts Load Time"
          value={formatTime(metrics.fontLoadTime)}
          color="#FF9800"
        />

        <MetricCard
          icon="folder"
          label="Local Assets Load Time"
          value={formatTime(metrics.localAssetsLoadTime)}
          color="#4CAF50"
        />

        <MetricCard
          icon="cloud-download"
          label="Remote Assets Load Time"
          value={formatTime(metrics.remoteAssetsLoadTime)}
          color="#2196F3"
        />

        <MetricCard
          icon="server"
          label="Critical Data Load Time"
          value={formatTime(metrics.criticalDataLoadTime)}
          color="#9C27B0"
        />

        <MetricCard
          icon="speedometer"
          label="Total Load Time"
          value={formatTime(metrics.totalLoadTime)}
          color="#F44336"
          isTotal
        />
      </View>

      {/* Preload Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✅ Preload Status</Text>

        <View style={styles.statusGrid}>
          <StatusCard icon="text" label="Fonts" status={preloadStatus.fonts} />
          <StatusCard
            icon="folder"
            label="Local Assets"
            status={preloadStatus.localAssets}
          />
          <StatusCard
            icon="cloud"
            label="Remote Assets"
            status={preloadStatus.remoteAssets}
          />
          <StatusCard
            icon="server"
            label="Critical Data"
            status={preloadStatus.criticalData}
          />
        </View>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚀 Implemented Features</Text>

        <FeatureCard
          title="Asset.loadAsync()"
          description="Preloads local bundled assets during app initialization"
          implemented={true}
        />

        <FeatureCard
          title="Font.loadAsync()"
          description="Loads custom fonts to prevent flash of unstyled text"
          implemented={true}
        />

        <FeatureCard
          title="Remote Asset Caching"
          description="Downloads and caches remote images for offline use"
          implemented={true}
        />

        <FeatureCard
          title="Predictive Navigation"
          description="Navigate to Gallery/Profile to see predictive preloading"
          implemented={true}
        />

        <FeatureCard
          title="Performance Monitoring"
          description="Real-time metrics tracking for all preload operations"
          implemented={true}
        />
      </View>

      {/* Best Practices */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Best Practices</Text>

        <View style={styles.tipCard}>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          <Text style={styles.tipText}>
            Load critical assets (fonts, local images) first
          </Text>
        </View>

        <View style={styles.tipCard}>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          <Text style={styles.tipText}>
            Use parallel loading for independent resources
          </Text>
        </View>

        <View style={styles.tipCard}>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          <Text style={styles.tipText}>
            Implement progressive loading for large assets
          </Text>
        </View>

        <View style={styles.tipCard}>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          <Text style={styles.tipText}>
            Track metrics to measure improvement
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Navigate to other tabs to see predictive preloading in action
        </Text>
      </View>
    </ScrollView>
  );
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  label,
  value,
  color,
  isTotal,
}) => (
  <View style={[styles.metricCard, isTotal && styles.metricCardTotal]}>
    <View style={styles.metricLeft}>
      <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
    <Text style={[styles.metricValue, { color }]}>{value}</Text>
  </View>
);

const StatusCard: React.FC<StatusCardProps> = ({ icon, label, status }) => {
  const getStatusColor = (): string => {
    switch (status) {
      case "loaded":
        return "#4CAF50";
      case "loading":
        return "#FF9800";
      case "failed":
        return "#F44336";
      default:
        return "#999";
    }
  };

  return (
    <View style={styles.statusCard}>
      <View
        style={[
          styles.statusIcon,
          { backgroundColor: getStatusColor() + "20" },
        ]}
      >
        <Ionicons name={icon} size={30} color={getStatusColor()} />
      </View>
      <Text style={styles.statusLabel}>{label}</Text>
      <View style={styles.statusBadge}>
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {status}
        </Text>
      </View>
    </View>
  );
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  implemented,
}) => (
  <View style={styles.featureCard}>
    <View style={styles.featureHeader}>
      <Text style={styles.featureTitle}>{title}</Text>
      {implemented && (
        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
      )}
    </View>
    <Text style={styles.featureDescription}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  } as ViewStyle,
  header: {
    backgroundColor: "#fff",
    padding: 30,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 20,
  } as ViewStyle,
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  } as TextStyle,
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  } as TextStyle,
  section: {
    marginBottom: 20,
    paddingHorizontal: 15,
  } as ViewStyle,
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  } as TextStyle,
  metricCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  } as ViewStyle,
  metricCardTotal: {
    borderWidth: 2,
    borderColor: "#2196F3",
  } as ViewStyle,
  metricLeft: {
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  } as ViewStyle,
  metricLabel: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  } as TextStyle,
  metricValue: {
    fontSize: 18,
    fontWeight: "bold",
  } as TextStyle,
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  } as ViewStyle,
  statusCard: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  } as ViewStyle,
  statusIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  } as ViewStyle,
  statusLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  } as TextStyle,
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  } as ViewStyle,
  statusText: {
    fontSize: 11,
    fontWeight: "bold",
  } as TextStyle,
  featureCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  } as ViewStyle,
  featureHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  } as ViewStyle,
  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  } as TextStyle,
  featureDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
  } as TextStyle,
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  } as ViewStyle,
  tipText: {
    fontSize: 13,
    color: "#333",
    marginLeft: 10,
    flex: 1,
  } as TextStyle,
  footer: {
    padding: 20,
    alignItems: "center",
    marginBottom: 30,
  } as ViewStyle,
  footerText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  } as TextStyle,
});
