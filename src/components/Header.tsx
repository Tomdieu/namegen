import React from 'react';
import { Sparkles, Bookmark, Calculator, RotateCcw, Volume2, Layers } from 'lucide-react';
import { CombinatoricsStats } from '../types';

interface HeaderProps {
  stats: CombinatoricsStats;
  length: number;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenMath: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  length,
  favoritesCount,
  onOpenFavorites,
  onOpenMath,
  onReset,
}) => {
  return (
    <header className="border-b-2 border-[#1A1A1A] bg-white sticky top-0 z-30 shadow-[0_2px_0_0_#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FF477E] border-2 border-[#1A1A1A] flex items-center justify-center shadow-[2px_2px_0px_0px_#1A1A1A]">
              <span className="font-mono font-black text-white text-lg tracking-tighter">26ⁿ</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-black text-[#1A1A1A] tracking-tight">
                  NameGen
                </h1>
                <span className="text-xs font-bold px-2 py-0.5 rounded border-2 border-[#1A1A1A] bg-[#FFD100] text-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A]">
                  26ⁿ Generator
                </span>
              </div>
              <p className="text-xs font-medium text-[#4A4A4A]">
                Explore 26-character alphabet combinations, phonetic name flows & acrostic meanings
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            <button
              id="math-explainer-btn"
              onClick={onOpenMath}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#1A1A1A] bg-[#00D1FF] hover:bg-[#33DAFF] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
              title="View Combinatorics Math & Formulas"
            >
              <Calculator className="w-3.5 h-3.5 text-[#1A1A1A]" />
              <span>26ⁿ Combinatorics</span>
            </button>

            <button
              id="favorites-toggle-btn"
              onClick={onOpenFavorites}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#1A1A1A] bg-[#FFD100] hover:bg-[#FFE04D] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
            >
              <Bookmark className="w-3.5 h-3.5 fill-[#1A1A1A] text-[#1A1A1A]" />
              <span>Saved ({favoritesCount})</span>
            </button>

            <button
              id="reset-settings-btn"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#1A1A1A] bg-[#FFF9E6] hover:bg-[#FFF0C2] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
              title="Reset Settings to Default (9 Characters)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
