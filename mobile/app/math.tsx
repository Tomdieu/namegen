import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { formatLargeNumber } from '../src/utils/combinatorics';
import { usePreferences } from '../src/store/preferences';
import { hapticLight } from '../src/utils/haptics';
import { brand, type Palette } from '../src/theme';

const TABLE_ROWS = [
  { len: 3, val: '17,576' },
  { len: 5, val: '11.88 Million' },
  { len: 7, val: '8.03 Billion' },
  { len: 9, val: '5.43 Trillion (Default)' },
  { len: 12, val: '95.42 Quadrillion' },
  { len: 15, val: '1.67 Quintillion' },
];

export default function MathScreen() {
  const router = useRouter();
  const { colors, t } = usePreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const params = useLocalSearchParams<{ length?: string }>();
  const parsed = Number(Array.isArray(params.length) ? params.length[0] : params.length);
  const length = Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 9;

  const close = () => {
    hapticLight();
    router.back();
  };

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
          <View />
          <TouchableOpacity onPress={close} style={styles.sheetCloseBtn}>
            <Text style={styles.sheetCloseText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightFormula}>26^{length}</Text>
          <Text style={styles.highlightResult}>
            {t('totalCombos', { v: formatLargeNumber(26n ** BigInt(length)) })}
          </Text>
        </View>

        <Text style={styles.sectionHeading}>{t('mathPrinciple')}</Text>
        <Text style={styles.paragraph}>{t('mathPrincipleBody')}</Text>

        <View style={styles.table}>
          {TABLE_ROWS.map((row) => (
            <View key={row.len} style={styles.tableRow}>
              <Text style={styles.tableLeft}>
                26^{row.len} ({row.len})
              </Text>
              <Text style={styles.tableRight}>{row.val}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionHeading}>{t('mathPhonetic')}</Text>
        <Text style={styles.paragraph}>{t('mathPhoneticBody')}</Text>
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
      marginBottom: 10,
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
    highlightBox: {
      backgroundColor: brand.yellow,
      borderWidth: 2,
      borderColor: c.text,
      borderRadius: 10,
      padding: 16,
      alignItems: 'center',
      marginBottom: 20,
    },
    highlightFormula: { fontSize: 24, fontWeight: '900', color: brand.ink },
    highlightResult: { fontSize: 14, fontWeight: '800', color: brand.ink, marginTop: 4 },
    sectionHeading: { fontSize: 14, fontWeight: '900', color: c.text, marginTop: 12, marginBottom: 6 },
    paragraph: { fontSize: 12, lineHeight: 18, color: c.subtext, marginBottom: 12 },
    table: {
      borderWidth: 1.5,
      borderColor: c.text,
      borderRadius: 8,
      overflow: 'hidden',
      marginBottom: 16,
      backgroundColor: c.surface,
    },
    tableRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: c.divider,
    },
    tableLeft: { fontSize: 11, fontWeight: '800', color: c.text },
    tableRight: { fontSize: 11, fontWeight: '800', color: '#0066CC' },
  });
