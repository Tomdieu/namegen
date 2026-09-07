import React, { useMemo, useState } from 'react';
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
import * as Clipboard from 'expo-clipboard';
import { ACROSTIC_MEANINGS } from '../src/data/linguisticData';
import { useFavorites } from '../src/store/favorites';
import { usePreferences } from '../src/store/preferences';
import { MaterialIcons } from '@expo/vector-icons';
import { hapticLight, hapticSelect, hapticSuccess } from '../src/utils/haptics';
import { speakText } from '../src/utils/speech';
import { brand, type Palette } from '../src/theme';

function parseStringArray(raw: string | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((w): w is string => typeof w === 'string');
  } catch {
    // ignore malformed params
  }
  return [];
}

export default function MeaningScreen() {
  const router = useRouter();
  const { toggleFavorite, updateNotes } = useFavorites();
  const { colors, t } = usePreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const params = useLocalSearchParams<{
    id?: string;
    text?: string;
    length?: string;
    score?: string;
    vowels?: string;
    consonants?: string;
    syllables?: string;
    embedded?: string;
    meanings?: string;
    fav?: string;
    notes?: string;
  }>();

  const id = typeof params.id === 'string' ? params.id : '';
  const text = typeof params.text === 'string' ? params.text : '';
  const length = Number(typeof params.length === 'string' ? params.length : text.length) || text.length;
  const score = Number(typeof params.score === 'string' ? params.score : 0) || 0;
  const vowelCount = Number(typeof params.vowels === 'string' ? params.vowels : 0) || 0;
  const consonantCount = Number(typeof params.consonants === 'string' ? params.consonants : 0) || 0;
  const syllables = parseStringArray(typeof params.syllables === 'string' ? params.syllables : undefined);
  const embeddedWords = parseStringArray(typeof params.embedded === 'string' ? params.embedded : undefined);
  const baseMeanings = parseStringArray(typeof params.meanings === 'string' ? params.meanings : undefined);
  const initialNotes = typeof params.notes === 'string' ? params.notes : '';

  const [isFav, setIsFav] = useState(params.fav === '1');
  const [customAcrostic, setCustomAcrostic] = useState<Record<number, string>>({});
  const [noteText, setNoteText] = useState(initialNotes);
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const chars = text.toUpperCase().split('');

  const close = () => {
    hapticLight();
    router.back();
  };

  const getLetterTrait = (char: string, index: number): string => {
    if (customAcrostic[index]) return customAcrostic[index];
    if (baseMeanings[index]) return baseMeanings[index];
    const pool = ACROSTIC_MEANINGS[char];
    return pool && pool.length > 0 ? pool[0] : t('luminousFallback');
  };

  const cycleLetterTrait = (char: string, index: number) => {
    hapticSelect();
    const pool = ACROSTIC_MEANINGS[char] || ['Virtuous', 'Resilient', t('luminousFallback')];
    const current = getLetterTrait(char, index);
    const next = pool[(pool.indexOf(current) + 1) % pool.length];
    setCustomAcrostic((prev) => ({ ...prev, [index]: next }));
  };

  const listen = () => {
    hapticLight();
    speakText(text, {
      onStart: () => setSpeaking(true),
      onDone: () => setSpeaking(false),
    });
  };

  const onToggleFav = () => {
    hapticSelect();
    const added = toggleFavorite({
      id,
      text,
      length,
      pronounceabilityScore: score,
      vowelCount,
      consonantCount,
      syllables,
      embeddedWords,
      acrosticMeaning: chars.map((c, i) => getLetterTrait(c, i)),
      createdAt: Date.now(),
    });
    setIsFav(added);
  };

  const onNotesChange = (value: string) => {
    setNoteText(value);
    if (id) updateNotes(id, value);
  };

  const copySummary = async () => {
    const lines = [
      `Name: ${text} (${length} Letters)`,
      `Pronunciation: ${syllables.join(' • ')}`,
      `Flow Score: ${score}%`,
      `Acrostic Meaning:`,
      ...chars.map((char, i) => `  ${char} — ${getLetterTrait(char, i)}`),
      embeddedWords.length > 0 ? `Embedded Morphemes: ${embeddedWords.join(', ')}` : '',
      noteText ? `Notes: ${noteText}` : '',
    ].filter(Boolean);
    await Clipboard.setStringAsync(lines.join('\n'));
    hapticSuccess();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const vowelPct = length > 0 ? Math.round((vowelCount / length) * 100) : 0;

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
        <View style={styles.titleRow}>
          <View style={styles.badges}>
            <Text style={styles.badgeYellow}>{t('meaningBadge', { len: length })}</Text>
            <Text style={styles.badgeBlue}>{t('scoreBadge', { s: score })}</Text>
          </View>
          <TouchableOpacity onPress={close} style={styles.sheetCloseBtn}>
            <MaterialIcons name="close" size={16} color={colors.text} />
          </TouchableOpacity>
        </View>

        <Text style={styles.nameTitle}>{text}</Text>
        {syllables.length > 0 && (
          <Text style={styles.syllables}>{t('phoneticLabel', { s: syllables.join(' • ') })}</Text>
        )}

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, speaking && { backgroundColor: brand.pink }]}
            onPress={listen}
          >
            <View style={{flexDirection:'row',alignItems:'center',gap:6}}>
              <MaterialIcons name={speaking ? 'stop' : 'volume-up'} size={16} color={speaking ? '#FFFFFF' : colors.text} />
              <Text style={[styles.actionBtnText, speaking && { color: '#FFFFFF' }]}>
                {speaking ? t('stopBtn') : t('listenBtn')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, isFav && { backgroundColor: brand.yellow }]}
            onPress={onToggleFav}
          >
            <View style={{flexDirection:'row',alignItems:'center',gap:6}}>
              <MaterialIcons name={isFav ? 'star' : 'star-border'} size={16} color={isFav ? brand.ink : colors.text} />
              <Text style={[styles.actionBtnText, isFav && { color: brand.ink }]}>
                {isFav ? t('savedBtn') : t('saveBtn')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>{t('secVirtues')}</Text>
        {chars.map((char, i) => (
          <TouchableOpacity key={i} style={styles.traitRow} onPress={() => cycleLetterTrait(char, i)}>
            <View style={styles.charBox}>
              <Text style={styles.char}>{char}</Text>
            </View>
            <View style={styles.traitInfo}>
              <Text style={styles.traitIndex}>{t('letterN', { n: i + 1 })}</Text>
              <Text style={styles.traitWord}>{getLetterTrait(char, i)}</Text>
            </View>
            <MaterialIcons name="swap-horiz" size={16} color={colors.subtext} />
          </TouchableOpacity>
        ))}

        <View style={styles.panelRow}>
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>{t('secRoots')}</Text>
            {embeddedWords.length > 0 ? (
              <View style={styles.tagWrap}>
                {embeddedWords.map((word) => (
                  <Text key={word} style={styles.tagBlue}>
                    {word}
                  </Text>
                ))}
              </View>
            ) : (
              <Text style={styles.panelText}>{t('noRoots')}</Text>
            )}
          </View>
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>{t('secProfile')}</Text>
            <Text style={styles.profileLine}>{t('profileVowels', { p: vowelPct, n: vowelCount })}</Text>
            <Text style={styles.profileLine}>{t('profileCons', { n: consonantCount })}</Text>
            <Text style={styles.profileLine}>{t('profileSyll', { n: syllables.length })}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('secNotes')}</Text>
        <TextInput
          style={styles.notesInput}
          value={noteText}
          onChangeText={onNotesChange}
          placeholder={t('notesPh')}
          placeholderTextColor={colors.placeholder}
          multiline
          numberOfLines={2}
        />

        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.closeCta} onPress={close}>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6}}>
              <MaterialIcons name="close" size={14} color={colors.text} />
              <Text style={styles.closeCtaText}>{t('closeBtn')}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.copyCta} onPress={copySummary}>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6}}>
              <MaterialIcons name={copied ? 'check-circle' : 'content-copy'} size={14} color="#FFFFFF" />
              <Text style={styles.copyCtaText}>{copied ? t('copiedMeaning') : t('copyMeaning')}</Text>
            </View>
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
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 8,
      marginBottom: 8,
    },
    badges: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    badgeYellow: {
      fontSize: 10,
      fontWeight: '900',
      color: brand.ink,
      backgroundColor: brand.yellow,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
      borderWidth: 1.5,
      borderColor: brand.ink,
    },
    badgeBlue: {
      fontSize: 10,
      fontWeight: '900',
      color: brand.ink,
      backgroundColor: brand.blue,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
      borderWidth: 1.5,
      borderColor: brand.ink,
    },
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
    nameTitle: { fontSize: 32, fontWeight: '900', color: c.text, letterSpacing: 0.5 },
    syllables: { fontSize: 11, fontWeight: '700', color: c.subtext, marginTop: 2, marginBottom: 10 },
    actionRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
    actionBtn: {
      flex: 1,
      paddingVertical: 9,
      backgroundColor: c.surface,
      borderWidth: 2,
      borderColor: c.text,
      borderRadius: 10,
      alignItems: 'center',
    },
    actionBtnText: { fontSize: 12, fontWeight: '900', color: c.text },
    sectionTitle: {
      fontSize: 11,
      fontWeight: '900',
      color: c.text,
      letterSpacing: 0.5,
      marginBottom: 8,
      marginTop: 8,
    },
    traitRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: c.surface,
      borderWidth: 1.5,
      borderColor: c.text,
      borderRadius: 10,
      padding: 10,
      marginBottom: 8,
    },
    charBox: {
      width: 36,
      height: 36,
      backgroundColor: brand.pink,
      borderWidth: 1.5,
      borderColor: c.text,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    char: { fontSize: 16, fontWeight: '900', color: '#FFFFFF' },
    traitInfo: { flex: 1 },
    traitIndex: { fontSize: 9, fontWeight: '700', color: c.subtext },
    traitWord: { fontSize: 13, fontWeight: '900', color: c.text },
    cycleHint: { fontSize: 14 },
    panelRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
    panel: {
      flex: 1,
      backgroundColor: c.surface,
      borderWidth: 1.5,
      borderColor: c.text,
      borderRadius: 10,
      padding: 10,
    },
    panelTitle: { fontSize: 10, fontWeight: '900', color: c.text, letterSpacing: 0.5, marginBottom: 6 },
    panelText: { fontSize: 11, color: c.subtext, fontWeight: '600' },
    tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    tagBlue: {
      fontSize: 11,
      fontWeight: '900',
      color: brand.ink,
      backgroundColor: brand.blue,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: brand.ink,
    },
    profileLine: { fontSize: 11, fontWeight: '700', color: c.text, marginBottom: 2 },
    notesInput: {
      backgroundColor: c.surface,
      borderWidth: 2,
      borderColor: c.text,
      borderRadius: 10,
      padding: 10,
      fontSize: 12,
      fontWeight: '600',
      color: c.text,
      minHeight: 56,
      textAlignVertical: 'top',
    },
    footerRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
    closeCta: {
      flex: 1,
      backgroundColor: c.surfaceAlt,
      paddingVertical: 12,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: c.text,
      alignItems: 'center',
    },
    closeCtaText: { color: c.text, fontWeight: '900', fontSize: 12 },
    copyCta: {
      flex: 2,
      backgroundColor: brand.pink,
      paddingVertical: 12,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: c.text,
      alignItems: 'center',
    },
    copyCtaText: { color: '#FFFFFF', fontWeight: '900', fontSize: 12 },
  });
