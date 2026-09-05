import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Fire-and-forget haptics. No-op on web and on devices without haptic
 * support — never throws, so it's safe to call from any press handler.
 */
function safe(run: () => Promise<void>) {
  if (Platform.OS === 'web') return;
  try {
    void run().catch(() => {});
  } catch {
    // Haptics not supported on this device — ignore.
  }
}

/** Light tap — navigation, opening screens, minor buttons. */
export const hapticLight = () =>
  safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));

/** Medium tap — primary actions like GENERATE. */
export const hapticMedium = () =>
  safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));

/** Heavy tap — destructive or significant actions. */
export const hapticHeavy = () =>
  safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy));

/** Selection tick — toggles, chips, steppers, slot boxes. */
export const hapticSelect = () => safe(() => Haptics.selectionAsync());

/** Success ping — copy to clipboard, saved. */
export const hapticSuccess = () =>
  safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));

/** Warning ping — removals. */
export const hapticWarning = () =>
  safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
