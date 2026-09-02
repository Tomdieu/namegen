export const ALPHABET_26 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export const VOWELS = ['A', 'E', 'I', 'O', 'U', 'Y'];
export const CONSONANTS = [
  'B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M',
  'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Z'
];

export const COMMON_PREFIXES = ['AL', 'EL', 'AR', 'BR', 'CA', 'DA', 'EV', 'FA', 'KA', 'LU', 'MA', 'NE', 'OR', 'RA', 'SE', 'TA', 'VA', 'ZE'];
export const COMMON_SUFFIXES = ['AN', 'EL', 'IS', 'ON', 'OR', 'RA', 'TH', 'US', 'YA', 'EN', 'IA', 'AL', 'EX', 'OS', 'AR', 'IX', 'UM'];

export const ONSETS = [
  'B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'QU', 'R', 'S', 'T', 'V', 'W', 'Y', 'Z',
  'BL', 'BR', 'CH', 'CL', 'CR', 'DR', 'FL', 'FR', 'GL', 'GR', 'PL', 'PR', 'SC', 'SH', 'SK', 'SL', 'SM', 'SN', 'SP', 'ST', 'SW', 'TH', 'TR', 'TW'
];

export const NUCLEI = [
  'A', 'E', 'I', 'O', 'U', 'Y',
  'AI', 'AU', 'EA', 'EE', 'EI', 'IA', 'IE', 'IO', 'OA', 'OI', 'OO', 'OU', 'UA'
];

export const CODAS = [
  '', '', '', 'B', 'C', 'CK', 'D', 'F', 'G', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'TH', 'X',
  'CH', 'FT', 'LD', 'LK', 'LM', 'LP', 'LT', 'MP', 'ND', 'NG', 'NK', 'NT', 'PT', 'RD', 'RK', 'RL', 'RM', 'RN', 'RP', 'RS', 'RT', 'SH', 'SK', 'SP', 'ST'
];

// Acrostic meanings for letters A to Z with positive, inspiring traits
export const ACROSTIC_MEANINGS: Record<string, string[]> = {
  A: ['Ambitious', 'Authentic', 'Adaptable', 'Adventurous', 'Artistic', 'Affectionate', 'Altruistic', 'Aspiring'],
  B: ['Brave', 'Brilliant', 'Benevolent', 'Balanced', 'Bold', 'Beloved', 'Boundless', 'Bright'],
  C: ['Creative', 'Compassionate', 'Courageous', 'Charismatic', 'Curious', 'Calm', 'Captivating', 'Clever'],
  D: ['Dynamic', 'Determined', 'Devoted', 'Diplomatic', 'Dignified', 'Daring', 'Delightful', 'Distinct'],
  E: ['Empathetic', 'Energetic', 'Enlightened', 'Eloquent', 'Exuberant', 'Enduring', 'Effervescent', 'Elevated'],
  F: ['Fearless', 'Friendly', 'Faithful', 'Forgiving', 'Flexible', 'Fortunate', 'Focused', 'Flourishing'],
  G: ['Generous', 'Genuine', 'Gracious', 'Gallant', 'Grounded', 'Gifted', 'Gentle', 'Glorious'],
  H: ['Harmonious', 'Honest', 'Heroic', 'Heartfelt', 'Hopeful', 'Humble', 'Honorary', 'Healing'],
  I: ['Inspiring', 'Insightful', 'Innovative', 'Intuitive', 'Illustrious', 'Inquisitive', 'Invincible', 'Idealistic'],
  J: ['Joyful', 'Just', 'Jubilant', 'Judicious', 'Jaunty', 'Jovial', 'Jeweled', 'Journeying'],
  K: ['Kind', 'Knowledgeable', 'Keen', 'Knightly', 'Kinetic', 'Kindred', 'Kingly', 'Kaleidoscopic'],
  L: ['Luminous', 'Loyal', 'Loving', 'Logical', 'Legendary', 'Leader', 'Liberated', 'Lucid'],
  M: ['Mindful', 'Magnetic', 'Masterful', 'Mighty', 'Merciful', 'Motivated', 'Majestic', 'Miraculous'],
  N: ['Noble', 'Nurturing', 'Natural', 'Novel', 'Navigating', 'Noteworthy', 'Nimble', 'Neighborly'],
  O: ['Optimistic', 'Openhearted', 'Original', 'Observant', 'Outstanding', 'Ornate', 'Orderly', 'Omniscient'],
  P: ['Peaceful', 'Passionate', 'Perceptive', 'Pioneering', 'Polite', 'Pure', 'Patient', 'Pragmatic'],
  Q: ['Quick-witted', 'Questing', 'Quality-minded', 'Quietly strong', 'Quirky', 'Quenching', 'Queenly', 'Quantum'],
  R: ['Resilient', 'Radiant', 'Rational', 'Reliable', 'Resourceful', 'Respectful', 'Reverent', 'Reflective'],
  S: ['Serene', 'Sincere', 'Strategic', 'Sympathetic', 'Soulful', 'Spirited', 'Steadfast', 'Scholarly'],
  T: ['Thoughtful', 'Trustworthy', 'Tenacious', 'Transformational', 'Talented', 'Tolerant', 'Tireless', 'Truthful'],
  U: ['Unwavering', 'Unique', 'Uplifting', 'Understanding', 'Unified', 'Unstoppable', 'Unbiased', 'Utilitarian'],
  V: ['Visionary', 'Vibrant', 'Valiant', 'Versatile', 'Virtuous', 'Victorious', 'Vigilant', 'Veracious'],
  W: ['Wise', 'Warmhearted', 'Witty', 'Welcoming', 'Wonder-filled', 'Watchful', 'Whole', 'Worldly'],
  X: ['Xenial', 'X-factor leader', 'X-traordinary', 'Xylographic artist', 'Xanthic radiant', 'Xenophile thinker'],
  Y: ['Youthful', 'Yielding peace', 'Yearning for truth', 'Yare & nimble', 'Yielding grace', 'Yugen appreciator'],
  Z: ['Zealous', 'Zenith-seeking', 'Zen-minded', 'Zestful', 'Zephyr-gentle', 'Zodiac-aligned', 'Zealous-hearted']
};

