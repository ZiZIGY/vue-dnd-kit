import type {
  IAutoScrollOptionsInternal,
  IScrollAdapter,
  TOverlayPoint,
} from '../types/auto-scroll';

const DEFAULT_THRESHOLD = 50;
const targetFPS = 144;
const frameTime = 1000 / targetFPS;

function normalizeThreshold(
  threshold?: IAutoScrollOptionsInternal['threshold']
): { top: number; right: number; bottom: number; left: number } {
  if (threshold == null) {
    return {
      top: DEFAULT_THRESHOLD,
      right: DEFAULT_THRESHOLD,
      bottom: DEFAULT_THRESHOLD,
      left: DEFAULT_THRESHOLD,
    };
  }
  if (typeof threshold === 'number') {
    return {
      top: threshold,
      right: threshold,
      bottom: threshold,
      left: threshold,
    };
  }
  return {
    top: threshold.top ?? DEFAULT_THRESHOLD,
    right: threshold.right ?? DEFAULT_THRESHOLD,
    bottom: threshold.bottom ?? DEFAULT_THRESHOLD,
    left: threshold.left ?? DEFAULT_THRESHOLD,
  };
}

export const defaultScrollAdapter: IScrollAdapter = {
  getScrollState(el) {
    return {
      scrollTop: el.scrollTop,
      scrollLeft: el.scrollLeft,
      rect: el.getBoundingClientRect(),
    };
  },
  setScroll(el, scrollTop, scrollLeft) {
    el.scrollTop = scrollTop;
    el.scrollLeft = scrollLeft;
  },
};

/**
 * Creates run/stop controller for auto-scroll loop. Element scroll only (no viewport).
 */
export function createAutoScrollController(
  containerRef: { value: HTMLElement | null },
  options: IAutoScrollOptionsInternal,
  getOverlayPoint: () => TOverlayPoint,
  scrollAdapter: IScrollAdapter = defaultScrollAdapter,
  isScrollingRef?: { value: boolean }
): { run: () => void; stop: () => void } {
  const { speed = 10, disabled = false } = options;
  const threshold = normalizeThreshold(options.threshold);

  let rafId: number | null = null;
  let lastTime: number | null = null;
  let lastRect: DOMRect | null = null;
  let lastScrollTop = 0;
  let lastScrollLeft = 0;

  const setScrolling = (value: boolean) => {
    if (isScrollingRef) isScrollingRef.value = value;
  };

  const performScroll = (timestamp: number) => {
    const el = containerRef.value;
    const point = getOverlayPoint();

    if (!el || !point || disabled) {
      setScrolling(false);
      return;
    }

    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;
    if (deltaTime < frameTime) {
      rafId = requestAnimationFrame(performScroll);
      return;
    }

    const currentSpeed = speed * (deltaTime / frameTime);
    lastTime = timestamp;

    const {
      scrollTop: currentScrollTop,
      scrollLeft: currentScrollLeft,
      rect,
    } = scrollAdapter.getScrollState(el);

    if (
      !lastRect ||
      lastScrollTop !== currentScrollTop ||
      lastScrollLeft !== currentScrollLeft
    ) {
      lastRect = rect;
      lastScrollTop = currentScrollTop;
      lastScrollLeft = currentScrollLeft;
    }

    let needsScroll = false;
    let newScrollTop = currentScrollTop;
    let newScrollLeft = currentScrollLeft;

    if (threshold.top > 0 && point.y - lastRect.top < threshold.top) {
      newScrollTop = currentScrollTop - currentSpeed;
      needsScroll = true;
    } else if (
      threshold.bottom > 0 &&
      lastRect.bottom - point.y < threshold.bottom
    ) {
      newScrollTop = currentScrollTop + currentSpeed;
      needsScroll = true;
    }
    if (threshold.left > 0 && point.x - lastRect.left < threshold.left) {
      newScrollLeft = currentScrollLeft - currentSpeed;
      needsScroll = true;
    } else if (
      threshold.right > 0 &&
      lastRect.right - point.x < threshold.right
    ) {
      newScrollLeft = currentScrollLeft + currentSpeed;
      needsScroll = true;
    }

    if (needsScroll) scrollAdapter.setScroll(el, newScrollTop, newScrollLeft);
    setScrolling(needsScroll);
    rafId = requestAnimationFrame(performScroll);
  };

  const stop = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    lastRect = null;
    lastScrollTop = 0;
    lastScrollLeft = 0;
    lastTime = null;
    setScrolling(false);
  };

  const run = () => {
    lastTime = null;
    rafId = requestAnimationFrame(performScroll);
  };

  return { run, stop };
}
