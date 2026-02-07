# Freelance Jo

## Overview

Freelance Jo is a mobile-first job board application targeting the Jordanian freelance market. Users can browse, search, post, and manage freelance job listings across Jordanian cities (Amman, Irbid, Ajloun, AL-Zarqaa, Aqaba). The app features authentication (login/register), job posting with categories (Healthcare, Hospitality, Creative, Services, Technical, Office), and job detail views with WhatsApp contact integration.

The project uses an Expo React Native frontend with an Express backend, designed to run on Replit with support for web, iOS, and Android platforms.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (Expo / React Native)

- **Framework**: Expo SDK 54 with React Native 0.81, using the new architecture (`newArchEnabled: true`)
- **Routing**: expo-router with file-based routing. Routes are defined in the `app/` directory:
  - `app/index.tsx` — Welcome/landing screen with animated intro, redirects to `/home` if logged in
  - `app/(auth)/login.tsx` and `app/(auth)/register.tsx` — Authentication screens presented as a modal stack
  - `app/home.tsx` — Main job listing screen with search and filtering
  - `app/post-job.tsx` — Form to create new job listings
  - `app/my-jobs.tsx` — User's posted jobs with delete capability
  - `app/job-details.tsx` — Job detail modal view
- **State Management**: React Context (`lib/job-context.tsx`) manages all job data and auth state. Jobs are persisted locally via `@react-native-async-storage/async-storage`. Default seed data includes 8 sample jobs.
- **Animations**: Heavy use of `react-native-reanimated` for spring/timing animations on cards, headers, and page transitions
- **Styling**: Custom dark theme defined in `constants/colors.ts` with a deep navy blue palette. No CSS framework — all styles use React Native `StyleSheet`
- **Fonts**: Inter font family (400, 500, 600, 700 weights) via `@expo-google-fonts/inter`
- **Data Fetching**: `@tanstack/react-query` is set up with a query client (`lib/query-client.ts`) that points to the Express API server, though currently most data is managed client-side via context

### Backend (Express)

- **Framework**: Express 5 running on Node.js
- **Entry point**: `server/index.ts` — sets up CORS (supporting Replit domains and localhost), serves the API and static files
- **Routes**: `server/routes.ts` — currently a skeleton with no API routes defined yet; ready for expansion
- **Storage**: `server/storage.ts` — implements an in-memory storage (`MemStorage`) with a `IStorage` interface for user CRUD operations. This is a placeholder ready to be swapped with database-backed storage.
- **CORS**: Configured to accept requests from Replit dev/deployment domains and localhost origins

### Database Schema

- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema** (`shared/schema.ts`): Currently defines a single `users` table with `id` (UUID, auto-generated), `username` (unique), and `password` fields
- **Validation**: Uses `drizzle-zod` to generate Zod schemas from the Drizzle table definitions
- **Config**: `drizzle.config.ts` reads `DATABASE_URL` env variable; migrations output to `./migrations`
- **Note**: Job data is currently stored client-side only (AsyncStorage). The database is set up for user auth but job persistence has not yet been moved server-side.

### Build & Development

- **Dev workflow**: Two processes run simultaneously:
  - `expo:dev` — Starts Expo dev server with Replit proxy configuration
  - `server:dev` — Runs Express server via `tsx`
- **Production build**: 
  - `expo:static:build` — Custom build script (`scripts/build.js`) that bundles the Expo web app
  - `server:build` — Uses esbuild to bundle the server
  - `server:prod` — Runs the production server
- **Database migrations**: `db:push` runs `drizzle-kit push` to sync schema

### Key Design Decisions

1. **Client-side job storage vs server-side**: Jobs are currently managed entirely in React Context with AsyncStorage persistence. This was likely chosen for rapid prototyping but should migrate to the server/database for multi-user support.
2. **In-memory user storage**: The `MemStorage` class is a temporary solution. The `IStorage` interface is designed to be easily swapped for a Drizzle/Postgres implementation.
3. **Dark theme only**: The app uses a fixed dark navy theme rather than following system appearance, despite `userInterfaceStyle: "automatic"` in app.json.
4. **No real authentication**: Login/register currently just sets local state — no server-side auth, sessions, or password hashing is implemented yet.

## External Dependencies

- **PostgreSQL**: Database configured via `DATABASE_URL` environment variable, used with Drizzle ORM
- **AsyncStorage**: `@react-native-async-storage/async-storage` for client-side persistence of jobs and auth state
- **Expo Services**: Various Expo modules (haptics, image picker, location, web browser, linear gradient, blur)
- **WhatsApp Integration**: Job details screen includes WhatsApp contact links via deep linking
- **Replit Infrastructure**: Build and dev scripts are configured for Replit's domain proxying (`REPLIT_DEV_DOMAIN`, `REPLIT_DOMAINS`, `REPLIT_INTERNAL_APP_DOMAIN`)