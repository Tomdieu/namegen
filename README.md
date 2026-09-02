# Letter Combination & Name Generator (26ⁿ)

An interactive, combinatorial letter permutation engine and pronounceable name generator built with React 19, TypeScript, Vite, and Tailwind CSS. 

Explore mathematical sequences from the 26-letter English alphabet ($26^N$), enforce phonetic constraints, inspect acrostic name meanings, and export saved favorites.

---

## ✨ Features

### 🔠 1. Combinatorics & 26ⁿ Math Engine
- **Mathematical Scale Calculations**: Computes exact theoretical possibilities ($26^N$) and informational entropy in bits ($N \times 4.70\text{ bits}$).
- **Interactive Math Explainer**: Explore how the exponential combination space scales from 1 to 20+ characters (e.g., $26^9 \approx 5.43\text{ Trillion}$ combinations).
- **Constrained Possibility Calculator**: Live calculation of remaining permutations when specific character slots or vowel/consonant rules are locked.

### 🎛️ 2. Positional Slot Matrix Configurator
- **Custom Slot Constraints**: Configure each letter position individually (Positions 1 through $N$).
- **Rule Types**:
  - **Any**: Free 26-letter choice ($A\text{–}Z$).
  - **Vowel**: Restricted to vowels & semi-vowels ($A, E, I, O, U, Y$).
  - **Consonant**: Restricted to consonants ($B, C, D, F, G, H, J, K, L, M, N, P, Q, R, S, T, V, W, X, Z$).
  - **Exact Character**: Lock a specific letter into any position.
- **Preset Patterns**: Instant 1-click patterns such as C-V-C-V alternating flow or Melodic 9-character cadence.

### 🧬 3. Multi-Algorithm Name Generation
- **Balanced Melodic Flow**: Phonotactic scoring that prevents unpronounceable consonant clusters while maximizing lyrical cadence.
- **Alternating Syllables**: Enforces rhythmic consonant-vowel transitions.
- **Root & Morpheme Blend**: Seeds generated names with natural Latin/Greek roots, science affixes, and evocative word stems.
- **Pure Combinatoric Random**: Unconstrained exploration of raw 26-character permutations.
- **Casing Controls**: Instant conversion between Title Case (`Aa`), Upper Case (`UPPER`), and Lower Case (`lower`).

### 📖 4. In-Depth Name Inspection & Acrostic Meanings
- **Acrostic Virtue Matrix**: Letter-by-letter virtue mapping (e.g., $L = \text{Luminous}, U = \text{Unstoppable}, M = \text{Mindful}, \dots$) with the ability to click any letter to cycle alternative traits.
- **Phonetic Analysis & Syllables**: Automatic syllable hyphenation and pronounceability scoring (0–100%).
- **Embedded Word Detection**: Identifies English and classical morphemes inside generated combinations.
- **Pronunciation Audio**: Built-in Text-to-Speech (Web Speech API) for auditory playback.
- **Custom Brand / Character Notes**: Add notes or fictional lore directly to any generated name.

### 🔍 5. Search, Filter, Sort & Export
- **Live Search**: Substring lookup across generated combinations.
- **Prefix / Suffix Filters**: Filter by specific starting or ending characters.
- **Flow Score Threshold**: Filter combinations by minimum pronounceability score.
- **Sorting Options**: Sort by highest flow score, alphabetical (A–Z or Z–A), vowel density, or length.
- **Export & Saved Drawer**:
  - Bookmark favorite names with celebratory confetti effects.
  - Export bookmarks or batches to **CSV** or **TXT**.
  - One-click copy for individual names, formatted meaning summaries, or visible batch lists.

---

## 🎨 Visual Design

- **Neo-Brutalist Vibrant Palette**: High-contrast layout with a warm cream background (`#FFF9E6`), deep charcoal typography (`#1A1A1A`), hard-offset geometric drop shadows, and bright accent tones (Hot Pink `#FF477E`, Electric Cyan `#00D1FF`, Lemon Yellow `#FFD100`, Mint `#00E699`).
- **Fully Responsive**: Optimized for mobile, tablet, and desktop viewports.

---

## 🚀 Tech Stack

- **Framework**: React 19
- **Language**: TypeScript 5.8
- **Bundler / Dev Server**: Vite 6
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti, CSS Transitions
- **Audio**: Web Speech Synthesis API

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone or download the repository:
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

5. Type check / lint:
   ```bash
   npm run lint
   ```

---

## 📁 Project Structure

```
├── index.html                  # HTML entry point with typography and meta tags
├── metadata.json               # App metadata configuration
├── package.json                # Project dependencies and npm scripts
├── src/
│   ├── App.tsx                 # Main application dashboard state & orchestrator
│   ├── main.tsx                # React DOM root entry
│   ├── index.css               # Global styles & neo-brutalist theme variables
│   ├── types.ts                # TypeScript interfaces and type definitions
│   ├── components/
│   │   ├── Header.tsx          # App header with quick actions and stats badge
│   │   ├── GeneratorControls.ts# Length, batch size, casing, and algorithm controls
│   │   ├── SlotConfigurator.tsx# Letter-by-letter position matrix editor
│   │   ├── FilterBar.tsx       # Search, prefix/suffix filters, sorting & thresholds
│   │   ├── NameCard.tsx        # Individual generated name card with speech & actions
│   │   ├── MeaningModal.tsx    # Acrostic analysis and trait inspection modal
│   │   ├── SavedNamesDrawer.tsx# Bookmarked names drawer with CSV/TXT export
│   │   └── MathExplainer.tsx   # 26ⁿ combinatorics formula & comparison modal
│   ├── utils/
│   │   ├── combinatorics.ts    # BigInt combination math & entropy formulas
│   │   └── nameEngine.ts       # Phonotactic flow generator & scoring algorithms
│   └── data/
│       └── linguisticData.ts   # Phonetic tables, root words, and acrostic virtues
└── README.md                   # Project documentation
```

---

## 📄 License

MIT
