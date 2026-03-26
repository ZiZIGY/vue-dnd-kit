import { ref, readonly } from 'vue';

const STORAGE_KEY = 'vdnd-read-mode';

// Module-level ref — shared across all components without provide/inject
const isReadMode = ref(false);
let initialized = false;

export function useReadMode() {
  if (!initialized && typeof window !== 'undefined') {
    initialized = true;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      isReadMode.value = stored === 'true';
    } else {
      // Default ON for mobile (no heavy background on small screens)
      isReadMode.value = window.innerWidth < 768;
    }
  }

  function toggle() {
    isReadMode.value = !isReadMode.value;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, String(isReadMode.value));
    }
  }

  return { isReadMode: readonly(isReadMode), toggle };
}
