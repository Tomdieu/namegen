import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GeneratedName } from '../types';

const STORAGE_KEY = '@namegen_mobile_favorites_v1';

interface FavoritesContextValue {
  favorites: GeneratedName[];
  loaded: boolean;
  isFavorite: (text: string) => boolean;
  /** Toggles a favorite. Returns true when the name was added, false when removed. */
  toggleFavorite: (name: GeneratedName) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<GeneratedName[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (err) {
        console.warn('Failed to load favorites', err);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persist = useCallback(async (updated: GeneratedName[]) => {
    setFavorites(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to persist favorites', err);
    }
  }, []);

  const isFavorite = useCallback(
    (text: string) => {
      const key = text.toUpperCase();
      return favorites.some((f) => f.text.toUpperCase() === key);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (name: GeneratedName) => {
      const key = name.text.toUpperCase();
      const exists = favorites.some((f) => f.text.toUpperCase() === key);
      const updated = exists
        ? favorites.filter((f) => f.text.toUpperCase() !== key)
        : [{ ...name, isFavorite: true }, ...favorites];
      void persist(updated);
      return !exists;
    },
    [favorites, persist]
  );

  const clearFavorites = useCallback(() => {
    void persist([]);
  }, [persist]);

  const value = useMemo(
    () => ({ favorites, loaded, isFavorite, toggleFavorite, clearFavorites }),
    [favorites, loaded, isFavorite, toggleFavorite, clearFavorites]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return ctx;
}
