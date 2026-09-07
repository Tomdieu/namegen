import { useEffect } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FavoritesProvider } from '../src/store/favorites';
import { FiltersProvider } from '../src/store/filters';
import { PreferencesProvider, usePreferences } from '../src/store/preferences';
import { brand } from '../src/theme';

SplashScreen.preventAutoHideAsync();

function ThemedRoot() {
  const { colors, t } = usePreferences();

  return (
    <>
      <StatusBar style={"light"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="filters"
          options={{
            presentation: 'formSheet',
            headerShown: true,
            title: t('sheetFilters'),
            headerStyle: { backgroundColor: brand.yellow },
            headerTitleStyle: { fontWeight: '900', color: brand.ink },
            headerTintColor: brand.ink,
            headerShadowVisible: false,
            contentStyle: { backgroundColor: colors.bg },
            sheetGrabberVisible: true,
            sheetCornerRadius: 16,
            sheetExpandsWhenScrolledToEdge: true,
            sheetAllowedDetents: [0.85],
          }}
        />
        <Stack.Screen
          name="math"
          options={{
            presentation: 'formSheet',
            headerShown: true,
            title: t('sheetMath'),
            headerStyle: { backgroundColor: brand.yellow },
            headerTitleStyle: { fontWeight: '900', color: brand.ink },
            headerTintColor: brand.ink,
            headerShadowVisible: false,
            contentStyle: { backgroundColor: colors.bg },
            sheetGrabberVisible: true,
            sheetCornerRadius: 16,
            sheetExpandsWhenScrolledToEdge: true,
            sheetAllowedDetents: 'fitToContents',
          }}
        />
        <Stack.Screen
          name="meaning"
          options={{
            presentation: 'formSheet',
            headerShown: true,
            title: t('sheetMeaning'),
            headerStyle: { backgroundColor: brand.yellow },
            headerTitleStyle: { fontWeight: '900', color: brand.ink },
            headerTintColor: brand.ink,
            headerShadowVisible: false,
            contentStyle: { backgroundColor: colors.bg },
            sheetGrabberVisible: true,
            sheetCornerRadius: 16,
            sheetExpandsWhenScrolledToEdge: true,
            sheetAllowedDetents: [0.75, 0.9],
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <PreferencesProvider>
        <FavoritesProvider>
          <FiltersProvider>
            <ThemedRoot />
          </FiltersProvider>
        </FavoritesProvider>
      </PreferencesProvider>
    </SafeAreaProvider>
  );
}
