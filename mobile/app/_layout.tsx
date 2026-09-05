import { useEffect } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FavoritesProvider } from '../src/store/favorites';

SplashScreen.preventAutoHideAsync();

const BRAND_YELLOW = '#FFD100';
const INK = '#1A1A1A';
const CREAM = '#FFF9E6';

const modalHeaderOptions = {
  presentation: 'modal' as const,
  headerShown: true,
  headerStyle: { backgroundColor: BRAND_YELLOW },
  headerTitleStyle: { fontWeight: '900' as const, color: INK },
  headerTintColor: INK,
  headerShadowVisible: false,
  contentStyle: { backgroundColor: CREAM },
};

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <FavoritesProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: CREAM },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen
            name="favorites"
            options={{ ...modalHeaderOptions, title: 'Saved Names' }}
          />
          <Stack.Screen
            name="math"
            options={{ ...modalHeaderOptions, title: '26ⁿ Combinatorics' }}
          />
          <Stack.Screen
            name="meaning"
            options={{
              presentation: 'transparentModal',
              animation: 'fade',
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' },
            }}
          />
        </Stack>
      </FavoritesProvider>
    </SafeAreaProvider>
  );
}
