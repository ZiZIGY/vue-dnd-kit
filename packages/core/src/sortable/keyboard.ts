import { getLayoutRect, offsetRect } from '../animation/layout';
import type { Rect } from '../types';

const isScrollable = (element: Element): boolean => {
  const style = getComputedStyle(element);
  const overflow = style.overflowY + style.overflowX;
  return (
    /auto|scroll|overlay/.test(overflow) &&
    (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth)
  );
};

/** Distance to scroll so that [start, end] fits in [min, max] (the start wins when it doesn't fit). */
const delta = (start: number, end: number, min: number, max: number): number => {
  if (start < min) return start - min;
  if (end > max) return Math.min(end - max, start - min);
  return 0;
};

const reveal = (rect: Rect, box: Rect, margin: number) => ({
  x: delta(rect.left - margin, rect.right + margin, box.left, box.right),
  y: delta(rect.top - margin, rect.bottom + margin, box.top, box.bottom),
});

/**
 * Keyboard sorting: brings the moved slot into view by scrolling its nearest scroll
 * container, then the window. Never `scrollIntoView`: it scrolls every ancestor at
 * once and fights virtualizers that correct their own scroll position.
 */
export const revealElement = (element: HTMLElement, margin = 8): void => {
  let rect = getLayoutRect(element);
  for (let parent = element.parentElement; parent; parent = parent.parentElement) {
    if (parent === document.body || parent === document.documentElement) break;
    if (!isScrollable(parent)) continue;
    const outer = parent.getBoundingClientRect();
    const top = outer.top + parent.clientTop;
    const left = outer.left + parent.clientLeft;
    const box: Rect = {
      top,
      left,
      width: parent.clientWidth,
      height: parent.clientHeight,
      right: left + parent.clientWidth,
      bottom: top + parent.clientHeight,
    };
    const { x, y } = reveal(rect, box, margin);
    if (x || y) {
      parent.scrollBy({ left: x, top: y, behavior: 'instant' });
      rect = offsetRect(rect, -x, -y);
    }
    break;
  }
  const viewport: Rect = {
    top: 0,
    left: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    right: window.innerWidth,
    bottom: window.innerHeight,
  };
  const { x, y } = reveal(rect, viewport, margin);
  if (x || y) window.scrollBy({ left: x, top: y, behavior: 'instant' });
};
