/**
 * Scroll containers in the DOM: what scrolls and how far it can, read from computed
 * styles and scroll offsets, and relative scroll steps.
 */

import type { Rect } from '../../types';
import { createRect, getLayoutRect } from '../../animation/layout';
import { parentOf } from '../../utils/dom';
import { getRevealDelta, type Directions } from './math';

export interface ScrollStyle {
  x: boolean;
  y: boolean;
  /** Scroll offsets run from -max to 0 (RTL, `*-reverse` flex containers). */
  reverseX: boolean;
  reverseY: boolean;
  /** Has `scroll-snap-type`. */
  snap: boolean;
}

export interface Measured {
  /** Visible client area in viewport coordinates. */
  rect: Rect;
  canScroll: Directions;
}

const OVERFLOW = /^(auto|scroll|overlay)$/;

export const readScrollStyle = (element: Element): ScrollStyle => {
  const style = getComputedStyle(element);
  const flex = style.display.endsWith('flex');
  return {
    x: OVERFLOW.test(style.overflowX),
    y: OVERFLOW.test(style.overflowY),
    reverseX: (style.direction === 'rtl') !== (flex && style.flexDirection === 'row-reverse'),
    reverseY: flex && style.flexDirection === 'column-reverse',
    snap: hasSnapping(style),
  };
};

const hasSnapping = (style: CSSStyleDeclaration): boolean =>
  !!style.scrollSnapType && style.scrollSnapType !== 'none';

/** The page itself scrolls through the window, which is always the last candidate. */
export const isPageRoot = (element: Element): boolean =>
  element === document.body || element === document.documentElement;

/** Room to scroll backward/forward; 1px slack absorbs fractional offsets. */
const room = (position: number, max: number, reversed: boolean): [boolean, boolean] => {
  if (max < 1) return [false, false];
  const low = reversed ? -max : 0;
  const high = reversed ? 0 : max;
  return [position > low + 1, position < high - 1];
};

const clientRect = (element: Element): Rect => {
  const box = element.getBoundingClientRect();
  return createRect(
    box.left + element.clientLeft,
    box.top + element.clientTop,
    element.clientWidth,
    element.clientHeight,
  );
};

export const measureElement = (element: Element, style: ScrollStyle): Measured | null => {
  const maxX = style.x ? element.scrollWidth - element.clientWidth : 0;
  const maxY = style.y ? element.scrollHeight - element.clientHeight : 0;
  if (maxX < 1 && maxY < 1) return null;
  const [left, right] = room(element.scrollLeft, maxX, style.reverseX);
  const [up, down] = room(element.scrollTop, maxY, style.reverseY);
  return { rect: clientRect(element), canScroll: { up, down, left, right } };
};

/** How the page scrolls, read once per drag. */
export interface PageScroll {
  x: boolean;
  y: boolean;
  reverseX: boolean;
  /** `scroll-snap-type` on the root, which snaps the viewport. */
  snap: boolean;
}

export const readPageScroll = (): PageScroll => {
  const root = getComputedStyle(document.documentElement);
  const body = getComputedStyle(document.body);
  // `overflow` on <body> applies to the viewport when <html> leaves it visible.
  // A page locked with `hidden` (an open modal) can still be scrolled by script: don't.
  const allowed = (axis: 'overflowX' | 'overflowY') => {
    const value = root[axis] === 'visible' ? body[axis] : root[axis];
    return value !== 'hidden' && value !== 'clip';
  };
  return {
    x: allowed('overflowX'),
    y: allowed('overflowY'),
    reverseX: root.direction === 'rtl',
    snap: hasSnapping(root),
  };
};

export const measureWindow = (page: PageScroll): Measured => {
  const root = document.scrollingElement ?? document.documentElement;
  // The root's client size is the viewport without scrollbars.
  const { clientWidth: width, clientHeight: height } = document.documentElement;
  const [left, right] = page.x ? room(window.scrollX, root.scrollWidth - width, page.reverseX) : [false, false];
  const [up, down] = page.y ? room(window.scrollY, root.scrollHeight - height, false) : [false, false];
  return { rect: createRect(0, 0, width, height), canScroll: { up, down, left, right } };
};

export type Scroller = Element | Window;

export const scrollBy = (scroller: Scroller, left: number, top: number) => {
  // 'instant' overrides a page-level `scroll-behavior: smooth`, which would lag behind the loop.
  const options: ScrollToOptions = { left, top, behavior: 'instant' };
  if (scroller === window) window.scrollBy(options);
  else (scroller as Element).scrollBy(options);
};

/**
 * Scrolls the scrollers around `element` by relative steps until it is visible.
 * Not `scrollIntoView`: it jumps virtual lists and scrolls unrelated ancestors.
 * Runs once per key press, so reading after each write is fine. Uses the layout
 * rect: a keyboard-sorted slot is revealed right after its FLIP starts, and the
 * running `translate` would aim at where it came from.
 */
export const revealElement = (element: Element, margin = 8): void => {
  for (let node = parentOf(element); node && !isPageRoot(node); node = parentOf(node)) {
    const measured = measureElement(node, readScrollStyle(node));
    if (!measured) continue;
    const delta = getRevealDelta(getLayoutRect(element), measured.rect, margin);
    if (delta.x || delta.y) scrollBy(node, delta.x, delta.y);
  }
  const page = readPageScroll();
  const delta = getRevealDelta(getLayoutRect(element), measureWindow(page).rect, margin);
  const dx = page.x ? delta.x : 0;
  const dy = page.y ? delta.y : 0;
  if (dx || dy) scrollBy(window, dx, dy);
};
