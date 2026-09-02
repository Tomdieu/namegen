import React from 'react';
import { X, Calculator, Sparkles, Binary, CheckCircle2, Layers } from 'lucide-react';
import { formatLargeNumber } from '../utils/combinatorics';

interface MathExplainerProps {
  isOpen: boolean;
  onClose: () => void;
  currentLength: number;
}

export const MathExplainer: React.FC<MathExplainerProps> = ({
  isOpen,
  onClose,
  currentLength,
}) => {
  if (!isOpen) return null;

  const tableData = [
    { len: 3, total: 26n ** 3n, label: '3 Chars (Short code)' },
    { len: 4, total: 26n ** 4n, label: '4 Chars (Acronym)' },
    { len: 5, total: 26n ** 5n, label: '5 Chars (Short name)' },
    { len: 6, total: 26n ** 6n, label: '6 Chars (Standard name)' },
    { len: 7, total: 26n ** 7n, label: '7 Chars (Brand name)' },
    { len: 8, total: 26n ** 8n, label: '8 Chars (Extended)' },
    { len: 9, total: 26n ** 9n, label: '9 Chars (Target Length)' },
    { len: 10, total: 26n ** 10n, label: '10 Chars' },
    { len: 12, total: 26n ** 12n, label: '12 Chars' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-2 border-[#1A1A1A] rounded-2xl p-6 sm:p-7 shadow-[8px_8px_0px_0px_#1A1A1A] space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-[#1A1A1A]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded border-2 border-[#1A1A1A] bg-[#FFD100] text-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A] flex items-center gap-1">
                <Calculator className="w-3.5 h-3.5" />
                Combinatorics Math
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] mt-2 tracking-tight">
              26 Characters Combinations (26<sup>N</sup>)
            </h2>
            <p className="text-xs font-bold text-[#666666] mt-0.5">
              The exact mathematical formula for generating sequences of length {currentLength} from the 26-letter English alphabet.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#1A1A1A] bg-[#FFF9E6] hover:bg-[#FF477E] hover:text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Highlight Box */}
        <div className="p-5 rounded-xl bg-[#FFF9E6] border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] space-y-3">
          <div className="text-xs font-mono text-[#FF477E] font-black uppercase tracking-wider">
            For Length N = {currentLength} Characters:
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-black text-[#1A1A1A] tracking-tight">
            26<sup>{currentLength}</sup> = {formatLargeNumber(26n ** BigInt(currentLength))}
          </div>
          <div className="text-xs text-[#4A4A4A] font-mono font-bold leading-relaxed">
            {`26 × `.repeat(Math.min(currentLength, 6))}
            {currentLength > 6 ? `... (${currentLength} times) ` : ''}= {(26n ** BigInt(currentLength)).toLocaleString()} unique variations with repetition.
          </div>
        </div>

        {/* Explanatory Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div className="p-4 rounded-xl bg-[#FFF9E6] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] space-y-2">
            <div className="font-black text-[#1A1A1A] flex items-center gap-1.5">
              <Binary className="w-4 h-4 text-[#00D1FF]" />
              Information Entropy
            </div>
            <p className="text-[#4A4A4A] font-medium leading-relaxed">
              Each character from the 26-letter alphabet carries <span className="font-mono font-bold text-[#1A1A1A]">log₂(26) ≈ 4.70 bits</span> of entropy.
              A {currentLength}-character name contains approximately{' '}
              <span className="font-mono text-[#FF477E] font-black">
                {(currentLength * 4.7004).toFixed(2)} bits
              </span>{' '}
              of combinatorial entropy.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFF9E6] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] space-y-2">
            <div className="font-black text-[#1A1A1A] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FFD100]" />
              Phonetic Filtering
            </div>
            <p className="text-[#4A4A4A] font-medium leading-relaxed">
              While there are 5.43 Trillion raw 9-character combinations, only about ~0.8% follow natural English phonotactic rules (balanced vowels, pronounceable consonant blends). Our generator filters the noise into melodic, memorable names.
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div>
          <h3 className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider mb-2.5">
            Combination Scale Table (26ⁿ)
          </h3>
          <div className="border-2 border-[#1A1A1A] rounded-xl overflow-hidden shadow-[2px_2px_0px_0px_#1A1A1A]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#FFF9E6] text-[#1A1A1A] border-b-2 border-[#1A1A1A] font-black">
                <tr>
                  <th className="py-2.5 px-3">Length (N)</th>
                  <th className="py-2.5 px-3">Formula</th>
                  <th className="py-2.5 px-3 text-right">Total Possible Combinations</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[#1A1A1A] bg-white font-bold">
                {tableData.map((row) => {
                  const isCurrent = row.len === currentLength;
                  return (
                    <tr
                      key={row.len}
                      className={isCurrent ? 'bg-[#FFD100] text-[#1A1A1A]' : 'text-[#1A1A1A]'}
                    >
                      <td className="py-2 px-3 flex items-center gap-1.5">
                        <span>{row.len}</span>
                        {isCurrent && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FF477E] text-white border border-[#1A1A1A]">
                            Current
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-[#666666]">26^{row.len}</td>
                      <td className="py-2 px-3 text-right text-[#1A1A1A] font-black">
                        {formatLargeNumber(row.total)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t-2 border-[#1A1A1A] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-black text-white bg-[#FF477E] hover:bg-[#FF2E6D] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
