import React from 'react';
import {
  Sparkles,
  Dices,
  Layers,
  FileText,
  Sliders,
  Type,
  Shuffle,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { GenerationMode, CasingOption, GenerationSettings, CombinatoricsStats } from '../types';

interface GeneratorControlsProps {
  settings: GenerationSettings;
  stats: CombinatoricsStats;
  isGenerating: boolean;
  onUpdateSettings: (partial: Partial<GenerationSettings>) => void;
  onGenerate: () => void;
}

export const GeneratorControls: React.FC<GeneratorControlsProps> = ({
  settings,
  stats,
  isGenerating,
  onUpdateSettings,
  onGenerate,
}) => {
  const popularLengths = [4, 5, 6, 7, 8, 9, 10, 12];

  const modes: {
    id: GenerationMode;
    label: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'pronounceable',
      label: 'Melodic & Pronounceable',
      description: 'Phonetically balanced natural names & brand flows',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'pattern',
      label: 'Slot Matrix Constrained',
      description: 'Strictly satisfies your letter position rules',
      icon: <Layers className="w-4 h-4 text-indigo-400" />,
    },
    {
      id: 'pure_random',
      label: 'Pure 26ⁿ Combinations',
      description: 'Uniform random sampling from 26 letter permutations',
      icon: <Dices className="w-4 h-4 text-purple-400" />,
    },
    {
      id: 'acrostic',
      label: 'Acrostic Meaning Focus',
      description: 'Optimized for letter-by-letter virtue attributes',
      icon: <FileText className="w-4 h-4 text-emerald-400" />,
    },
  ];

  return (
    <div className="bg-white border-2 border-[#1A1A1A] rounded-xl p-5 shadow-[4px_4px_0px_0px_#1A1A1A] space-y-5">
      {/* Row 1: Length (e.g. 9 chars) & Batch & Casing */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Length Selector */}
        <div className="md:col-span-6 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
              <Type className="w-4 h-4 text-[#FF477E]" />
              Name Character Length: <span className="text-[#FF477E] font-mono text-sm font-black">{settings.length} Characters</span>
            </label>
            <span className="text-[11px] font-bold text-[#4A4A4A] font-mono">
              Theoretical: {stats.totalFormulaString.split('=')[0].trim()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min="2"
              max="20"
              value={settings.length}
              onChange={(e) => onUpdateSettings({ length: Number(e.target.value) })}
              className="w-full accent-[#FF477E] bg-[#FFF9E6] border-2 border-[#1A1A1A] h-3 rounded-lg cursor-pointer"
            />
          </div>

          {/* Quick Length Pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] font-bold text-[#4A4A4A]">Quick set:</span>
            {popularLengths.map((len) => (
              <button
                key={len}
                type="button"
                id={`length-btn-${len}`}
                onClick={() => onUpdateSettings({ length: len })}
                className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border-2 border-[#1A1A1A] transition-all ${
                  settings.length === len
                    ? 'bg-[#FF477E] text-white shadow-[2px_2px_0px_0px_#1A1A1A]'
                    : 'bg-[#FFF9E6] hover:bg-[#FFE04D] text-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A]'
                }`}
              >
                {len === 9 ? '9 (Target)' : `${len}`}
              </button>
            ))}
          </div>
        </div>

        {/* Batch Size */}
        <div className="md:col-span-3 space-y-1.5">
          <label className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider block">
            Batch Size
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[12, 24, 48, 96].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onUpdateSettings({ batchSize: size })}
                className={`py-1.5 rounded-md text-xs font-mono font-bold border-2 border-[#1A1A1A] text-center transition-all ${
                  settings.batchSize === size
                    ? 'bg-[#00D1FF] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                    : 'bg-[#FFF9E6] text-[#1A1A1A] hover:bg-[#FFE04D] shadow-[1px_1px_0px_0px_#1A1A1A]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Casing */}
        <div className="md:col-span-3 space-y-1.5">
          <label className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider block">
            Text Casing
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(
              [
                { id: 'title', label: 'Aa' },
                { id: 'upper', label: 'UPPER' },
                { id: 'lower', label: 'lower' },
              ] as { id: CasingOption; label: string }[]
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onUpdateSettings({ casing: opt.id })}
                className={`py-1.5 rounded-md text-xs font-mono font-bold border-2 border-[#1A1A1A] text-center transition-all ${
                  settings.casing === opt.id
                    ? 'bg-[#FFD100] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                    : 'bg-[#FFF9E6] text-[#1A1A1A] hover:bg-[#FFE04D] shadow-[1px_1px_0px_0px_#1A1A1A]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Generation Modes */}
      <div>
        <label className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider block mb-2">
          Generation Algorithm & Flow Mode
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {modes.map((m) => {
            const isSelected = settings.mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                id={`mode-${m.id}`}
                onClick={() => onUpdateSettings({ mode: m.id })}
                className={`p-3 rounded-lg border-2 border-[#1A1A1A] text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#FFF9E6] shadow-[3px_3px_0px_0px_#1A1A1A] ring-2 ring-[#FF477E]'
                    : 'bg-white hover:bg-[#FFF9E6]/60 shadow-[2px_2px_0px_0px_#1A1A1A]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {m.icon}
                  <span className="text-xs font-black text-[#1A1A1A] tracking-tight">{m.label}</span>
                </div>
                <p className="text-[11px] font-medium text-[#4A4A4A] line-clamp-2 leading-relaxed">
                  {m.description}
                </p>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#FF477E] border border-[#1A1A1A]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t-2 border-[#1A1A1A]">
        <div className="flex items-center gap-2 text-xs font-bold text-[#4A4A4A]">
          <Cpu className="w-4 h-4 text-[#FF477E]" />
          <span>Combinatorics Space:</span>
          <span className="font-mono text-[#1A1A1A] font-black bg-[#FFF9E6] px-2 py-0.5 rounded border border-[#1A1A1A]">
            {stats.constrainedFormulaString.includes('=')
              ? stats.constrainedFormulaString.split('=')[1].trim()
              : stats.totalFormulaString}
          </span>
        </div>

        <button
          type="button"
          id="generate-names-btn"
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-sm text-white bg-[#FF477E] hover:bg-[#FF2E6D] border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#1A1A1A] transition-all cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Calculating Combinations...</span>
            </>
          ) : (
            <>
              <Shuffle className="w-4 h-4 text-white" />
              <span>Generate {settings.batchSize} Combinations ({settings.length}-Letters)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
