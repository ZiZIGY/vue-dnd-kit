/**
 * Light or dark: the DevTools' when the tab runs in them (their `<html class="dark">`,
 * Vue's and Nuxt's alike, same origin), the system's otherwise; or the one chosen with the
 * toggle, kept in this browser.
 */

import { ref, watchEffect } from 'vue';

export type ThemeChoice = 'auto' | 'light' | 'dark';

const STORAGE_KEY = 'vue-dnd-kit-devtools:theme';

const stored = (): ThemeChoice => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : 'auto';
  } catch {
    return 'auto';
  }
};

/** The DevTools' document around the tab; `null` in a window of its own (or another origin). */
const host = (): Document | null => {
  try {
    return window.parent !== window ? window.parent.document : null;
  } catch {
    return null;
  }
};

export const choice = ref<ThemeChoice>(stored());
const hostDark = ref<boolean | null>(null);
const systemDark = ref(matchMedia('(prefers-color-scheme: dark)').matches);

export function useTheme(): void {
  const parent = host();
  if (parent) {
    const read = () => (hostDark.value = parent.documentElement.classList.contains('dark'));
    read();
    new MutationObserver(read).observe(parent.documentElement, { attributes: true, attributeFilter: ['class'] });
  }
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => (systemDark.value = event.matches));
  watchEffect(() => {
    const dark = choice.value === 'auto' ? (hostDark.value ?? systemDark.value) : choice.value === 'dark';
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  });
}

/** Auto → light → dark → auto. */
export const cycleTheme = (): void => {
  choice.value = choice.value === 'auto' ? 'light' : choice.value === 'light' ? 'dark' : 'auto';
  try {
    localStorage.setItem(STORAGE_KEY, choice.value);
  } catch {
    // Storage off: the choice lasts until the tab reloads.
  }
};
