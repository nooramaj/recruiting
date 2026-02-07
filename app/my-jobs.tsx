import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  interpolate,
  FadeIn,
  SlideOutLeft,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { useJobs, Job } from "@/lib/job-context";
import * as Haptics from "expo-haptics";

export default function MyJobsScreen() {
  const insets = useSafeAreaInsets();
  const { userJobs, removeJob } = useJobs();

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  const headerAnim = useSharedValue(0);
  useEffect(() => {
    headerAnim.value = withSpring(1, { damping: 14, stiffness: 90 });
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerAnim.value,
    transform: [{ translateY: interpolate(headerAnim.value, [0, 1], [-20, 0]) }],
  }));

  const handleDelete = useCallback((job: Job) => {
    Alert.alert(
      "Delete Job",
      `Are you sure you want to remove "${job.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            removeJob(job.id);
          },
        },
      ]
    );
  }, [removeJob]);

  const renderItem = useCallback(({ item, index }: { item: Job; index: number }) => (
    <MyJobItem job={item} index={index} onDelete={() => handleDelete(item)} onPress={() => router.push({ pathname: "/job-details", params: { jobId: item.id } })} />
  ), [handleDelete]);

  return (
    <View style={[styles.container, { paddingTop: topInset }]}>
      <Animated.View style={[styles.topBar, headerStyle]}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>My Posted Jobs</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <FlatList
        data={userJobs}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.list, { paddingBottom: bottomInset + 20 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={56} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No Jobs Posted</Text>
            <Text style={styles.emptyText}>Jobs you post will appear here</Text>
            <Pressable
              onPress={() => router.push("/post-job")}
              style={({ pressed }) => [styles.emptyButton, pressed && { opacity: 0.7 }]}
            >
              <Ionicons name="add" size={20} color={Colors.primary} />
              <Text style={styles.emptyButtonText}>Post Your First Job</Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

function MyJobItem({ job, index, onDelete, onPress }: { job: Job; index: number; onDelete: () => void; onPress: () => void }) {
  const anim = useSharedValue(0);

  useEffect(() => {
    anim.value = withDelay(index * 100, withSpring(1, { damping: 14, stiffness: 90 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: anim.value,
    transform: [
      { translateX: interpolate(anim.value, [0, 1], [-40, 0]) },
    ],
  }));

  const timeStr = new Date(job.postedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.jobCard, pressed && styles.cardPressed]}
      >
        <View style={styles.jobCardContent}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <View style={styles.jobMeta}>
            <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.jobMetaText}>{job.location}</Text>
            <View style={styles.dot} />
            <Text style={styles.jobMetaText}>${job.salary}/hr</Text>
            <View style={styles.dot} />
            <Text style={styles.jobMetaText}>{timeStr}</Text>
          </View>
        </View>

        <Pressable
          onPress={(e) => { e.stopPropagation?.(); onDelete(); }}
          style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.6 }]}
        >
          <Ionicons name="trash-outline" size={20} color={Colors.danger} />
        </Pressable>
      </Pressable>
    </Animated.View>
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
  backBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  topTitle: { fontFamily: "Inter_600SemiBold", fontSize: 18, color: Colors.text },
  list: { paddingHorizontal: 20, paddingTop: 8 },
  jobCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cardPressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  jobCardContent: { flex: 1, gap: 6 },
  jobTitle: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: Colors.text },
  jobMeta: { flexDirection: "row", alignItems: "center", gap: 5 },
  jobMetaText: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textMuted },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: Colors.textMuted },
  deleteBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    gap: 12,
  },
  emptyTitle: { fontFamily: "Inter_600SemiBold", fontSize: 20, color: Colors.textSecondary },
  emptyText: { fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.textMuted },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  emptyButtonText: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.primary },
});
