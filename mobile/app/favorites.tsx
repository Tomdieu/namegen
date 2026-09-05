import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { useFavorites } from '../src/store/favorites';
import { hapticLight, hapticSuccess, hapticWarning } from '../src/utils/haptics';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, toggleFavorite } = useFavorites();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    hapticSuccess();
    showToast(`Copied "${text}" to clipboard!`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                hapticLight();
                router.back();
              }}
              style={styles.doneBtn}
            >
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          ),
        }}
      />

      {toastMessage && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>✓ {toastMessage}</Text>
        </View>
      )}

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>⭐</Text>
          <Text style={styles.emptyText}>No names saved yet!</Text>
          <Text style={styles.emptySubtext}>
            Tap the star icon on any card to save it here.
          </Text>
          <TouchableOpacity
            style={styles.generateCta}
            onPress={() => {
              hapticLight();
              router.back();
            }}
          >
            <Text style={styles.generateCtaText}>← Back to generator</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          <Text style={styles.countLabel}>
            {favorites.length} SAVED NAME{favorites.length === 1 ? '' : 'S'}
          </Text>
          {favorites.map((fav) => (
            <View key={fav.id} style={styles.favoriteItem}>
              <View style={styles.favoriteInfo}>
                <Text style={styles.favoriteText}>{fav.text}</Text>
                <Text style={styles.favoriteMeta}>
                  {fav.length} letters • {fav.pronounceabilityScore}% natural
                </Text>
              </View>
              <View style={styles.favoriteActions}>
                <TouchableOpacity
                  style={styles.favSmallBtn}
                  onPress={() => copyToClipboard(fav.text)}
                >
                  <Text style={styles.favSmallBtnText}>Copy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.favSmallBtn, { backgroundColor: '#FF477E' }]}
                  onPress={() => {
                    hapticWarning();
                    toggleFavorite(fav);
                    showToast('Removed from saved');
                  }}
                >
                  <Text style={[styles.favSmallBtnText, { color: '#FFF' }]}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9E6',
  },
  doneBtn: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: Platform.OS === 'web' ? 0 : 4,
  },
  doneBtnText: {
    color: '#FFD100',
    fontSize: 12,
    fontWeight: '900',
  },
  toast: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastText: {
    color: '#00E699',
    fontWeight: '700',
    fontSize: 12,
  },
  list: {
    padding: 16,
    gap: 10,
  },
  countLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1A1A1A',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 6,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  emptySubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  generateCta: {
    marginTop: 12,
    backgroundColor: '#FFD100',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1A1A1A',
  },
  generateCtaText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  favoriteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  favoriteInfo: {
    flex: 1,
    marginRight: 8,
  },
  favoriteText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  favoriteMeta: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  favoriteActions: {
    flexDirection: 'row',
    gap: 6,
  },
  favSmallBtn: {
    backgroundColor: '#FFD100',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  favSmallBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1A1A1A',
  },
});
