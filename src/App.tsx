import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sparkles,
  Shuffle,
  Bookmark,
  Layers,
  Dices,
  RotateCcw,
  Copy,
  Check,
  Download,
  AlertCircle,
  HelpCircle,
  Cpu
} from 'lucide-react';
import {
  GeneratedName,
  GenerationSettings,
  SlotConstraint,
  CombinatoricsStats,
} from './types';
import { ALPHABET_26, VOWELS, CONSONANTS } from './data/linguisticData';
import { calculateCombinatoricsStats, formatLargeNumber } from './utils/combinatorics';
import { generateNamesBatch } from './utils/nameEngine';
import { Header } from './components/Header';
import { GeneratorControls } from './components/GeneratorControls';
import { SlotConfigurator } from './components/SlotConfigurator';
import { FilterBar, SortOption } from './components/FilterBar';
import { NameCard } from './components/NameCard';
import { MeaningModal } from './components/MeaningModal';
import { SavedNamesDrawer } from './components/SavedNamesDrawer';
import { MathExplainer } from './components/MathExplainer';
import { GitHubModal } from './components/GitHubModal';
import { SEOSection } from './components/SEOSection';
import { Logo } from './components/Logo';

const LOCAL_STORAGE_FAVORITES_KEY = 'name_generator_saved_favorites_v1';

