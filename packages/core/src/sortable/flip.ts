/**
 * FLIP for every change a sortable group makes: the items are measured before the
 * render a draft change causes and animated from there after it (`bump`). Changes the
 * library didn't cause (virtualizer re-measures) go through `captureLayout`.
 */

import { nextTick, watch } from 'vue';
import type { Key, Rect } from '../types';
import { fadeIn, flip, getRect, type FlipEntry } from '../animation/layout';
import { listOfKey, type GroupContext } from './context';
import type { ListEntry } from './entry';

interface Snapshot {
  element: HTMLElement;
  /** `null`: far from the viewport, the element jumps instead of animating. */
  rect: Rect | null;
}

const capture = (g: GroupContext): Map<Key, Snapshot> => {
  const snapshot = new Map<Key, Snapshot>();
  for (const [key, getElement] of g.items) {
    const element = getElement();
    if (!element?.isConnected) continue;
    snapshot.set(key, { element, rect: g.manager.isNearViewport(element) ? getRect(element) : null });
  }
  return snapshot;
};

const animate = (g: GroupContext, snapshot: Map<Key, Snapshot>, fadeAppearing: boolean) => {
  const { manager } = g;
  const byList = new Map<ListEntry, FlipEntry[]>();
  const appearing: Array<{ element: HTMLElement; list: ListEntry }> = [];
  const landing = manager.landingKey.value ?? manager.active.value?.id;
  const back = g.returning;
  g.returning = null;
  const pickup = g.gathering;
  g.gathering = false;
  // The overlay carries a clone of the item landing on `key` (multi-drag column).
  const carried = (key: Key) => key === landing || manager.overlayItems.has(manager.landings.value.get(key) ?? key);
  for (const [key, getElement] of g.items) {
    const before = snapshot.get(key);
    // Far from the viewport: it jumps instead of animating.
    if (before && !before.rect) continue;
    const element = getElement();
    if (!element?.isConnected) continue;
    const list = listOfKey(g, key, true);
    if (!list) continue;
    let first: Rect;
    let previous: HTMLElement;
    if (before?.rect) {
      first = before.rect;
      previous = before.element;
    } else if (back?.keys.has(key)) {
      // Multi-drag items coming back out of the overlay.
      first = back.from;
      previous = element;
      appearing.push({ element, list });
    } else {
      if (fadeAppearing && key !== landing) fadeIn(element, list.animation());
      continue;
    }
    // The active slot entering another list was recreated: sliding it in from the
    // old list would be clipped by the new scroller, and the overlay shows it anyway.
    // The same goes for the items whose clones the overlay carries, except at pickup,
    // where the others visibly travel into the block.
    if (previous !== element && !pickup && carried(key)) continue;
    const entries = byList.get(list) ?? [];
    // A recreated element came from another list (a swap partner, a key a list didn't take).
    entries.push({ key, element, first, crossing: previous !== element });
    byList.set(list, entries);
  }
  for (const [list, entries] of byList) flip(entries, list.animation());
  for (const { element, list } of appearing) fadeIn(element, list.animation());
  manager.invalidateMeasurements();
};

/** The drafts changed: a FLIP pass runs around the render. */
export const bump = (g: GroupContext) => g.version.value++;

/** Runs a FLIP pass around every render `bump` causes. Call inside the group's effect scope. */
export const watchLayout = (g: GroupContext) => {
  let snapshot = new Map<Key, Snapshot>();
  watch(g.version, () => (snapshot = capture(g)), { flush: 'pre' });
  watch(g.version, () => animate(g, snapshot, true), { flush: 'post' });
};

/** For layout changes the library didn't cause (virtualizer re-measures). Free while idle. */
export const captureLayout = (g: GroupContext) => {
  if (g.manager.status.value === 'idle') return;
  const snapshot = capture(g);
  void nextTick(() => animate(g, snapshot, false));
};
