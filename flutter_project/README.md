# Freelance Jo

A freelance job marketplace app for Jordan. Browse, search, post, and manage freelance job listings with WhatsApp contact integration.

## Setup Instructions

### Step 1: Create Flutter Project

Open terminal and run:

```bash
flutter create freelance_jo
```

### Step 2: Copy Files

Copy all files from this folder into the created project:

1. Replace `pubspec.yaml` with the one from this folder
2. Replace the entire `lib/` folder with the one from this folder
3. Copy `analysis_options.yaml` into the project root

### Step 3: Install Dependencies

```bash
cd freelance_jo
flutter pub get
```

### Step 4: Run

```bash
flutter run
```

Or open the project folder in **Android Studio** and click the Run button.

## Features

- Welcome screen with animations
- Login and Register (local storage)
- Job listings with search and category filters
- Post new jobs with category and location selection
- My Jobs screen with swipe-to-delete
- Job details with WhatsApp contact button
- Dark navy theme
- Staggered card animations
- 8 pre-loaded sample jobs
- Data saved locally using SharedPreferences

## Project Structure

```
lib/
  main.dart                    - App entry point
  theme/
    app_theme.dart             - Colors and theme
  models/
    job.dart                   - Job data model
  providers/
    app_provider.dart          - State management
  screens/
    welcome_screen.dart        - Landing page
    login_screen.dart          - Sign in
    register_screen.dart       - Create account
    home_screen.dart           - Job listings
    post_job_screen.dart       - Post a job
    my_jobs_screen.dart        - Your posted jobs
    job_details_screen.dart    - Job details + WhatsApp
  widgets/
    job_card.dart              - Animated job card
```

## Dependencies

- provider - State management
- shared_preferences - Local data storage
- google_fonts - Inter font family
- url_launcher - WhatsApp links
- intl - Date formatting

No Firebase. No backend. Pure frontend.
