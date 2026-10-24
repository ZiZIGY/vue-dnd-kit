import type { Rect } from '../types';
import { createRect, getWindowRect } from '../animation/layout';
import { parentOf } from './dom';

const clipsOverflow = (element: Element): boolean => {
  const style = getComputedStyle(element);
  // `overflow` doesn't apply to boxes that don't exist or are inline.
  if (style.display === 'contents' || style.display === 'inline') return false;
  return style.overflowX !== 'visible' || style.overflowY !== 'visible';
};

/**
 * Part of the viewport where `element` can be seen: the viewport intersected with
 * the client boxes of every ancestor that clips its overflow (scrollers). Rows a
 * virtualizer keeps mounted in its overscan, or pins, lie outside of it.
 */
export const getVisibleClip = (element: Element): Rect => {
  let { left, top, right, bottom } = getWindowRect();
  const { documentElement, body } = element.ownerDocument;
  for (
    let node = parentOf(element);
    node && node !== documentElement && node !== body;
    node = parentOf(node)
  ) {
    if (!clipsOverflow(node)) continue;
    const box = node.getBoundingClientRect();
    const x = box.left + node.clientLeft;
    const y = box.top + node.clientTop;
    left = Math.max(left, x);
    top = Math.max(top, y);
    right = Math.min(right, x + node.clientWidth);
    bottom = Math.min(bottom, y + node.clientHeight);
  }
  return createRect(left, top, Math.max(0, right - left), Math.max(0, bottom - top));
};

export const intersects = (a: Rect, b: Rect): boolean =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

/** Part of `rect` inside `clip`; `null` when nothing of it is. */
export const clipRect = (rect: Rect, clip: Rect): Rect | null => {
  if (!intersects(rect, clip)) return null;
  const left = Math.max(rect.left, clip.left);
  const top = Math.max(rect.top, clip.top);
  return createRect(left, top, Math.min(rect.right, clip.right) - left, Math.min(rect.bottom, clip.bottom) - top);
};
