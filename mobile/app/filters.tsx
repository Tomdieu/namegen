import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useFilters, type SortOption } from '../src/store/filters';
import { usePreferences } from '../src/store/preferences';
import { hapticLight, hapticSelect } from '../src/utils/haptics';
import { brand, type Palette } from '../src/theme';

export default function FiltersScreen() {
  const router = useRouter();
  const { colors, t } = usePreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const params = useLocalSearchParams<{ total?: string; filtered?: string }>();
  const total = Number(Array.isArray(params.total) ? params.total[0] : params.total) || 0;
  const filtered = Number(Array.isArray(params.filtered) ? params.filtered[0] : params.filtered) || 0;

  const {
    searchTerm,
    setSearchTerm,
    startsWithFilter,
    setStartsWithFilter,
    endsWithFilter,
    setEndsWithFilter,
    minFlowScore,
    setMinFlowScore,
    sortBy,
    setSortBy,
    onlyWithWords,
    setOnlyWithWords,
    resetFilters,
    activeFilterCount,
  } = useFilters();

  const close = () => {
    hapticLight();
    router.back();
  };

  const clearAll = () => {
    hapticLight();
    resetFilters();
  };

  const sortOptions = useMemo(
    () => [
      { id: 'score_desc' as SortOption, label: t('sortScore') },
      { id: 'alpha_asc' as SortOption, label: t('sortAZ') },
      { id: 'alpha_desc' as SortOption, label: t('sortZA') },
      { id: 'words_desc' as SortOption, label: t('sortWords') },
      { id: 'vowels_desc' as SortOption, label: t('sortVowels') },
    ],
    [t]
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={close} style={styles.doneBtn}>
              <Text style={styles.doneBtnText}>{t('doneBtn')}</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sheetTopRow}>
          <Text style={styles.title}>
            {t('sheetFilters')}
            {activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
          </Text>
          <TouchableOpacity onPress={close} style={styles.sheetCloseBtn}>
            <Text style={styles.sheetCloseText}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>{t('secFilter')}</Text>
        <TextInput
          style={styles.searchInput}
          placeholder={t('searchPh')}
          placeholderTextColor={colors.placeholder}
          value={searchTerm}
          onChangeText={setSearchTerm}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <View style={styles.startsEndsRow}>
          <View style={styles.startsEndsField}>
            <Text style={styles.miniLabel}>{t('startsLabel')}</Text>
            <TextInput
              style={styles.miniInput}
              placeholder="S"
              placeholderTextColor={colors.placeholder}
              value={startsWithFilter}
              onChangeText={(v) => setStartsWithFilter(v.toUpperCase())}
              maxLength={3}
              autoCapitalize="characters"
              autoCorrect={false}
            />
          </View>
          <View style={styles.startsEndsField}>
            <Text style={styles.miniLabel}>{t('endsLabel')}</Text>
            <TextInput
              style={styles.miniInput}
              placeholder="TH"
              placeholderTextColor={colors.placeholder}
              value={endsWithFilter}
              onChangeText={(v) => setEndsWithFilter(v.toUpperCase())}
              maxLength={3}
              autoCapitalize="characters"
              autoCorrect={false}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('secMinScore')}</Text>
        <View style={styles.chipRow}>
          {[0, 40, 60, 80].map((score) => (
            <TouchableOpacity
              key={score}
              onPress={() => {
                hapticSelect();
                setMinFlowScore(score);
              }}
              style={[styles.optionChip, minFlowScore === score && styles.optionChipActive]}
            >
              <Text style={[styles.optionChipText, minFlowScore === score && styles.optionChipTextOn]}>
                {score === 0 ? t('anyScore') : `${score}%+`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{t('secSort')}</Text>
        <View style={styles.chipRowWrap}>
          {sortOptions.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              onPress={() => {
                hapticSelect();
                setSortBy(opt.id);
              }}
              style={[styles.optionChip, sortBy === opt.id && styles.optionChipActive]}
            >
              <Text style={[styles.optionChipText, sortBy === opt.id && styles.optionChipTextOn]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.wordsToggle}
          onPress={() => {
            hapticSelect();
            setOnlyWithWords(!onlyWithWords);
          }}
        >
          <Text style={styles.wordsToggleBox}>{onlyWithWords ? '☑' : '☐'}</Text>
          <Text style={styles.wordsToggleText}>{t('onlyWords')}</Text>
        </TouchableOpacity>

        <Text style={styles.counter}>{t('showingXofY', { a: filtered, b: total })}</Text>

        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.clearCta} onPress={clearAll}>
            <Text style={styles.clearCtaText}>{t('clearAll')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.showCta} onPress={close}>
            <Text style={styles.showCtaText}>{t('showResults', { n: filtered })}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    doneBtn: {
      backgroundColor: brand.ink,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      marginRight: Platform.OS === 'web' ? 0 : 4,
    },
    doneBtnText: { color: brand.yellow, fontSize: 12, fontWeight: '900' },
    content: { padding: 16, paddingBottom: 32 },
    sheetTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    title: { fontSize: 16, fontWeight: '900', color: c.text },
    sheetCloseBtn: {
      width: 30,
      height: 30,
      backgroundColor: c.surface,
      borderWidth: 1.5,
      borderColor: c.text,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sheetCloseText: { fontSize: 13, fontWeight: '900', color: c.text },
    sectionTitle: {
      fontSize: 11,
      fontWeight: '900',
      color: c.text,
      letterSpacing: 0.5,
      marginBottom: 8,
      marginTop: 10,
    },
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
      marginBottom: 8,
    },
    startsEndsRow: { flexDirection: 'row', gap: 12 },
    startsEndsField: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
    miniLabel: { fontSize: 11, fontWeight: '800', color: c.text },
    miniInput: {
      flex: 1,
      backgroundColor: c.surface,
      borderWidth: 2,
      borderColor: c.text,
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 6,
      fontSize: 12,
      fontWeight: '800',
      color: c.text,
      textAlign: 'center',
    },
    chipRow: { flexDirection: 'row', gap: 6 },
    chipRowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    optionChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: c.surfaceAlt,
      borderWidth: 1.5,
      borderColor: c.text,
      borderRadius: 8,
    },
    optionChipActive: { backgroundColor: brand.yellow, borderWidth: 2 },
    optionChipText: { fontSize: 12, fontWeight: '800', color: c.text },
    optionChipTextOn: { color: brand.ink },
    wordsToggle: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10 },
    wordsToggleBox: { fontSize: 18, color: c.text },
    wordsToggleText: { fontSize: 11, fontWeight: '800', color: c.text },
    counter: { fontSize: 11, fontWeight: '700', color: c.subtext, marginTop: 4 },
    footerRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
    clearCta: {
      flex: 1,
      backgroundColor: c.surfaceAlt,
      paddingVertical: 12,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: c.text,
      alignItems: 'center',
    },
    clearCtaText: { color: c.text, fontWeight: '900', fontSize: 12 },
    showCta: {
      flex: 2,
      backgroundColor: brand.pink,
      paddingVertical: 12,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: c.text,
      alignItems: 'center',
    },
    showCtaText: { color: '#FFFFFF', fontWeight: '900', fontSize: 12 },
  });
