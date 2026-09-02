import React from 'react';
import { Search, Filter, ArrowUpDown, Sparkles, Tag, CheckSquare } from 'lucide-react';

export type SortOption = 'score_desc' | 'alpha_asc' | 'alpha_desc' | 'words_desc' | 'vowels_desc';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  startsWith: string;
  onStartsWithChange: (val: string) => void;
  endsWith: string;
  onEndsWithChange: (val: string) => void;
  minScore: number;
  onMinScoreChange: (val: number) => void;
  sortBy: SortOption;
  onSortChange: (val: SortOption) => void;
  onlyWithWords: boolean;
  onToggleOnlyWithWords: (val: boolean) => void;
  totalResults: number;
  filteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  startsWith,
  onStartsWithChange,
  endsWith,
  onEndsWithChange,
  minScore,
  onMinScoreChange,
  sortBy,
  onSortChange,
  onlyWithWords,
  onToggleOnlyWithWords,
  totalResults,
  filteredCount,
}) => {
  return (
    <div className="bg-white border-2 border-[#1A1A1A] rounded-xl p-3.5 space-y-3 shadow-[3px_3px_0px_0px_#1A1A1A]">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#4A4A4A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search generated names or substring..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#FFF9E6] border-2 border-[#1A1A1A] rounded-lg pl-9 pr-3 py-1.5 text-xs font-bold text-[#1A1A1A] placeholder-[#7A7A7A] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FF477E] transition shadow-[1px_1px_0px_0px_#1A1A1A]"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#FF477E] hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        {/* Starts with / Ends with mini inputs */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#1A1A1A] font-bold font-mono">Starts:</span>
            <input
              type="text"
              maxLength={3}
              placeholder="e.g. S"
              value={startsWith}
              onChange={(e) => onStartsWithChange(e.target.value.toUpperCase())}
              className="w-16 bg-[#FFF9E6] border-2 border-[#1A1A1A] rounded-md px-2 py-1 text-xs font-mono font-bold uppercase text-center text-[#1A1A1A] focus:bg-white focus:outline-none shadow-[1px_1px_0px_0px_#1A1A1A]"
            />
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#1A1A1A] font-bold font-mono">Ends:</span>
            <input
              type="text"
              maxLength={3}
              placeholder="e.g. TH"
              value={endsWith}
              onChange={(e) => onEndsWithChange(e.target.value.toUpperCase())}
              className="w-16 bg-[#FFF9E6] border-2 border-[#1A1A1A] rounded-md px-2 py-1 text-xs font-mono font-bold uppercase text-center text-[#1A1A1A] focus:bg-white focus:outline-none shadow-[1px_1px_0px_0px_#1A1A1A]"
            />
          </div>

          {/* Sort By Selector */}
          <div className="flex items-center gap-1.5 ml-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-[#FFF9E6] border-2 border-[#1A1A1A] rounded-md px-2.5 py-1 text-xs font-bold text-[#1A1A1A] focus:outline-none focus:bg-white cursor-pointer shadow-[1px_1px_0px_0px_#1A1A1A]"
            >
              <option value="score_desc">Highest Flow Score</option>
              <option value="alpha_asc">Alphabetical (A → Z)</option>
              <option value="alpha_desc">Alphabetical (Z → A)</option>
              <option value="words_desc">Embedded Root Words</option>
              <option value="vowels_desc">Most Melodic Vowels</option>
            </select>
          </div>
        </div>
      </div>

      {/* Second Row: Filters & Stats Counter */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t-2 border-[#1A1A1A] text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Min Score Slider */}
          <div className="flex items-center gap-2">
            <span className="text-[#1A1A1A] font-bold text-[11px]">Min Flow:</span>
            <input
              type="range"
              min="0"
              max="85"
              step="5"
              value={minScore}
              onChange={(e) => onMinScoreChange(Number(e.target.value))}
              className="w-20 accent-[#FF477E] bg-[#FFF9E6] border border-[#1A1A1A] h-2 rounded cursor-pointer"
            />
            <span className="font-mono text-[#1A1A1A] font-bold text-[11px] bg-[#FFD100] px-1.5 py-0.5 rounded border border-[#1A1A1A]">{minScore}%</span>
          </div>

          {/* Root words checkbox */}
          <label className="flex items-center gap-1.5 cursor-pointer text-[#1A1A1A] font-bold select-none">
            <input
              type="checkbox"
              checked={onlyWithWords}
              onChange={(e) => onToggleOnlyWithWords(e.target.checked)}
              className="rounded bg-[#FFF9E6] border-2 border-[#1A1A1A] text-[#FF477E] accent-[#FF477E] focus:ring-0 cursor-pointer"
            />
            <span className="text-[11px]">Contains Root Words</span>
          </label>
        </div>

        {/* Counter */}
        <div className="text-[11px] font-bold text-[#4A4A4A]">
          Showing <span className="text-[#1A1A1A] font-black font-mono bg-[#00D1FF] px-1.5 py-0.5 rounded border border-[#1A1A1A]">{filteredCount}</span> of{' '}
          <span className="text-[#1A1A1A] font-mono font-bold">{totalResults}</span> generated combinations
        </div>
      </div>
    </div>
  );
};
