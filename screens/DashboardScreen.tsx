import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { useContext, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { PerformanceContext } from "../contexts/PerformanceContext";
import { usePixelPerfect } from "../hooks/useMobileResponsive";
import { analytics } from "../utils/analytics";

interface DashboardMetrics {
  totalRequests: number;
  cacheHitRate: number;
  avgLoadTime: number;
  preloadedAssets: number;
}

interface MetricCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
}

interface TipCardProps {
  icon: string; // Changed to string for emoji support
  tip: string;
  impact: string;
}

// Clean unified styles interface - no separate ViewStyle/TextStyle interfaces needed
interface DashboardStyles {
  // View Styles
  container: ViewStyle;
  header: ViewStyle;
  dashboardGrid: ViewStyle;
  metricCard: ViewStyle;
  metricIcon: ViewStyle;
  chartSection: ViewStyle;
  chartPlaceholder: ViewStyle;
  summarySection: ViewStyle;
  summaryCard: ViewStyle;
  summaryRow: ViewStyle;
  tipsSection: ViewStyle;
  tipCard: ViewStyle;
  tipContent: ViewStyle;
  impactBadge: ViewStyle;
  highImpact: ViewStyle;
  metricsDetailSection: ViewStyle;
  metricsDetail: ViewStyle;

  // Text Styles
  title: TextStyle;
  metricValue: TextStyle;
  metricLabel: TextStyle;
  chartText: TextStyle;
  chartSubtext: TextStyle;
  summaryLabel: TextStyle;
  summaryValue: TextStyle;
  sectionTitle: TextStyle;
  tipText: TextStyle;
  impactText: TextStyle;
  metricDetailLabel: TextStyle;
  metricDetailValue: TextStyle;
  tipIcon: TextStyle;
}

