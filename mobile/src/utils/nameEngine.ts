import {
  ALPHABET_26,
  VOWELS,
  CONSONANTS,
  PHONETIC_BIGRAM_SCORES,
  EMBEDDED_WORDS_DICTIONARY,
  ACROSTIC_MEANINGS
} from '../data/linguisticData';
import { GeneratedName, GenerationSettings, SlotConstraint } from '../types';

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function formatCase(text: string, casing: GenerationSettings['casing']): string {
  const upper = text.toUpperCase();
  if (casing === 'upper') return upper;
  if (casing === 'lower') return text.toLowerCase();
  return upper.charAt(0) + upper.slice(1).toLowerCase();
}

export function calculatePronounceabilityScore(word: string): number {
  const upper = word.toUpperCase();
  if (upper.length === 0) return 0;

  let score = 50;
  const len = upper.length;

  const vowelCount = upper.split('').filter((c) => VOWELS.includes(c)).length;
  const vowelRatio = vowelCount / len;

  if (vowelRatio >= 0.3 && vowelRatio <= 0.55) {
    score += 25;
  } else if (vowelRatio >= 0.2 && vowelRatio <= 0.65) {
    score += 10;
  } else {
    score -= 25;
  }

  let maxCons = 0;
  let currCons = 0;
  let maxVowels = 0;
  let currVowels = 0;

  for (let i = 0; i < len; i++) {
    const isVowel = VOWELS.includes(upper[i]);
    if (isVowel) {
      currVowels++;
      currCons = 0;
      if (currVowels > maxVowels) maxVowels = currVowels;
    } else {
      currCons++;
      currVowels = 0;
      if (currCons > maxCons) maxCons = currCons;
    }
  }

  if (maxCons >= 4) score -= 30;
  else if (maxCons === 3) score -= 10;
  else if (maxCons <= 2) score += 10;

  if (maxVowels >= 3) score -= 15;
  else if (maxVowels === 2) score += 5;

  let bigramTotal = 0;
  let bigramChecks = 0;
  for (let i = 0; i < len - 1; i++) {
    const pair = upper.substring(i, i + 2);
    const pairScore = PHONETIC_BIGRAM_SCORES[pair];
    if (pairScore !== undefined) {
      bigramTotal += pairScore;
      bigramChecks++;
    } else {
      const firstIsVowel = VOWELS.includes(upper[i]);
      const secondIsVowel = VOWELS.includes(upper[i + 1]);
      if (firstIsVowel !== secondIsVowel) {
        bigramTotal += 7;
      } else {
        bigramTotal += 4;
      }
      bigramChecks++;
    }
  }

  if (bigramChecks > 0) {
    const avgBigram = bigramTotal / bigramChecks;
    score += (avgBigram - 5) * 5;
  }

  return Math.max(5, Math.min(99, Math.round(score)));
}

export function detectEmbeddedWords(word: string): string[] {
  const upper = word.toUpperCase();
  const found: string[] = [];

  for (let start = 0; start < upper.length; start++) {
    for (let end = start + 3; end <= Math.min(upper.length, start + 7); end++) {
      const sub = upper.substring(start, end);
      if (EMBEDDED_WORDS_DICTIONARY.has(sub) && !found.includes(sub)) {
        found.push(sub);
      }
    }
  }

  return found;
}

export function breakIntoSyllables(word: string): string[] {
  const upper = word.toUpperCase();
  if (upper.length <= 3) return [upper];

  const syllables: string[] = [];
  let current = '';

  for (let i = 0; i < upper.length; i++) {
    current += upper[i];
    const isCurrentVowel = VOWELS.includes(upper[i]);
    const nextChar = upper[i + 1];
    const nextIsVowel = nextChar ? VOWELS.includes(nextChar) : false;

    if (isCurrentVowel && nextChar && !nextIsVowel && i + 2 < upper.length && VOWELS.includes(upper[i + 2])) {
      syllables.push(current);
      current = '';
    } else if (current.length >= 3 && isCurrentVowel && i < upper.length - 2) {
      syllables.push(current);
      current = '';
    }
  }

  if (current.length > 0) {
    if (syllables.length > 0 && current.length <= 1) {
      syllables[syllables.length - 1] += current;
    } else {
      syllables.push(current);
    }
  }

  return syllables.length > 0 ? syllables : [upper];
}

export function generateAcrosticMeaning(word: string): string[] {
  const upper = word.toUpperCase();
  return upper.split('').map((char) => {
    const list = ACROSTIC_MEANINGS[char];
    if (list && list.length > 0) {
      return randomChoice(list);
    }
    return 'Luminous';
  });
}

