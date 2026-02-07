import React, { useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { useJobs } from "@/lib/job-context";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { isLoggedIn } = useJobs();

  const logoAnim = useSharedValue(0);
  const titleAnim = useSharedValue(0);
  const subtitleAnim = useSharedValue(0);
  const buttonsAnim = useSharedValue(0);
  const floatingAnim = useSharedValue(0);
  const orb1 = useSharedValue(0);
  const orb2 = useSharedValue(0);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/home");
      return;
    }
    orb1.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.quad) });
    orb2.value = withDelay(200, withTiming(1, { duration: 1200, easing: Easing.out(Easing.quad) }));
    logoAnim.value = withDelay(300, withSpring(1, { damping: 12, stiffness: 100 }));
    titleAnim.value = withDelay(600, withSpring(1, { damping: 14, stiffness: 90 }));
    subtitleAnim.value = withDelay(800, withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) }));
    buttonsAnim.value = withDelay(1000, withSpring(1, { damping: 14, stiffness: 80 }));
    floatingAnim.value = withDelay(1400, withTiming(1, { duration: 800 }));
  }, [isLoggedIn]);

  const orb1Style = useAnimatedStyle(() => ({
    opacity: interpolate(orb1.value, [0, 1], [0, 0.15]),
    transform: [{ scale: interpolate(orb1.value, [0, 1], [0.5, 1]) }],
  }));

  const orb2Style = useAnimatedStyle(() => ({
    opacity: interpolate(orb2.value, [0, 1], [0, 0.1]),
    transform: [{ scale: interpolate(orb2.value, [0, 1], [0.5, 1]) }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoAnim.value,
    transform: [
      { scale: interpolate(logoAnim.value, [0, 1], [0.3, 1]) },
      { translateY: interpolate(logoAnim.value, [0, 1], [40, 0]) },
    ],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleAnim.value,
    transform: [{ translateY: interpolate(titleAnim.value, [0, 1], [30, 0]) }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleAnim.value,
    transform: [{ translateY: interpolate(subtitleAnim.value, [0, 1], [20, 0]) }],
  }));

  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: buttonsAnim.value,
    transform: [{ translateY: interpolate(buttonsAnim.value, [0, 1], [40, 0]) }],
  }));

  const handleLogin = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(auth)/login");
  };

  const handleRegister = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(auth)/register");
  };

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { paddingTop: topInset, paddingBottom: bottomInset + 20 }]}>
      <Animated.View style={[styles.orb1, orb1Style]} />
      <Animated.View style={[styles.orb2, orb2Style]} />

      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoGradient}
          >
            <Ionicons name="briefcase" size={44} color={Colors.white} />
          </LinearGradient>
        </Animated.View>

        <Animated.View style={titleStyle}>
          <Text style={styles.title}>Freelance Jo</Text>
        </Animated.View>

        <Animated.View style={subtitleStyle}>
          <Text style={styles.subtitle}>
            Find freelance opportunities across Jordan.{"\n"}Post jobs, connect instantly.
          </Text>
        </Animated.View>

        <Animated.View style={[styles.featuresRow, { opacity: floatingAnim }]}>
          <View style={styles.featureItem}>
            <Ionicons name="search" size={20} color={Colors.primaryLight} />
            <Text style={styles.featureText}>Find Jobs</Text>
          </View>
          <View style={styles.featureDivider} />
          <View style={styles.featureItem}>
            <Ionicons name="create-outline" size={20} color={Colors.accent} />
            <Text style={styles.featureText}>Post Jobs</Text>
          </View>
          <View style={styles.featureDivider} />
          <View style={styles.featureItem}>
            <Ionicons name="chatbubble-outline" size={20} color={Colors.warning} />
            <Text style={styles.featureText}>Connect</Text>
          </View>
        </Animated.View>
      </View>

      <Animated.View style={[styles.buttonsContainer, buttonsStyle]}>
        <Pressable
          onPress={handleLogin}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.primaryButtonText}>Sign In</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.white} />
          </LinearGradient>
        </Pressable>

        <Pressable
          onPress={handleRegister}
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.secondaryButtonText}>Create Account</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  orb1: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.primary,
  },
  orb2: {
    position: "absolute",
    bottom: 100,
    left: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: Colors.accent,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  logoContainer: {
    marginBottom: 8,
  },
  logoGradient: {
    width: 88,
    height: 88,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 36,
    color: Colors.white,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  featuresRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  featureText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  featureDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.cardBorder,
  },
  buttonsContainer: {
    width: "100%",
    gap: 12,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  primaryButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 17,
    color: Colors.white,
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 17,
    color: Colors.textSecondary,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
