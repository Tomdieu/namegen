import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { useFavorites } from '../../src/store/favorites';
import { usePreferences } from '../../src/store/preferences';
import { hapticLight, hapticSuccess, hapticWarning } from '../../src/utils/haptics';
import { speakText } from '../../src/utils/speech';
import { buildCSV, buildTXT, exportAndShare } from '../../src/utils/exporter';
import { MaterialIcons } from '@expo/vector-icons';
import { brand, type Palette } from '../../src/theme';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, toggleFavorite, clearFavorites } = useFavorites();
  const { colors, t } = usePreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [exporting, setExporting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    hapticSuccess();
    showToast(t('toastCopied', { t: text }));
  };

  const visibleFavorites = favorites.filter((f) =>
    f.text.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const copyAll = async () => {
    if (favorites.length === 0) return;
    hapticSuccess();
    await Clipboard.setStringAsync(favorites.map((f) => f.text).join('\n'));
    showToast(t('toastFavCopiedAll', { n: favorites.length }));
  };

  const runExport = async (kind: 'csv' | 'txt') => {
    if (favorites.length === 0 || exporting) return;
    hapticLight();
    setExporting(true);
    try {
      const content = kind === 'csv' ? buildCSV(favorites) : buildTXT(favorites);
      const filename =
        kind === 'csv'
          ? `saved-name-combinations-${Date.now()}.csv`
          : `saved-names-${Date.now()}.txt`;
      const ok = await exportAndShare(
        content,
        filename,
        kind === 'csv' ? 'text/csv' : 'text/plain'
      );
      showToast(ok ? t('toastShared', { f: filename }) : t('toastExportFailed'));
    } finally {
      setExporting(false);
    }
  };

  const confirmClearAll = () => {
    hapticWarning();
    Alert.alert(t('confirmClearTitle'), t('confirmClearMsg'), [
      { text: t('confirmCancel'), style: 'cancel' },
      {
        text: t('confirmClear'),
        style: 'destructive',
        onPress: () => {
          clearFavorites();
          showToast(t('toastCleared'));
        },
      },
    ]);
  };

  const openMeaning = (fav: (typeof favorites)[number]) => {
    hapticLight();
    router.push({
      pathname: '/meaning',
      params: {
        id: fav.id,
        text: fav.text,
        length: String(fav.length),
        score: String(fav.pronounceabilityScore),
        vowels: String(fav.vowelCount),
        consonants: String(fav.consonantCount),
        syllables: JSON.stringify(fav.syllables ?? []),
        embedded: JSON.stringify(fav.embeddedWords ?? []),
        meanings: JSON.stringify(fav.acrosticMeaning ?? []),
        fav: '1',
        notes: fav.notes ?? '',
      },
    });
  };

  const countLabel =
    favorites.length === 1
      ? t('savedCount', { n: 1 })
      : t('savedMany', { n: favorites.length });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.screenHeader}>
        <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
          <MaterialIcons name="star" size={20} color={brand.ink} />
          <Text style={styles.screenTitle}>{t('tabSaved')}</Text>
        </View>
        <Text style={styles.countLabel}>{countLabel}</Text>
      </View>

      {toastMessage && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="star-border" size={48} color={colors.subtext} />
          <Text style={styles.emptyText}>{t('favEmptyTitle')}</Text>
          <Text style={styles.emptySubtext}>{t('favEmptySub')}</Text>
          <TouchableOpacity
            style={styles.generateCta}
            onPress={() => {
              hapticLight();
              router.push('/');
            }}
          >
            <Text style={styles.generateCtaText}>{t('favEmptyCta')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchSavedPh')}
            placeholderTextColor={colors.placeholder}
            value={searchFilter}
            onChangeText={setSearchFilter}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.toolbarRow}>
            <TouchableOpacity style={styles.toolBtn} onPress={copyAll}>
              <Text style={styles.toolBtnText}>{t('favCopyAll')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolBtn} onPress={() => runExport('csv')}>
              <Text style={styles.toolBtnText}>{exporting ? '…' : t('favCsv')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolBtn} onPress={() => runExport('txt')}>
              <Text style={styles.toolBtnText}>{exporting ? '…' : t('favTxt')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toolBtn, { backgroundColor: brand.pink }]}
              onPress={confirmClearAll}
            >
              <Text style={[styles.toolBtnText, { color: '#FFFFFF' }]}>{t('favClear')}</Text>
            </TouchableOpacity>
          </View>

          {visibleFavorites.map((fav) => (
            <TouchableOpacity key={fav.id} activeOpacity={0.85} onPress={() => openMeaning(fav)}>
              <View style={styles.favoriteItem}>
                <View style={styles.favoriteInfo}>
                  <Text style={styles.favoriteText}>{fav.text}</Text>
                  <Text style={styles.favoriteMeta}>
                    {t('metaLine', { len: fav.length, score: fav.pronounceabilityScore })}
                  </Text>
                  {fav.notes ? (
                    <View style={{flexDirection:'row',alignItems:'center',gap:4}}>
                      <MaterialIcons name="edit-note" size={14} color={colors.subtext} />
                      <Text style={styles.favoriteNotes}>{fav.notes}</Text>
                    </View>
                  ) : null}
                </View>
                <View style={styles.favoriteActions}>
                  <TouchableOpacity
                    style={styles.favSmallBtn}
                    onPress={() => copyToClipboard(fav.text)}
                  >
                    <View style={{flexDirection:'row',alignItems:'center',gap:4}}>
                      <MaterialIcons name="content-copy" size={12} color={brand.ink} />
                      <Text style={styles.favSmallBtnText}>{t('favCopy')}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.favSmallBtn}
                    onPress={() => {
                      hapticLight();
                      speakText(fav.text);
                    }}
                  >
                    <MaterialIcons name="volume-up" size={16} color={brand.ink} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.favSmallBtn, { backgroundColor: brand.pink }]}
                    onPress={() => {
                      hapticWarning();
                      toggleFavorite(fav);
                      showToast(t('toastFavRemoved'));
                    }}
                  >
                    <View style={{flexDirection:'row',alignItems:'center',gap:4}}>
                      <MaterialIcons name="delete-outline" size={14} color="#FFFFFF" />
                      <Text style={[styles.favSmallBtnText, { color: '#FFFFFF' }]}>{t('favRemove')}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    screenHeader: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: c.surface,
      borderBottomWidth: 2,
      borderBottomColor: c.text,
    },
    screenTitle: { fontSize: 19, fontWeight: '900', color: c.text },
    countLabel: {
      fontSize: 11,
      fontWeight: '900',
      color: c.subtext,
      letterSpacing: 0.5,
      marginTop: 2,
    },
    toast: {
      backgroundColor: brand.ink,
      paddingVertical: 8,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    toastText: { color: brand.green, fontWeight: '700', fontSize: 12 },
    list: { padding: 16, gap: 10 },
    searchInput: {
      backgroundColor: c.surface,
      borderWidth: 2,
      borderColor: c.text,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 12,
      fontWeight: '700',
      color: c.text,
    },
    toolbarRow: { flexDirection: 'row', gap: 6 },
    toolBtn: {
      flex: 1,
      backgroundColor: brand.yellow,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: c.text,
      alignItems: 'center',
    },
    toolBtnText: { fontSize: 10, fontWeight: '900', color: brand.ink },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 6 },
    emptyEmoji: { fontSize: 48, marginBottom: 4 },
    emptyText: { fontSize: 16, fontWeight: '900', color: c.text },
    emptySubtext: { fontSize: 12, color: c.subtext, textAlign: 'center' },
    generateCta: {
      marginTop: 12,
      backgroundColor: brand.yellow,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: c.text,
    },
    generateCtaText: { fontSize: 12, fontWeight: '900', color: brand.ink },
    favoriteItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: c.surface,
      borderWidth: 2,
      borderColor: c.text,
      borderRadius: 12,
      padding: 12,
      shadowColor: c.text,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 2,
    },
    favoriteInfo: { flex: 1, marginRight: 8 },
    favoriteText: { fontSize: 16, fontWeight: '900', color: c.text },
    favoriteMeta: { fontSize: 11, color: c.subtext, marginTop: 2 },
    favoriteNotes: { fontSize: 11, color: c.subtext, fontWeight: '600', marginTop: 4 },
    favoriteActions: { flexDirection: 'row', gap: 6 },
    favSmallBtn: {
      backgroundColor: brand.yellow,
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: c.text,
    },
    favSmallBtnText: { fontSize: 11, fontWeight: '800', color: brand.ink },
  });
