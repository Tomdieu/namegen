import React, { useState } from 'react';
import {
  X,
  Bookmark,
  Trash2,
  Copy,
  Check,
  Download,
  Volume2,
  BookOpen,
  Tag
} from 'lucide-react';
import { GeneratedName } from '../types';

interface SavedNamesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: GeneratedName[];
  onRemoveFavorite: (id: string) => void;
  onClearAll: () => void;
  onOpenMeaning: (item: GeneratedName) => void;
}

export const SavedNamesDrawer: React.FC<SavedNamesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onClearAll,
  onOpenMeaning,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  if (!isOpen) return null;

  const filteredFavorites = favorites.filter((f) =>
    f.text.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleCopyAll = () => {
    const textList = favorites.map((f) => f.text).join('\n');
    navigator.clipboard.writeText(textList);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleExportCSV = () => {
    const headers = 'Name,Length,PronounceabilityScore,Syllables,EmbeddedWords\n';
    const rows = favorites
      .map(
        (f) =>
          `"${f.text}",${f.length},${f.pronounceabilityScore},"${f.syllables.join('-')}","${f.embeddedWords.join(';')}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `saved-name-combinations-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportTXT = () => {
    const textList = favorites.map((f) => `${f.text} (${f.length}L, ${f.pronounceabilityScore}% flow)`).join('\n');
    const blob = new Blob([textList], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `saved-names-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md h-full bg-white border-l-2 border-[#1A1A1A] p-6 flex flex-col justify-between shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="pb-4 border-b-2 border-[#1A1A1A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#1A1A1A] fill-[#FFD100]" />
            <h2 className="text-lg font-black text-[#1A1A1A] tracking-tight">
              Saved Favorites ({favorites.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#1A1A1A] bg-[#FFF9E6] hover:bg-[#FF477E] hover:text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Search */}
        <div className="py-3 space-y-2">
          <input
            type="text"
            placeholder="Search within saved names..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-[#FFF9E6] border-2 border-[#1A1A1A] rounded-lg px-3 py-1.5 text-xs font-bold text-[#1A1A1A] placeholder-[#7A7A7A] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FF477E] shadow-[1px_1px_0px_0px_#1A1A1A]"
          />

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyAll}
                disabled={favorites.length === 0}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-[#FFF9E6] hover:bg-[#FFE04D] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A] disabled:opacity-40 transition-all"
              >
                {copiedAll ? <Check className="w-3 h-3 text-[#00E699]" /> : <Copy className="w-3 h-3" />}
                <span>Copy All</span>
              </button>

              <button
                onClick={handleExportCSV}
                disabled={favorites.length === 0}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-[#00D1FF] hover:bg-[#33DAFF] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A] disabled:opacity-40 transition-all"
              >
                <Download className="w-3 h-3" />
                <span>CSV</span>
              </button>

              <button
                onClick={handleExportTXT}
                disabled={favorites.length === 0}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-[#FFD100] hover:bg-[#FFE04D] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A] disabled:opacity-40 transition-all"
              >
                <Download className="w-3 h-3" />
                <span>TXT</span>
              </button>
            </div>

            {favorites.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-[11px] font-bold text-[#FF477E] hover:underline"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1">
          {filteredFavorites.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center p-4 text-[#7A7A7A]">
              <Bookmark className="w-8 h-8 mb-2 opacity-30 text-[#1A1A1A]" />
              <p className="text-xs font-bold text-[#1A1A1A]">No saved names yet.</p>
              <p className="text-[11px] font-medium text-[#666666] mt-1">
                Click the bookmark star on any generated name card to save it here.
              </p>
            </div>
          ) : (
            filteredFavorites.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-[#FFF9E6] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] hover:bg-white flex items-center justify-between gap-3 group transition-all"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-[#1A1A1A] tracking-wide">
                      {item.text}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FFD100] text-[#1A1A1A] border border-[#1A1A1A]">
                      {item.length}L
                    </span>
                  </div>
                  {item.syllables && item.syllables.length > 1 && (
                    <span className="text-[10px] text-[#666666] font-mono font-bold block">
                      {item.syllables.join(' • ')}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onOpenMeaning(item)}
                    className="p-1.5 rounded-lg text-[#1A1A1A] bg-white hover:bg-[#00D1FF] border-2 border-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A] transition-all"
                    title="Inspect Meaning"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.text);
                    }}
                    className="p-1.5 rounded-lg text-[#1A1A1A] bg-white hover:bg-[#FFD100] border-2 border-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A] transition-all"
                    title="Copy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onRemoveFavorite(item.id)}
                    className="p-1.5 rounded-lg text-[#1A1A1A] bg-white hover:bg-[#FF477E] hover:text-white border-2 border-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A] transition-all"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t-2 border-[#1A1A1A]">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-xs font-black text-white bg-[#FF477E] hover:bg-[#FF2E6D] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all text-center"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
