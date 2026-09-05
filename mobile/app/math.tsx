import React from 'react';
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
import { hapticLight } from '../src/utils/haptics';

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
  const params = useLocalSearchParams<{ length?: string }>();
  const parsed = Number(Array.isArray(params.length) ? params.length[0] : params.length);
  const length = Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 9;

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

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.highlightBox}>
          <Text style={styles.highlightFormula}>26^{length}</Text>
          <Text style={styles.highlightResult}>
            {formatLargeNumber(26n ** BigInt(length))} Total Combinations
          </Text>
        </View>

        <Text style={styles.sectionHeading}>The Exponential Principle</Text>
        <Text style={styles.paragraph}>
          With an alphabet of 26 letters (A–Z), every character position you add multiplies the
          total theoretical permutation space by 26:
        </Text>

        <View style={styles.table}>
          {TABLE_ROWS.map((row) => (
            <View key={row.len} style={styles.tableRow}>
              <Text style={styles.tableLeft}>
                26^{row.len} ({row.len} chars)
              </Text>
              <Text style={styles.tableRight}>{row.val}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionHeading}>Phonetic Filtering</Text>
        <Text style={styles.paragraph}>
          NameGen reduces the raw 26ⁿ space into pronounceable phonemes using Latin syllable
          structures (Onset, Nucleus, Coda), bigram harmonic transition matrices, and
          vowel-to-consonant equilibrium ratios.
        </Text>
      </ScrollView>
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
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  highlightBox: {
    backgroundColor: '#FFD100',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  highlightFormula: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  highlightResult: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1A1A1A',
    marginTop: 12,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 18,
    color: '#444',
    marginBottom: 12,
  },
  table: {
    borderWidth: 1.5,
    borderColor: '#1A1A1A',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#FFF',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  tableLeft: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  tableRight: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0066CC',
  },
});
