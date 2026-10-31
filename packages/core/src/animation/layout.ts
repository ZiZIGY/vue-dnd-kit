/**
 * Geometry and the FLIP engine shared by every layer.
 * Layout animations run on the CSS `translate` property, so they compose with
 * `transform` set by the user or by virtualizers.
 */

import type {
  AnimationOptions,
  Coordinates,
  Key,
  LayoutAnimation,
  LayoutAnimationContext,
  Rect,
  Size,
} from '../types';
import { parentOf } from '../utils/dom';

interface LayoutAnimationState {
  /** Ends it early: cancels the animation, aborts a custom function's signal. */
  stop(): void;
  running(): boolean;
  /** Layout rect the animation ends at. */
  to: Rect;
  /** From a user function: it may animate more than `translate`. */
  custom: boolean;
  /** Slides in from another list: it ignores the pointer meanwhile (see `FlipEntry.crossing`). */
  crossing?: boolean;
}

const layoutAnimations = new WeakMap<Element, LayoutAnimationState>();

const isRunning = (animation: Animation) =>
  animation.playState !== 'finished' && animation.playState !== 'idle';

/** What a custom animation function returned is a WAAPI `Animation` (or acts like one). */
const isAnimation = (value: unknown): value is Animation =>
  !!value &&
  typeof (value as Animation).cancel === 'function' &&
  typeof (value as Animation).addEventListener === 'function';

const noop = () => {};

/**
 * Settles when what an animation function returned has ended: an `Animation` finished
 * or cancelled, a promise (or a thenable, e.g. a GSAP tween) settled, anything with a
 * `finished` promise (motion's controls) done; at once for anything else. Never rejects.
 */
const ended = (result: unknown): Promise<void> => {
  const finished = (result as { finished?: unknown } | null | undefined)?.finished;
  const done = finished && typeof (finished as PromiseLike<unknown>).then === 'function' ? finished : result;
  return Promise.resolve(done).then(noop, noop);
};

/** Margin over an animation's duration after which it counts as ended anyway. */
export const STALL_MARGIN = 1000;

/**
 * Waits for an animation (see `ended`), but never longer than `timeout`: one that never
 * settles (a stalled compositor, a custom function that never resolves) must not hold
 * up what waits for it, such as a drop (rfcs/0001-v3.md §13).
 */
export const settle = async (result: unknown, timeout: number): Promise<void> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([ended(result), new Promise((resolve) => (timer = setTimeout(resolve, timeout)))]);
  } finally {
    clearTimeout(timer);
  }
};

export const DEFAULT_LAYOUT_ANIMATION: Required<AnimationOptions> = {
  duration: 200,
  easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
};

export const createRect = (
  left: number,
  top: number,
  width: number,
  height: number,
): Rect => ({ left, top, width, height, right: left + width, bottom: top + height });

export const toRect = (rect: DOMRectReadOnly | Rect): Rect =>
  createRect(rect.left, rect.top, rect.width, rect.height);

export const getRect = (element: Element): Rect =>
  toRect(element.getBoundingClientRect());

export const offsetRect = (rect: Rect, x: number, y: number): Rect =>
  createRect(rect.left + x, rect.top + y, rect.width, rect.height);

/** Overlap of two rects; `null` when they don't overlap. */
export const intersectRect = (a: Rect, b: Rect): Rect | null => {
  const left = Math.max(a.left, b.left);
  const top = Math.max(a.top, b.top);
  const right = Math.min(a.right, b.right);
  const bottom = Math.min(a.bottom, b.bottom);
  return right > left && bottom > top ? createRect(left, top, right - left, bottom - top) : null;
};

/** Overlap test: touching edges don't count, a zero-width rect crossing the other does. */
export const intersects = (a: Rect, b: Rect): boolean =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

/** Smallest rect containing both. */
export const unionRect = (a: Rect, b: Rect): Rect => {
  const left = Math.min(a.left, b.left);
  const top = Math.min(a.top, b.top);
  return createRect(left, top, Math.max(a.right, b.right) - left, Math.max(a.bottom, b.bottom) - top);
};

/** `rect` grown by `x` and `y` on each side. */
export const expandRect = (rect: Rect, x: number, y: number): Rect =>
  createRect(rect.left - x, rect.top - y, rect.width + 2 * x, rect.height + 2 * y);

export const containsPoint = (rect: Rect, point: Coordinates): boolean =>
  point.x >= rect.left &&
  point.x <= rect.right &&
  point.y >= rect.top &&
  point.y <= rect.bottom;

export const getCenter = (rect: Rect): Coordinates => ({
  x: rect.left + rect.width / 2,
  y: rect.top + rect.height / 2,
});

export const distance = (a: Coordinates, b: Coordinates): number => Math.hypot(a.x - b.x, a.y - b.y);

export const getWindowRect = (): Rect =>
  createRect(0, 0, window.innerWidth, window.innerHeight);

