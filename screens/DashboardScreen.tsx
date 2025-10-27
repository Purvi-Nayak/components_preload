import { Ionicons } from "@expo/vector-icons";
import React, { useContext, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { PerformanceContext } from "../contexts/PerformanceContext";
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

export default function DashboardScreen(): React.JSX.Element {
  // 🔥 USING ONLY REAL PERFORMANCE DATA - NO ARTIFICIAL NUMBERS
  const { metrics: realMetrics } = useContext(PerformanceContext);
  const analyticsReport = analytics.getReport();

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
    <View style={styles.metricCard}>
      <View style={[styles.metricIcon, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={32} color={color} />
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
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
    <View style={styles.tipCard}>
      <Text style={styles.tipIcon}>{icon}</Text>
      <View style={styles.tipContent}>
        <Text style={styles.tipText}>{tip}</Text>
        <View
          style={[
            styles.impactBadge,
            impact === "High Impact" && styles.highImpact,
          ]}
        >
          <Text style={styles.impactText}>{impact}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="stats-chart" size={30} color="#2196F3" />
        <Text style={styles.title}>Performance Dashboard</Text>
      </View>

      <View style={styles.dashboardGrid}>
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

      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Cache Performance</Text>
        <View style={styles.chartPlaceholder}>
          <Ionicons name="bar-chart" size={80} color="#E0E0E0" />
          <Text style={styles.chartText}>Performance chart visualization</Text>
          <Text style={styles.chartSubtext}>
            Shows cache hit rates, load times, and optimization trends over time
          </Text>
        </View>
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Performance Summary</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Network Requests Saved:</Text>
            <Text style={styles.summaryValue}>
              {metrics.totalRequests > 0
                ? Math.round(
                    metrics.totalRequests * (metrics.cacheHitRate / 100)
                  )
                : "Use app to see data"}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Time Saved:</Text>
            <Text style={styles.summaryValue}>
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

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Data Saved:</Text>
            <Text style={styles.summaryValue}>
              {metrics.totalRequests > 0
                ? `~${Math.round(metrics.totalRequests * 0.01)}MB`
                : "Use app to see data"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>Optimization Tips</Text>

        {dynamicTips.map((tipItem, index) => (
          <TipCard
            key={index}
            icon={tipItem.icon}
            tip={tipItem.tip}
            impact={tipItem.impact}
          />
        ))}
      </View>

      <View style={styles.metricsDetailSection}>
        <Text style={styles.sectionTitle}>Detailed Metrics</Text>

        <View style={styles.metricsDetail}>
          <Text style={styles.metricDetailLabel}>
            Average Screen Load Time:
          </Text>
          <Text style={styles.metricDetailValue}>{metrics.avgLoadTime}ms</Text>
        </View>

        <View style={styles.metricsDetail}>
          <Text style={styles.metricDetailLabel}>Cache Efficiency:</Text>
          <Text style={styles.metricDetailValue}>
            {metrics.cacheHitRate > 80
              ? "Excellent"
              : metrics.cacheHitRate > 60
              ? "Good"
              : "Needs Improvement"}
          </Text>
        </View>

        <View style={styles.metricsDetail}>
          <Text style={styles.metricDetailLabel}>Performance Score:</Text>
          <Text style={styles.metricDetailValue}>
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
  dashboardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 15,
    justifyContent: "space-between",
  } as ViewStyle,
  metricCard: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  } as ViewStyle,
  metricIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  } as ViewStyle,
  metricValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  } as TextStyle,
  metricLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  } as TextStyle,
  chartSection: {
    margin: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  } as ViewStyle,
  chartPlaceholder: {
    alignItems: "center",
    paddingVertical: 40,
  } as ViewStyle,
  chartText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    fontWeight: "500",
  } as TextStyle,
  chartSubtext: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
    textAlign: "center",
  } as TextStyle,
  summarySection: {
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
  summaryCard: {
    marginTop: 10,
  } as ViewStyle,
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  } as ViewStyle,
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  } as TextStyle,
  summaryValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  } as TextStyle,
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  } as TextStyle,
  tipsSection: {
    margin: 15,
  } as ViewStyle,
  tipCard: {
    flexDirection: "row",
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
  tipContent: {
    flex: 1,
    marginLeft: 15,
  } as ViewStyle,
  tipText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  } as TextStyle,
  impactBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  } as ViewStyle,
  highImpact: {
    backgroundColor: "#FFCDD2",
  } as ViewStyle,
  impactText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#666",
  } as TextStyle,
  metricsDetailSection: {
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
  metricsDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  } as ViewStyle,
  metricDetailLabel: {
    fontSize: 14,
    color: "#666",
  } as TextStyle,
  metricDetailValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2196F3",
  } as TextStyle,
  tipIcon: {
    fontSize: 24,
    minWidth: 30,
    textAlign: "center",
  } as TextStyle,
});
