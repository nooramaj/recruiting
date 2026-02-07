import 'package:flutter/material.dart';

class AppColors {
  static const Color background = Color(0xFF0A0E1A);
  static const Color surface = Color(0xFF141929);
  static const Color surfaceLight = Color(0xFF1C2237);
  static const Color primary = Color(0xFF4A9EFF);
  static const Color primaryDark = Color(0xFF2B7DE9);
  static const Color accent = Color(0xFF00D4AA);
  static const Color accentOrange = Color(0xFFFF8C42);
  static const Color textPrimary = Color(0xFFF0F2F5);
  static const Color textSecondary = Color(0xFFB0B8C8);
  static const Color textMuted = Color(0xFF6B7280);
  static const Color danger = Color(0xFFFF4D6A);
  static const Color border = Color(0xFF2A3045);

  static const Color healthcare = Color(0xFF4A9EFF);
  static const Color hospitality = Color(0xFFFF8C42);
  static const Color creative = Color(0xFFE040FB);
  static const Color services = Color(0xFF00D4AA);
  static const Color technical = Color(0xFFFFD740);
  static const Color office = Color(0xFF7C8CF8);
}

class AppTheme {
  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.background,
      primaryColor: AppColors.primary,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.primary,
        secondary: AppColors.accent,
        surface: AppColors.surface,
        error: AppColors.danger,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: IconThemeData(color: AppColors.textPrimary),
        titleTextStyle: TextStyle(
          color: AppColors.textPrimary,
          fontSize: 20,
          fontWeight: FontWeight.w600,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surfaceLight,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: AppColors.primary, width: 2),
        ),
        hintStyle: const TextStyle(color: AppColors.textMuted),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          textStyle: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }

  static Color getCategoryColor(String category) {
    switch (category.toLowerCase()) {
      case 'healthcare':
        return AppColors.healthcare;
      case 'hospitality':
        return AppColors.hospitality;
      case 'creative':
        return AppColors.creative;
      case 'services':
        return AppColors.services;
      case 'technical':
        return AppColors.technical;
      case 'office':
        return AppColors.office;
      default:
        return AppColors.primary;
    }
  }

  static IconData getCategoryIcon(String category) {
    switch (category.toLowerCase()) {
      case 'healthcare':
        return Icons.local_hospital;
      case 'hospitality':
        return Icons.restaurant;
      case 'creative':
        return Icons.brush;
      case 'services':
        return Icons.build;
      case 'technical':
        return Icons.computer;
      case 'office':
        return Icons.business_center;
      default:
        return Icons.work;
    }
  }
}