// Common memorable words and morphemes to detect embedded in strings
export const EMBEDDED_WORDS_DICTIONARY = new Set([
  'ACE', 'ACT', 'AIR', 'ALL', 'ANY', 'ARC', 'ARK', 'ARM', 'ART', 'ASH', 'AURA', 'AUTO',
  'BAY', 'BEE', 'BIG', 'BIO', 'BIT', 'BLISS', 'BLOOM', 'BLUE', 'BOLD', 'BOND', 'BORN', 'BRAVE',
  'CALM', 'CARE', 'CAT', 'COLE', 'CORE', 'COSMO', 'CREED', 'CURE',
  'DAWN', 'DAY', 'DEAL', 'DEEP', 'DIVA', 'DREAM', 'DUKE',
  'EAGLE', 'EARTH', 'EAST', 'ECHO', 'EDEN', 'EDGE', 'ELITE', 'ELLA', 'EMBER', 'EMPIRE', 'ERA', 'ETERNAL', 'EVE', 'EVER', 'EYE',
  'FAITH', 'FAME', 'FATE', 'FEEL', 'FINE', 'FIRE', 'FLAME', 'FLASH', 'FLOW', 'FLY', 'FOCUS', 'FORCE', 'FOREST', 'FORTUNE', 'FOX', 'FREE', 'FROST',
  'GALAXY', 'GEM', 'GIANT', 'GLAD', 'GLORY', 'GLOW', 'GOLD', 'GRACE', 'GRAND', 'GREAT', 'GREEN',
  'HALO', 'HARMONY', 'HAVEN', 'HEART', 'HERO', 'HIGH', 'HOPE', 'HORN', 'HORIZON',
  'ICE', 'ICON', 'IDEA', 'IMPACT', 'INF', 'INFINITY', 'ION', 'IRIS', 'IRON', 'ISLE',
  'JADE', 'JAZZ', 'JOY', 'JUST',
  'KEEN', 'KEY', 'KING', 'KNIGHT',
  'LAKE', 'LARK', 'LEAD', 'LEAF', 'LEGEND', 'LIGHT', 'LILY', 'LION', 'LIV', 'LIVE', 'LONE', 'LOVE', 'LUCK', 'LUMEN', 'LUNA', 'LUSH', 'LUX',
  'MAGIC', 'MAJESTY', 'MANA', 'MANY', 'MAX', 'MELODY', 'MIND', 'MINT', 'MIST', 'MOON', 'MYTH',
  'NEO', 'NEON', 'NEST', 'NEW', 'NEXUS', 'NIGHT', 'NOBLE', 'NOVA',
  'OASIS', 'OCEAN', 'ONE', 'ONYX', 'OPAL', 'OPEN', 'ORBIT', 'ORIGIN', 'OWL',
  'PACE', 'PALM', 'PARK', 'PASSION', 'PATH', 'PEACE', 'PEAK', 'PEARL', 'PHOENIX', 'PIONEER', 'PIXEL', 'PLANET', 'PLAY', 'PLUM', 'POEM', 'POET', 'POINT', 'POLAR', 'POWER', 'PRIME', 'PRISM', 'PRO', 'PULSE', 'PURE',
  'QUEST', 'QUICK',
  'RADIANT', 'RAIN', 'RAY', 'REAL', 'REALM', 'RED', 'REST', 'RICH', 'RIDER', 'RING', 'RISE', 'RIVER', 'ROAR', 'ROCK', 'ROSE', 'ROYAL', 'RUBY', 'RUNE', 'RUSH',
  'SAGE', 'SAIL', 'SEA', 'SECRET', 'SEEK', 'SHADOW', 'SHINE', 'SILVER', 'SKY', 'SNOW', 'SOL', 'SOLAR', 'SONG', 'SOUL', 'SPARK', 'SPELL', 'SPHERE', 'SPIRIT', 'SPRING', 'STAR', 'STEEL', 'STORM', 'STORY', 'SUMMIT', 'SUN', 'SWIFT', 'SYLVAN',
  'TALE', 'TALON', 'TIME', 'TITAN', 'TOP', 'TRUE', 'TRUTH',
  'ULTRA', 'UNITY', 'VALE', 'VALOR', 'VARA', 'VEGA', 'VENTURE', 'VERA', 'VERVE', 'VIBE', 'VICTOR', 'VINE', 'VINTAGE', 'VISION', 'VISTA', 'VITAL', 'VIVID', 'VORTEX',
  'WAVE', 'WAY', 'WEST', 'WILD', 'WIND', 'WING', 'WISE', 'WISH', 'WOLF', 'WOOD', 'WORD',
  'ZEN', 'ZEPHYR', 'ZERO', 'ZEST', 'ZION', 'ZONE'
]);

