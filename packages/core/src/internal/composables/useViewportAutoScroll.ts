import { shallowRef, watch } from 'vue';
import { onScopeDispose } from 'vue';
import { createAutoScrollController } from '../utils/auto-scroll';
import type {
  IAutoScrollOptionsInternal,
  IScrollAdapter,
} from '../types/auto-scroll';
import type { IDnDProviderInternal } from '../types/provider';

const viewportScrollAdapter: IScrollAdapter = {
  getScrollState() {
    return {
      scrollTop: window.scrollY ?? document.documentElement.scrollTop,
      scrollLeft: window.scrollX ?? document.documentElement.scrollLeft,
    };
  },
  setScroll(_, scrollTop, scrollLeft) {
    window.scrollTo(scrollLeft, scrollTop);
  },
  getRect() {
    return new DOMRect(0, 0, window.innerWidth, window.innerHeight);
  },
};

/** Viewport container for controller (adapter ignores element, only window is used). */
const viewportContainer = {
  get value(): HTMLElement | null {
    return typeof document !== 'undefined' ? document.documentElement : null;
  },
};

/**
 * Internal composable: viewport (window) auto-scroll. Not exposed to user.
 */
export function useViewportAutoScroll(
  provider: IDnDProviderInternal,
  options?: IAutoScrollOptionsInternal
) {
  const isScrolling = shallowRef(false);

  const getOverlayPoint = () => {
    if (provider.state.value !== 'dragging') return null;
    const position = provider.preview.position.value;
    const size = provider.preview.size.value;
    if (!position) return null;
    if (size?.width && size?.height) {
      return {
        x: position.x + size.width / 2,
        y: position.y + size.height / 2,
      };
    }
    return position;
  };

  const controller = createAutoScrollController(
    viewportContainer,
    options ?? {},
    getOverlayPoint,
    viewportScrollAdapter,
    isScrolling
  );

  const stopWatch = watch(
    () => provider.state.value,
    (state) => {
      if (state === 'dragging') controller.run();
      else controller.stop();
    }
  );

  const stop = () => {
    stopWatch();
    controller.stop();
  };

  onScopeDispose(stop);

  return { isScrolling, stop };
}
