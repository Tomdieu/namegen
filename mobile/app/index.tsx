import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { hapticLight, hapticMedium, hapticSelect, hapticSuccess } from '../src/utils/haptics';

import { GeneratedName, GenerationMode, GenerationSettings, SlotConstraintType } from '../src/types';
import { generateNamesBatch } from '../src/utils/nameEngine';
import { calculateCombinatoricsStats, formatLargeNumber } from '../src/utils/combinatorics';
import { useFavorites } from '../src/store/favorites';

export default function HomeScreen() {
  const router = useRouter();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Generator settings
  const [settings, setSettings] = useState<GenerationSettings>({
    length: 9,
    batchSize: 16,
    mode: 'pronounceable',
    casing: 'title',
    characterPool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    slots: [],
    minVowels: 2,
    maxConsecutiveConsonants: 2,
    allowRepeatedAdjacent: false,
    filterSubstring: '',
    filterStartsWith: '',
    filterEndsWith: '',
    minScore: 40,
  });

  const [names, setNames] = useState<GeneratedName[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Combinatorics calculations
  const stats = useMemo(() => {
    return calculateCombinatoricsStats(settings.length, settings.characterPool, settings.slots);
  }, [settings.length, settings.characterPool, settings.slots]);

  // Trigger name generation
  const handleGenerate = () => {
    hapticMedium();
    const generated = generateNamesBatch(settings);
    // Mark items that are already favorited
    const enriched = generated.map((g) => ({
      ...g,
      isFavorite: isFavorite(g.text),
    }));
    setNames(enriched);
  };

  // Initial generation on launch
  useEffect(() => {
    handleGenerate();
  }, [settings.length, settings.mode, settings.casing]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    hapticSuccess();
    showToast(`Copied "${text}" to clipboard!`);
  };

  const onToggleFavorite = (name: GeneratedName) => {
    hapticSelect();
    const added = toggleFavorite(name);
    showToast(added ? `Saved "${name.text}"` : `Removed from saved`);
    setNames((prev) =>
      prev.map((n) =>
        n.text.toUpperCase() === name.text.toUpperCase() ? { ...n, isFavorite: added } : n
      )
    );
  };

  const openMath = () => {
    hapticLight();
    router.push({ pathname: '/math', params: { length: String(settings.length) } });
  };

  const openMeaning = (item: GeneratedName) => {
    hapticLight();
    router.push({
      pathname: '/meaning',
      params: { text: item.text, words: JSON.stringify(item.acrosticMeaning ?? []) },
    });
  };

  const updateSlotType = (index: number, type: SlotConstraintType) => {
    hapticSelect();
    const existing = settings.slots.filter((s) => s.index !== index);
    if (type === 'any') {
      setSettings((prev) => ({ ...prev, slots: existing }));
    } else {
      setSettings((prev) => ({
        ...prev,
        slots: [...existing, { index, type, isLocked: true }],
      }));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>26ⁿ</Text>
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.appTitle}>NameGen</Text>
              <Text style={styles.byText}>by </Text>
              <TouchableOpacity onPress={() => {
                hapticLight();
                Linking.openURL('https://ivantomdieu.vercel.app/en');
              }}>
                <Text style={styles.authorLink}>Tomdieu ivan</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.appSubtitle}>26-Letter Combinatorics Engine</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: '#FFD100' }]}
            onPress={() => {
              hapticLight();
              router.push('/favorites');
            }}
          >
            <Text style={styles.headerBtnText}>⭐ {favorites.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: '#00D1FF' }]}
            onPress={openMath}
          >
            <Text style={styles.headerBtnText}>26ⁿ</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Toast Bar */}
      {toastMessage && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>✓ {toastMessage}</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Combinatorics Stats Banner */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={openMath}
          style={styles.statsCard}
        >
          <View style={styles.statsHeader}>
            <Text style={styles.statsLabel}>THEORETICAL COMBINATIONS ({settings.length} LETTERS)</Text>
            <Text style={styles.statsFormula}>26^{settings.length}</Text>
          </View>
          <Text style={styles.statsValue}>{formatLargeNumber(26n ** BigInt(settings.length))}</Text>
          <Text style={styles.statsSubtext}>
            Tap for complete formula and combinatorial probabilities →
          </Text>
        </TouchableOpacity>

        {/* Generator Controls */}
        <View style={styles.controlBox}>
          {/* Length Selector Stepper */}
          <View style={styles.controlSection}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.controlTitle}>NAME LENGTH: {settings.length} CHARACTERS</Text>
              <Text style={styles.badgeSmall}>Default 9</Text>
            </View>

            <View style={styles.stepperRow}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => {
                  hapticSelect();
                  if (settings.length > 3) {
                    setSettings((p) => ({ ...p, length: p.length - 1 }));
                  }
                }}
              >
                <Text style={styles.stepperBtnText}>-</Text>
              </TouchableOpacity>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.lengthChipsContainer}
              >
                {[4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16].map((len) => (
                  <TouchableOpacity
                    key={len}
                    onPress={() => {
                      hapticSelect();
                      setSettings((p) => ({ ...p, length: len }));
                    }}
                    style={[
                      styles.lengthChip,
                      settings.length === len && styles.lengthChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.lengthChipText,
                        settings.length === len && styles.lengthChipTextActive,
                      ]}
                    >
                      {len}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => {
                  hapticSelect();
                  if (settings.length < 26) {
                    setSettings((p) => ({ ...p, length: p.length + 1 }));
                  }
                }}
              >
                <Text style={styles.stepperBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Mode Selector */}
          <View style={styles.controlSection}>
            <Text style={styles.controlTitle}>GENERATION MODE</Text>
            <View style={styles.modeRow}>
              {[
                { id: 'pronounceable', label: '🗣️ Pronounceable' },
                { id: 'pattern', label: '🔤 Pattern' },
                { id: 'acrostic', label: '✨ Acrostic' },
                { id: 'pure_random', label: '🎲 Random' },
              ].map((m) => (
                <TouchableOpacity
                  key={m.id}
                  onPress={() => {
                    hapticSelect();
                    setSettings((p) => ({ ...p, mode: m.id as GenerationMode }));
                  }}
                  style={[
                    styles.modeBtn,
                    settings.mode === m.id && styles.modeBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.modeBtnText,
                      settings.mode === m.id && styles.modeBtnTextActive,
                    ]}
                  >
                    {m.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Slot Constraints Configurator */}
          <View style={styles.controlSection}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.controlTitle}>SLOT CONSTRAINTS (TAP TO TOGGLE)</Text>
              <TouchableOpacity
                onPress={() => {
                  hapticLight();
                  setSettings((p) => ({ ...p, slots: [] }));
                }}
              >
                <Text style={styles.resetLink}>Clear All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.slotsRow}>
              {Array.from({ length: settings.length }).map((_, idx) => {
                const constraint = settings.slots.find((s) => s.index === idx);
                const currentType = constraint ? constraint.type : 'any';

                const nextType: SlotConstraintType =
                  currentType === 'any'
                    ? 'vowel'
                    : currentType === 'vowel'
                    ? 'consonant'
                    : 'any';

                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => updateSlotType(idx, nextType)}
                    style={[
                      styles.slotBox,
                      currentType === 'vowel' && { backgroundColor: '#FFD100' },
                      currentType === 'consonant' && { backgroundColor: '#00D1FF' },
                    ]}
                  >
                    <Text style={styles.slotIndex}>#{idx + 1}</Text>
                    <Text style={styles.slotType}>
                      {currentType === 'any'
                        ? 'ANY'
                        : currentType === 'vowel'
                        ? 'VOWEL'
                        : 'CONS'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Generate Action Button */}
          <TouchableOpacity
            style={styles.generateBtn}
            activeOpacity={0.85}
            onPress={handleGenerate}
          >
            <Text style={styles.generateBtnText}>⚡ GENERATE {settings.batchSize} NAMES</Text>
          </TouchableOpacity>
        </View>

        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            GENERATED {names.length} NAMES ({settings.length} CHARS)
          </Text>
        </View>

        {/* Names List */}
        <View style={styles.namesGrid}>
          {names.map((item) => (
            <View key={item.id} style={styles.nameCard}>
              <View style={styles.cardTopRow}>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreText}>{item.pronounceabilityScore}% Score</Text>
                </View>
                <View style={styles.vowelRatioBadge}>
                  <Text style={styles.vowelRatioText}>
                    {item.vowelCount}V / {item.consonantCount}C
                  </Text>
                </View>
              </View>

              <Text style={styles.nameWord}>{item.text}</Text>

              {/* Syllables breakdown */}
              {item.syllables && item.syllables.length > 1 && (
                <Text style={styles.syllablesText}>
                  {item.syllables.join(' • ')}
                </Text>
              )}

              {/* Embedded words if any */}
              {item.embeddedWords && item.embeddedWords.length > 0 && (
                <View style={styles.embeddedRow}>
                  <Text style={styles.embeddedTag}>
                    Contains: {item.embeddedWords.join(', ')}
                  </Text>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.copyBtn}
                  onPress={() => copyToClipboard(item.text)}
                >
                  <Text style={styles.copyBtnText}>📋 Copy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionIconBtn, item.isFavorite && styles.favActiveBtn]}
                  onPress={() => onToggleFavorite(item)}
                >
                  <Text style={styles.actionIconText}>
                    {item.isFavorite ? '★' : '☆'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionIconBtn}
                  onPress={() => openMeaning(item)}
                >
                  <Text style={styles.actionIconText}>✨</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>NameGen for Android</Text>
          <Text style={styles.footerAuthor}>
            Created by{' '}
            <Text
              style={styles.footerLink}
              onPress={() => Linking.openURL('https://ivantomdieu.vercel.app/en')}
            >
              Tomdieu ivan
            </Text>
          </Text>
          <TouchableOpacity
            style={styles.githubBtn}
            onPress={() => {
              hapticLight();
              Linking.openURL('https://github.com/Tomdieu/namegen');
            }}
          >
            <Text style={styles.githubBtnText}>⭐ Star on GitHub (github.com/Tomdieu/namegen)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9E6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#1A1A1A',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1A1A1A',
  },
  logoText: {
    color: '#FFD100',
    fontSize: 16,
    fontWeight: '900',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1A1A1A',
    marginRight: 4,
  },
  byText: {
    fontSize: 12,
    color: '#666',
  },
  authorLink: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FF477E',
    textDecorationLine: 'underline',
  },
  appSubtitle: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1A1A1A',
  },
  headerBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1A1A1A',
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statsCard: {
    backgroundColor: '#FFD100',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  statsFormula: {
    fontSize: 12,
    fontWeight: '900',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  statsValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1A1A1A',
    marginVertical: 2,
  },
  statsSubtext: {
    fontSize: 11,
    color: '#333',
    fontWeight: '600',
  },
  controlBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  controlSection: {
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  controlTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
  badgeSmall: {
    fontSize: 10,
    fontWeight: '800',
    backgroundColor: '#00E699',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  resetLink: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FF477E',
    textDecorationLine: 'underline',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    backgroundColor: '#FFF9E6',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  lengthChipsContainer: {
    gap: 6,
    paddingVertical: 2,
  },
  lengthChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F5F5F5',
    borderWidth: 1.5,
    borderColor: '#1A1A1A',
    borderRadius: 8,
  },
  lengthChipActive: {
    backgroundColor: '#FFD100',
    borderWidth: 2,
  },
  lengthChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  lengthChipTextActive: {
    color: '#1A1A1A',
  },
  modeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  modeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#F5F5F5',
    borderWidth: 1.5,
    borderColor: '#1A1A1A',
    borderRadius: 8,
  },
  modeBtnActive: {
    backgroundColor: '#00D1FF',
    borderWidth: 2,
  },
  modeBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  modeBtnTextActive: {
    color: '#1A1A1A',
  },
  slotsRow: {
    gap: 8,
    paddingVertical: 4,
  },
  slotBox: {
    width: 54,
    height: 54,
    backgroundColor: '#F5F5F5',
    borderWidth: 1.5,
    borderColor: '#1A1A1A',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotIndex: {
    fontSize: 9,
    fontWeight: '800',
    color: '#666',
  },
  slotType: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1A1A1A',
    marginTop: 2,
  },
  generateBtn: {
    backgroundColor: '#FF477E',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  generateBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultsCount: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
  namesGrid: {
    gap: 12,
  },
  nameCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  scoreBadge: {
    backgroundColor: '#00E699',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  scoreText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  vowelRatioBadge: {
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  vowelRatioText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  nameWord: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1A1A1A',
    letterSpacing: 0.5,
    marginVertical: 4,
  },
  syllablesText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
    marginBottom: 4,
  },
  embeddedRow: {
    marginBottom: 8,
  },
  embeddedTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0066CC',
    backgroundColor: '#E6F4FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#B3DCFF',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 8,
  },
  copyBtn: {
    flex: 1,
    backgroundColor: '#FFD100',
    borderWidth: 1.5,
    borderColor: '#1A1A1A',
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  actionIconBtn: {
    width: 36,
    height: 32,
    backgroundColor: '#F5F5F5',
    borderWidth: 1.5,
    borderColor: '#1A1A1A',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favActiveBtn: {
    backgroundColor: '#FF477E',
  },
  actionIconText: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: '#1A1A1A',
    paddingTop: 20,
    gap: 6,
  },
  footerBrand: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  footerAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },
  footerLink: {
    color: '#FF477E',
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  githubBtn: {
    marginTop: 8,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  githubBtnText: {
    color: '#FFD100',
    fontSize: 11,
    fontWeight: '900',
  },
});
