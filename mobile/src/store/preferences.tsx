import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkPalette, lightPalette, type Locale, type Palette, type ThemeMode } from '../theme';
import { translate, type StringKey } from '../i18n';

const STORAGE_KEY = '@namegen_prefs_v1';

interface PreferencesContextValue {
  theme: ThemeMode;
  colors: Palette;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: StringKey, params?: Record<string, string | number>) => string;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as { theme?: ThemeMode; locale?: Locale };
          if (parsed.theme === 'light' || parsed.theme === 'dark') setThemeState(parsed.theme);
          if (parsed.locale === 'en' || parsed.locale === 'fr') setLocaleState(parsed.locale);
        }
      } catch {
        // keep defaults
      }
    })();
  }, []);

  const persist = useCallback(async (next: { theme: ThemeMode; locale: Locale }) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore persistence errors
    }
  }, []);

  const setTheme = useCallback(
    (mode: ThemeMode) => {
      setThemeState(mode);
      void persist({ theme: mode, locale });
    },
    [locale, persist]
  );

  const toggleTheme = useCallback(() => {
    const next: ThemeMode = theme === 'light' ? 'dark' : 'light';
    setThemeState(next);
    void persist({ theme: next, locale });
  }, [theme, locale, persist]);

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      void persist({ theme, locale: next });
    },
    [theme, persist]
  );

  const t = useCallback(
    (key: StringKey, params?: Record<string, string | number>) => translate(locale, key, params),
    [locale]
  );

  const value = useMemo<PreferencesContextValue>(
    () => ({
      theme,
      colors: theme === 'light' ? lightPalette : darkPalette,
      setTheme,
      toggleTheme,
      locale,
      setLocale,
      t,
    }),
    [theme, locale, setTheme, toggleTheme, setLocale, t]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within a PreferencesProvider');
  return ctx;
}