export default function App() {
  // Settings State
  const [settings, setSettings] = useState<GenerationSettings>({
    length: 9, // default 9 characters as requested
    batchSize: 24,
    mode: 'pronounceable',
    casing: 'title',
    characterPool: ALPHABET_26.join(''),
    slots: [],
    minVowels: 0,
    maxConsecutiveConsonants: 3,
    allowRepeatedAdjacent: true,
    filterSubstring: '',
    filterStartsWith: '',
    filterEndsWith: '',
    minScore: 0,
  });

  // UI & Data State
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [favorites, setFavorites] = useState<GeneratedName[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Drawers
  const [selectedNameForMeaning, setSelectedNameForMeaning] = useState<GeneratedName | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isMathOpen, setIsMathOpen] = useState(false);
  const [isGitHubOpen, setIsGitHubOpen] = useState(false);

  // Client filtering & sorting state
  const [searchTerm, setSearchTerm] = useState('');
  const [startsWithFilter, setStartsWithFilter] = useState('');
  const [endsWithFilter, setEndsWithFilter] = useState('');
  const [minFlowScore, setMinFlowScore] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('score_desc');
  const [onlyWithWords, setOnlyWithWords] = useState(false);
  const [copiedBatch, setCopiedBatch] = useState(false);

  // Calculate Combinatorics Statistics
  const stats: CombinatoricsStats = useMemo(() => {
    return calculateCombinatoricsStats(settings.length, settings.characterPool, settings.slots);
  }, [settings.length, settings.characterPool, settings.slots]);

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      // localStorage error fallback
    }
  }, [favorites]);

  // Generate Names Function
  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    // Short tick for smooth UI feel
    setTimeout(() => {
      const names = generateNamesBatch(settings);
      setGeneratedNames(names);
      setIsGenerating(false);
    }, 60);
  }, [settings]);

  // Initial Generation on first mount
  useEffect(() => {
    handleGenerate();
  }, []);

  // Update Partial Settings
  const handleUpdateSettings = (partial: Partial<GenerationSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...partial };
      // If length changed, trim or adjust any slots out of bounds
      if (partial.length !== undefined && partial.length !== prev.length) {
        updated.slots = prev.slots.filter((s) => s.index < partial.length!);
      }
      return updated;
    });
  };

  // Slot Configuration Handlers
  const handleUpdateSlot = (slot: SlotConstraint) => {
    setSettings((prev) => {
      const filtered = prev.slots.filter((s) => s.index !== slot.index);
      if (slot.type === 'any') {
        return { ...prev, slots: filtered };
      }
      return { ...prev, slots: [...filtered, slot] };
    });
  };

  const handleClearSlots = () => {
    setSettings((prev) => ({ ...prev, slots: [] }));
  };

  const handleApplyPreset = (presetName: string) => {
    const len = settings.length;
    const newSlots: SlotConstraint[] = [];

    if (presetName === 'alternating') {
      // C - V - C - V - C...
      for (let i = 0; i < len; i++) {
        newSlots.push({
          index: i,
          type: i % 2 === 0 ? 'consonant' : 'vowel',
        });
      }
    } else if (presetName === 'name_melodic') {
      // Classic name structure: C - V - C - C - V - C...
      const pattern: ('consonant' | 'vowel')[] = [
        'consonant', 'vowel', 'consonant', 'consonant', 'vowel', 'consonant', 'vowel', 'consonant', 'vowel'
      ];
      for (let i = 0; i < len; i++) {
        newSlots.push({
          index: i,
          type: pattern[i % pattern.length],
        });
      }
    }

    setSettings((prev) => ({ ...prev, slots: newSlots, mode: 'pattern' }));
  };

  // Reset all to standard 9 characters
  const handleReset = () => {
    setSettings({
      length: 9,
      batchSize: 24,
      mode: 'pronounceable',
      casing: 'title',
      characterPool: ALPHABET_26.join(''),
      slots: [],
      minVowels: 0,
      maxConsecutiveConsonants: 3,
      allowRepeatedAdjacent: true,
      filterSubstring: '',
      filterStartsWith: '',
      filterEndsWith: '',
      minScore: 0,
    });
    setSearchTerm('');
    setStartsWithFilter('');
    setEndsWithFilter('');
    setMinFlowScore(0);
    setOnlyWithWords(false);
  };

  // Favorites Handlers
  const handleToggleFavorite = (item: GeneratedName) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === item.id || f.text === item.text);
      if (exists) {
        return prev.filter((f) => f.id !== item.id && f.text !== item.text);
      }
      return [{ ...item, isFavorite: true }, ...prev];
    });
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const handleClearFavorites = () => {
    setFavorites([]);
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setFavorites((prev) =>
      prev.map((f) => (f.id === id ? { ...f, notes } : f))
    );
    setGeneratedNames((prev) =>
      prev.map((n) => (n.id === id ? { ...n, notes } : n))
    );
  };

  // Filtered and Sorted Names
  const filteredNames = useMemo(() => {
    let list = generatedNames.filter((item) => {
      if (searchTerm && !item.text.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (startsWithFilter && !item.text.toUpperCase().startsWith(startsWithFilter.toUpperCase())) {
        return false;
      }
      if (endsWithFilter && !item.text.toUpperCase().endsWith(endsWithFilter.toUpperCase())) {
        return false;
      }
      if (minFlowScore > 0 && item.pronounceabilityScore < minFlowScore) {
        return false;
      }
      if (onlyWithWords && (!item.embeddedWords || item.embeddedWords.length === 0)) {
        return false;
      }
      return true;
    });

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'score_desc') return b.pronounceabilityScore - a.pronounceabilityScore;
      if (sortBy === 'alpha_asc') return a.text.localeCompare(b.text);
      if (sortBy === 'alpha_desc') return b.text.localeCompare(a.text);
      if (sortBy === 'words_desc') return (b.embeddedWords?.length || 0) - (a.embeddedWords?.length || 0);
      if (sortBy === 'vowels_desc') return b.vowelCount - a.vowelCount;
      return 0;
    });

    return list;
  }, [generatedNames, searchTerm, startsWithFilter, endsWithFilter, minFlowScore, sortBy, onlyWithWords]);

  const handleCopyAllVisible = () => {
    const textList = filteredNames.map((n) => n.text).join('\n');
    navigator.clipboard.writeText(textList);
    setCopiedBatch(true);
    setTimeout(() => setCopiedBatch(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FFF9E6] text-[#1A1A1A] flex flex-col selection:bg-[#FFD100] selection:text-[#1A1A1A]">
      {/* Sticky Header */}
      <Header
        stats={stats}
        length={settings.length}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenMath={() => setIsMathOpen(true)}
        onOpenGitHub={() => setIsGitHubOpen(true)}
        onReset={handleReset}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Math & Combinatorics Quick Status Banner */}
        <div className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[4px_4px_0px_0px_#1A1A1A]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#FFD100] border-2 border-[#1A1A1A] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#1A1A1A]">
              <Sparkles className="w-6 h-6 text-[#1A1A1A]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-sm font-black text-[#1A1A1A]">
                  26-Letter Base ^ {settings.length} Characters
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded border-2 border-[#1A1A1A] bg-[#00D1FF] text-[#1A1A1A] font-black shadow-[1px_1px_0px_0px_#1A1A1A]">
                  {stats.totalFormulaString}
                </span>
              </div>
              <p className="text-xs text-[#4A4A4A] font-medium mt-0.5">
                Every {settings.length}-letter combination has {stats.entropyBits} bits of entropy. Generating balanced, pronounceable names with customizable letter constraints.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <button
              onClick={() => setIsMathOpen(true)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-black text-[#1A1A1A] bg-[#00D1FF] hover:bg-[#33DAFF] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              How 26ⁿ Math Works
            </button>
          </div>
        </div>

        {/* Generator Controls (Length, Batch, Algorithm Modes, Generate Button) */}
        <GeneratorControls
          settings={settings}
          stats={stats}
          isGenerating={isGenerating}
          onUpdateSettings={handleUpdateSettings}
          onGenerate={handleGenerate}
        />

        {/* Interactive Character Slot Matrix Configurator */}
        <SlotConfigurator
          length={settings.length}
          slots={settings.slots}
          onUpdateSlot={handleUpdateSlot}
          onClearSlots={handleClearSlots}
          onApplyPreset={handleApplyPreset}
        />

        {/* Filter and Search Bar */}
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          startsWith={startsWithFilter}
          onStartsWithChange={setStartsWithFilter}
          endsWith={endsWithFilter}
          onEndsWithChange={setEndsWithFilter}
          minScore={minFlowScore}
          onMinScoreChange={setMinFlowScore}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onlyWithWords={onlyWithWords}
          onToggleOnlyWithWords={setOnlyWithWords}
          totalResults={generatedNames.length}
          filteredCount={filteredNames.length}
        />

        {/* Results Section Toolbar */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-[#1A1A1A] tracking-tight flex items-center gap-2">
              <span>Generated Combinations</span>
              <span className="text-xs font-mono font-bold text-[#1A1A1A] bg-[#FFF9E6] border-2 border-[#1A1A1A] px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#1A1A1A]">
                {filteredNames.length} items
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAllVisible}
              disabled={filteredNames.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#1A1A1A] bg-white hover:bg-[#FFF9E6] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-40"
            >
              {copiedBatch ? <Check className="w-3.5 h-3.5 text-[#00E699]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedBatch ? 'Copied All!' : 'Copy Visible'}</span>
            </button>

            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black text-white bg-[#FF477E] hover:bg-[#FF2E6D] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Re-Roll</span>
            </button>
          </div>
        </div>

        {/* Generated Name Cards Grid */}
        {filteredNames.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-[#1A1A1A] rounded-2xl p-12 text-center space-y-3 shadow-[4px_4px_0px_0px_#1A1A1A]">
            <AlertCircle className="w-10 h-10 text-[#FF477E] mx-auto" />
            <h3 className="text-base font-black text-[#1A1A1A]">No combinations matched active filters</h3>
            <p className="text-xs font-medium text-[#4A4A4A] max-w-md mx-auto">
              Try adjusting your search query, lowering the minimum flow score, or rolling a new batch of combinations.
            </p>
            <button
              onClick={handleGenerate}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white bg-[#FF477E] hover:bg-[#FF2E6D] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              Generate Fresh Batch
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredNames.map((nameItem) => {
              const isFav = favorites.some(
                (f) => f.id === nameItem.id || f.text === nameItem.text
              );
              return (
                <NameCard
                  key={nameItem.id}
                  item={nameItem}
                  isFavorite={isFav}
                  onToggleFavorite={handleToggleFavorite}
                  onOpenMeaning={setSelectedNameForMeaning}
                />
              );
            })}
          </div>
        )}

        {/* SEO Guide & FAQ Section */}
        <SEOSection />
      </main>

      {/* Meaning & Acrostic Inspector Modal */}
      <MeaningModal
        nameItem={selectedNameForMeaning}
        onClose={() => setSelectedNameForMeaning(null)}
        isFavorite={
          selectedNameForMeaning
            ? favorites.some((f) => f.id === selectedNameForMeaning.id || f.text === selectedNameForMeaning.text)
            : false
        }
        onToggleFavorite={handleToggleFavorite}
        onUpdateNotes={handleUpdateNotes}
      />

      {/* Saved Names Drawer */}
      <SavedNamesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onRemoveFavorite={handleRemoveFavorite}
        onClearAll={handleClearFavorites}
        onOpenMeaning={(item) => {
          setSelectedNameForMeaning(item);
        }}
      />

      {/* Combinatorics Math Modal */}
      <MathExplainer
        isOpen={isMathOpen}
        onClose={() => setIsMathOpen(false)}
        currentLength={settings.length}
      />

      {/* GitHub Repository, Star & Clone Modal */}
      <GitHubModal
        isOpen={isGitHubOpen}
        onClose={() => setIsGitHubOpen(false)}
      />

      {/* Enriched Footer with SEO & Brand Details */}
      <footer className="border-t-2 border-[#1A1A1A] bg-white py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <Logo size="sm" showText={false} />
            <div>
              <p className="text-sm font-black text-[#1A1A1A]">
                NameGen{' '}
                <span className="font-normal text-xs text-[#4A4A4A]">
                  by{' '}
                  <a
                    href="https://ivantomdieu.vercel.app/en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#1A1A1A] hover:text-[#FF477E] underline transition-colors"
                  >
                    Tomdieu ivan
                  </a>
                </span>
                {' '}• 26ⁿ Letter Combinatorics Engine
              </p>
              <p className="text-xs text-[#4A4A4A]">
                Exploring {formatLargeNumber(26n ** BigInt(settings.length))} theoretical 26-character variations
              </p>
            </div>
          </div>
          <div className="text-xs font-bold text-[#4A4A4A] flex items-center gap-4 flex-wrap justify-center">
            <button
              onClick={() => setIsGitHubOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-white bg-[#1A1A1A] hover:bg-[#333333] border border-[#1A1A1A] transition-colors cursor-pointer"
            >
              <span>⭐ GitHub Repository</span>
            </button>
            <span>•</span>
            <a
              href="https://github.com/Tomdieu/namegen"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF477E] transition-colors underline cursor-pointer"
            >
              github.com/Tomdieu/namegen
            </a>
            <span>•</span>
            <button
              onClick={() => setIsMathOpen(true)}
              className="hover:text-[#FF477E] transition-colors underline cursor-pointer"
            >
              26ⁿ Math Formula
            </button>
            <span>•</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-[#FF477E] transition-colors underline cursor-pointer"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
