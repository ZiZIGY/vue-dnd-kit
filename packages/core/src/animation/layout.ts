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
} from '../types';

const layoutAnimations = new WeakMap<Element, Animation>();

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

export const containsPoint = (rect: Rect, point: Coordinates): boolean =>
  point.x >= rect.left &&
  point.x <= rect.right &&
  point.y >= rect.top &&
  point.y <= rect.bottom;

export const getCenter = (rect: Rect): Coordinates => ({
  x: rect.left + rect.width / 2,
  y: rect.top + rect.height / 2,
});

export const getWindowRect = (): Rect =>
  createRect(0, 0, window.innerWidth, window.innerHeight);

const parseTranslate = (value: string): Coordinates => {
  if (!value || value === 'none') return { x: 0, y: 0 };
  const [x = '0', y = '0'] = value.split(' ');
  return { x: parseFloat(x) || 0, y: parseFloat(y) || 0 };
};

/** Rect of the element without its in-flight layout animation. */
export const getLayoutRect = (element: Element): Rect => {
  const rect = getRect(element);
  const animation = layoutAnimations.get(element);
  if (!animation || animation.playState === 'finished') return rect;
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

const cancelTransformTransitions = (element: Element) => {
  if (typeof CSSTransition === 'undefined' || !canAnimate(element)) return;
  for (const animation of element.getAnimations()) {
    if (
      animation instanceof CSSTransition &&
      (animation.transitionProperty === 'transform' ||
        animation.transitionProperty === 'translate')
    ) {
      animation.cancel();
    }
  }
};

export const stopLayoutAnimation = (element: Element): void => {
  layoutAnimations.get(element)?.cancel();
  layoutAnimations.delete(element);
};

const track = (element: Element, animation: Animation) => {
  layoutAnimations.set(element, animation);
  const release = () => {
    if (layoutAnimations.get(element) === animation) layoutAnimations.delete(element);
  };
  animation.addEventListener('finish', release);
  animation.addEventListener('cancel', release);
};

export interface FlipEntry {
  key: Key;
  element: HTMLElement;
  /** Visual rect captured before the change (including any running animation). */
  first: Rect;
}

/**
 * Animates elements from their captured rects to their current layout.
 * Reads happen in one pass before any write; interrupted animations restart
 * from where the element visually was.
 */
export const flip = (
  entries: FlipEntry[],
  option: LayoutAnimation | undefined,
): void => {
  const resolved = resolveAnimation(option, DEFAULT_LAYOUT_ANIMATION);
  for (const { element } of entries) {
    stopLayoutAnimation(element);
    cancelTransformTransitions(element);
  }
  if (!resolved) return;

  const measured = entries.map((entry) => ({ ...entry, last: getRect(entry.element) }));
  for (const { key, element, first, last } of measured) {
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
        track(element, result as Animation);
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
    );
  }
};

/** Fade for elements that appear because of a drag change (returned multi-drag items, copies). */
export const fadeIn = (element: HTMLElement, option: LayoutAnimation | undefined): void => {
  const resolved = resolveAnimation(option, DEFAULT_LAYOUT_ANIMATION);
  if (!resolved || resolved.custom || !canAnimate(element)) return;
  element.animate([{ opacity: 0 }, { opacity: 1 }], resolved.options);
};
