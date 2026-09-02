import React, { useState } from 'react';
import { Lock, Unlock, SlidersHorizontal, Sparkles, X, Check, HelpCircle } from 'lucide-react';
import { SlotConstraint, SlotConstraintType } from '../types';
import { VOWELS, CONSONANTS, ALPHABET_26 } from '../data/linguisticData';

interface SlotConfiguratorProps {
  length: number;
  slots: SlotConstraint[];
  onUpdateSlot: (slot: SlotConstraint) => void;
  onClearSlots: () => void;
  onApplyPreset: (presetName: string) => void;
}

export const SlotConfigurator: React.FC<SlotConfiguratorProps> = ({
  length,
  slots,
  onUpdateSlot,
  onClearSlots,
  onApplyPreset,
}) => {
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);

  const getSlot = (index: number): SlotConstraint => {
    return (
      slots.find((s) => s.index === index) || {
        index,
        type: 'any',
      }
    );
  };

  const currentActiveSlot = activeSlotIndex !== null ? getSlot(activeSlotIndex) : null;

  return (
    <div className="bg-white border-2 border-[#1A1A1A] rounded-xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_#1A1A1A]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b-2 border-[#1A1A1A]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black text-[#1A1A1A] tracking-wide uppercase flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-[#FF477E]" />
              Character Slot Matrix ({length} Positions)
            </h2>
            <span className="text-xs text-[#1A1A1A] bg-[#FFF9E6] border border-[#1A1A1A] px-2 py-0.5 rounded font-mono font-bold">
              26 choices per free slot
            </span>
          </div>
          <p className="text-xs font-medium text-[#4A4A4A] mt-0.5">
            Click any slot below to lock a specific letter, enforce Vowels (A,E,I,O,U,Y) or Consonants.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-[#4A4A4A] mr-1">Presets:</span>
          <button
            onClick={() => onApplyPreset('alternating')}
            className="text-xs px-2.5 py-1 rounded-md bg-[#FFF9E6] hover:bg-[#FFE04D] text-[#1A1A1A] border-2 border-[#1A1A1A] font-bold shadow-[1px_1px_0px_0px_#1A1A1A] transition-all"
          >
            C-V-C-V Flow
          </button>
          <button
            onClick={() => onApplyPreset('name_melodic')}
            className="text-xs px-2.5 py-1 rounded-md bg-[#00D1FF] hover:bg-[#33DAFF] text-[#1A1A1A] border-2 border-[#1A1A1A] font-bold shadow-[1px_1px_0px_0px_#1A1A1A] transition-all"
          >
            Melodic 9
          </button>
          <button
            onClick={onClearSlots}
            className="text-xs px-2 py-1 rounded-md text-[#FF477E] hover:bg-[#FF477E]/10 font-bold transition"
            title="Reset all slot constraints to Any"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Visual Slot Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2.5">
        {Array.from({ length }).map((_, idx) => {
          const slot = getSlot(idx);
          const isSelected = activeSlotIndex === idx;

          let badgeColor = 'bg-[#FFF9E6] text-[#1A1A1A] border-[#1A1A1A]';
          let label = 'ANY';

          if (slot.type === 'exact' && slot.exactChar) {
            badgeColor = 'bg-[#00E699] text-[#1A1A1A] border-[#1A1A1A]';
            label = slot.exactChar.toUpperCase();
          } else if (slot.type === 'vowel') {
            badgeColor = 'bg-[#FFD100] text-[#1A1A1A] border-[#1A1A1A]';
            label = 'VOWEL (6)';
          } else if (slot.type === 'consonant') {
            badgeColor = 'bg-[#00D1FF] text-[#1A1A1A] border-[#1A1A1A]';
            label = 'CONSONANT (20)';
          } else if (slot.type === 'custom' && slot.customChars && slot.customChars.length > 0) {
            badgeColor = 'bg-[#FF477E] text-white border-[#1A1A1A]';
            label = `${slot.customChars.length} CHARS`;
          }

          return (
            <button
              key={idx}
              type="button"
              id={`slot-card-${idx}`}
              onClick={() => setActiveSlotIndex(isSelected ? null : idx)}
              className={`relative flex flex-col items-center justify-between p-2.5 rounded-lg border-2 border-[#1A1A1A] text-center transition-all duration-150 group ${
                isSelected
                  ? 'bg-[#FFF9E6] shadow-[3px_3px_0px_0px_#FF477E] ring-2 ring-[#FF477E]'
                  : 'bg-white hover:bg-[#FFF9E6]/50 shadow-[2px_2px_0px_0px_#1A1A1A]'
              }`}
            >
              <div className="flex items-center justify-between w-full text-[10px] font-mono text-[#4A4A4A] font-bold mb-1">
                <span>POS #{idx + 1}</span>
                {slot.type === 'exact' ? (
                  <Lock className="w-3 h-3 text-[#1A1A1A]" />
                ) : (
                  <span className="opacity-0 group-hover:opacity-100 transition text-[9px] text-[#FF477E] font-bold">
                    Edit
                  </span>
                )}
              </div>

              {/* Character or Type Indicator */}
              <div className="my-1.5 flex items-center justify-center">
                {slot.type === 'exact' && slot.exactChar ? (
                  <span className="font-mono font-black text-2xl text-[#1A1A1A] tracking-wider">
                    {slot.exactChar.toUpperCase()}
                  </span>
                ) : (
                  <span className="font-mono text-xl text-[#7A7A7A] group-hover:text-[#1A1A1A] transition font-bold">
                    {slot.type === 'vowel' ? '🅥' : slot.type === 'consonant' ? '🅲' : '?'}
                  </span>
                )}
              </div>

              {/* Tag */}
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border-2 tracking-tight w-full truncate shadow-[1px_1px_0px_0px_#1A1A1A] ${badgeColor}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Slot Configurator Popover / Editor */}
      {currentActiveSlot !== null && (
        <div className="mt-4 p-4 rounded-xl bg-[#FFF9E6] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#1A1A1A]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black text-[#1A1A1A] px-2 py-0.5 rounded bg-[#FFD100] border-2 border-[#1A1A1A]">
                Configuring Position #{currentActiveSlot.index + 1} of {length}
              </span>
              <span className="text-xs font-bold text-[#4A4A4A]">Choose rule for this letter slot:</span>
            </div>
            <button
              onClick={() => setActiveSlotIndex(null)}
              className="text-[#1A1A1A] hover:bg-[#FF477E] hover:text-white p-1 rounded border-2 border-transparent hover:border-[#1A1A1A] transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quick Type Selection */}
            <div>
              <label className="text-xs font-black text-[#1A1A1A] mb-1.5 block uppercase">
                Position Rule Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSlot({
                      index: currentActiveSlot.index,
                      type: 'any',
                    })
                  }
                  className={`px-3 py-2 rounded-lg text-xs font-black border-2 border-[#1A1A1A] text-center transition-all ${
                    currentActiveSlot.type === 'any'
                      ? 'bg-[#FF477E] text-white shadow-[2px_2px_0px_0px_#1A1A1A]'
                      : 'bg-white text-[#1A1A1A] hover:bg-[#FFF9E6] shadow-[1px_1px_0px_0px_#1A1A1A]'
                  }`}
                >
                  Any (26)
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onUpdateSlot({
                      index: currentActiveSlot.index,
                      type: 'vowel',
                    })
                  }
                  className={`px-3 py-2 rounded-lg text-xs font-black border-2 border-[#1A1A1A] text-center transition-all ${
                    currentActiveSlot.type === 'vowel'
                      ? 'bg-[#FFD100] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                      : 'bg-white text-[#1A1A1A] hover:bg-[#FFF9E6] shadow-[1px_1px_0px_0px_#1A1A1A]'
                  }`}
                >
                  Vowel (6)
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onUpdateSlot({
                      index: currentActiveSlot.index,
                      type: 'consonant',
                    })
                  }
                  className={`px-3 py-2 rounded-lg text-xs font-black border-2 border-[#1A1A1A] text-center transition-all ${
                    currentActiveSlot.type === 'consonant'
                      ? 'bg-[#00D1FF] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                      : 'bg-white text-[#1A1A1A] hover:bg-[#FFF9E6] shadow-[1px_1px_0px_0px_#1A1A1A]'
                  }`}
                >
                  Consonant (20)
                </button>
              </div>
            </div>

            {/* Lock Exact Character */}
            <div>
              <label className="text-xs font-black text-[#1A1A1A] mb-1.5 block uppercase">
                Or Pin Exact Letter (A-Z)
              </label>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1.5 bg-white rounded-lg border-2 border-[#1A1A1A]">
                {ALPHABET_26.map((letter) => {
                  const isExact =
                    currentActiveSlot.type === 'exact' &&
                    currentActiveSlot.exactChar?.toUpperCase() === letter;
                  return (
                    <button
                      key={letter}
                      type="button"
                      onClick={() =>
                        onUpdateSlot({
                          index: currentActiveSlot.index,
                          type: 'exact',
                          exactChar: letter,
                        })
                      }
                      className={`w-6 h-6 text-xs font-mono font-black rounded border border-[#1A1A1A] transition-all ${
                        isExact
                          ? 'bg-[#00E699] text-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A] scale-110'
                          : 'bg-[#FFF9E6] hover:bg-[#FFE04D] text-[#1A1A1A]'
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
