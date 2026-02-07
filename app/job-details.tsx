import React, { useEffect, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  Linking,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import { useJobs } from "@/lib/job-context";
import * as Haptics from "expo-haptics";

const CATEGORY_COLORS: Record<string, string> = {
  Healthcare: "#EF4444",
  Hospitality: "#F59E0B",
  Creative: "#8B5CF6",
  Services: "#10B981",
  Technical: "#3B82F6",
  Office: "#EC4899",
  Other: "#6366F1",
};

export default function JobDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const { jobs } = useJobs();

  const job = useMemo(() => jobs.find(j => j.id === jobId), [jobs, jobId]);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  const headerAnim = useSharedValue(0);
  const contentAnim = useSharedValue(0);
  const detailsAnim = useSharedValue(0);
  const buttonAnim = useSharedValue(0);

  useEffect(() => {
    headerAnim.value = withSpring(1, { damping: 14, stiffness: 90 });
    contentAnim.value = withDelay(200, withSpring(1, { damping: 14, stiffness: 90 }));
    detailsAnim.value = withDelay(400, withSpring(1, { damping: 14, stiffness: 80 }));
    buttonAnim.value = withDelay(600, withSpring(1, { damping: 16, stiffness: 80 }));
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerAnim.value,
    transform: [{ translateY: interpolate(headerAnim.value, [0, 1], [-20, 0]) }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentAnim.value,
    transform: [{ translateY: interpolate(contentAnim.value, [0, 1], [30, 0]) }],
  }));

  const detailsStyle = useAnimatedStyle(() => ({
    opacity: detailsAnim.value,
    transform: [{ translateY: interpolate(detailsAnim.value, [0, 1], [20, 0]) }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonAnim.value,
    transform: [
      { translateY: interpolate(buttonAnim.value, [0, 1], [30, 0]) },
      { scale: interpolate(buttonAnim.value, [0, 1], [0.9, 1]) },
    ],
  }));

  if (!job) {
    return (
      <View style={[styles.container, { paddingTop: topInset, justifyContent: "center", alignItems: "center" }]}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.textMuted} />
        <Text style={styles.notFoundText}>Job not found</Text>
        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const catColor = CATEGORY_COLORS[job.category] || CATEGORY_COLORS.Other;
  const postedDate = new Date(job.postedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleWhatsApp = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const message = encodeURIComponent(`Hi, I'm interested in the "${job.title}" position posted on Freelance Jo.`);
    Linking.openURL(`https://wa.me/?text=${message}`).catch(() => {});
  };

  return (
    <View style={[styles.container, { paddingTop: topInset }]}>
      <Animated.View style={[styles.topBar, headerStyle]}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.6 }]}>
          <Ionicons name="close" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>Job Details</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomInset + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={contentStyle}>
          <View style={styles.heroSection}>
            <View style={[styles.heroBadge, { backgroundColor: catColor + "18" }]}>
              <Text style={[styles.heroBadgeText, { color: catColor }]}>{job.category}</Text>
            </View>
            <Text style={styles.heroTitle}>{job.title}</Text>
            <View style={styles.heroMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="location" size={16} color={Colors.primaryLight} />
                <Text style={styles.metaText}>{job.location}</Text>
              </View>
              <View style={styles.metaDot} />
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={16} color={Colors.primaryLight} />
                <Text style={styles.metaText}>{postedDate}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.salaryCard, detailsStyle]}>
          <LinearGradient
            colors={[Colors.primary + "15", Colors.accent + "10"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.salaryGradient}
          >
            <View>
              <Text style={styles.salaryLabel}>Hourly Rate</Text>
              <View style={styles.salaryValue}>
                <Text style={styles.salaryAmount}>${job.salary}</Text>
                <Text style={styles.salaryPeriod}>/hour</Text>
              </View>
            </View>
            <View style={styles.salaryIcon}>
              <Ionicons name="cash" size={28} color={Colors.accent} />
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.section, detailsStyle]}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{job.description}</Text>
        </Animated.View>

        <Animated.View style={[styles.detailsGrid, detailsStyle]}>
          <DetailItem icon="people-outline" label="Min Age" value={`${job.age} years`} />
          <DetailItem icon="location-outline" label="Location" value={job.location} />
          <DetailItem icon="pricetag-outline" label="Category" value={job.category} />
          <DetailItem icon="time-outline" label="Type" value="Freelance" />
        </Animated.View>
      </ScrollView>

      <Animated.View style={[styles.bottomBar, { paddingBottom: bottomInset + 12 }, buttonStyle]}>
        <Pressable
          onPress={handleWhatsApp}
          style={({ pressed }) => [styles.whatsappButton, pressed && styles.pressed]}
        >
          <Ionicons name="logo-whatsapp" size={22} color={Colors.white} />
          <Text style={styles.whatsappText}>Contact via WhatsApp</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

function DetailItem({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.detailItem}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={20} color={Colors.primaryLight} />
      </View>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  topTitle: { fontFamily: "Inter_600SemiBold", fontSize: 18, color: Colors.text },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, gap: 20 },
  heroSection: { gap: 12, paddingTop: 8 },
  heroBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  heroBadgeText: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  heroTitle: { fontFamily: "Inter_700Bold", fontSize: 28, color: Colors.text, lineHeight: 34 },
  heroMeta: { flexDirection: "row", alignItems: "center", gap: 10 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaText: { fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.textSecondary },
  metaDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.textMuted },
  salaryCard: { borderRadius: 18, overflow: "hidden" },
  salaryGradient: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.primary + "30",
  },
  salaryLabel: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textMuted },
  salaryValue: { flexDirection: "row", alignItems: "baseline", gap: 2, marginTop: 4 },
  salaryAmount: { fontFamily: "Inter_700Bold", fontSize: 32, color: Colors.accent },
  salaryPeriod: { fontFamily: "Inter_400Regular", fontSize: 16, color: Colors.textMuted },
  salaryIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: Colors.accent + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  section: { gap: 10 },
  sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 18, color: Colors.text },
  descriptionText: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  detailItem: {
    width: "47%" as any,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary + "12",
    justifyContent: "center",
    alignItems: "center",
  },
  detailLabel: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textMuted },
  detailValue: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.text },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  whatsappButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.whatsapp,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 10,
  },
  whatsappText: { fontFamily: "Inter_600SemiBold", fontSize: 17, color: Colors.white },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  notFoundText: { fontFamily: "Inter_500Medium", fontSize: 16, color: Colors.textMuted, marginTop: 12 },
  backLink: { marginTop: 16 },
  backLinkText: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.primary },
});
