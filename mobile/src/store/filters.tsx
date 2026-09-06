import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type SortOption = 'score_desc' | 'alpha_asc' | 'alpha_desc' | 'words_desc' | 'vowels_desc';

interface FiltersContextValue {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  startsWithFilter: string;
  setStartsWithFilter: (v: string) => void;
  endsWithFilter: string;
  setEndsWithFilter: (v: string) => void;
  minFlowScore: number;
  setMinFlowScore: (v: number) => void;
  sortBy: SortOption;
  setSortBy: (v: SortOption) => void;
  onlyWithWords: boolean;
  setOnlyWithWords: (v: boolean) => void;
  resetFilters: () => void;
  activeFilterCount: number;
}

const FiltersContext = createContext<FiltersContextValue | null>(null);

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [startsWithFilter, setStartsWithFilter] = useState('');
  const [endsWithFilter, setEndsWithFilter] = useState('');
  const [minFlowScore, setMinFlowScore] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('score_desc');
  const [onlyWithWords, setOnlyWithWords] = useState(false);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setStartsWithFilter('');
    setEndsWithFilter('');
    setMinFlowScore(0);
    setSortBy('score_desc');
    setOnlyWithWords(false);
  }, []);

  const activeFilterCount =
    (searchTerm ? 1 : 0) +
    (startsWithFilter ? 1 : 0) +
    (endsWithFilter ? 1 : 0) +
    (minFlowScore > 0 ? 1 : 0) +
    (sortBy !== 'score_desc' ? 1 : 0) +
    (onlyWithWords ? 1 : 0);

  const value = useMemo<FiltersContextValue>(
    () => ({
      searchTerm,
      setSearchTerm,
      startsWithFilter,
      setStartsWithFilter,
      endsWithFilter,
      setEndsWithFilter,
      minFlowScore,
      setMinFlowScore,
      sortBy,
      setSortBy,
      onlyWithWords,
      setOnlyWithWords,
      resetFilters,
      activeFilterCount,
    }),
    [
      searchTerm,
      startsWithFilter,
      endsWithFilter,
      minFlowScore,
      sortBy,
      onlyWithWords,
      resetFilters,
      activeFilterCount,
    ]
  );

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters(): FiltersContextValue {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error('useFilters must be used within a FiltersProvider');
  return ctx;
}
