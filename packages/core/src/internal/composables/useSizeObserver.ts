import { ref, watch, type Ref } from 'vue';
import { createSizeObserver } from '../utils/observer';

/**
 * Tracks element size via ResizeObserver, writes to returned ref
 *
 * @param elementRef - Ref to element to observe
 * @returns { overlaySize, overlaySizeObserver } — ref with { width, height } and cleanup
 */

export const useSizeObserver = (
  elementRef: Ref<HTMLElement | null>
) => {
  const overlaySize = ref<DOMRect | null>(null);
  const observer = createSizeObserver(overlaySize);

  const stopWatch = watch(
    elementRef,
    (el) => {
      observer.disconnect();
      if (el) observer.observe(el);
    },
    { immediate: true }
  );

  const overlaySizeObserver = {
    disconnect: () => {
      stopWatch();
      observer.disconnect();
    },
  };

  return { overlaySize, overlaySizeObserver };
};
