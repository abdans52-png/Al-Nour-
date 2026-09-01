/**
 * AL-NOUREEN Tactile Haptic Feedback Utility
 * Supports mobile touch vibrations and user preference toggling via Profile settings.
 */

const HAPTICS_STORAGE_KEY = 'aln_haptics_enabled';

/**
 * Checks if haptics are enabled by user preference (defaults to true)
 */
export const getHapticsEnabled = (): boolean => {
  if (typeof window === 'undefined') return true;
  try {
    const stored = localStorage.getItem(HAPTICS_STORAGE_KEY);
    if (stored === null) return true;
    return stored === 'true';
  } catch {
    return true;
  }
};

/**
 * Sets user preference for haptic tactile feedback
 */
export const setHapticsEnabled = (enabled: boolean): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(HAPTICS_STORAGE_KEY, String(enabled));
    window.dispatchEvent(new CustomEvent('aln_haptics_changed', { detail: { enabled } }));
  } catch (e) {
    console.warn('Failed to save haptics setting:', e);
  }
};

/**
 * Triggers a vibration pattern if haptics are enabled and supported
 */
export const triggerHaptic = (pattern: number | number[] = 20): boolean => {
  if (!getHapticsEnabled()) {
    return false;
  }

  try {
    if (
      typeof window !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      'vibrate' in navigator &&
      typeof navigator.vibrate === 'function'
    ) {
      return navigator.vibrate(pattern);
    }
  } catch (e) {
    // Fail silently on unsupported platforms or restricted iframe permissions
  }
  return false;
};

/** Subtle click tap (15ms) */
export const hapticLight = () => triggerHaptic(15);

/** Add to Bag / Purchase confirmation pulse (25ms - 40ms - 25ms) */
export const hapticSuccess = () => triggerHaptic([25, 40, 25]);

/** Wishlist heart favorite toggle (20ms - 50ms - 20ms) */
export const hapticWishlist = () => triggerHaptic([20, 50, 20]);

/** Item removal / decrease / delete pulse */
export const hapticWarning = () => triggerHaptic([25, 50, 35]);
