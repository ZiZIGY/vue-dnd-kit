/**
 * Multi-drag animations that FLIP can't do on its own: in `'stack'` mode the other
 * dragged items unmount on pickup, so clones of them fly into the overlay instead.
 * The way back (cancel, reject, drop) is a regular FLIP from the overlay rect,
 * run by the group once the items have mounted again.
 */

import type { LayoutAnimation, Rect } from '../types';
import { clonePreview } from '../core/clone';
import {
  DEFAULT_LAYOUT_ANIMATION,
  canAnimate,
  getRect,
  getWindowRect,
  intersects,
  resolveAnimation,
} from '../animation/layout';

/** Clones beyond this count add cost without being noticeable. */
const MAX_GHOSTS = 12;

/**
 * Flies clones of `elements` into `overlay` and fades them out. Call it before the
 * drafts change, while the elements are still mounted.
 */
export const collapseIntoOverlay = (
  elements: HTMLElement[],
  overlay: Rect,
  option: LayoutAnimation | undefined,
): void => {
  const resolved = resolveAnimation(option, DEFAULT_LAYOUT_ANIMATION);
  if (!resolved || resolved.custom || typeof document === 'undefined') return;
  const viewport = getWindowRect();
  // All reads (rects, computed styles in clonePreview) happen before the first append. Each
  // clone gets the styles its source has in the list (`snapshot.ts`): ghosts fly in <body>.
  const ghosts = elements
    .map((element) => ({ element, rect: getRect(element) }))
    .filter(({ rect }) => rect.width > 0 && intersects(rect, viewport))
    .slice(0, MAX_GHOSTS)
    .map(({ element, rect }) => ({ ghost: clonePreview(element, { opaque: true }), rect }));

  for (const { ghost, rect } of ghosts) {
    if (!canAnimate(ghost)) continue;
    Object.assign(ghost.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      // The clone fills its box (100%): appended to <body>, it needs its own size.
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      zIndex: '9998',
      transformOrigin: '0 0',
      pointerEvents: 'none',
    });
    ghost.setAttribute('data-dnd-ghost', '');
    document.body.appendChild(ghost);
    const scale = `scale(${overlay.width / rect.width || 1}, ${overlay.height / rect.height || 1})`;
    const animation = ghost.animate(
      [
        { transform: `translate3d(${rect.left}px, ${rect.top}px, 0)`, opacity: 1 },
        { transform: `translate3d(${overlay.left}px, ${overlay.top}px, 0) ${scale}`, opacity: 0 },
      ],
      { ...resolved.options, fill: 'forwards' },
    );
    const remove = () => ghost.remove();
    animation.addEventListener('finish', remove);
    animation.addEventListener('cancel', remove);
  }
};
