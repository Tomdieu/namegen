export type ThemeMode = 'light' | 'dark';
export type Locale = 'en' | 'fr';

export interface Palette {
  /** App background (cream in light). */
  bg: string;
  /** Cards, headers, inputs, sheets (white in light). */
  surface: string;
  /** Muted fills like chips and toggles. */
  surfaceAlt: string;
  /** Dividers inside cards. */
  divider: string;
  /** Primary text. */
  text: string;
  /** Secondary text. */
  subtext: string;
  /** Placeholder text in inputs. */
  placeholder: string;
  /** StatusBar style name for expo-status-bar. */
  statusBarStyle: 'dark' | 'light';
}

export const lightPalette: Palette = {
  bg: '#FFF9E6',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F5F5',
  divider: '#EEEEEE',
  text: '#1A1A1A',
  subtext: '#666666',
  placeholder: '#7A7A7A',
  statusBarStyle: 'dark',
};

export const darkPalette: Palette = {
  bg: '#141414',
  surface: '#1E1E1E',
  surfaceAlt: '#2A2A2A',
  divider: '#333333',
  text: '#F5F5F5',
  subtext: '#B0B0B0',
  placeholder: '#8A8A8A',
  statusBarStyle: 'light',
};

/** Brand accents stay identical in both themes. */
export const brand = {
  yellow: '#FFD100',
  blue: '#00D1FF',
  pink: '#FF477E',
  green: '#00E699',
  ink: '#1A1A1A',
} as const;
