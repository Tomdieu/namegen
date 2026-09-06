import { Share } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import type { GeneratedName } from '../types';

export function buildCSV(favorites: GeneratedName[]): string {
  const headers = 'Name,Length,PronounceabilityScore,Syllables,EmbeddedWords\n';
  const rows = favorites
    .map(
      (f) =>
        `"${f.text}",${f.length},${f.pronounceabilityScore},"${(f.syllables ?? []).join('-')}","${(f.embeddedWords ?? []).join(';')}"`
    )
    .join('\n');
  return headers + rows;
}

export function buildTXT(favorites: GeneratedName[]): string {
  return favorites.map((f) => `${f.text} (${f.length}L, ${f.pronounceabilityScore}% flow)`).join('\n');
}

/**
 * Writes content to a cache file and opens the system share sheet.
 * Falls back to sharing raw text when file sharing is unavailable.
 * Returns true when a share action was launched.
 */
export async function exportAndShare(
  content: string,
  filename: string,
  mimeType: string
): Promise<boolean> {
  try {
    const baseDir = FileSystem.cacheDirectory;
    if (baseDir) {
      const uri = `${baseDir}${filename}`;
      await FileSystem.writeAsStringAsync(uri, content, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType, dialogTitle: 'Export saved names' });
        return true;
      }
      await Share.share({ url: uri, title: 'Export saved names' });
      return true;
    }
  } catch {
    // fall through to text fallback below
  }
  try {
    await Share.share({ message: content, title: 'Export saved names' });
    return true;
  } catch {
    return false;
  }
}
