import { Ionicons } from "@expo/vector-icons";
import React, { useContext } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  PerformanceContext,
  PreloadStatus,
} from "../contexts/PerformanceContext";
import { usePixelPerfect } from "../hooks/usePixcelperfect";

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

  // 📱 PIXEL-PERFECT HOOK - Device-aware layouts and scaling
  const responsive = usePixelPerfect();

  const formatTime = (ms: number | undefined): string => {
    return ms ? `${ms}ms` : "N/A";
  };

  // 📱 PIXEL-PERFECT STYLES - Generated based on device type and scaling
  const getResponsiveStyles = () => {
    const { scale, layout, device, screen, perfect } = responsive;
    const isLandscape = device.orientation === "landscape";
    const gridGap = scale.space(12);
    const contentPadding = layout.container.padding;
    const cardPadding = layout.card.padding;
    const safeBottom = device.isNotched ? scale.space(10) : 0;

    // Use perfect.flexGrid for status cards
    const statusGridConfig = perfect.flexGrid([1, 2, 3, 4], {
      maxColumns: isLandscape ? 4 : 2,
      minItemWidth: scale.size(140),
      gap: gridGap,
      padding: contentPadding,
    });

    const viewStyles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
      },
      header: {
        backgroundColor: "#fef8f8",
        padding: scale.space(40),
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
        // marginBottom: scale.space(20),
      },
      section: {
        marginBottom: scale.space(20),
        paddingHorizontal: contentPadding,
      },
      metricCard: {
        backgroundColor: "#fff",
        padding: cardPadding,
        borderRadius: scale.radius(10),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: scale.space(10),
        elevation: layout.card.elevation,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: layout.card.shadowRadius,
      },
      metricCardTotal: {
        borderWidth: 2,
        borderColor: "#2196F3",
      },
      metricLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
      },
      iconContainer: {
        width: scale.size(45),
        height: scale.size(45),
        borderRadius: scale.radius(10),
        justifyContent: "center",
        alignItems: "center",
        marginRight: scale.space(12),
      },
      statusGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: isLandscape ? "space-around" : "space-between",
        gap: gridGap,
      },
      statusCard: {
        backgroundColor: "#fff",
        width: statusGridConfig.itemWidth,
        padding: cardPadding,
        borderRadius: scale.radius(10),
        alignItems: "center",
        marginBottom: gridGap,
        elevation: layout.card.elevation,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: layout.card.shadowRadius,
      },
      statusIcon: {
        width: scale.size(60),
        height: scale.size(60),
        borderRadius: scale.size(30),
        justifyContent: "center",
        alignItems: "center",
        marginBottom: scale.space(10),
      },
      statusBadge: {
        paddingHorizontal: scale.space(8),
        paddingVertical: scale.space(2),
        borderRadius: scale.radius(12),
      },
      featureCard: {
        backgroundColor: "#fff",
        padding: cardPadding,
        borderRadius: scale.radius(10),
        marginBottom: scale.space(10),
        elevation: layout.card.elevation,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: layout.card.shadowRadius,
      },
      featureHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: scale.space(5),
      },
      tipCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: scale.space(12),
        borderRadius: scale.radius(8),
        marginBottom: scale.space(8),
        elevation: layout.card.elevation,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: layout.card.shadowRadius,
      },
      footer: {
        padding: scale.space(20),
        alignItems: "center",
        marginBottom: safeBottom + scale.space(30),
      },
    });

    const textStyles = StyleSheet.create({
      title: {
        fontSize: scale.font(26),
        fontWeight: "bold",
        color: "#333",
        marginTop: scale.space(10),
        textAlign: "center",
      },
      subtitle: {
        fontSize: scale.font(14),
        color: "#666",
        marginTop: scale.space(5),
        textAlign: "center",
      },
      sectionTitle: {
        fontSize: scale.font(20),
        fontWeight: "bold",
        color: "#333",
        marginBottom: scale.space(15),
      },
      metricLabel: {
        fontSize: scale.font(14),
        color: "#333",
        fontWeight: "500",
        flex: 1,
      },
      metricValue: {
        fontSize: scale.font(18),
        fontWeight: "bold",
      },
      statusLabel: {
        fontSize: scale.font(12),
        color: "#666",
        textAlign: "center",
        marginBottom: scale.space(5),
      },
      statusText: {
        fontSize: scale.font(11),
        fontWeight: "bold",
      },
      featureTitle: {
        fontSize: scale.font(16),
        fontWeight: "bold",
        color: "#333",
      },
      featureDescription: {
        fontSize: scale.font(13),
        color: "#666",
        lineHeight: scale.font(20),
      },
      tipText: {
        fontSize: scale.font(13),
        color: "#333",
        marginLeft: scale.space(10),
        flex: 1,
      },
      footerText: {
        fontSize: scale.font(12),
        color: "#999",
        textAlign: "center",
      },
    });

    return { viewStyles, textStyles };
  };

  const { viewStyles, textStyles } = getResponsiveStyles();

  const MetricCard: React.FC<MetricCardProps> = ({
    icon,
    label,
    value,
    color,
    isTotal,
  }) => (
    <View
      style={[viewStyles.metricCard, isTotal && viewStyles.metricCardTotal]}
    >
      <View style={viewStyles.metricLeft}>
        <View
          style={[viewStyles.iconContainer, { backgroundColor: color + "20" }]}
        >
          <Ionicons
            name={icon}
            size={responsive.scale.size(24)}
            color={color}
          />
        </View>
        <Text style={textStyles.metricLabel}>{label}</Text>
      </View>
      <Text style={[textStyles.metricValue, { color }]}>{value}</Text>
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
      <View style={viewStyles.statusCard}>
        <View
          style={[
            viewStyles.statusIcon,
            { backgroundColor: getStatusColor() + "20" },
          ]}
        >
          <Ionicons
            name={icon}
            size={responsive.scale.size(30)}
            color={getStatusColor()}
          />
        </View>
        <Text style={textStyles.statusLabel}>{label}</Text>
        <View style={viewStyles.statusBadge}>
          <Text style={[textStyles.statusText, { color: getStatusColor() }]}>
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
    <View style={viewStyles.featureCard}>
      <View style={viewStyles.featureHeader}>
        <Text style={textStyles.featureTitle}>{title}</Text>
        {implemented && (
          <Ionicons
            name="checkmark-circle"
            size={responsive.scale.size(20)}
            color="#4CAF50"
          />
        )}
      </View>
      <Text style={textStyles.featureDescription}>{description}</Text>
    </View>
  );

  return (
    <ScrollView
      style={viewStyles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={viewStyles.header}>
        <Text style={textStyles.title}>Performance Dashboard</Text>
        <Text style={textStyles.subtitle}>Complete Asset Preloading Demo</Text>
      </View>

      {/* Load Time Metrics */}
      <View style={viewStyles.section}>
        <Text style={textStyles.sectionTitle}>⏱️ Load Time Metrics</Text>

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
      <View style={viewStyles.section}>
        <Text style={textStyles.sectionTitle}>✅ Preload Status</Text>

        <View style={viewStyles.statusGrid}>
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
      <View style={viewStyles.section}>
        <Text style={textStyles.sectionTitle}>🚀 Implemented Features</Text>

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
      <View style={viewStyles.section}>
        <Text style={textStyles.sectionTitle}>💡 Best Practices</Text>

        <View style={viewStyles.tipCard}>
          <Ionicons
            name="checkmark-circle"
            size={responsive.scale.size(24)}
            color="#4CAF50"
          />
          <Text style={textStyles.tipText}>
            Load critical assets (fonts, local images) first
          </Text>
        </View>

        <View style={viewStyles.tipCard}>
          <Ionicons
            name="checkmark-circle"
            size={responsive.scale.size(24)}
            color="#4CAF50"
          />
          <Text style={textStyles.tipText}>
            Use parallel loading for independent resources
          </Text>
        </View>

        <View style={viewStyles.tipCard}>
          <Ionicons
            name="checkmark-circle"
            size={responsive.scale.size(24)}
            color="#4CAF50"
          />
          <Text style={textStyles.tipText}>
            Implement progressive loading for large assets
          </Text>
        </View>

        <View style={viewStyles.tipCard}>
          <Ionicons
            name="checkmark-circle"
            size={responsive.scale.size(24)}
            color="#4CAF50"
          />
          <Text style={textStyles.tipText}>
            Track metrics to measure improvement
          </Text>
        </View>
      </View>

      <View style={viewStyles.footer}>
        <Text style={textStyles.footerText}>
          Navigate to other tabs to see predictive preloading in action
        </Text>
      </View>
    </ScrollView>
  );
}
