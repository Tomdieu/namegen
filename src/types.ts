export type GenerationMode = 'pronounceable' | 'pattern' | 'acrostic' | 'pure_random' | 'lexicographic';

export type CasingOption = 'title' | 'upper' | 'lower';

export type SlotConstraintType = 'any' | 'vowel' | 'consonant' | 'exact' | 'custom';

export interface SlotConstraint {
  index: number;
  type: SlotConstraintType;
  exactChar?: string;
  customChars?: string[];
  isLocked?: boolean;
}

export interface GeneratedName {
  id: string;
  text: string;
  length: number;
  pronounceabilityScore: number; // 0 - 100
  vowelCount: number;
  consonantCount: number;
  syllables: string[];
  embeddedWords: string[];
  acrosticMeaning?: string[];
  createdAt: number;
  isFavorite?: boolean;
  notes?: string;
  tags?: string[];
}

export interface GenerationSettings {
  length: number; // default 9
  batchSize: number; // default 24
  mode: GenerationMode;
  casing: CasingOption;
  characterPool: string; // default "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  slots: SlotConstraint[];
  minVowels: number;
  maxConsecutiveConsonants: number;
  allowRepeatedAdjacent: boolean;
  filterSubstring: string;
  filterStartsWith: string;
  filterEndsWith: string;
  minScore: number;
}

export interface CombinatoricsStats {
  totalPossible: number; // e.g., 26^9 = 5,429,503,678,976
  totalFormulaString: string;
  constrainedPossible: number;
  constrainedFormulaString: string;
  entropyBits: number;
  vowelProbability: number;
}