/** Where `point` lies in `rect`, as fractions of its size: 0 at the left/top edge, 1 at the right/bottom. */
export const getFraction = (rect: Rect, point: Coordinates): Coordinates => ({
  x: rect.width ? (point.x - rect.left) / rect.width : 0,
  y: rect.height ? (point.y - rect.top) / rect.height : 0,
});

/** `rect` resized to `size` around the point at `fraction` of it: that point keeps its fraction. */
export const resizeAround = (rect: Rect, size: Size, fraction: Coordinates): Rect =>
  createRect(
    rect.left + (rect.width - size.width) * fraction.x,
    rect.top + (rect.height - size.height) * fraction.y,
    size.width,
    size.height,
  );

const parseTranslate = (value: string): Coordinates => {
  if (!value || value === 'none') return { x: 0, y: 0 };
  const [x = '0', y = '0'] = value.split(' ');
  return { x: parseFloat(x) || 0, y: parseFloat(y) || 0 };
};

/** Rect of the element without its in-flight layout animation. */
export const getLayoutRect = (element: Element): Rect => {
  const rect = getRect(element);
  const state = layoutAnimations.get(element);
  if (!state?.running()) return rect;
  const { x, y } = parseTranslate(getComputedStyle(element).translate);
  return offsetRect(rect, -x, -y);
};

/** A layout animation moving an element now (`layoutShifts`), and how far it has it moved. */
export interface LayoutShift {
  /** Which animation: a new one is a new object. */
  animation: object;
  offset: Coordinates;
}

/**
 * The layout animations in flight that move the element: its own and its ancestors' (flat
 * tree), each with its current `translate`. Walks every ancestor.
 */
export const layoutShifts = (element: Element): LayoutShift[] => {
  const shifts: LayoutShift[] = [];
  for (let node: Element | null = element; node; node = parentOf(node)) {
    const animation = layoutAnimations.get(node);
    if (animation?.running()) shifts.push({ animation, offset: parseTranslate(getComputedStyle(node).translate) });
  }
  return shifts;
};

/**
 * Where the element will be once the layout animations in flight have ended: its own and
 * its ancestors' (flat tree). An item of a list nested in another list's item (a field in
 * a form section, a card in a kanban column) slides along with that item after a drop.
 * Walks every ancestor: for landings, not for per-frame measuring.
 */
export const getSettledRect = (element: Element): Rect => {
  let x = 0;
  let y = 0;
  for (const { offset } of layoutShifts(element)) {
    x += offset.x;
    y += offset.y;
  }
  return offsetRect(getRect(element), -x, -y);
};

export const prefersReducedMotion = (): boolean =>
  typeof matchMedia !== 'undefined' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches;

export const canAnimate = (element: Element): boolean =>
  typeof (element as HTMLElement).animate === 'function';

/** Resolves `true | false | options | fn` into options + optional custom function. */
export const resolveAnimation = <TFn extends (...args: never[]) => unknown>(
  option: boolean | AnimationOptions | TFn | undefined,
  defaults: Required<AnimationOptions>,
): { options: Required<AnimationOptions>; custom: TFn | null } | null => {
  if (option === false) return null;
  if (typeof option === 'function') return { options: defaults, custom: option };
  const options = { ...defaults, ...(option === true ? {} : option) };
  if (options.duration <= 0 || prefersReducedMotion()) return null;
  return { options, custom: null };
};

/**
 * Cancels CSS transitions on `transform`/`translate` of `elements`: they would
 * distort the measurement. `Element.getAnimations()` scans every animation of the
 * document, so one call per element is quadratic while many FLIP animations run;
 * one `getAnimations()` per document or shadow root is linear.
 */
const cancelTransformTransitions = (elements: Element[]) => {
  if (typeof CSSTransition === 'undefined' || !elements.length) return;
  const targets = new Set<Element | null>(elements);
  const roots = new Set<Document | ShadowRoot>();
  for (const element of elements) {
    const root = element.getRootNode() as Partial<Document | ShadowRoot>;
    if (typeof root.getAnimations === 'function') roots.add(root as Document | ShadowRoot);
  }
  for (const root of roots) {
    for (const animation of root.getAnimations()) {
      if (
        animation instanceof CSSTransition &&
        (animation.transitionProperty === 'transform' ||
          animation.transitionProperty === 'translate') &&
        targets.has((animation.effect as KeyframeEffect | null)?.target ?? null)
      ) {
        animation.cancel();
      }
    }
  }
};

const release = (element: HTMLElement, state: LayoutAnimationState) => {
  if (layoutAnimations.get(element) !== state) return;
  layoutAnimations.delete(element);
  if (state.crossing) element.style.pointerEvents = '';
};

export const stopLayoutAnimation = (element: Element): void => {
  const state = layoutAnimations.get(element);
  if (!state) return;
  release(element as HTMLElement, state);
  state.stop();
};

