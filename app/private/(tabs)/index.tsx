// import { ThemedText } from "@/components/themed-text";
// import { ThemedView } from "@/components/themed-view";

// import { Image } from "expo-image";
// import React, { useEffect } from "react";
// import { ScrollView, StyleSheet } from "react-native";

// export default function HomeScreen() {
//   const { preloadStatus, preloadAllScreens, clearAllCache, isPreloading } =
//     useImagePreload();

//   const {
//     userBehavior,
//     trackNavigation,
//     predictNextScreen,
//     clearBehavior,
//     getBehaviorAnalytics,
//   } = useBehaviorTracking();

//   const { currentLoadTime, clearMetrics, getPerformanceStats } =
//     usePerformanceMetrics();

//   useEffect(() => {
//     trackNavigation("home");
//   }, []);

//   const handleClearCache = () => {
//     console.log("🗑️ User clicked clear cache");
//     clearAllCache();
//     clearBehavior();
//     clearMetrics();
//     console.log("✅ All cache and data cleared");
//   };

//   const behaviorAnalytics = getBehaviorAnalytics();
//   const performanceStats = getPerformanceStats();
//   const predictedNext = predictNextScreen();
//   const lastScreen = userBehavior[userBehavior.length - 2] || "";
//   const wasLastPreloaded = lastScreen
//     ? preloadStatus[lastScreen] === "loaded"
//     : false;

//   return (
//     <ScrollView style={styles.container}>
//       <ThemedView style={styles.content}>
//         {/* Header Section */}
//         <ThemedView style={styles.header}>
//           <Image
//             source={require("@/assets/images/react-logo.png")}
//             style={styles.logo}
//             contentFit="contain"
//           />
//           <ThemedText type="title" style={styles.title}>
//             🚀 Predictive Preloading Demo
//           </ThemedText>
//           <ThemedText style={styles.subtitle}>
//             Experience lightning-fast navigation with intelligent asset
//             preloading
//           </ThemedText>
//         </ThemedView>

//         {/* How It Works Section */}
//         <ThemedView style={styles.infoBox}>
//           <ThemedText type="subtitle" style={styles.infoTitle}>
//             📚 How This Demo Works
//           </ThemedText>
//           {/* <ThemedText style={styles.infoText}>
//             • <ThemedText style={styles.bold}>Manual Preload:</ThemedText> Tap
//             "Preload All" to cache all screens{"\n"}•{" "}
//             <ThemedText style={styles.bold}>API Preloading:</ThemedText> Real
//             JSONPlaceholder API caching with instant data access{"\n"}•{" "}
//             <ThemedText style={styles.bold}>Predictive Loading:</ThemedText> AI
//             learns your navigation patterns{"\n"}•{" "}
//             <ThemedText style={styles.bold}>Performance Metrics:</ThemedText>{" "}
//             See real-time load time comparisons{"\n"}•{" "}
//             <ThemedText style={styles.bold}>Smart Caching:</ThemedText> Assets
//             preload based on predicted routes
//           </ThemedText> */}
//         </ThemedView>

//         {/* Demo Instructions */}
//         <ThemedView style={styles.instructionsBox}>
//           <ThemedText type="subtitle" style={styles.instructionsTitle}>
//             🎯 Try This Demo
//           </ThemedText>
//           <ThemedText style={styles.instructionsText}>
//             1. Navigate between tabs without preloading - notice load times
//             {"\n"}
//             2. Use "Preload All" button and navigate again - instant loading!
//             {"\n"}
//             3. Visit API Data tab to test JSONPlaceholder API preloading
//             {"\n"}
//             4. Visit Gallery → Gallery → Profile to see predictive preloading
//             {"\n"}
//             5. Check performance metrics to see the improvement
//           </ThemedText>
//         </ThemedView>

//         {/* Preload Controls */}
//         <PreloadControls
//           preloadStatus={preloadStatus}
//           isPreloading={isPreloading}
//           onPreloadAll={preloadAllScreens}
//           onClearCache={handleClearCache}
//         />