export default function DashboardScreen(): React.JSX.Element {
  // 🔥 USING ONLY REAL PERFORMANCE DATA - NO ARTIFICIAL NUMBERS
  const { metrics: realMetrics } = useContext(PerformanceContext);
  const analyticsReport = analytics.getReport();

  // 📱 PIXEL-PERFECT HOOK - Device-aware layouts and scaling
  const responsive = usePixelPerfect();

  // REAL-ONLY METRICS - No random numbers, no artificial data
  const [metrics] = useState<DashboardMetrics>(() => {
    return {
      // REAL total requests from actual analytics
      totalRequests: analyticsReport.totalRequests,

      // REAL cache hit rate from actual preload usage
      cacheHitRate: analyticsReport.cacheHitRate,

      // REAL average load time from performance measurements
      avgLoadTime: Math.round(analyticsReport.avgPreloadTime) || 0,

      // REAL preloaded assets count from context
      preloadedAssets: Object.keys(realMetrics).length,
    };
  });

  // REMOVED: All artificial dynamic updates
  // Now showing only real data that updates when user actually uses the app

  const MetricCard: React.FC<MetricCardProps> = ({
    icon,
    label,
    value,
    color,
  }) => (
    <View style={viewStyles.metricCard}>
      <View style={[viewStyles.metricIcon, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={responsive.scale.size(32)} color={color} />
      </View>
      <Text style={textStyles.metricValue}>{value}</Text>
      <Text style={textStyles.metricLabel}>{label}</Text>
    </View>
  );

  // Dynamic tips based on REAL current metrics
  const dynamicTips = useMemo(() => {
    const tips = [];

    // Only show tips if we have real data to analyze
    if (metrics.totalRequests > 0) {
      if (metrics.cacheHitRate < 80 && metrics.cacheHitRate > 0) {
        tips.push({
          icon: "📈",
          tip: `Cache hit rate is ${metrics.cacheHitRate}% - consider preloading more frequently used assets`,
          impact: "High Impact",
        });
      }

      if (metrics.avgLoadTime > 100) {
        tips.push({
          icon: "⚡",
          tip: `Load times are ${metrics.avgLoadTime}ms - optimize critical asset preloading`,
          impact: "Medium Impact",
        });
      }
    }

    // Always show best practices (real implementation tips)
    tips.push({
      icon: "🔥",
      tip: "Preload critical assets during app initialization for instant access",
      impact: "High Impact",
    });

    tips.push({
      icon: "🖼️",
      tip: "Use progressive image loading to improve perceived performance",
      impact: "Medium Impact",
    });

    tips.push({
      icon: "🧠",
      tip: "Implement predictive preloading based on user behavior patterns",
      impact: "High Impact",
    });

    tips.push({
      icon: "📶",
      tip: "Adjust preloading strategy based on network conditions",
      impact: "Medium Impact",
    });

    return tips;
  }, [metrics.cacheHitRate, metrics.avgLoadTime, metrics.totalRequests]);

  const TipCard: React.FC<TipCardProps> = ({ icon, tip, impact }) => (
    <View style={viewStyles.tipCard}>
      <Text style={textStyles.tipIcon}>{icon}</Text>
      <View style={viewStyles.tipContent}>
        <Text style={textStyles.tipText}>{tip}</Text>
        <View
          style={[
            viewStyles.impactBadge,
            impact === "High Impact" && viewStyles.highImpact,
          ]}
        >
          <Text style={textStyles.impactText}>{impact}</Text>
        </View>
      </View>
    </View>
  );

  // 📱 PIXEL-PERFECT STYLES - Generated based on device type and scaling
  const getResponsiveStyles = () => {
    const { scale, layout, device, screen, perfect } = responsive;
    const isLandscape = device.orientation === "landscape";
    const columnsNum = layout.columns(4); // Max 4 columns
    const gridGap = scale.space(12);
    const contentPadding = layout.container.padding;
    const cardPadding = layout.card.padding;
    const safeBottom = device.isNotched ? scale.space(10) : 0;

    // Use perfect.flexGrid for metric cards
    const metricGridConfig = perfect.flexGrid([1, 2, 3, 4], {
      maxColumns: 4,
      minItemWidth: scale.size(120),
      gap: gridGap,
      padding: contentPadding,
    });

    const viewStyles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
      },
      header: {
        backgroundColor: "#f9f7f7",
        padding: scale.space(40),
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
      },
      dashboardGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: contentPadding,
        justifyContent: isLandscape ? "space-around" : "space-between",
        gap: gridGap,
      },
      metricCard: {
        backgroundColor: "#fff",
        width: metricGridConfig.itemWidth, // Use calculated pixel-perfect width
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
      metricIcon: {
        width: scale.size(60),
        height: scale.size(60),
        borderRadius: scale.size(30),
        justifyContent: "center",
        alignItems: "center",
        marginBottom: scale.space(10),
      },
      chartSection: {
        margin: contentPadding,
        backgroundColor: "#fff",
        borderRadius: scale.radius(10),
        padding: scale.space(20),
        elevation: layout.card.elevation,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: layout.card.shadowRadius,
      },
      chartPlaceholder: {
        alignItems: "center",
        paddingVertical: scale.space(40),
      },
      summarySection: {
        margin: contentPadding,
        backgroundColor: "#fff",
        borderRadius: scale.radius(10),
        padding: scale.space(15),
        elevation: layout.card.elevation,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: layout.card.shadowRadius,
      },
      summaryCard: {
        marginTop: scale.space(10),
      },
      summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: scale.space(8),
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
      },
      tipsSection: {
        margin: contentPadding,
        paddingBottom: safeBottom,
      },
      tipCard: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: scale.space(15),
        borderRadius: scale.radius(10),
        marginBottom: scale.space(10),
        elevation: layout.card.elevation,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: layout.card.shadowRadius,
      },
      tipContent: {
        flex: 1,
        marginLeft: scale.space(15),
      },
      impactBadge: {
        alignSelf: "flex-start",
        backgroundColor: "#E0E0E0",
        paddingHorizontal: scale.space(8),
        paddingVertical: scale.space(2),
        borderRadius: scale.radius(12),
      },
      highImpact: {
        backgroundColor: "#FFCDD2",
      },
      metricsDetailSection: {
        margin: contentPadding,
        backgroundColor: "#fff",
        borderRadius: scale.radius(10),
        padding: scale.space(15),
        elevation: layout.card.elevation,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: layout.card.shadowRadius,
      },
      metricsDetail: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: scale.space(8),
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
      },
    });

    const textStyles = StyleSheet.create({
      title: {
        fontSize: scale.font(20),
        fontWeight: "bold",
        color: "#333",
        marginLeft: scale.space(10),
      },
      metricValue: {
        fontSize: scale.font(18),
        fontWeight: "bold",
        color: "#333",
        marginBottom: scale.space(5),
      },
      metricLabel: {
        fontSize: scale.font(12),
        color: "#666",
        textAlign: "center",
      },
      chartText: {
        fontSize: scale.font(16),
        color: "#666",
        marginTop: scale.space(10),
        fontWeight: "500",
      },
      chartSubtext: {
        fontSize: scale.font(12),
        color: "#999",
        marginTop: scale.space(5),
        textAlign: "center",
      },
      summaryLabel: {
        fontSize: scale.font(14),
        color: "#666",
        flex: 1,
      },
      summaryValue: {
        fontSize: scale.font(14),
        fontWeight: "bold",
        color: "#333",
        textAlign: "right",
      },
      sectionTitle: {
        fontSize: scale.font(18),
        fontWeight: "bold",
        color: "#333",
        marginBottom: scale.space(10),
      },
      tipText: {
        fontSize: scale.font(14),
        color: "#333",
        marginBottom: scale.space(8),
      },
      impactText: {
        fontSize: scale.font(10),
        fontWeight: "bold",
        color: "#666",
      },
      metricDetailLabel: {
        fontSize: scale.font(14),
        color: "#666",
        flex: 1,
      },
      metricDetailValue: {
        fontSize: scale.font(14),
        fontWeight: "bold",
        color: "#2196F3",
        textAlign: "right",
      },
      tipIcon: {
        fontSize: scale.font(24),
        minWidth: scale.space(30),
        textAlign: "center",
      },
    });

    return { viewStyles, textStyles };
  };

  const { viewStyles, textStyles } = getResponsiveStyles();

  return (
    <ScrollView style={viewStyles.container}>
      <View style={viewStyles.header}>
        <Ionicons
          name="stats-chart"
          size={responsive.scale.size(30)}
          color="#2196F3"
        />
        <Text style={textStyles.title}>Performance Dashboard</Text>
      </View>

      <View style={viewStyles.dashboardGrid}>
        <MetricCard
          icon="download"
          label="Total Requests"
          value={metrics.totalRequests.toLocaleString()}
          color="#2196F3"
        />
        <MetricCard
          icon="flash"
          label="Cache Hit Rate"
          value={`${metrics.cacheHitRate}%`}
          color="#4CAF50"
        />
        <MetricCard
          icon="speedometer"
          label="Avg Load Time"
          value={`${metrics.avgLoadTime}ms`}
          color="#FF9800"
        />
        <MetricCard
          icon="folder"
          label="Preloaded Assets"
          value={metrics.preloadedAssets.toString()}
          color="#9C27B0"
        />
      </View>

      <View style={viewStyles.chartSection}>
        <Text style={textStyles.sectionTitle}>Cache Performance</Text>
        <View style={viewStyles.chartPlaceholder}>
          <Ionicons
            name="bar-chart"
            size={responsive.scale.size(80)}
            color="#E0E0E0"
          />
          <Text style={textStyles.chartText}>
            Performance chart visualization
          </Text>
          <Text style={textStyles.chartSubtext}>
            Shows cache hit rates, load times, and optimization trends over time
          </Text>
        </View>
      </View>

      <View style={viewStyles.summarySection}>
        <Text style={textStyles.sectionTitle}>Performance Summary</Text>

        <View style={viewStyles.summaryCard}>
          <View style={viewStyles.summaryRow}>
            <Text style={textStyles.summaryLabel}>Network Requests Saved:</Text>
            <Text style={textStyles.summaryValue}>
              {metrics.totalRequests > 0
                ? Math.round(
                    metrics.totalRequests * (metrics.cacheHitRate / 100)
                  )
                : "Use app to see data"}
            </Text>
          </View>

          <View style={viewStyles.summaryRow}>
            <Text style={textStyles.summaryLabel}>Time Saved:</Text>
            <Text style={textStyles.summaryValue}>
              {metrics.totalRequests > 0
                ? `~${Math.round(
                    (metrics.avgLoadTime *
                      metrics.totalRequests *
                      (metrics.cacheHitRate / 100)) /
                      1000
                  )}s`
                : "Use app to see data"}
            </Text>
          </View>

          <View style={viewStyles.summaryRow}>
            <Text style={textStyles.summaryLabel}>Data Saved:</Text>
            <Text style={textStyles.summaryValue}>
              {metrics.totalRequests > 0
                ? `~${Math.round(metrics.totalRequests * 0.01)}MB`
                : "Use app to see data"}
            </Text>
          </View>
        </View>
      </View>

      <View style={viewStyles.tipsSection}>
        <Text style={textStyles.sectionTitle}>Optimization Tips</Text>

        {dynamicTips.map((tipItem, index) => (
          <TipCard
            key={index}
            icon={tipItem.icon}
            tip={tipItem.tip}
            impact={tipItem.impact}
          />
        ))}
      </View>

      <View style={viewStyles.metricsDetailSection}>
        <Text style={textStyles.sectionTitle}>Detailed Metrics</Text>

        <View style={viewStyles.metricsDetail}>
          <Text style={textStyles.metricDetailLabel}>
            Average Screen Load Time:
          </Text>
          <Text style={textStyles.metricDetailValue}>
            {metrics.avgLoadTime}ms
          </Text>
        </View>

        <View style={viewStyles.metricsDetail}>
          <Text style={textStyles.metricDetailLabel}>Cache Efficiency:</Text>
          <Text style={textStyles.metricDetailValue}>
            {metrics.cacheHitRate > 80
              ? "Excellent"
              : metrics.cacheHitRate > 60
              ? "Good"
              : "Needs Improvement"}
          </Text>
        </View>

        <View style={viewStyles.metricsDetail}>
          <Text style={textStyles.metricDetailLabel}>Performance Score:</Text>
          <Text style={textStyles.metricDetailValue}>
            {Math.round(
              (metrics.cacheHitRate + (100 - metrics.avgLoadTime / 10)) / 2
            )}
            /100
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
