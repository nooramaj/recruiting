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
  withDelay,
  interpolate,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import Colors from "@/constants/colors";
import { useJobs } from "@/lib/job-context";
import * as Haptics from "expo-haptics";

const CITIES = ["Amman", "Irbid", "Ajloun", "AL-Zarqaa", "Aqaba"];
const CATEGORIES = ["Healthcare", "Hospitality", "Creative", "Services", "Technical", "Office", "Other"];

export default function PostJobScreen() {
  const insets = useSafeAreaInsets();
  const { addJob } = useJobs();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("Amman");
  const [category, setCategory] = useState("Other");
  const [showCityPicker, setShowCityPicker] = useState(false);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  const formAnim = useSharedValue(0);
  useEffect(() => {
    formAnim.value = withSpring(1, { damping: 14, stiffness: 80 });
  }, []);

  const formStyle = useAnimatedStyle(() => ({
    opacity: formAnim.value,
    transform: [{ translateY: interpolate(formAnim.value, [0, 1], [30, 0]) }],
  }));

  const handlePost = () => {
    if (!title.trim()) { Alert.alert("Missing", "Job title is required."); return; }
    if (!description.trim()) { Alert.alert("Missing", "Job description is required."); return; }
    if (!salary.trim()) { Alert.alert("Missing", "Salary is required."); return; }
    const ageNum = parseInt(age) || 18;
    if (ageNum < 18) { Alert.alert("Invalid", "Minimum age must be 18 or above."); return; }

    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addJob({ title: title.trim(), description: description.trim(), salary: salary.trim(), age: ageNum, location: city, category });
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: topInset }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>Post a Job</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAwareScrollViewCompat
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomInset + 30 }]}
        bottomOffset={60}
      >
        <Animated.View style={[styles.form, formStyle]}>
          <FormField label="Job Title" required>
            <View style={styles.inputRow}>
              <Ionicons name="briefcase-outline" size={20} color={Colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="e.g. Graphic Designer"
                placeholderTextColor={Colors.textMuted}
                value={title}
                onChangeText={setTitle}
              />
            </View>
          </FormField>

          <FormField label="Description" required>
            <View style={[styles.inputRow, { alignItems: "flex-start" }]}>
              <Ionicons name="document-text-outline" size={20} color={Colors.textMuted} style={{ marginTop: 14 }} />
              <TextInput
                style={[styles.input, { minHeight: 90, textAlignVertical: "top" }]}
                placeholder="Describe the job requirements..."
                placeholderTextColor={Colors.textMuted}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
            </View>
          </FormField>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <FormField label="Salary ($/hr)" required>
                <View style={styles.inputRow}>
                  <Ionicons name="cash-outline" size={20} color={Colors.textMuted} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 15"
                    placeholderTextColor={Colors.textMuted}
                    value={salary}
                    onChangeText={setSalary}
                    keyboardType="number-pad"
                  />
                </View>
              </FormField>
            </View>
            <View style={{ flex: 1 }}>
              <FormField label="Min Age">
                <View style={styles.inputRow}>
                  <Ionicons name="people-outline" size={20} color={Colors.textMuted} />
                  <TextInput
                    style={styles.input}
                    placeholder="18"
                    placeholderTextColor={Colors.textMuted}
                    value={age}
                    onChangeText={setAge}
                    keyboardType="number-pad"
                  />
                </View>
              </FormField>
            </View>
          </View>

          <FormField label="Category">
            <View style={styles.categoryGrid}>
              {CATEGORIES.map(cat => (
                <Pressable
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[
                    styles.categoryChip,
                    category === cat && styles.categoryChipActive,
                  ]}
                >
                  <Text style={[
                    styles.categoryChipText,
                    category === cat && styles.categoryChipTextActive,
                  ]}>{cat}</Text>
                </Pressable>
              ))}
            </View>
          </FormField>

          <FormField label="Location">
            <Pressable
              style={styles.dropdownButton}
              onPress={() => setShowCityPicker(!showCityPicker)}
            >
              <Ionicons name="location-outline" size={20} color={Colors.textMuted} />
              <Text style={styles.dropdownText}>{city}</Text>
              <Ionicons name={showCityPicker ? "chevron-up" : "chevron-down"} size={18} color={Colors.textMuted} />
            </Pressable>
            {showCityPicker && (
              <View style={styles.cityList}>
                {CITIES.map(c => (
                  <Pressable
                    key={c}
                    style={[styles.cityItem, city === c && styles.cityItemActive]}
                    onPress={() => { setCity(c); setShowCityPicker(false); }}
                  >
                    <Text style={[styles.cityText, city === c && styles.cityTextActive]}>{c}</Text>
                    {city === c && <Ionicons name="checkmark" size={18} color={Colors.primary} />}
                  </Pressable>
                ))}
              </View>
            )}
          </FormField>

          <Pressable
            onPress={handlePost}
            style={({ pressed }) => [styles.submitButton, pressed && styles.pressed]}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitGradient}
            >
              <Ionicons name="paper-plane-outline" size={20} color={Colors.white} />
              <Text style={styles.submitText}>Post Job</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.required}>*</Text>}
      </View>
      {children}
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
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  topTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    color: Colors.text,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8 },
  form: { gap: 20 },
  field: { gap: 8 },
  labelRow: { flexDirection: "row", gap: 4 },
  label: { fontFamily: "Inter_500Medium", fontSize: 14, color: Colors.textSecondary },
  required: { fontFamily: "Inter_500Medium", fontSize: 14, color: Colors.danger },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.inputBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 14,
    gap: 10,
  },
  input: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 14,
  },
  row: { flexDirection: "row", gap: 12 },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary + "20",
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.textMuted,
  },
  categoryChipTextActive: {
    color: Colors.primary,
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
  cityItemActive: { backgroundColor: Colors.backgroundLight },
  cityText: { fontFamily: "Inter_400Regular", fontSize: 15, color: Colors.text },
  cityTextActive: { fontFamily: "Inter_600SemiBold", color: Colors.primary },
  submitButton: { borderRadius: 16, overflow: "hidden", marginTop: 8 },
  submitGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  submitText: { fontFamily: "Inter_600SemiBold", fontSize: 17, color: Colors.white },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});
