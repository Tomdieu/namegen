import { VOWELS, CONSONANTS, ALPHABET_26 } from '../data/linguisticData';
import { SlotConstraint, CombinatoricsStats } from '../types';

export function formatLargeNumber(num: number | bigint): string {
  if (typeof num === 'bigint') {
    if (num > 1_000_000_000_000_000_000n) {
      return (Number(num / 1_000_000_000_000_000n) / 1000).toFixed(2) + ' Quintillion';
    }
    if (num > 1_000_000_000_000_000n) {
      return (Number(num / 1_000_000_000_000n) / 1000).toFixed(2) + ' Quadrillion';
    }
    if (num > 1_000_000_000_000n) {
      return (Number(num / 1_000_000_000n) / 1000).toFixed(2) + ' Trillion';
    }
    if (num > 1_000_000_000n) {
      return (Number(num / 1_000_000n) / 1000).toFixed(2) + ' Billion';
    }
    if (num > 1_000_000n) {
      return (Number(num / 1_000n) / 1000).toFixed(2) + ' Million';
    }
    return num.toLocaleString();
  }

  if (num >= 1e18) return (num / 1e18).toFixed(2) + ' Quintillion';
  if (num >= 1e15) return (num / 1e15).toFixed(2) + ' Quadrillion';
  if (num >= 1e12) return (num / 1e12).toFixed(2) + ' Trillion';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + ' Billion';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + ' Million';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + ' Thousand';
  return num.toLocaleString();
}

export function calculateCombinatoricsStats(
  length: number,
  pool: string,
  slots: SlotConstraint[]
): CombinatoricsStats {
  const poolSize = pool.length > 0 ? pool.length : 26;
  const totalBig = BigInt(poolSize) ** BigInt(length);
  const totalPossible = Number(totalBig > BigInt(Number.MAX_SAFE_INTEGER) ? Number.MAX_SAFE_INTEGER : totalBig);

  // Constrained slots math
  let constrainedProduct = 1n;
  const slotMultipliers: number[] = [];

  for (let i = 0; i < length; i++) {
    const slot = slots.find((s) => s.index === i);
    let count = poolSize;

    if (slot) {
      if (slot.type === 'exact' && slot.exactChar) {
        count = 1;
      } else if (slot.type === 'vowel') {
        const matchingVowels = VOWELS.filter((v) => pool.includes(v));
        count = matchingVowels.length > 0 ? matchingVowels.length : 6;
      } else if (slot.type === 'consonant') {
        const matchingConsonants = CONSONANTS.filter((c) => pool.includes(c));
        count = matchingConsonants.length > 0 ? matchingConsonants.length : 20;
      } else if (slot.type === 'custom' && slot.customChars && slot.customChars.length > 0) {
        count = slot.customChars.length;
      }
    }

    slotMultipliers.push(count);
    constrainedProduct *= BigInt(count);
  }

  const constrainedPossible = Number(
    constrainedProduct > BigInt(Number.MAX_SAFE_INTEGER)
      ? Number.MAX_SAFE_INTEGER
      : constrainedProduct
  );

  const entropyBits = Number((length * Math.log2(poolSize)).toFixed(2));
  const vowelCount = pool.split('').filter((c) => VOWELS.includes(c.toUpperCase())).length;
  const vowelProbability = Number(((vowelCount / poolSize) * 100).toFixed(1));

  return {
    totalPossible,
    totalFormulaString: `${poolSize}^${length} = ${formatLargeNumber(totalBig)} combinations`,
    constrainedPossible,
    constrainedFormulaString:
      slotMultipliers.length <= 10
        ? slotMultipliers.join(' × ') + ` = ${formatLargeNumber(constrainedProduct)} combinations`
        : `Product of ${length} slots = ${formatLargeNumber(constrainedProduct)} combinations`,
    entropyBits,
    vowelProbability,
  };
}
