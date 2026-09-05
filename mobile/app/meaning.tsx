import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { hapticLight } from '../src/utils/haptics';

export default function MeaningScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ text?: string; words?: string }>();

  const text = typeof params.text === 'string' ? params.text : '';
  const rawWords = typeof params.words === 'string' ? params.words : '[]';
  let words: string[] = [];
  try {
    const parsed: unknown = JSON.parse(rawWords);
    if (Array.isArray(parsed)) {
      words = parsed.filter((w): w is string => typeof w === 'string');
    }
  } catch {
    words = [];
  }

  const chars = text.split('');

  const close = () => {
    hapticLight();
    router.back();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.box}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            Acrostic: {text}
          </Text>
          <TouchableOpacity onPress={close} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.list}>
          {chars.map((char, i) => (
            <View key={i} style={styles.item}>
              <View style={styles.charBox}>
                <Text style={styles.char}>{char.toUpperCase()}</Text>
              </View>
              <Text style={styles.word}>{words[i] || 'Luminous'}</Text>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.doneBtn} onPress={close}>
          <Text style={styles.doneText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  box: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1A1A1A',
    borderRadius: 14,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#1A1A1A',
    paddingBottom: 10,
    marginBottom: 12,
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  closeBtn: {
    width: 30,
    height: 30,
    backgroundColor: '#FFF9E6',
    borderWidth: 1.5,
    borderColor: '#1A1A1A',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  list: {
    marginVertical: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  charBox: {
    width: 32,
    height: 32,
    backgroundColor: '#FFD100',
    borderWidth: 1.5,
    borderColor: '#1A1A1A',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  char: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  word: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  doneBtn: {
    marginTop: 12,
    backgroundColor: '#1A1A1A',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
  },
});
