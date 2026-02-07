import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'theme/app_theme.dart';
import 'providers/app_provider.dart';
import 'screens/welcome_screen.dart';
import 'screens/home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ),
  );
  runApp(const FreelanceJoApp());
}

class FreelanceJoApp extends StatelessWidget {
  const FreelanceJoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => AppProvider(),
      child: Consumer<AppProvider>(
        builder: (context, provider, _) {
          return MaterialApp(
            title: 'Freelance Jo',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.darkTheme.copyWith(
              textTheme: GoogleFonts.interTextTheme(
                ThemeData.dark().textTheme,
              ),
            ),
            home: provider.isLoggedIn
                ? const HomeScreen()
                : const WelcomeScreen(),
          );
        },
      ),
    );
  }
}
