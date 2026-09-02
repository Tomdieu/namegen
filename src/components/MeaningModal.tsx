import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Volume2,
  Copy,
  Check,
  Bookmark,
  Shuffle,
  Tag,
  BookOpen,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { GeneratedName } from '../types';
import { ACROSTIC_MEANINGS } from '../data/linguisticData';

interface MeaningModalProps {
  nameItem: GeneratedName | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (item: GeneratedName) => void;
  onUpdateNotes?: (id: string, notes: string) => void;
}

export const MeaningModal: React.FC<MeaningModalProps> = ({
  nameItem,
  onClose,
  isFavorite,
  onToggleFavorite,
  onUpdateNotes,
}) => {
  if (!nameItem) return null;

  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [customAcrostic, setCustomAcrostic] = useState<Record<number, string>>({});
  const [noteText, setNoteText] = useState(nameItem.notes || '');

  const characters = nameItem.text.toUpperCase().split('');

  const getLetterTrait = (char: string, index: number): string => {
    if (customAcrostic[index]) return customAcrostic[index];
    if (nameItem.acrosticMeaning && nameItem.acrosticMeaning[index]) {
      return nameItem.acrosticMeaning[index];
    }
    const pool = ACROSTIC_MEANINGS[char];
    return pool && pool.length > 0 ? pool[0] : 'Inspiring';
  };

  const cycleLetterTrait = (char: string, index: number) => {
    const pool = ACROSTIC_MEANINGS[char] || ['Virtuous', 'Resilient', 'Luminous'];
    const current = getLetterTrait(char, index);
    const currentIndex = pool.indexOf(current);
    const nextIndex = (currentIndex + 1) % pool.length;
    setCustomAcrostic((prev) => ({
      ...prev,
      [index]: pool[nextIndex],
    }));
  };

  const handleSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(nameItem.text);
    utterance.rate = 0.85;
    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopySummary = () => {
    const lines = [
      `Name: ${nameItem.text} (${nameItem.length} Letters)`,
      `Pronunciation: ${nameItem.syllables.join(' • ')}`,
      `Flow Score: ${nameItem.pronounceabilityScore}%`,
      `Acrostic Meaning:`,
      ...characters.map((char, i) => `  ${char} — ${getLetterTrait(char, i)}`),
      nameItem.embeddedWords.length > 0 ? `Embedded Morphemes: ${nameItem.embeddedWords.join(', ')}` : '',
      noteText ? `Notes: ${noteText}` : '',
    ].filter(Boolean);

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-2 border-[#1A1A1A] rounded-2xl p-6 sm:p-7 shadow-[8px_8px_0px_0px_#1A1A1A] space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-[#1A1A1A]">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded border-2 border-[#1A1A1A] bg-[#FFD100] text-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A]">
                {nameItem.length}-Character Name Meaning Analysis
              </span>
              <span className="text-xs font-mono font-bold text-[#1A1A1A] bg-[#00D1FF] px-2 py-0.5 rounded border border-[#1A1A1A]">
                Score: {nameItem.pronounceabilityScore}%
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-mono text-[#1A1A1A] mt-2 tracking-tight">
              {nameItem.text}
            </h2>
            <p className="text-xs font-bold text-[#666666] font-mono mt-0.5">
              Phonetic breakdown: {nameItem.syllables.join(' • ')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeech}
              className={`p-2 rounded-lg border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all ${
                isPlayingAudio
                  ? 'bg-[#FF477E] text-white'
                  : 'text-[#1A1A1A] bg-[#FFF9E6] hover:bg-[#FFE04D]'
              }`}
              title="Speak Name"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onToggleFavorite(nameItem)}
              className={`p-2 rounded-lg border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all ${
                isFavorite
                  ? 'bg-[#FFD100] text-[#1A1A1A]'
                  : 'text-[#1A1A1A] bg-[#FFF9E6] hover:bg-[#FFD100]'
              }`}
              title={isFavorite ? 'Saved' : 'Save'}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-[#1A1A1A]' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#1A1A1A] bg-[#FFF9E6] hover:bg-[#FF477E] hover:text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Acrostic Virtue Meaning Cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FF477E]" />
              Acrostic Virtue Matrix (Letter-by-Letter)
            </h3>
            <span className="text-[11px] font-bold text-[#666666]">Click any trait to cycle alternatives</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {characters.map((char, idx) => {
              const trait = getLetterTrait(char, idx);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => cycleLetterTrait(char, idx)}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-[#FFF9E6] hover:bg-[#FFE04D] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all text-left group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-md bg-[#FF477E] border-2 border-[#1A1A1A] flex items-center justify-center font-mono font-black text-lg text-white group-hover:scale-105 transition-transform shadow-[1px_1px_0px_0px_#1A1A1A]">
                    {char}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-mono font-bold text-[#666666]">Letter #{idx + 1}</div>
                    <div className="text-xs font-black text-[#1A1A1A] truncate">
                      {trait}
                    </div>
                  </div>
                  <Shuffle className="w-3.5 h-3.5 text-[#1A1A1A]" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Embedded Morphemes & Linguistic Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-[#FFF9E6] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]">
            <span className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider block mb-1.5">
              Embedded Root Words
            </span>
            {nameItem.embeddedWords && nameItem.embeddedWords.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {nameItem.embeddedWords.map((word) => (
                  <span
                    key={word}
                    className="text-xs font-mono font-black px-2 py-0.5 rounded border-2 border-[#1A1A1A] bg-[#00D1FF] text-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A]"
                  >
                    {word}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs font-medium text-[#4A4A4A]">
                Purely abstract combination. High phonetic uniqueness and distinctive brand resonance.
              </p>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-[#FFF9E6] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]">
            <span className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider block mb-1.5">
              Linguistic Profile
            </span>
            <div className="space-y-1 text-xs text-[#1A1A1A] font-mono font-bold">
              <div className="flex justify-between">
                <span className="text-[#666666]">Vowel Ratio:</span>
                <span>{((nameItem.vowelCount / nameItem.length) * 100).toFixed(0)}% ({nameItem.vowelCount} vowels)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Consonants:</span>
                <span>{nameItem.consonantCount} letters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Syllables:</span>
                <span>{nameItem.syllables.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Notes */}
        <div>
          <label className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider block mb-1.5">
            Personal Notes / Brand Story
          </label>
          <textarea
            rows={2}
            value={noteText}
            onChange={(e) => {
              setNoteText(e.target.value);
              if (onUpdateNotes) onUpdateNotes(nameItem.id, e.target.value);
            }}
            placeholder="Add meaning notes (e.g. 'Project code name for solar energy', 'Fantasy novel character')..."
            className="w-full bg-[#FFF9E6] border-2 border-[#1A1A1A] rounded-xl p-3 text-xs font-bold text-[#1A1A1A] placeholder-[#7A7A7A] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FF477E] transition shadow-[1px_1px_0px_0px_#1A1A1A]"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t-2 border-[#1A1A1A]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#1A1A1A] bg-[#FFF9E6] hover:bg-[#FFE04D] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] transition-all"
          >
            Close
          </button>

          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-black text-white bg-[#FF477E] hover:bg-[#FF2E6D] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Meaning Card!' : 'Copy Formatted Meaning'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