// Good sounding consonant-vowel bigrams and trigrams for smooth phonetic flow scoring
export const PHONETIC_BIGRAM_SCORES: Record<string, number> = {
  TH: 9, SH: 9, CH: 9, PH: 8, ST: 8, BR: 8, CR: 8, DR: 8, FR: 8, GR: 8, PR: 8, TR: 8, SP: 8, FL: 8, CL: 8, BL: 8, GL: 8, PL: 8,
  AN: 9, EN: 9, IN: 9, ON: 9, UN: 9, AR: 9, ER: 9, IR: 9, OR: 9, UR: 9,
  AL: 9, EL: 9, IL: 9, OL: 9, UL: 9, AT: 8, ET: 8, IT: 8, OT: 8, UT: 8,
  MA: 9, ME: 9, MI: 9, MO: 9, MU: 9, LA: 9, LE: 9, LI: 9, LO: 9, LU: 9,
  RA: 9, RE: 9, RI: 9, RO: 9, RU: 9, NA: 9, NE: 9, NI: 9, NO: 9, NU: 9,
  SA: 9, SE: 9, SI: 9, SO: 9, SU: 9, TA: 9, TE: 9, TI: 9, TO: 9, TU: 9,
  KA: 8, KE: 8, KI: 8, KO: 8, KU: 8, DA: 9, DE: 9, DI: 9, DO: 9, DU: 9,
  BA: 8, BE: 8, BI: 8, BO: 8, BU: 8, GA: 8, GE: 8, GI: 8, GO: 8, GU: 8,
  FA: 8, FE: 8, FI: 8, FO: 8, FU: 8, VA: 8, VE: 8, VI: 8, VO: 8, VU: 8,
  IA: 9, IE: 9, IO: 9, IU: 7, EA: 9, EE: 9, EI: 8, EO: 8, EU: 7, AI: 9,
  AY: 9, EY: 9, OY: 8, AU: 8, OU: 9, OO: 8, OA: 8, UI: 7, UA: 8, UO: 7,
  // Awkward / Harsh combinations to penalize in flow
  QQ: 0, QK: 0, QX: 0, QZ: 0, ZX: 0, XZ: 0, JJ: 1, KK: 2, VV: 1, WW: 1, XX: 1, YY: 2, ZZ: 2,
  BK: 1, CP: 1, DT: 2, FP: 1, GB: 1, GK: 1, HQ: 0, HX: 0, JQ: 0, JV: 0, KP: 2, LQ: 1,
  MX: 1, PB: 2, PM: 2, PT: 3, QD: 0, QG: 0, QJ: 0, QP: 0, QT: 0, QV: 0, QW: 0,
  TB: 2, TD: 2, TF: 2, TG: 2, TK: 2, TP: 2, TQ: 0, TV: 2, TW: 7, TX: 1, TZ: 5,
  VB: 2, VC: 2, VD: 2, VF: 1, VG: 2, VH: 1, VJ: 1, VK: 2, VL: 6, VM: 5, VN: 5, VP: 2, VQ: 0, VR: 7, VS: 5, VT: 3, VV_: 0, VW: 1, VX: 0, VZ: 1,
  WB: 2, WC: 2, WD: 2, WF: 2, WG: 2, WH: 8, WJ: 1, WK: 2, WL: 4, WM: 4, WN: 7, WP: 2, WQ: 0, WR: 8, WS: 4, WT: 3, WV: 1, WW_: 1, WX: 0, WZ: 1,
  XB: 1, XC: 2, XD: 1, XF: 1, XG: 1, XH: 1, XJ: 1, XK: 2, XL: 3, XM: 3, XN: 3, XP: 4, XQ: 0, XR: 2, XS: 2, XT: 6, XV: 1, XW: 1, XX_: 0, XY: 5, XZ_: 0,
  ZB: 2, ZC: 2, ZD: 2, ZF: 2, ZG: 2, ZH: 7, ZJ: 1, ZK: 2, ZL: 5, ZM: 5, ZN: 5, ZP: 2, ZQ: 0, ZR: 6, ZS: 2, ZT: 3, ZV: 2, ZW: 4, ZX_: 0, ZY: 6, ZZ_: 2
};
