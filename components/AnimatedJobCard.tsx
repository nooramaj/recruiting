import React, { useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { Job } from "@/lib/job-context";
import * as Haptics from "expo-haptics";

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Healthcare: "medkit-outline",
  Hospitality: "restaurant-outline",
  Creative: "color-palette-outline",
  Services: "construct-outline",
  Technical: "flash-outline",
  Office: "desktop-outline",
  Other: "briefcase-outline",
};

const CATEGORY_COLORS: Record<string, string> = {
  Healthcare: "#EF4444",
  Hospitality: "#F59E0B",
  Creative: "#8B5CF6",
  Services: "#10B981",
  Technical: "#3B82F6",
  Office: "#EC4899",
  Other: "#6366F1",
};

interface AnimatedJobCardProps {
  job: Job;
  index: number;
  onPress: () => void;
}

export default function AnimatedJobCard({ job, index, onPress }: AnimatedJobCardProps) {
  const anim = useSharedValue(0);

  useEffect(() => {
    anim.value = withDelay(
      Math.min(index * 80, 600),
      withSpring(1, { damping: 16, stiffness: 90 })
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: anim.value,
    transform: [
      { translateY: interpolate(anim.value, [0, 1], [40, 0]) },
      { scale: interpolate(anim.value, [0, 1], [0.92, 1]) },
    ],
  }));

  const iconName = CATEGORY_ICONS[job.category] || CATEGORY_ICONS.Other;
  const catColor = CATEGORY_COLORS[job.category] || CATEGORY_COLORS.Other;

  const timeAgo = getTimeAgo(job.postedAt);

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={() => {
          if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: catColor + "18" }]}>
          <Ionicons name={iconName} size={24} color={catColor} />
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>{job.title}</Text>
            {job.isUserPosted && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>You</Text>
              </View>
            )}
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
              <Text style={styles.infoText}>{job.location}</Text>
            </View>
            <View style={styles.dot} />
            <Text style={styles.infoText}>{timeAgo}</Text>
          </View>

          <View style={styles.bottomRow}>
            <View style={styles.salaryContainer}>
              <Text style={styles.salaryAmount}>${job.salary}</Text>
              <Text style={styles.salaryPeriod}>/hr</Text>
            </View>
            <View style={[styles.categoryTag, { backgroundColor: catColor + "15" }]}>
              <Text style={[styles.categoryText, { color: catColor }]}>{job.category}</Text>
            </View>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
      </Pressable>
    </Animated.View>
  );
}

function getTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  return `${Math.floor(days / 7)}w ago`;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 14,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    gap: 6,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  badge: {
    backgroundColor: Colors.primary + "25",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: Colors.primary,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  infoText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textMuted,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textMuted,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  salaryContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  salaryAmount: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    color: Colors.accent,
  },
  salaryPeriod: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
  },
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryText: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
  },
});
