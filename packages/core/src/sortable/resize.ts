/**
 * A list's own size follows its items (`animateSize`): when a render adds or takes an item
 * (a slot coming in, the drop, a change `animate` shows), the list grows or shrinks to its
 * new size instead of jumping. Measured before the render, animated after it, before the
 * items' FLIP measures them: the items of an outer list then move with it as it resizes.
 */

import type { AnimationOptions, LayoutAnimation } from '../types';
import { DEFAULT_LAYOUT_ANIMATION, canAnimate, resolveAnimation } from '../animation/layout';
import type { ListEntry } from './entry';
import type { GroupContext } from './context';

export interface SizeSnapshot {
  list: ListEntry;
  element: HTMLElement;
  /** Its layout size (`offsetWidth`, `offsetHeight`), as it shows: a resize under way included. */
  width: number;
  height: number;
}

/** The resize running on a list's element. */
const running = new WeakMap<Element, Animation>();

/** Sizes of `lists` near the visible area, before a render. */
export const captureSizes = (g: GroupContext, lists: Iterable<ListEntry>): SizeSnapshot[] => {
  const sizes: SizeSnapshot[] = [];
  for (const list of lists) {
    if (list.animateSize?.() === false) continue;
    const element = list.getElement();
    if (!element?.isConnected || !g.manager.isNearViewport(element)) continue;
    sizes.push({ list, element, width: element.offsetWidth, height: element.offsetHeight });
  }
  return sizes;
};

/** The CSS `width`/`height` for a layout size: less the padding and border of a `content-box`. */
const cssSize = (style: CSSStyleDeclaration, axis: 'width' | 'height', size: number) => {
  if (style.boxSizing === 'border-box') return size;
  const [a, b] = axis === 'width' ? (['Left', 'Right'] as const) : (['Top', 'Bottom'] as const);
  const box = (name: string) => parseFloat(style.getPropertyValue(name)) || 0;
  return size - box(`padding-${a.toLowerCase()}`) - box(`padding-${b.toLowerCase()}`) - box(`border-${a.toLowerCase()}-width`) - box(`border-${b.toLowerCase()}-width`);
};

/**
 * After the render: each list that changed size grows or shrinks to it from where it was,
 * with its animation's duration and easing (`option`; a custom function: the defaults).
 */
export const animateSizes = (sizes: SizeSnapshot[], option: (list: ListEntry) => LayoutAnimation | AnimationOptions | boolean | undefined) => {
  for (const { list, element, width, height } of sizes) {
    if (!element.isConnected || !canAnimate(element)) continue;
    // Its size as the render left it, not as a resize under way shows it.
    running.get(element)?.cancel();
    running.delete(element);
    const to = { width: element.offsetWidth, height: element.offsetHeight };
    const changed = (['width', 'height'] as const).filter((axis) => Math.abs(to[axis] - (axis === 'width' ? width : height)) >= 1);
    if (!changed.length) continue;
    const resolved = resolveAnimation(option(list), DEFAULT_LAYOUT_ANIMATION);
    if (!resolved) continue;
    const style = getComputedStyle(element);
    const from: Keyframe = {};
    const end: Keyframe = {};
    for (const axis of changed) {
      from[axis] = `${cssSize(style, axis, axis === 'width' ? width : height)}px`;
      end[axis] = `${cssSize(style, axis, to[axis])}px`;
    }
    const { duration, easing } = resolved.options;
    const animation = element.animate([from, end], { duration, easing });
    running.set(element, animation);
    animation.addEventListener('finish', () => running.get(element) === animation && running.delete(element));
  }
};