const track = (element: HTMLElement, state: LayoutAnimationState) => {
  layoutAnimations.set(element, state);
  if (state.crossing) element.style.pointerEvents = 'none';
};

/** Keeps a WAAPI animation of `element` (ours, or a custom function's) until it ends. */
const trackAnimation = (
  element: HTMLElement,
  animation: Animation,
  state: Omit<LayoutAnimationState, 'stop' | 'running'>,
  abort?: AbortController,
) => {
  const tracked: LayoutAnimationState = {
    ...state,
    stop: () => {
      animation.cancel();
      abort?.abort();
    },
    running: () => isRunning(animation),
  };
  track(element, tracked);
  animation.addEventListener('finish', () => release(element, tracked));
  animation.addEventListener('cancel', () => release(element, tracked));
};

/**
 * Keeps what a custom function returned until it ends (see `ended`): an `Animation`, or
 * a promise whose animation only the function's `signal` can stop.
 */
const trackCustom = (
  element: HTMLElement,
  result: unknown,
  abort: AbortController,
  state: Omit<LayoutAnimationState, 'stop' | 'running' | 'custom'>,
) => {
  if (isAnimation(result)) return trackAnimation(element, result, { ...state, custom: true }, abort);
  if (!result || typeof result !== 'object') return;
  let settled = false;
  const tracked: LayoutAnimationState = {
    ...state,
    custom: true,
    stop: () => abort.abort(),
    running: () => !settled,
  };
  track(element, tracked);
  void ended(result).then(() => {
    settled = true;
    release(element, tracked);
  });
};

const sameRect = (a: Rect, b: Rect) =>
  Math.abs(a.left - b.left) < 0.5 && Math.abs(a.top - b.top) < 0.5;

export interface FlipEntry {
  key: Key;
  element: HTMLElement;
  /** Visual rect captured before the change (including any running animation). */
  first: Rect;
  /**
   * Slides in from another list (a swap partner, an item a list didn't take): it ignores
   * the pointer until it lands, or hit tests over the lists it crosses would find it.
   */
  crossing?: boolean;
}

/** Entries animated with one option: the items of one list. */
export interface FlipBatch {
  entries: FlipEntry[];
  option: LayoutAnimation | undefined;
  /** Timing for `true` and for custom functions. Default `DEFAULT_LAYOUT_ANIMATION`. */
  defaults?: Required<AnimationOptions>;
}

/**
 * Animates elements from their captured rects to their current layout, a batch per list.
 * Every layout read happens in one pass before any animation starts. An animation still
 * heading to the same layout rect keeps running; one whose target moved restarts from
 * where the element visually was. A custom function's animation restarts every time:
 * its offset in flight can't be told apart from the layout.
 */
export const flip = (batches: FlipBatch[], reason: LayoutAnimationContext['reason'] = 'drag'): void => {
  // Writes first: whatever the measurement can't see through.
  cancelTransformTransitions(batches.flatMap(({ entries }) => entries.map((entry) => entry.element)));
  const runs = batches.map(({ entries, option, defaults }) => {
    const resolved = resolveAnimation(option, defaults ?? DEFAULT_LAYOUT_ANIMATION);
    for (const { element } of entries) {
      if (!resolved || layoutAnimations.get(element)?.custom) stopLayoutAnimation(element);
    }
    return resolved && { resolved, entries };
  });
  const measured = runs.map((run) => run?.entries.map((entry) => getLayoutRect(entry.element)));
  const reducedMotion = prefersReducedMotion();

  runs.forEach((run, index) => {
    if (!run) return;
    const { resolved, entries } = run;
    entries.forEach(({ key, element, first, crossing }, at) => {
      const last = measured[index]![at]!;
      const running = layoutAnimations.get(element);
      if (running?.running() && sameRect(running.to, last)) return;
      // Interrupted on its way in from another list, it keeps ignoring the pointer.
      const passing = !!crossing || (!!running?.crossing && running.running());
      stopLayoutAnimation(element);
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
      if (resolved.custom) {
        const abort = new AbortController();
        const { options } = resolved;
        const result = resolved.custom({
          key,
          element,
          from: first,
          to: last,
          options,
          reason,
          signal: abort.signal,
          reducedMotion,
        });
        trackCustom(element, result, abort, { to: last, crossing: passing });
        return;
      }
      if (!canAnimate(element)) return;
      const animation = element.animate([{ translate: `${dx}px ${dy}px` }, { translate: '0px 0px' }], resolved.options);
      trackAnimation(element, animation, { to: last, custom: false, crossing: passing });
    });
  });
};

/** Fade for elements that appear because of a drag change (returned multi-drag items, copies). */
export const fadeIn = (element: HTMLElement, option: LayoutAnimation | undefined): void => {
  const resolved = resolveAnimation(option, DEFAULT_LAYOUT_ANIMATION);
  if (!resolved || resolved.custom || !canAnimate(element)) return;
  element.animate([{ opacity: 0 }, { opacity: 1 }], resolved.options);
};
