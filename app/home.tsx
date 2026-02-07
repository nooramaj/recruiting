import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Platform,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  interpolate,
  FadeIn,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import { useJobs, Job } from "@/lib/job-context";
import AnimatedJobCard from "@/components/AnimatedJobCard";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { filteredJobs, searchQuery, setSearchQuery, userName } = useJobs();
  const [refreshing, setRefreshing] = useState(false);

  const headerAnim = useSharedValue(0);
  const searchAnim = useSharedValue(0);
  const statsAnim = useSharedValue(0);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  useEffect(() => {
    headerAnim.value = withSpring(1, { damping: 14, stiffness: 90 });
    searchAnim.value = withDelay(200, withSpring(1, { damping: 14, stiffness: 90 }));
    statsAnim.value = withDelay(400, withSpring(1, { damping: 14, stiffness: 90 }));
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerAnim.value,
    transform: [{ translateY: interpolate(headerAnim.value, [0, 1], [-20, 0]) }],
  }));

  const searchStyle = useAnimatedStyle(() => ({
    opacity: searchAnim.value,
    transform: [{ translateY: interpolate(searchAnim.value, [0, 1], [20, 0]) }],
  }));

  const statsStyle = useAnimatedStyle(() => ({
    opacity: statsAnim.value,
    transform: [{ scale: interpolate(statsAnim.value, [0, 1], [0.9, 1]) }],
  }));

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const handleJobPress = useCallback((job: Job) => {
    router.push({ pathname: "/job-details", params: { jobId: job.id } });
  }, []);

  const greeting = getGreeting();

  const renderItem = useCallback(({ item, index }: { item: Job; index: number }) => (
    <AnimatedJobCard job={item} index={index} onPress={() => handleJobPress(item)} />
  ), [handleJobPress]);

  const renderHeader = useCallback(() => (
    <View style={styles.listHeader}>
      <Animated.View style={[styles.header, headerStyle]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.headerName}>{userName || "User"}</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              onPress={() => {
                if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/my-jobs");
              }}
              style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
            >
              <Ionicons name="time-outline" size={22} color={Colors.text} />
            </Pressable>
            <Pressable
              onPress={() => {
                if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/post-job");
              }}
              style={({ pressed }) => [styles.addButton, pressed && styles.iconButtonPressed]}
            >
              <Ionicons name="add" size={22} color={Colors.white} />
            </Pressable>
          </View>
        </View>
      </Animated.View>

      <Animated.View style={[styles.searchContainer, searchStyle]}>
        <Ionicons name="search" size={20} color={Colors.textMuted} />
        <TextInput
          testID="search-input"
          style={styles.searchInput}
          placeholder="Search jobs, locations..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={Colors.textMuted} />
          </Pressable>
        )}
      </Animated.View>

      <Animated.View style={[styles.statsRow, statsStyle]}>
        <StatCard icon="briefcase-outline" label="Available" value={filteredJobs.length.toString()} color={Colors.primary} />
        <StatCard icon="location-outline" label="Cities" value="5" color={Colors.accent} />
        <StatCard icon="trending-up-outline" label="New" value="3" color={Colors.warning} />
      </Animated.View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {searchQuery ? "Search Results" : "Available Jobs"}
        </Text>
        <Text style={styles.sectionCount}>{filteredJobs.length} jobs</Text>
      </View>
    </View>
  ), [headerStyle, searchStyle, statsStyle, greeting, userName, searchQuery, filteredJobs.length, setSearchQuery]);

  const renderEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={48} color={Colors.textMuted} />
      <Text style={styles.emptyTitle}>No Jobs Found</Text>
      <Text style={styles.emptyText}>Try adjusting your search terms</Text>
    </View>
  ), []);

  return (
    <View style={[styles.container, { paddingTop: topInset }]}>
      <FlatList
        data={filteredJobs}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: bottomInset + 20 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      />

      <Pressable
        onPress={() => {
          if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push("/post-job");
        }}
        style={({ pressed }) => [
          styles.fab,
          { bottom: bottomInset + 20 },
          pressed && styles.fabPressed,
        ]}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={28} color={Colors.white} />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

function StatCard({ icon, label, value, color }: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + "15" }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    paddingHorizontal: 20,
  },
  listHeader: {
    gap: 16,
    marginBottom: 8,
  },
  header: {
    marginTop: 8,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textMuted,
  },
  headerName: {
    fontFamily: "Inter_700Bold",
    fontSize: 26,
    color: Colors.text,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  iconButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.text,
    padding: 0,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: Colors.text,
  },
  statLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    color: Colors.text,
  },
  sectionCount: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textMuted,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 10,
  },
  emptyTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    color: Colors.textSecondary,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textMuted,
  },
  fab: {
    position: "absolute",
    right: 20,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  fabPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.92 }],
  },
});
