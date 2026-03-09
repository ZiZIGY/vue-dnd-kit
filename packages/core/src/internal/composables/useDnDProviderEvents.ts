import { onBeforeUnmount, onMounted, watch } from 'vue';

import type { IDnDProviderInternal } from '../types/provider';
import { createPointerHandlers } from '../logic/pointer';
import { handleKeyboardEvents } from '../logic/keyboard';
import { handleScrollEvent } from '../logic/scroll';
import { useViewportAutoScroll } from './useViewportAutoScroll';

export const useDnDProviderEvents = (provider: IDnDProviderInternal) => {
  const handlers = createPointerHandlers(provider);
  const keyDown = handleKeyboardEvents.keyDown(provider);
  const keyUp = handleKeyboardEvents.keyUp(provider);
  const clear = handleKeyboardEvents.clear(provider);
  const scrollHandler = handleScrollEvent(provider);

  let viewportScrollStop: (() => void) | null = null;

  watch(
    provider.autoScrollViewport,
    (autoScrollViewport) => {
      viewportScrollStop?.();
      viewportScrollStop = null;
      if (
        autoScrollViewport === true ||
        (autoScrollViewport && typeof autoScrollViewport === 'object')
      ) {
        const result = useViewportAutoScroll(
          provider,
          autoScrollViewport === true ? {} : autoScrollViewport
        );
        viewportScrollStop = result.stop;
      }
    },
    { immediate: true }
  );

  onMounted(() => {
    document.addEventListener('pointerdown', handlers.pointerDown);
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
    document.addEventListener('blur', clear);
    document.addEventListener('scroll', scrollHandler, true);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handlers.pointerDown);
    document.removeEventListener('pointerup', handlers.pointerUp);
    document.removeEventListener('pointermove', handlers.pointerMove);
    document.removeEventListener('keydown', keyDown);
    document.removeEventListener('keyup', keyUp);
    document.removeEventListener('blur', clear);
    document.removeEventListener('scroll', scrollHandler, true);

    viewportScrollStop?.();
    handlers.cleanup();
  });
};
