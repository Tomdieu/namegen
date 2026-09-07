import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons } from '@expo/vector-icons';

import { GeneratedName, GenerationMode, GenerationSettings, CasingOption, SlotConstraintType } from '../../src/types';
import { generateNamesBatch } from '../../src/utils/nameEngine';
import { calculateCombinatoricsStats, formatLargeNumber } from '../../src/utils/combinatorics';
import { useFavorites } from '../../src/store/favorites';
import { useFilters } from '../../src/store/filters';
import { usePreferences } from '../../src/store/preferences';
import { hapticLight, hapticMedium, hapticSelect, hapticSuccess } from '../../src/utils/haptics';
import { speakText, stopSpeaking } from '../../src/utils/speech';
import { brand, type Palette } from '../../src/theme';

const DEFAULT_SETTINGS: GenerationSettings = {
  length: 9,
  batchSize: 24,
  mode: 'pronounceable',
  casing: 'title',
  characterPool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  slots: [],
  minVowels: 0,
  maxConsecutiveConsonants: 3,
  allowRepeatedAdjacent: true,
  filterSubstring: '',
  filterStartsWith: '',
  filterEndsWith: '',
  minScore: 0,
};

const BATCH_SIZES = [12, 24, 48, 96];
const CASINGS: { id: CasingOption; label: string }[] = [
  { id: 'title', label: 'Aa' },
  { id: 'upper', label: 'UPPER' },
  { id: 'lower', label: 'lower' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { colors, t } = usePreferences();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, insets.bottom), [colors, insets.bottom]);
  const scrollRef = useRef<ScrollView>(null);

  const [settings, setSettings] = useState<GenerationSettings>(DEFAULT_SETTINGS);

  const [names, setNames] = useState<GeneratedName[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [editingSlot, setEditingSlot] = useState<number | null>(null);

  const [step, setStep] = useState(0);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [generatedFingerprint, setGeneratedFingerprint] = useState<string | null>(null);

  const {
    searchTerm,
    startsWithFilter,
    endsWithFilter,
    minFlowScore,
    sortBy,
    onlyWithWords,
    resetFilters,
    activeFilterCount,
  } = useFilters();
  const [copiedBatch, setCopiedBatch] = useState(false);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const stats = useMemo(() => {
    return calculateCombinatoricsStats(settings.length, settings.characterPool, settings.slots);
  }, [settings.length, settings.characterPool, settings.slots]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const enrichWithFavorites = (generated: GeneratedName[]) =>
    generated.map((g) => ({ ...g, isFavorite: isFavorite(g.text) }));

  const handleGenerate = () => {
    hapticMedium();
    const generated = generateNamesBatch(settings);
    setNames(enrichWithFavorites(generated));
    setHasGenerated(true);
    setGeneratedFingerprint(setupFingerprint);
  };

  const handleGenerateMore = () => {
    hapticMedium();
    const generated = generateNamesBatch(settings);
    setNames((prev) => {
      const seen = new Set(prev.map((n) => n.text.toUpperCase()));
      const fresh = generated.filter((g) => !seen.has(g.text.toUpperCase()));
      showToast(
        fresh.length > 0 ? t('toastAdded', { n: fresh.length }) : t('toastNoNew')
      );
      return [...prev, ...enrichWithFavorites(fresh.length > 0 ? fresh : generated)];
    });
  };

  const updateLength = (len: number) => {
    const clamped = Math.min(26, Math.max(3, len));
    setSettings((p) => ({
      ...p,
      length: clamped,
      slots: p.slots.filter((s) => s.index < clamped),
    }));
    if (editingSlot !== null && editingSlot >= clamped) setEditingSlot(null);
  };

  const handleApplyPreset = (presetName: 'alternating' | 'melodic') => {
    hapticSelect();
    const len = settings.length;
    const newSlots: GenerationSettings['slots'] = [];
    if (presetName === 'alternating') {
      for (let i = 0; i < len; i++) {
        newSlots.push({ index: i, type: i % 2 === 0 ? 'consonant' : 'vowel' });
      }
    } else {
      const pattern: ('consonant' | 'vowel')[] = [
        'consonant', 'vowel', 'consonant', 'consonant', 'vowel', 'consonant', 'vowel', 'consonant', 'vowel',
      ];
      for (let i = 0; i < len; i++) {
        newSlots.push({ index: i, type: pattern[i % pattern.length] });
      }
    }
    setSettings((prev) => ({ ...prev, slots: newSlots, mode: 'pattern' }));
    showToast(presetName === 'alternating' ? t('toastPresetFlow') : t('toastPresetMelodic'));
  };

  const handleReset = () => {
    hapticLight();
    setSettings(DEFAULT_SETTINGS);
    setEditingSlot(null);
    resetFilters();
    setStep(0);
    setHasGenerated(false);
    setGeneratedFingerprint(null);
    showToast(t('toastReset'));
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    hapticSuccess();
    showToast(t('toastCopied', { t: text }));
  };

  const handleCopyAllVisible = async () => {
    if (filteredNames.length === 0) return;
    hapticSuccess();
    await Clipboard.setStringAsync(filteredNames.map((n) => n.text).join('\n'));
    setCopiedBatch(true);
    setTimeout(() => setCopiedBatch(false), 2000);
    showToast(t('toastCopiedN', { n: filteredNames.length }));
  };

  const onSpeak = (item: GeneratedName) => {
    hapticLight();
    if (speakingId === item.id) {
      stopSpeaking();
      setSpeakingId(null);
      return;
    }
    speakText(item.text, {
      onStart: () => setSpeakingId(item.id),
      onDone: () => setSpeakingId((cur) => (cur === item.id ? null : cur)),
    });
  };

  const onToggleFavorite = (name: GeneratedName) => {
    hapticSelect();
    const added = toggleFavorite(name);
    showToast(added ? t('toastSaved', { t: name.text }) : t('toastRemoved'));
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

  const openFilters = () => {
    hapticLight();
    router.push({
      pathname: '/filters',
      params: { total: String(names.length), filtered: String(filteredNames.length) },
    });
  };

  const openMeaning = (item: GeneratedName) => {
    hapticLight();
    router.push({
      pathname: '/meaning',
      params: {
        id: item.id,
        text: item.text,
        length: String(item.length),
        score: String(item.pronounceabilityScore),
        vowels: String(item.vowelCount),
        consonants: String(item.consonantCount),
        syllables: JSON.stringify(item.syllables ?? []),
        embedded: JSON.stringify(item.embeddedWords ?? []),
        meanings: JSON.stringify(item.acrosticMeaning ?? []),
        fav: item.isFavorite ? '1' : '0',
        notes: item.notes ?? '',
      },
    });
  };

  const setSlotRule = (index: number, type: SlotConstraintType, exactChar?: string) => {
    hapticSelect();
    const existing = settings.slots.filter((s) => s.index !== index);
    if (type === 'any') {
      setSettings((prev) => ({ ...prev, slots: existing }));
    } else if (type === 'exact' && exactChar) {
      setSettings((prev) => ({
        ...prev,
        slots: [...existing, { index, type, exactChar: exactChar.toUpperCase(), isLocked: true }],
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        slots: [...existing, { index, type, isLocked: true }],
      }));
    }
  };

  const filteredNames = useMemo(() => {
    const list = names.filter((item) => {
      if (searchTerm && !item.text.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (startsWithFilter && !item.text.toUpperCase().startsWith(startsWithFilter.toUpperCase())) return false;
      if (endsWithFilter && !item.text.toUpperCase().endsWith(endsWithFilter.toUpperCase())) return false;
      if (minFlowScore > 0 && item.pronounceabilityScore < minFlowScore) return false;
      if (onlyWithWords && (!item.embeddedWords || item.embeddedWords.length === 0)) return false;
      return true;
    });
    list.sort((a, b) => {
      if (sortBy === 'score_desc') return b.pronounceabilityScore - a.pronounceabilityScore;
      if (sortBy === 'alpha_asc') return a.text.localeCompare(b.text);
      if (sortBy === 'alpha_desc') return b.text.localeCompare(a.text);
      if (sortBy === 'words_desc') return (b.embeddedWords?.length || 0) - (a.embeddedWords?.length || 0);
      if (sortBy === 'vowels_desc') return b.vowelCount - a.vowelCount;
      return 0;
    });
    return list;
  }, [names, searchTerm, startsWithFilter, endsWithFilter, minFlowScore, sortBy, onlyWithWords]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setShowBackToTop(e.nativeEvent.contentOffset.y > 500);
  };

  const scrollToTop = () => {
    hapticLight();
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const modes = [
    { id: 'pronounceable', label: t('modePronounceable') },
    { id: 'pattern', label: t('modePattern') },
    { id: 'acrostic', label: t('modeAcrostic') },
    { id: 'pure_random', label: t('modeRandom') },
  ];

  const wizardSteps = [
    { label: t('wizBasics'), icon: 'straighten' as const },
    { label: t('wizStyle'), icon: 'palette' as const },
    { label: t('wizSlots'), icon: 'grid-on' as const },
    { label: t('wizReview'), icon: 'fact-check' as const },
  ];

  const setupFingerprint = useMemo(
    () => `${settings.length}|${settings.batchSize}|${settings.casing}|${settings.mode}|${settings.slots.length}`,
    [settings.length, settings.batchSize, settings.casing, settings.mode, settings.slots.length]
  );
  const setupDirty = hasGenerated && generatedFingerprint !== null && generatedFingerprint !== setupFingerprint;

  const goStep = (next: number) => {
    hapticSelect();
    setStep(Math.max(0, Math.min(3, next)));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Slim header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>NameGen</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: brand.yellow }]}
            onPress={() => {
              hapticLight();
              router.push('/favorites');
            }}
          >
            <MaterialIcons name='star' size={18} color={brand.ink} />
            {favorites.length > 0 && (
              <View style={styles.favBadge}>
                <Text style={styles.favBadgeText}>{favorites.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: brand.blue }]}
            onPress={openMath}
          >
            <Text style={styles.mathBtnText}>26n</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: colors.surfaceAlt }]}
            onPress={handleReset}
          >
            <MaterialIcons name="restart-alt" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {toastMessage && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <TouchableOpacity activeOpacity={0.85} onPress={openMath} style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsLabel}>{t('bannerTitle', { length: settings.length })}</Text>
            <Text style={styles.statsFormula}>26^{settings.length}</Text>
          </View>
          <Text style={styles.statsValue}>{formatLargeNumber(26n ** BigInt(settings.length))}</Text>
          <Text style={styles.statsSubtext}>{t('bannerSub')}</Text>
        </TouchableOpacity>

        <View style={styles.controlBox}>
          <View style={styles.wizTopRow}>
            <Text style={styles.wizStepOf}>{t('wizStepOf', { cur: step + 1, total: 4 })}</Text>
            {hasGenerated && (
              <View style={styles.wizDoneBadge}>
                <MaterialIcons name="check-circle" size={12} color={brand.ink} />
                <Text style={styles.wizDoneBadgeText}>{filteredNames.length}</Text>
              </View>
            )}
          </View>
          <View style={styles.wizStepsRow}>
            {wizardSteps.map((s, i) => {
              const active = i === step;
              const done = hasGenerated || i < step;
              return (
                <TouchableOpacity key={s.label} style={[styles.wizStep, active && styles.wizStepActive]} onPress={() => goStep(i)}>
                  <View style={[styles.wizStepNum, active && styles.wizStepNumActive, !active && done && styles.wizStepNumDone]}>
                    {done && !active ? <MaterialIcons name="check" size={12} color={brand.ink} /> : <Text style={[styles.wizStepNumText, active && styles.wizStepNumTextActive]}>{i + 1}</Text>}
                  </View>
                  <MaterialIcons name={s.icon} size={14} color={active ? brand.ink : colors.subtext} />
                  <Text style={[styles.wizStepLabel, active && styles.wizStepLabelActive]}>{s.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.wizProgressTrack}>
            <View style={[styles.wizProgressBar, { width: `${((step + 1) / 4) * 100}%` }]} />
          </View>

          {step === 0 && (
            <>
              <View style={styles.controlSection}>
                <View style={styles.sectionTitleRow}>
                  <Text style={styles.controlTitle}>{t('secLength', { length: settings.length })}</Text>
                  <Text style={styles.badgeSmall}>{t('defaultBadge')}</Text>
                </View>
                <View style={styles.stepperRow}>
                  <TouchableOpacity style={styles.stepperBtn} onPress={() => { hapticSelect(); updateLength(settings.length - 1); }}>
                    <Text style={styles.stepperBtnText}>-</Text>
                  </TouchableOpacity>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.lengthChipsContainer}>
                    {[4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16].map((len) => (
                      <TouchableOpacity key={len} onPress={() => { hapticSelect(); updateLength(len); }} style={[styles.lengthChip, settings.length === len && styles.lengthChipActive]}>
                        <Text style={[styles.lengthChipText, settings.length === len && styles.lengthChipTextActive]}>{len}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity style={styles.stepperBtn} onPress={() => { hapticSelect(); updateLength(settings.length + 1); }}>
                    <Text style={styles.stepperBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.controlSection}>
                <Text style={styles.controlTitle}>{t('secBatch')}</Text>
                <View style={styles.chipRow}>
                  {BATCH_SIZES.map((size) => (
                    <TouchableOpacity key={size} onPress={() => { hapticSelect(); setSettings((p) => ({ ...p, batchSize: size })); }} style={[styles.optionChip, settings.batchSize === size && styles.optionChipActiveBlue]}>
                      <Text style={[styles.optionChipText, settings.batchSize === size && styles.optionChipTextOnColor]}>{size}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.controlSection}>
                <Text style={styles.controlTitle}>{t('secCasing')}</Text>
                <View style={styles.chipRow}>
                  {CASINGS.map((opt) => (
                    <TouchableOpacity key={opt.id} onPress={() => { hapticSelect(); setSettings((p) => ({ ...p, casing: opt.id })); }} style={[styles.optionChip, settings.casing === opt.id && styles.optionChipActiveYellow]}>
                      <Text style={[styles.optionChipText, settings.casing === opt.id && styles.optionChipTextOnColor]}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}

          {step === 1 && (
            <View style={styles.controlSection}>
              <Text style={styles.controlTitle}>{t('secMode')}</Text>
              <View style={styles.modeRow}>
                {modes.map((m) => (
                  <TouchableOpacity key={m.id} onPress={() => { hapticSelect(); setSettings((p) => ({ ...p, mode: m.id as GenerationMode })); }} style={[styles.modeBtn, settings.mode === m.id && styles.modeBtnActive]}>
                    <View style={{flexDirection:'row',alignItems:'center',gap:6}}>
                      <MaterialIcons name={m.id === 'pronounceable' ? 'record-voice-over' : m.id === 'pattern' ? 'grid-4x4' : m.id === 'acrostic' ? 'auto-awesome' : 'casino'} size={14} color={settings.mode === m.id ? brand.ink : colors.text} />
                      <Text style={[styles.modeBtnText, settings.mode === m.id && styles.optionChipTextOnColor]}>{m.label}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.controlSection}>
              <Text style={styles.controlTitle}>{t('secSlots')}</Text>
              <View style={styles.presetRow}>
                <TouchableOpacity style={[styles.presetBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => handleApplyPreset('alternating')}>
                  <Text style={styles.presetBtnText}>{t('presetFlow')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.presetBtn, { backgroundColor: brand.blue }]} onPress={() => handleApplyPreset('melodic')}>
                  <Text style={[styles.presetBtnText, { color: brand.ink }]}>{t('presetMelodic', { length: settings.length })}</Text>
                </TouchableOpacity>
              </View>
              {settings.slots.length > 0 && (
                <TouchableOpacity style={styles.clearAllBtn} onPress={() => { hapticLight(); setSettings((p) => ({ ...p, slots: [] })); }}>
                  <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6}}>
                    <MaterialIcons name="restart-alt" size={14} color={brand.pink} />
                    <Text style={styles.clearAllBtnText}>{t('clearAll')}</Text>
                  </View>
                </TouchableOpacity>
              )}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.slotsRow}>
                {Array.from({ length: settings.length }).map((_, idx) => {
                  const constraint = settings.slots.find((s) => s.index === idx);
                  const currentType = constraint ? constraint.type : 'any';
                  const isEditing = editingSlot === idx;
                  return (
                    <TouchableOpacity key={idx} onPress={() => { hapticSelect(); setEditingSlot(isEditing ? null : idx); }} style={[styles.slotBox, currentType === 'vowel' && { backgroundColor: brand.yellow }, currentType === 'consonant' && { backgroundColor: brand.blue }, currentType === 'exact' && { backgroundColor: brand.green }, isEditing && styles.slotBoxEditing]}>
                      <Text style={styles.slotIndex}>#{idx + 1}</Text>
                      <Text style={[styles.slotType, currentType !== 'any' && styles.slotTypeOnColor]}>{currentType === 'any' ? 'ANY' : currentType === 'vowel' ? 'VOWEL' : currentType === 'consonant' ? 'CONS' : (constraint?.exactChar ?? '?').toUpperCase()}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              {editingSlot !== null && editingSlot < settings.length && (
                <View style={styles.slotEditor}>
                  <View style={styles.slotEditorHeader}>
                    <Text style={styles.slotEditorTitle}>{t('editorPosition', { index: editingSlot + 1, total: settings.length })}</Text>
                    <TouchableOpacity onPress={() => setEditingSlot(null)}>
                      <MaterialIcons name="close" size={16} color={colors.text} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.slotRuleRow}>
                    {([{ id: 'any', label: t('ruleAny') }, { id: 'vowel', label: t('ruleVowel') }, { id: 'consonant', label: t('ruleCons') }] as { id: SlotConstraintType; label: string }[]).map((rule) => {
                      const active = (settings.slots.find((s) => s.index === editingSlot)?.type ?? 'any') === rule.id;
                      return (
                        <TouchableOpacity key={rule.id} style={[styles.slotRuleBtn, active && styles.slotRuleBtnActive]} onPress={() => setSlotRule(editingSlot, rule.id)}>
                          <Text style={[styles.slotRuleText, active && styles.optionChipTextOnColor]}>{rule.label}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  <Text style={styles.slotEditorSubtitle}>{t('pinExact')}</Text>
                  <View style={styles.letterGrid}>
                    {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => {
                      const slot = settings.slots.find((s) => s.index === editingSlot);
                      const isExact = slot?.type === 'exact' && slot.exactChar?.toUpperCase() === letter;
                      return (
                        <TouchableOpacity key={letter} style={[styles.letterKey, isExact && styles.letterKeyActive]} onPress={() => setSlotRule(editingSlot, 'exact', letter)}>
                          <Text style={styles.letterKeyText}>{letter}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>
          )}

          {step === 3 && (
            <View style={styles.controlSection}>
              <Text style={styles.controlTitle}>{t('wizReviewTitle')}</Text>
              <Text style={{fontSize:11,color:colors.subtext,marginBottom:10}}>{t('wizReviewSub')}</Text>
              <View style={styles.reviewCard}>
                <View style={styles.reviewRow}>
                  <MaterialIcons name="straighten" size={15} color={colors.subtext} />
                  <Text style={styles.reviewLabel}>{t('revLength')}</Text>
                  <Text style={styles.reviewValue}>{settings.length}</Text>
                </View>
                <View style={styles.reviewRow}>
                  <MaterialIcons name="layers" size={15} color={colors.subtext} />
                  <Text style={styles.reviewLabel}>{t('revBatch')}</Text>
                  <Text style={styles.reviewValue}>{settings.batchSize}</Text>
                </View>
                <View style={styles.reviewRow}>
                  <MaterialIcons name="format-size" size={15} color={colors.subtext} />
                  <Text style={styles.reviewLabel}>{t('revCasing')}</Text>
                  <Text style={styles.reviewValue}>{settings.casing}</Text>
                </View>
                <View style={styles.reviewRow}>
                  <MaterialIcons name="palette" size={15} color={colors.subtext} />
                  <Text style={styles.reviewLabel}>{t('revMode')}</Text>
                  <Text style={styles.reviewValue}>{settings.mode}</Text>
                </View>
                <View style={styles.reviewRow}>
                  <MaterialIcons name="grid-on" size={15} color={colors.subtext} />
                  <Text style={styles.reviewLabel}>{t('revSlots')}</Text>
                  <Text style={styles.reviewValue}>{settings.slots.length === 0 ? t('revSlotsNone') : `${settings.slots.length}/${settings.length}`}</Text>
                </View>
                <View style={[styles.reviewRow, styles.reviewRowLast]}>
                  <MaterialIcons name="calculate" size={15} color={colors.subtext} />
                  <Text style={styles.reviewLabel}>{t('revCombos')}</Text>
                  <Text style={styles.reviewValue}>{formatLargeNumber(26n ** BigInt(settings.length))}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.generateBtn} activeOpacity={0.85} onPress={handleGenerate}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8}}>
                  <MaterialIcons name="bolt" size={18} color="#FFFFFF" />
                  <Text style={styles.generateBtnText}>{setupDirty ? t('wizRegenerate') : t('generateBtn', { n: settings.batchSize })}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.wizNavRow}>
            {step > 0 ? (
              <TouchableOpacity style={styles.wizBackBtn} onPress={() => goStep(step - 1)}>
                <View style={{flexDirection:'row',alignItems:'center',gap:4}}>
                  <MaterialIcons name="arrow-back" size={15} color={colors.text} />
                  <Text style={styles.wizBackBtnText}>{t('wizBack')}</Text>
                </View>
              </TouchableOpacity>
            ) : <View style={{ flex: 1 }} />}
            {step < 3 ? (
              <TouchableOpacity style={styles.wizNextBtn} onPress={() => goStep(step + 1)}>
                <View style={{flexDirection:'row',alignItems:'center',gap:4}}>
                  <Text style={styles.wizNextBtnText}>{t('wizNext')}</Text>
                  <MaterialIcons name="arrow-forward" size={15} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            ) : <View style={{ flex: 1 }} />}
          </View>
        </View>

        {!hasGenerated ? (
          <View style={styles.emptyBox}>
            <MaterialIcons name="hourglass-empty" size={36} color={colors.subtext} />
            <Text style={styles.emptyTitle}>{t('wizNotYetTitle')}</Text>
            <Text style={styles.emptySubtext}>{t('wizNotYetSub')}</Text>
            <TouchableOpacity style={styles.emptyCta} onPress={() => goStep(3)}>
              <View style={{flexDirection:'row',alignItems:'center',gap:6}}>
                <MaterialIcons name="fact-check" size={16} color="#FFFFFF" />
                <Text style={styles.emptyCtaText}>{t('wizGoReview')}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {setupDirty && (
              <View style={styles.changedBanner}>
                <MaterialIcons name="info" size={15} color={brand.ink} />
                <Text style={styles.changedBannerText}>{t('wizChanged')}</Text>
              </View>
            )}
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>{t('resultsCount', { n: filteredNames.length, len: settings.length })}</Text>
              <TouchableOpacity style={[styles.copyAllBtn, filteredNames.length === 0 && { opacity: 0.4 }]} disabled={filteredNames.length === 0} onPress={handleCopyAllVisible}>
                <View style={{flexDirection:'row',alignItems:'center',gap:4}}>
                  <MaterialIcons name={copiedBatch ? 'check-circle' : 'content-copy'} size={14} color={colors.text} />
                  <Text style={styles.copyAllBtnText}>{copiedBatch ? t('copiedTick') : t('copyAll')}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.generateRow}>
              <TouchableOpacity style={[styles.secondaryBtn, { backgroundColor: brand.green }]} activeOpacity={0.85} onPress={handleGenerateMore}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6}}>
                  <MaterialIcons name="add" size={16} color={brand.ink} />
                  <Text style={styles.secondaryBtnText}>{t('nextSet')}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.secondaryBtn, { backgroundColor: '#ffff' }]} activeOpacity={0.85} onPress={handleGenerate}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6}}>
                  <MaterialIcons name="refresh" size={16} color={brand.ink} />
                  <Text style={styles.secondaryBtnText}>{t('reroll')}</Text>
                </View>
              </TouchableOpacity>
            </View>
            {filteredNames.length === 0 ? (
              <View style={styles.emptyBox}>
                <MaterialIcons name="search" size={36} color={colors.subtext} />
                <Text style={styles.emptyTitle}>{t('emptyTitle')}</Text>
                <Text style={styles.emptySubtext}>{t('emptySub')}</Text>
                <TouchableOpacity style={styles.emptyCta} onPress={handleGenerate}>
                  <View style={{flexDirection:'row',alignItems:'center',gap:6}}>
                    <MaterialIcons name="bolt" size={16} color="#FFFFFF" />
                    <Text style={styles.emptyCtaText}>{t('emptyCta')}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.namesGrid}>
                {filteredNames.map((item) => (
                  <View key={item.id} style={styles.nameCard}>
                    <View style={styles.cardTopRow}>
                      <View style={styles.scoreBadge}>
                        <Text style={styles.scoreText}>{item.pronounceabilityScore}{t('scoreSuffix')}</Text>
                      </View>
                      <View style={styles.vowelRatioBadge}>
                        <Text style={styles.vowelRatioText}>{item.vowelCount}V / {item.consonantCount}C</Text>
                      </View>
                    </View>
                    <Text style={styles.nameWord}>{item.text}</Text>
                    {item.syllables && item.syllables.length > 1 && (
                      <Text style={styles.syllablesText}>{item.syllables.join(' * ')}</Text>
                    )}
                    {item.embeddedWords && item.embeddedWords.length > 0 && (
                      <View style={styles.embeddedRow}>
                        <Text style={styles.embeddedTag}>{t('contains', { words: item.embeddedWords.join(', ') })}</Text>
                      </View>
                    )}
                    <View style={styles.cardActions}>
                      <TouchableOpacity style={styles.copyBtn} onPress={() => copyToClipboard(item.text)}>
                        <View style={{flexDirection:'row',alignItems:'center',gap:4}}>
                          <MaterialIcons name="content-copy" size={14} color={brand.ink} />
                          <Text style={styles.copyBtnText}>{t('copyBtn')}</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionIconBtn} onPress={() => onSpeak(item)}>
                        <MaterialIcons name={speakingId === item.id ? 'stop' : 'volume-up'} size={18} color={colors.text} />
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionIconBtn, item.isFavorite && styles.favActiveBtn]} onPress={() => onToggleFavorite(item)}>
                        <MaterialIcons name={item.isFavorite ? 'star' : 'star-border'} size={18} color={item.isFavorite ? '#FFFFFF' : colors.text} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionIconBtn} onPress={() => openMeaning(item)}>
                        <MaterialIcons name="auto-awesome" size={18} color={colors.text} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, styles.filterFab]}
        onPress={openFilters}
        activeOpacity={0.85}
      >
        <MaterialIcons name="tune" size={22} color={brand.yellow} />
        {activeFilterCount > 0 && (
          <View style={styles.fabBadge}>
            <Text style={styles.fabBadgeText}>{activeFilterCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      {showBackToTop && (
        <TouchableOpacity
          style={[styles.fab, styles.topFab]}
          onPress={scrollToTop}
          activeOpacity={0.85}
        >
          <MaterialIcons name="arrow-upward" size={24} color={brand.yellow} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const createStyles = (c: Palette, bottomInset: number) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: c.surface,
      borderBottomWidth: 2,
      borderBottomColor: c.text,
    },
    appTitle: { fontSize: 20, fontWeight: '900', color: c.text, letterSpacing: -0.5 },
    headerRight: { flexDirection: 'row', gap: 8 },
    headerBtn: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: c.text,
    },
    favBadge: {
      position: 'absolute',
      top: -6,
      right: -6,
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: brand.pink,
      borderWidth: 1.5,
      borderColor: brand.yellow,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    },
    favBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
    mathBtnText: { fontSize: 12, fontWeight: '900', color: brand.ink },
    toast: {
      backgroundColor: brand.ink,
      paddingVertical: 8,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    toastText: { color: brand.green, fontWeight: '700', fontSize: 12 },
    scrollContent: { padding: 16, paddingBottom: 40 },
    statsCard: {
      backgroundColor: brand.yellow,
      borderWidth: 2,
      borderColor: c.text,
      borderRadius: 12,
      padding: 14,
      marginBottom: 16,
      shadowColor: c.text,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 3,
    },
    statsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    statsLabel: { fontSize: 11, fontWeight: '900', color: brand.ink, flex: 1, marginRight: 6 },
    statsFormula: {
      fontSize: 12,
      fontWeight: '900',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: brand.ink,
      color: brand.ink,
    },
    statsValue: { fontSize: 22, fontWeight: '900', color: brand.ink, marginVertical: 2 },
    statsSubtext: { fontSize: 11, color: '#333333', fontWeight: '600' },
    controlBox: {
      backgroundColor: c.surface,
      borderWidth: 2,
      borderColor: c.text,
      borderRadius: 12,
      padding: 14,
      marginBottom: 20,
      shadowColor: c.text,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 3,
    },
    controlSection: { marginBottom: 16 },
    sectionTitleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    controlTitle: { fontSize: 11, fontWeight: '900', color: c.text, letterSpacing: 0.5, marginBottom: 8 },
    badgeSmall: {
      fontSize: 10,
      fontWeight: '800',
      backgroundColor: brand.green,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: brand.ink,
      color: brand.ink,
    },
    resetLink: { fontSize: 11, fontWeight: '800', color: brand.pink, textDecorationLine: 'underline' },
    stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    stepperBtn: {
      width: 36,
      height: 36,
      backgroundColor: c.bg,
      borderWidth: 2,
      borderColor: c.text,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepperBtnText: { fontSize: 18, fontWeight: '900', color: c.text },
    lengthChipsContainer: { gap: 6, paddingVertical: 2 },
    lengthChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: c.surfaceAlt,
      borderWidth: 1.5,
      borderColor: c.text,
      borderRadius: 8,
    },
    lengthChipActive: { backgroundColor: brand.yellow, borderWidth: 2 },
    lengthChipText: { fontSize: 12, fontWeight: '800', color: c.text },
    lengthChipTextActive: { color: brand.ink },
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
    optionChipActiveYellow: { backgroundColor: brand.yellow, borderWidth: 2 },
    optionChipActiveBlue: { backgroundColor: brand.blue, borderWidth: 2 },
    optionChipText: { fontSize: 12, fontWeight: '800', color: c.text },
    optionChipTextOnColor: { color: brand.ink },
    modeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    modeBtn: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      backgroundColor: c.surfaceAlt,
      borderWidth: 1.5,
      borderColor: c.text,
      borderRadius: 8,
    },
    modeBtnActive: { backgroundColor: brand.blue, borderWidth: 2 },
    modeBtnText: { fontSize: 11, fontWeight: '800', color: c.text },
    presetRow: { flexDirection: 'row', gap: 6, marginBottom: 10 },
    presetBtn: {
      flex: 1,
      paddingVertical: 8,
      borderWidth: 2,
      borderColor: c.text,
      borderRadius: 8,
      alignItems: 'center',
    },
    presetBtnText: { fontSize: 11, fontWeight: '900', color: c.text },
    clearAllBtn: { borderWidth: 2, borderColor: brand.pink, borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginBottom: 10 },
    clearAllBtnText: { fontSize: 11, fontWeight: '900', color: brand.pink },
    slotsRow: { gap: 8, paddingVertical: 4 },
    slotBox: {
      width: 54,
      height: 54,
      backgroundColor: c.surfaceAlt,
      borderWidth: 1.5,
      borderColor: c.text,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    slotBoxEditing: { borderColor: brand.pink, borderWidth: 2.5 },
    slotIndex: { fontSize: 9, fontWeight: '800', color: c.subtext },
    slotType: { fontSize: 10, fontWeight: '900', color: c.text, marginTop: 2 },
    slotTypeOnColor: { color: brand.ink },
    slotEditor: {
      marginTop: 10,
      backgroundColor: c.bg,
      borderWidth: 2,
      borderColor: c.text,
      borderRadius: 10,
      padding: 10,
    },
    slotEditorHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    slotEditorTitle: {
      fontSize: 11,
      fontWeight: '900',
      color: brand.ink,
      backgroundColor: brand.yellow,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
      borderWidth: 1.5,
      borderColor: brand.ink,
    },
    slotEditorClose: { fontSize: 14, fontWeight: '900', color: c.text },
    slotRuleRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
    slotRuleBtn: {
      flex: 1,
      paddingVertical: 8,
      backgroundColor: c.surface,
      borderWidth: 1.5,
      borderColor: c.text,
      borderRadius: 8,
      alignItems: 'center',
    },
    slotRuleBtnActive: { backgroundColor: brand.yellow, borderWidth: 2 },
    slotRuleText: { fontSize: 11, fontWeight: '900', color: c.text },
    slotEditorSubtitle: {
      fontSize: 10,
      fontWeight: '900',
      color: c.text,
      letterSpacing: 0.5,
      marginBottom: 6,
    },
    letterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    letterKey: {
      width: 32,
      height: 32,
      backgroundColor: c.surface,
      borderWidth: 1.5,
      borderColor: c.text,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    letterKeyActive: { backgroundColor: brand.green, borderWidth: 2 },
    letterKeyText: { fontSize: 13, fontWeight: '900', color: c.text },
    generateBtn: {
      backgroundColor: brand.pink,
      borderWidth: 2,
      borderColor: c.text,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: c.text,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 2,
    },
    generateBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },
    generateRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
    secondaryBtn: {
      flex: 1,
      borderWidth: 2,
      borderColor: c.text,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondaryBtnText: { color: brand.ink, fontSize: 12, fontWeight: '900', letterSpacing: 0.5 },
    searchInput: {
      backgroundColor: c.bg,
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
      backgroundColor: c.bg,
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
    wordsToggle: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
    wordsToggleBox: { fontSize: 18, color: c.text },
    wordsToggleText: { fontSize: 11, fontWeight: '800', color: c.text },
    filterCounter: { fontSize: 11, fontWeight: '700', color: c.subtext, marginTop: 8 },
    resultsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    resultsCount: { fontSize: 11, fontWeight: '900', color: c.text, letterSpacing: 0.5 },
    copyAllBtn: {
      backgroundColor: c.surface,
      borderWidth: 2,
      borderColor: c.text,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    copyAllBtnText: { fontSize: 11, fontWeight: '900', color: c.text },
    emptyBox: {
      backgroundColor: c.surface,
      borderWidth: 2,
      borderColor: c.text,
      borderStyle: 'dashed',
      borderRadius: 12,
      padding: 24,
      alignItems: 'center',
      gap: 6,
    },
    emptyEmoji: { fontSize: 36 },
    emptyTitle: { fontSize: 14, fontWeight: '900', color: c.text, textAlign: 'center' },
    emptySubtext: { fontSize: 11, color: c.subtext, textAlign: 'center' },
    emptyCta: {
      marginTop: 8,
      backgroundColor: brand.pink,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: c.text,
    },
    emptyCtaText: { color: '#FFFFFF', fontSize: 12, fontWeight: '900' },
    namesGrid: { gap: 12 },
    nameCard: {
      backgroundColor: c.surface,
      borderWidth: 2,
      borderColor: c.text,
      borderRadius: 12,
      padding: 14,
      shadowColor: c.text,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 2,
    },
    cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    scoreBadge: {
      backgroundColor: brand.green,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: brand.ink,
    },
    scoreText: { fontSize: 10, fontWeight: '900', color: brand.ink },
    vowelRatioBadge: {
      backgroundColor: c.bg,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: c.text,
    },
    vowelRatioText: { fontSize: 10, fontWeight: '800', color: c.text },
    nameWord: { fontSize: 22, fontWeight: '900', color: c.text, letterSpacing: 0.5, marginVertical: 4 },
    syllablesText: { fontSize: 11, fontWeight: '700', color: c.subtext, marginBottom: 4 },
    embeddedRow: { marginBottom: 8 },
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
      borderTopColor: c.divider,
      paddingTop: 8,
    },
    copyBtn: {
      flex: 1,
      backgroundColor: brand.yellow,
      borderWidth: 1.5,
      borderColor: c.text,
      borderRadius: 8,
      paddingVertical: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    copyBtnText: { fontSize: 11, fontWeight: '900', color: brand.ink },
    actionIconBtn: {
      width: 36,
      height: 32,
      backgroundColor: c.surfaceAlt,
      borderWidth: 1.5,
      borderColor: c.text,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    favActiveBtn: { backgroundColor: brand.pink },
    actionIconText: { fontSize: 14, color: c.text },
    fab: {
      position: 'absolute',
      right: 16,
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: brand.ink,
      borderWidth: 2,
      borderColor: brand.yellow,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    filterFab: {
      bottom: bottomInset + 10,
    },
    topFab: {
      bottom: bottomInset + 70,
    },
    fabBadge: {
      position: 'absolute',
      top: -6,
      right: -6,
      minWidth: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: brand.pink,
      borderWidth: 1.5,
      borderColor: brand.yellow,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    },
    fabBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '900' },
    wizTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    wizStepOf: { fontSize: 11, fontWeight: '900', color: c.text, letterSpacing: 0.5 },
    wizDoneBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: brand.green, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, borderWidth: 1, borderColor: brand.ink },
    wizDoneBadgeText: { fontSize: 10, fontWeight: '900', color: brand.ink },
    wizStepsRow: { flexDirection: 'row', gap: 4, marginBottom: 10 },
    wizStep: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 6, borderRadius: 8, backgroundColor: c.surfaceAlt, borderWidth: 1, borderColor: c.divider },
    wizStepActive: { backgroundColor: brand.yellow, borderColor: brand.ink, borderWidth: 2 },
    wizStepNum: { width: 20, height: 20, borderRadius: 10, backgroundColor: c.surface, borderWidth: 1.5, borderColor: c.text, alignItems: 'center', justifyContent: 'center' },
    wizStepNumActive: { backgroundColor: brand.ink, borderColor: brand.ink },
    wizStepNumDone: { backgroundColor: brand.green, borderColor: brand.ink },
    wizStepNumText: { fontSize: 10, fontWeight: '900', color: c.text },
    wizStepNumTextActive: { color: '#FFFFFF' },
    wizStepLabel: { fontSize: 9, fontWeight: '800', color: c.subtext, flexShrink: 1 },
    wizStepLabelActive: { color: brand.ink },
    wizProgressTrack: { height: 4, backgroundColor: c.surfaceAlt, borderRadius: 2, marginBottom: 14, borderWidth: 1, borderColor: c.divider },
    wizProgressBar: { height: '100%', backgroundColor: brand.ink, borderRadius: 2 },
    wizNavRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
    wizBackBtn: { backgroundColor: c.surfaceAlt, borderWidth: 2, borderColor: c.text, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10 },
    wizBackBtnText: { fontSize: 12, fontWeight: '900', color: c.text },
    wizNextBtn: { backgroundColor: brand.ink, borderWidth: 2, borderColor: brand.yellow, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10 },
    wizNextBtnText: { fontSize: 12, fontWeight: '900', color: '#FFFFFF' },
    reviewCard: { backgroundColor: c.bg, borderWidth: 2, borderColor: c.text, borderRadius: 10, padding: 10, marginBottom: 12 },
    reviewRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: c.divider },
    reviewRowLast: { borderBottomWidth: 0 },
    reviewLabel: { fontSize: 11, fontWeight: '800', color: c.subtext, flex: 1 },
    reviewValue: { fontSize: 12, fontWeight: '900', color: c.text },
    changedBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: brand.yellow, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1.5, borderColor: brand.ink, marginBottom: 10 },
    changedBannerText: { fontSize: 11, fontWeight: '800', color: brand.ink, flex: 1 },
  });
