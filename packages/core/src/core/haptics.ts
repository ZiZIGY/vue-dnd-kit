/**
 * Haptic feedback for touch drags (`haptics` option): a short vibration when the long
 * press turns into a drag, and on request when the drag enters an accepting target, drops
 * or is refused. Only drags started by touch vibrate. Browsers without
 * `navigator.vibrate` (iOS Safari) do nothing, and nothing is tried before the user has
 * interacted with the page: the browser would block it and log a warning.
 */

import type { HapticPattern, HapticsOptions } from '../types';

export type HapticEvent = keyof HapticsOptions;

/** What `true` stands for. */
const DEFAULT_PATTERNS: Record<HapticEvent, number | number[]> = {
  start: 10,
  enter: 10,
  drop: 10,
  refuse: [20, 40, 20],
};

/** The vibration for `event` under the provider's `haptics` option; `null`: none. */
export const resolveHaptic = (
  option: boolean | HapticsOptions | undefined,
  event: HapticEvent,
): number | number[] | null => {
  if (option === false) return null;
  const byDefault = event === 'start';
  const value: HapticPattern = typeof option === 'object' ? (option[event] ?? byDefault) : byDefault;
  if (value === true) return DEFAULT_PATTERNS[event];
  if (value === false || value === 0 || (Array.isArray(value) && !value.length)) return null;
  return value;
};

/** Vibrates for `event` of a drag (see the module comment); `touch`: the drag was started by touch. */
export const vibrate = (option: boolean | HapticsOptions | undefined, event: HapticEvent, touch: boolean): void => {
  if (!touch || typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
  // Blocked without a tap on the page so far (Chromium logs an intervention).
  if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
  const pattern = resolveHaptic(option, event);
  if (pattern === null) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // Some embedders throw instead of ignoring it.
  }
};