function getCharForSlot(
  slotIndex: number,
  slots: SlotConstraint[],
  fallbackPool: string,
  preferredType?: 'vowel' | 'consonant'
): string {
  const slot = slots.find((s) => s.index === slotIndex);
  if (slot) {
    if (slot.type === 'exact' && slot.exactChar) {
      return slot.exactChar.toUpperCase();
    }
    if (slot.type === 'vowel') {
      const poolVowels = VOWELS.filter((v) => fallbackPool.includes(v));
      return randomChoice(poolVowels.length > 0 ? poolVowels : VOWELS);
    }
    if (slot.type === 'consonant') {
      const poolConsonants = CONSONANTS.filter((c) => fallbackPool.includes(c));
      return randomChoice(poolConsonants.length > 0 ? poolConsonants : CONSONANTS);
    }
    if (slot.type === 'custom' && slot.customChars && slot.customChars.length > 0) {
      return randomChoice(slot.customChars).toUpperCase();
    }
  }

  if (preferredType === 'vowel') {
    const poolVowels = VOWELS.filter((v) => fallbackPool.includes(v));
    return randomChoice(poolVowels.length > 0 ? poolVowels : VOWELS);
  } else if (preferredType === 'consonant') {
    const poolConsonants = CONSONANTS.filter((c) => fallbackPool.includes(c));
    return randomChoice(poolConsonants.length > 0 ? poolConsonants : CONSONANTS);
  }

  const poolChars = fallbackPool.length > 0 ? fallbackPool.split('') : ALPHABET_26;
  return randomChoice(poolChars).toUpperCase();
}

function generatePronounceableWord(settings: GenerationSettings): string {
  const { length, characterPool, slots } = settings;
  const chars: string[] = new Array(length);
  let useVowelNext = Math.random() > 0.6;

  for (let i = 0; i < length; i++) {
    const slot = slots.find((s) => s.index === i);
    if (slot && slot.type !== 'any') {
      chars[i] = getCharForSlot(i, slots, characterPool);
      useVowelNext = !VOWELS.includes(chars[i]);
    } else {
      let forceType: 'vowel' | 'consonant' | undefined;
      if (i >= 2) {
        const prev1Vowel = VOWELS.includes(chars[i - 1]);
        const prev2Vowel = VOWELS.includes(chars[i - 2]);
        if (prev1Vowel && prev2Vowel) forceType = 'consonant';
        else if (!prev1Vowel && !prev2Vowel) forceType = 'vowel';
      }

      const targetType = forceType || (useVowelNext ? 'vowel' : 'consonant');
      chars[i] = getCharForSlot(i, slots, characterPool, targetType);

      const isCurrentVowel = VOWELS.includes(chars[i]);
      if (isCurrentVowel) {
        useVowelNext = Math.random() < 0.2;
      } else {
        useVowelNext = Math.random() < 0.8;
      }
    }
  }

  return chars.join('');
}

function generatePureRandomWord(settings: GenerationSettings): string {
  const { length, characterPool, slots } = settings;
  const chars: string[] = [];
  for (let i = 0; i < length; i++) {
    chars.push(getCharForSlot(i, slots, characterPool));
  }
  return chars.join('');
}

export function generateNamesBatch(settings: GenerationSettings): GeneratedName[] {
  const results: GeneratedName[] = [];
  const count = Math.min(settings.batchSize, 500);
  const seen = new Set<string>();

  let attempts = 0;
  const maxAttempts = count * 6;

  while (results.length < count && attempts < maxAttempts) {
    attempts++;
    let rawWord = '';

    switch (settings.mode) {
      case 'pronounceable':
      case 'acrostic':
        rawWord = generatePronounceableWord(settings);
        break;
      case 'pure_random':
      case 'lexicographic':
      case 'pattern':
      default:
        rawWord = generatePureRandomWord(settings);
        break;
    }

    if (seen.has(rawWord)) continue;
    seen.add(rawWord);

    const score = calculatePronounceabilityScore(rawWord);
    if (settings.minScore > 0 && score < settings.minScore) {
      continue;
    }

    const vowelCount = rawWord.split('').filter((c) => VOWELS.includes(c)).length;
    if (settings.minVowels > 0 && vowelCount < settings.minVowels) {
      continue;
    }

    if (settings.filterStartsWith && !rawWord.startsWith(settings.filterStartsWith.toUpperCase())) {
      continue;
    }
    if (settings.filterEndsWith && !rawWord.endsWith(settings.filterEndsWith.toUpperCase())) {
      continue;
    }
    if (settings.filterSubstring && !rawWord.includes(settings.filterSubstring.toUpperCase())) {
      continue;
    }

    const formattedText = formatCase(rawWord, settings.casing);
    const embeddedWords = detectEmbeddedWords(rawWord);
    const syllables = breakIntoSyllables(formattedText);
    const acrosticMeaning = generateAcrosticMeaning(rawWord);

    results.push({
      id: `${rawWord}-${Date.now()}-${results.length}`,
      text: formattedText,
      length: rawWord.length,
      pronounceabilityScore: score,
      vowelCount,
      consonantCount: rawWord.length - vowelCount,
      syllables,
      embeddedWords,
      acrosticMeaning,
      createdAt: Date.now(),
    });
  }

  if (results.length === 0) {
    const rawWord = generatePureRandomWord(settings);
    const formattedText = formatCase(rawWord, settings.casing);
    results.push({
      id: `${rawWord}-${Date.now()}-0`,
      text: formattedText,
      length: rawWord.length,
      pronounceabilityScore: calculatePronounceabilityScore(rawWord),
      vowelCount: rawWord.split('').filter((c) => VOWELS.includes(c)).length,
      consonantCount: rawWord.length - rawWord.split('').filter((c) => VOWELS.includes(c)).length,
      syllables: breakIntoSyllables(formattedText),
      embeddedWords: detectEmbeddedWords(rawWord),
      acrosticMeaning: generateAcrosticMeaning(rawWord),
      createdAt: Date.now(),
    });
  }

  return results;
}
