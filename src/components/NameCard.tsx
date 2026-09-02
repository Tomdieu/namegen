import React, { useState } from 'react';
import {
  Volume2,
  Copy,
  Check,
  Bookmark,
  Sparkles,
  BookOpen,
  VolumeX,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GeneratedName } from '../types';

interface NameCardProps {
  item: GeneratedName;
  isFavorite: boolean;
  onToggleFavorite: (item: GeneratedName) => void;
  onOpenMeaning: (item: GeneratedName) => void;
}

export const NameCard: React.FC<NameCardProps> = ({
  item,
  isFavorite,
  onToggleFavorite,
  onOpenMeaning,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeech = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFavorite) {
      try {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        confetti({
          particleCount: 25,
          spread: 40,
          origin: { x, y },
          colors: ['#FF477E', '#00D1FF', '#FFD100', '#00E699'],
        });
      } catch (err) {
        // confetti fallback
      }
    }
    onToggleFavorite(item);
  };

  // Score color helper
  const getScoreBadge = (score: number) => {
    if (score >= 80) {
      return {
        label: `${score}% Melodic`,
        color: 'bg-[#00E699] text-[#1A1A1A] border-2 border-[#1A1A1A]',
      };
    }
    if (score >= 60) {
      return {
        label: `${score}% Balanced`,
        color: 'bg-[#FFD100] text-[#1A1A1A] border-2 border-[#1A1A1A]',
      };
    }
    return {
      label: `${score}% Unique`,
      color: 'bg-[#FFF9E6] text-[#1A1A1A] border-2 border-[#1A1A1A]',
    };
  };

  const scoreBadge = getScoreBadge(item.pronounceabilityScore);

  return (
    <div
      id={`name-card-${item.id}`}
      className="group relative bg-white border-2 border-[#1A1A1A] rounded-xl p-4 transition-all duration-150 shadow-[3px_3px_0px_0px_#1A1A1A] hover:shadow-[5px_5px_0px_0px_#1A1A1A] hover:-translate-y-0.5 flex flex-col justify-between"
    >
      {/* Top row: Length tag, Score badge, Actions */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded border-2 border-[#1A1A1A] bg-[#FFF9E6] text-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A]">
            {item.length}L
          </span>
          <span
            className={`text-[10px] font-black px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#1A1A1A] ${scoreBadge.color}`}
          >
            {scoreBadge.label}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Audio Pronunciation */}
          <button
            type="button"
            onClick={handleSpeech}
            className={`p-1.5 rounded-lg border-2 border-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all ${
              isPlayingAudio
                ? 'bg-[#FF477E] text-white'
                : 'text-[#1A1A1A] bg-[#FFF9E6] hover:bg-[#FFE04D]'
            }`}
            title="Listen to pronunciation"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-[#1A1A1A] bg-[#FFF9E6] hover:bg-[#FFE04D] border-2 border-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
            title="Copy name to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#00E699]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Favorite Button */}
          <button
            type="button"
            onClick={handleFavoriteClick}
            className={`p-1.5 rounded-lg border-2 border-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all ${
              isFavorite
                ? 'bg-[#FFD100] text-[#1A1A1A]'
                : 'text-[#1A1A1A] bg-[#FFF9E6] hover:bg-[#FFD100]'
            }`}
            title={isFavorite ? 'Remove from saved' : 'Save to favorites'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-[#1A1A1A]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Name Display */}
      <div className="my-2">
        <h3 className="font-mono text-xl sm:text-2xl font-black text-[#1A1A1A] tracking-wide break-all group-hover:text-[#FF477E] transition-colors">
          {item.text}
        </h3>

        {/* Syllables breakdown */}
        {item.syllables && item.syllables.length > 1 && (
          <p className="text-[11px] font-mono font-bold text-[#666666] mt-0.5">
            {item.syllables.join(' • ')}
          </p>
        )}
      </div>

      {/* Embedded Words & Acrostic Meaning Trigger */}
      <div className="mt-3 pt-3 border-t-2 border-[#1A1A1A] flex flex-col gap-2">
        {/* Embedded words */}
        {item.embeddedWords && item.embeddedWords.length > 0 ? (
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[10px] font-bold text-[#4A4A4A]">Roots:</span>
            {item.embeddedWords.map((word) => (
              <span
                key={word}
                className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded border border-[#1A1A1A] bg-[#FFD100] text-[#1A1A1A]"
              >
                {word}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-[10px] text-[#4A4A4A] font-mono font-bold">
            {item.vowelCount} vowels, {item.consonantCount} consonants
          </div>
        )}

        {/* View Acrostic Meaning CTA */}
        <button
          type="button"
          onClick={() => onOpenMeaning(item)}
          className="w-full mt-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-black text-[#1A1A1A] bg-[#00D1FF] hover:bg-[#33DAFF] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Inspect Name Meaning</span>
        </button>
      </div>
    </div>
  );
};
