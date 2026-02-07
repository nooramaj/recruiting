import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { router, Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import Colors from "@/constants/colors";
import { useJobs } from "@/lib/job-context";
import * as Haptics from "expo-haptics";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { setIsLoggedIn, setUserName } = useJobs();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const formAnim = useSharedValue(0);

  useEffect(() => {
    formAnim.value = withSpring(1, { damping: 14, stiffness: 80 });
  }, []);

  const formStyle = useAnimatedStyle(() => ({
    opacity: formAnim.value,
    transform: [{ translateY: interpolate(formAnim.value, [0, 1], [30, 0]) }],
  }));

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing Info", "Please enter both email and password.");
      return;
    }
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoggedIn(true);
    setUserName(email.split("@")[0] || "User");
    router.dismissAll();
    router.replace("/home");
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={styles.scroll}
      contentContainerStyle={[
        styles.container,
        { paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 20 },
      ]}
      bottomOffset={60}
    >
      <Animated.View style={[styles.formWrapper, formStyle]}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to find your next opportunity</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={Colors.textMuted} />
              </Pressable>
            </View>
          </View>

          <Pressable
            onPress={handleLogin}
            style={({ pressed }) => [styles.submitButton, pressed && styles.pressed]}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitGradient}
            >
              <Text style={styles.submitText}>Sign In</Text>
              <Ionicons name="arrow-forward" size={20} color={Colors.white} />
            </LinearGradient>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Link href="/(auth)/register" asChild>
            <Pressable>
              <Text style={styles.linkText}>Create Account</Text>
            </Pressable>
          </Link>
        </View>
      </Animated.View>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  formWrapper: { gap: 32 },
  header: { gap: 8 },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    color: Colors.white,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.textSecondary,
  },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: Colors.textSecondary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.inputBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 16,
  },
  eyeButton: { padding: 4 },
  submitButton: { borderRadius: 14, overflow: "hidden", marginTop: 4 },
  submitGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  submitText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 17,
    color: Colors.white,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textMuted,
  },
  linkText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.primary,
  },
});
