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
  Rect,
  Size,
} from '../types';

interface LayoutAnimationState {
  animation: Animation;
  /** Layout rect the animation ends at. */
  to: Rect;
  /** From a user function: it may animate more than `translate`. */
  custom: boolean;
}

const layoutAnimations = new WeakMap<Element, LayoutAnimationState>();

const isRunning = (animation: Animation) =>
  animation.playState !== 'finished' && animation.playState !== 'idle';

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
  if (!state || state.animation.playState === 'finished') return rect;
  const { x, y } = parseTranslate(getComputedStyle(element).translate);
  return offsetRect(rect, -x, -y);
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

export const stopLayoutAnimation = (element: Element): void => {
  layoutAnimations.get(element)?.animation.cancel();
  layoutAnimations.delete(element);
};

const track = (element: Element, animation: Animation, to: Rect, custom: boolean) => {
  const state = { animation, to, custom };
  layoutAnimations.set(element, state);
  const release = () => {
    if (layoutAnimations.get(element) === state) layoutAnimations.delete(element);
  };
  animation.addEventListener('finish', release);
  animation.addEventListener('cancel', release);
};

const sameRect = (a: Rect, b: Rect) =>
  Math.abs(a.left - b.left) < 0.5 && Math.abs(a.top - b.top) < 0.5;

export interface FlipEntry {
  key: Key;
  element: HTMLElement;
  /** Visual rect captured before the change (including any running animation). */
  first: Rect;
}

/**
 * Animates elements from their captured rects to their current layout.
 * Reads happen in one pass before any write. An animation still heading to the
 * same layout rect keeps running; one whose target moved restarts from where the
 * element visually was.
 */
export const flip = (
  entries: FlipEntry[],
  option: LayoutAnimation | undefined,
): void => {
  const resolved = resolveAnimation(option, DEFAULT_LAYOUT_ANIMATION);
  // Writes first: whatever the measurement can't see through.
  cancelTransformTransitions(entries.map((entry) => entry.element));
  for (const { element } of entries) {
    if (!resolved || layoutAnimations.get(element)?.custom) stopLayoutAnimation(element);
  }
  if (!resolved) return;

  const measured = entries.map((entry) => ({ ...entry, last: getLayoutRect(entry.element) }));
  for (const { key, element, first, last } of measured) {
    const running = layoutAnimations.get(element);
    if (running && isRunning(running.animation) && sameRect(running.to, last)) continue;
    stopLayoutAnimation(element);
    const dx = first.left - last.left;
    const dy = first.top - last.top;
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue;
    if (resolved.custom) {
      const result = resolved.custom({
        key,
        element,
        from: first,
        to: last,
        options: resolved.options,
      });
      if (result && typeof (result as Animation).cancel === 'function') {
        track(element, result as Animation, last, true);
      }
      continue;
    }
    if (!canAnimate(element)) continue;
    track(
      element,
      element.animate(
        [{ translate: `${dx}px ${dy}px` }, { translate: '0px 0px' }],
        resolved.options,
      ),
      last,
      false,
    );
  }
};

/** Fade for elements that appear because of a drag change (returned multi-drag items, copies). */
export const fadeIn = (element: HTMLElement, option: LayoutAnimation | undefined): void => {
  const resolved = resolveAnimation(option, DEFAULT_LAYOUT_ANIMATION);
  if (!resolved || resolved.custom || !canAnimate(element)) return;
  element.animate([{ opacity: 0 }, { opacity: 1 }], resolved.options);
};