//         {/* Performance Metrics */}
//         <PerformanceStats
//           currentLoadTime={currentLoadTime}
//           lastScreen={lastScreen}
//           wasPreloaded={wasLastPreloaded}
//           totalNavigations={performanceStats.totalNavigations}
//           averagePreloadedTime={performanceStats.averagePreloadedTime}
//           averageNonPreloadedTime={performanceStats.averageNonPreloadedTime}
//           performanceImprovement={performanceStats.performanceImprovement}
//         />

//         {/* Behavior Insights */}
//         <BehaviorInsights
//           userBehavior={userBehavior}
//           mostVisited={behaviorAnalytics.mostVisited}
//           commonPatterns={behaviorAnalytics.commonPatterns}
//           navigationCount={behaviorAnalytics.navigationCount}
//           predictedNext={predictedNext}
//         />

//         {/* Technical Benefits */}
//         {/* <ThemedView style={styles.benefitsBox}>
//           <ThemedText type="subtitle" style={styles.benefitsTitle}>
//             ⚡ Key Benefits
//           </ThemedText>
//           <ThemedView style={styles.benefitsList}>
//             <ThemedText style={styles.benefitItem}>
//               🎯 <ThemedText style={styles.bold}>70-90% faster</ThemedText> load
//               times for preloaded content
//             </ThemedText>
//             <ThemedText style={styles.benefitItem}>
//               🧠{" "}
//               <ThemedText style={styles.bold}>
//                 Intelligent prediction
//               </ThemedText>{" "}
//               based on user behavior
//             </ThemedText>
//             <ThemedText style={styles.benefitItem}>
//               📱 <ThemedText style={styles.bold}>Seamless UX</ThemedText> with
//               no loading spinners
//             </ThemedText>
//             <ThemedText style={styles.benefitItem}>
//               📊 <ThemedText style={styles.bold}>Real-time metrics</ThemedText>{" "}
//               for performance monitoring
//             </ThemedText>
//           </ThemedView>
//         </ThemedView> */}

//         {/* Footer */}
//         <ThemedView style={styles.footer}>
//           {/* <ThemedText style={styles.footerText}>
//             Built with Expo • React Native • TypeScript
//           </ThemedText> */}
//         </ThemedView>
//       </ThemedView>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   content: {
//     padding: 20,
//   },
//   header: {
//     alignItems: "center",
//     marginBottom: 24,
//     paddingTop: 20,
//   },
//   logo: {
//     width: 80,
//     height: 80,
//     marginBottom: 16,
//   },
//   title: {
//     textAlign: "center",
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     textAlign: "center",
//     opacity: 0.8,
//     lineHeight: 22,
//   },
//   infoBox: {
//     padding: 16,
//     borderRadius: 12,
//     backgroundColor: "rgba(10, 126, 164, 0.1)",
//     marginBottom: 16,
//   },
//   infoTitle: {
//     marginBottom: 12,
//   },
//   infoText: {
//     fontSize: 14,
//     lineHeight: 20,
//     opacity: 0.9,
//   },
//   instructionsBox: {
//     padding: 16,
//     borderRadius: 12,
//     backgroundColor: "rgba(76, 175, 80, 0.1)",
//     marginBottom: 16,
//   },
//   instructionsTitle: {
//     marginBottom: 12,
//   },
//   instructionsText: {
//     fontSize: 14,
//     lineHeight: 20,
//     opacity: 0.9,
//   },
//   benefitsBox: {
//     padding: 16,
//     borderRadius: 12,
//     backgroundColor: "rgba(255, 152, 0, 0.1)",
//     marginBottom: 16,
//   },
//   benefitsTitle: {
//     marginBottom: 12,
//   },
//   benefitsList: {
//     gap: 8,
//   },
//   benefitItem: {
//     fontSize: 14,
//     lineHeight: 20,
//     opacity: 0.9,
//   },
//   bold: {
//     fontWeight: "600",
//   },
//   footer: {
//     alignItems: "center",
//     paddingVertical: 20,
//     marginTop: 20,
//   },
//   footerText: {
//     fontSize: 12,
//     opacity: 0.6,
//   },
// });
