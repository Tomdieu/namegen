import * as Speech from 'expo-speech';

export interface SpeakOptions {
  rate?: number;
  language?: string;
  onStart?: () => void;
  onDone?: () => void;
}

/**
 * Speaks text aloud, stopping anything currently playing first
 * (mirrors the web version's speechSynthesis.cancel() behavior).
 * Never throws — safe to call from any press handler.
 */
export function speakText(text: string, opts?: SpeakOptions) {
  if (!text) return;
  try {
    Speech.stop();
    Speech.speak(text, {
      language: opts?.language ?? 'en-US',
      rate: opts?.rate ?? 0.9,
      pitch: 1.0,
      onStart: opts?.onStart,
      onDone: opts?.onDone,
      onStopped: opts?.onDone,
      onError: opts?.onDone,
    });
  } catch {
    // TTS unavailable on this device — ignore.
  }
}

export function stopSpeaking() {
  try {
    Speech.stop();
  } catch {
    // ignore
  }
}
