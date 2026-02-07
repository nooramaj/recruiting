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
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import Colors from "@/constants/colors";
import { useJobs } from "@/lib/job-context";
import * as Haptics from "expo-haptics";

const CITIES = ["Amman", "Irbid", "Zarqa", "Ajloun", "Aqaba"];

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { setIsLoggedIn, setUserName } = useJobs();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCity, setSelectedCity] = useState("Amman");
  const [showCityPicker, setShowCityPicker] = useState(false);

  const formAnim = useSharedValue(0);

  useEffect(() => {
    formAnim.value = withSpring(1, { damping: 14, stiffness: 80 });
  }, []);

  const formStyle = useAnimatedStyle(() => ({
    opacity: formAnim.value,
    transform: [{ translateY: interpolate(formAnim.value, [0, 1], [30, 0]) }],
  }));

  const handleRegister = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Missing Info", "Please fill in name, email, and password.");
      return;
    }
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoggedIn(true);
    setUserName(name.trim());
    router.dismissAll();
    router.replace("/home");
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={styles.scroll}
      contentContainerStyle={[
        styles.container,
        { paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 30 },
      ]}
      bottomOffset={60}
    >
      <Animated.View style={[styles.formWrapper, formStyle]}>
        <View style={styles.header}>
          <Text style={styles.title}>Join Freelance Jo</Text>
          <Text style={styles.subtitle}>Create your account to get started</Text>
        </View>

        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={Colors.textMuted} />
          </View>
          <View style={styles.cameraButton}>
            <Ionicons name="camera" size={14} color={Colors.white} />
          </View>
        </View>

        <View style={styles.form}>
          <InputField icon="person-outline" label="Full Name" value={name} onChangeText={setName} placeholder="Your full name" />
          <InputField icon="mail-outline" label="Email" value={email} onChangeText={setEmail} placeholder="your@email.com" keyboardType="email-address" />
          <InputField icon="lock-closed-outline" label="Password" value={password} onChangeText={setPassword} placeholder="Create a password" secure />
          <InputField icon="calendar-outline" label="Age" value={age} onChangeText={setAge} placeholder="Your age" keyboardType="number-pad" />
          <InputField icon="call-outline" label="Phone Number" value={phone} onChangeText={setPhone} placeholder="+962 7XX XXX XXX" keyboardType="phone-pad" />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>City</Text>
            <Pressable
              style={styles.dropdownButton}
              onPress={() => setShowCityPicker(!showCityPicker)}
            >
              <Ionicons name="location-outline" size={20} color={Colors.textMuted} />
              <Text style={styles.dropdownText}>{selectedCity}</Text>
              <Ionicons name={showCityPicker ? "chevron-up" : "chevron-down"} size={18} color={Colors.textMuted} />
            </Pressable>
            {showCityPicker && (
              <View style={styles.cityList}>
                {CITIES.map(city => (
                  <Pressable
                    key={city}
                    style={[
                      styles.cityItem,
                      selectedCity === city && styles.cityItemActive,
                    ]}
                    onPress={() => {
                      setSelectedCity(city);
                      setShowCityPicker(false);
                    }}
                  >
                    <Text style={[
                      styles.cityText,
                      selectedCity === city && styles.cityTextActive,
                    ]}>{city}</Text>
                    {selectedCity === city && <Ionicons name="checkmark" size={18} color={Colors.primary} />}
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <Pressable
            onPress={handleRegister}
            style={({ pressed }) => [styles.submitButton, pressed && styles.pressed]}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitGradient}
            >
              <Text style={styles.submitText}>Create Account</Text>
              <Ionicons name="arrow-forward" size={20} color={Colors.white} />
            </LinearGradient>
          </Pressable>
        </View>
      </Animated.View>
    </KeyboardAwareScrollViewCompat>
  );
}

function InputField({
  icon, label, value, onChangeText, placeholder, keyboardType, secure
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'number-pad' | 'phone-pad';
  secure?: boolean;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <Ionicons name={icon} size={20} color={Colors.textMuted} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType || "default"}
          secureTextEntry={!!secure}
          autoCapitalize={keyboardType === "email-address" ? "none" : "words"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  formWrapper: { gap: 24 },
  header: { gap: 6 },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 26,
    color: Colors.white,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.textSecondary,
  },
  avatarContainer: {
    alignSelf: "center",
    position: "relative",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.cardBorder,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.background,
  },
  form: { gap: 16 },
  inputGroup: { gap: 6 },
  label: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
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
    paddingVertical: 14,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.inputBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  dropdownText: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: Colors.text,
  },
  cityList: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: "hidden",
  },
  cityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  cityItemActive: {
    backgroundColor: Colors.backgroundLight,
  },
  cityText: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.text,
  },
  cityTextActive: {
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary,
  },
  submitButton: { borderRadius: 14, overflow: "hidden", marginTop: 8 },
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
});
