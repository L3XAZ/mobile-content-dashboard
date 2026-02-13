# Mobile Content Dashboard

**GitHub Repository:** https://github.com/L3XAZ/mobile-content-dashboard

React Native (Expo) application demonstrating a complete authentication flow with PIN codes, biometric unlock, offline-first data access, and RTL support.

---

## Overview

The app includes:

- Authentication via test API (dummyjson.com)
- Per-user PIN creation and verification
- Biometric unlock (Face ID / Fingerprint) as a PIN unlock mechanism
- Offline-first data access for posts
- RTL-safe UI with Arabic language support
- Clear architectural separation between UI, business logic, and secure storage

---

## How to install and run locally

1. Clone the repository

   `git clone https://github.com/L3XAZ/mobile-content-dashboard.git`

   `cd mobile-content-dashboard`

2. Install dependencies:

   `npm install`

3. Start the application:

   `npx expo start`

   With cache reset:

   `npx expo start -c`

4. Open the app in Expo Go on a physical device.

---

## Test Accounts

| Username | Password     |
| -------- | ------------ |
| williamg | williamgpass |
| averyp   | averyppass   |
| evelyns  | evelynspass  |
| logant   | logantpass   |
| abigailr | abigailrpass |
| jacksone | jacksonepass |
| madisonc | madisoncpass |
| elijahs  | elijahspass  |
| chloem   | chloempass   |
| mateon   | mateonpass   |

---

## Authentication

### Login

Login is performed via POST /auth/login on the dummyjson API.

Access and refresh tokens are stored securely (see Secure Storage).

After login, the app checks whether a PIN already exists for the user and redirects accordingly.

### Registration

Registration is implemented as a mock flow because dummyjson does not provide a real auth-backed registration endpoint.

The app uses POST /users/add to create a user record and then authenticates the user locally. This allows PIN creation, biometric unlock, and offline-first behavior to be demonstrated without relying on fake tokens.

In a production environment, this flow would be replaced by a real registration endpoint issuing tokens.

### PIN Code Flow

Each user must set a personal PIN on first login.

- PIN is stored per user, scoped by `userId` (`pin_${userId}`)
- PIN is never stored in Redux, serialized, or logged
- Create, repeat, and enter flows are clearly separated
- Incorrect PIN resets the flow in a predictable way
- PINs persist between sessions and app restarts

### Biometric Authentication

Biometrics (Face ID / Fingerprint) are used only to unlock the app with the stored PIN, not as a replacement for login.

- Availability and enrollment are checked explicitly
- User consent is required
- Biometric state is scoped per user
- Biometric unlock uses the stored PIN with no implicit side effects

### Secure Storage

Sensitive data is kept outside Redux.

**Production / development builds:** react-native-keychain (iOS Keychain, Android Keystore).

**Expo Go (development fallback):** AsyncStorage, because Expo Go does not support custom native modules. The fallback is automatic and transparent.

**Stored data:** PIN codes (per user), access token, refresh token. Tokens are cleared on logout. PINs stay per user and persist between sessions.

### Existing Login & App Restart

- Redux Persist restores auth state on app restart
- PIN screen is shown instead of the welcome screen
- Biometric unlock triggers automatically when enabled

---

## Offline-First Data Access

Posts are loaded from https://jsonplaceholder.typicode.com/ using TanStack React Query v5 and an AsyncStorage persister. Data is cached locally so the app remains usable offline.

---

## Internationalization & RTL

- English and Arabic are supported.
- Full RTL via I18nManager; no hardcoded left/right spacing.
- Icons and navigation mirror correctly in RTL.
- Direction change triggers a controlled app reload.
- All screens are RTL-safe without separate layouts.

---

## Linting and Formatting

Run ESLint:

`npm run lint`

Auto-fix ESLint issues:

`npm run lint:fix`

Format code:

`npm run format`

The project uses strict TypeScript and ESLint: no `any` or unsafe casts.

## Technology Stack

### Core

- React Native
- Expo (Expo Router)
- TypeScript (strict mode)
- Redux Toolkit
- Redux Persist
- TanStack React Query v5
- AsyncStorage (state and cache persistence)

### Authentication & Security

- react-native-keychain (Keychain / Keystore)
- expo-local-authentication (Face ID / Biometrics)
- axios
- axios-auth-refresh

### Forms & Validation

- react-hook-form
- zod

### UI & Styling

- NativeWind (Tailwind v4)
- react-native-svg
- @expo/vector-icons

### Internationalization

- i18next
- react-i18next
- RTL via I18nManager

---
