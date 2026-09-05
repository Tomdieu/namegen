# NameGen for Android (React Native & Expo SDK 57)

**NameGen** by [Tomdieu ivan](https://ivantomdieu.vercel.app/en) — 26ⁿ Letter Combinatorics and Pronounceable Name Generator built for Android using **React Native** and **Expo SDK 57**.

---

## 📱 Mobile Features Included

- **⚡ 26ⁿ Combinatorics Engine**: Real-time formula calculations for theoretical permutation spaces (e.g., 26⁹ = 5.43 Trillion combinations).
- **🗣️ Multi-mode Generation**:
  - *Pronounceable*: Natural phonetic syllable synthesis with alternating vowel/consonant harmonic flow.
  - *Pattern*: Syllabic rhythm templates.
  - *Acrostic*: Positive character-by-character poetic meaning generator.
  - *Random*: Unconstrained combinatorial permutation sampling.
- **🎯 Interactive Slot Constraints**: Tap individual letter positions (1 to 9+) to lock specific vowels, consonants, or characters.
- **📋 Haptic Copying**: 1-tap clipboard copy with native Android haptic feedback (`expo-haptics`).
- **⭐ Offline Favorites**: Save, review, and manage names persisted locally via `@react-native-async-storage/async-storage`.
- **📐 Mathematical Explainer**: Interactive modal explaining permutation logic and exponential growth.
- **✨ Acrostic Meaning Modal**: Deep-dive into each character's assigned trait.
- **🎨 Neo-Brutalist Visual Design**: High-contrast, bold borders, offset solid shadows, and signature vibrant accents (#FFD100, #FF477E, #00D1FF, #00E699).

---

## 🚀 How to Run on Android

### Prerequisites
- Node.js (v18 or v20+)
- Android Studio with Android Emulator OR a physical Android device with the **Expo Go** app installed from the Google Play Store.

### 1. Navigate to the mobile directory
```bash
cd mobile
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the Expo development server
```bash
npx expo start --android
```
Or simply:
```bash
npx expo start
```

### 4. Open on your Android device
- **Physical Device**: Scan the QR code displayed in the terminal using the **Expo Go** app on your phone.
- **Android Emulator**: Press `a` in your terminal to launch automatically on your running Android Virtual Device (AVD).

---

## 📦 Building Standalone Android APK / AAB

To build a standalone Android production package (.aab or .apk) with EAS (Expo Application Services):

```bash
# Install EAS CLI globally if not already installed
npm install -g eas-cli

# Log in to your Expo account
eas login

# Configure EAS build
eas build:configure

# Build Android APK for testing or AAB for Google Play Store
eas build --platform android --profile preview
```

---

## 👨‍💻 Creator & Links
- **Creator**: [Tomdieu ivan](https://ivantomdieu.vercel.app/en)
- **Web App**: [namegen-phi.vercel.app](https://namegen-phi.vercel.app/)
- **GitHub**: [github.com/Tomdieu/namegen](https://github.com/Tomdieu/namegen)
- **License**: MIT
