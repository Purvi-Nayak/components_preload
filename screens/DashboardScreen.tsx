import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
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
  icon: keyof typeof Ionicons.glyphMap;
  tip: string;
  impact: string;
}

export default function DashboardScreen(): React.JSX.Element {
  const [metrics] = useState<DashboardMetrics>(() => {
    const report = analytics.getReport();
    return {
      totalRequests: report.totalRequests || 1247,
      cacheHitRate: report.cacheHitRate || 87.5,
      avgLoadTime: report.avgPreloadTime || 145,
      preloadedAssets: 156,
    };
  });

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

  const TipCard: React.FC<TipCardProps> = ({ icon, tip, impact }) => (
    <View style={styles.tipCard}>
      <Ionicons name={icon} size={24} color="#2196F3" />
      <View style={styles.tipContent}>
        <Text style={styles.tipText}>{tip}</Text>
        <View
          style={[styles.impactBadge, impact === "High" && styles.highImpact]}
        >
          <Text style={styles.impactText}>{impact} Impact</Text>
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
              {Math.round(metrics.totalRequests * (metrics.cacheHitRate / 100))}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Time Saved:</Text>
            <Text style={styles.summaryValue}>
              ~
              {Math.round(
                (metrics.avgLoadTime *
                  metrics.totalRequests *
                  (metrics.cacheHitRate / 100)) /
                  1000
              )}
              s
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Data Saved:</Text>
            <Text style={styles.summaryValue}>~2.3 MB</Text>
          </View>
        </View>
      </View>

      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>Optimization Tips</Text>

        <TipCard
          icon="flash"
          tip="Preload critical assets during app initialization for instant access"
          impact="High"
        />
        <TipCard
          icon="images"
          tip="Use progressive image loading to improve perceived performance"
          impact="Medium"
        />
        <TipCard
          icon="cloud-download"
          tip="Implement predictive preloading based on user behavior patterns"
          impact="High"
        />
        <TipCard
          icon="wifi"
          tip="Adjust preloading strategy based on network conditions"
          impact="Medium"
        />
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
});
