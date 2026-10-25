/**
 * FLIP for every change a sortable group makes: the items are measured before the
 * render a draft change causes and animated from there after it (`bump`). Changes the
 * library didn't cause (virtualizer re-measures) go through `captureLayout`.
 *
 * Only items near the visible area animate; far ones just move (rfcs/0001-v3.md §8). A
 * pass doesn't even look at the far ones: it goes over the near set, the items that were
 * near when all of them were last scanned. Scans run at the start and the end of a drag,
 * when a list moved or scrolled by half its visible size, and once the drafts may have
 * carried far items into view: a draft change moves items by the dragged block at most,
 * and the near margin is a whole scroller size.
 */

import { nextTick, watch } from 'vue';
import type { Key, Rect } from '../types';
import { fadeIn, flip, getRect, type FlipBatch, type FlipEntry } from '../animation/layout';
import { keysOf, listOfKey, type GroupContext, type Session } from './context';
import type { ListEntry } from './entry';

interface Snapshot {
  element: HTMLElement;
  rect: Rect;
}

/** A list where the near set was made: moved or scrolled further than its slack, it asks for a scan. */
interface Probe {
  element: HTMLElement;
  left: number;
  top: number;
  scrollLeft: number;
  scrollTop: number;
  /** Half the list's visible size: within that the near margin still covers what shows. */
  slackX: number;
  slackY: number;
}

export interface NearSet {
  keys: Set<Key>;
  /** The drag it was made for. */
  session: Session | null;
  probes: Probe[];
  /** Slots the items may still move by before a scan. */
  drift: number;
}

/** At most this many slots of drift between scans. */
const MAX_DRIFT = 8;

const NO_KEYS: ReadonlySet<Key> = new Set();

const probeList = (g: GroupContext, list: ListEntry): Probe[] => {
  const element = list.getElement();
  if (!element?.isConnected) return [];
  const { left, top } = getRect(element);
  const visible = g.manager.measureVisible(element);
  const { scrollLeft, scrollTop } = element;
  return [{ element, left, top, scrollLeft, scrollTop, slackX: (visible?.width ?? 0) / 2, slackY: (visible?.height ?? 0) / 2 }];
};

/** Its items moved with the list, or with its own scroll. */
const moved = ({ element, left, top, scrollLeft, scrollTop, slackX, slackY }: Probe) => {
  const rect = getRect(element);
  return (
    Math.abs(rect.left - left - element.scrollLeft + scrollLeft) > slackX + 0.5 ||
    Math.abs(rect.top - top - element.scrollTop + scrollTop) > slackY + 0.5
  );
};

/**
 * Slots of drift a near set made of `keys` can take: half a scroller size of items. A
 * list with far items has up to three sizes of near ones (its visible area and the margin
 * on each side); the one with the fewest sets the pace. Lists without far items, or
 * without near ones (their probes watch them), don't count.
 */
const driftFor = (g: GroupContext, keys: ReadonlySet<Key>): number => {
  const counts = new Map<ListEntry, number>();
  for (const key of keys) {
    const list = listOfKey(g, key, true);
    if (list) counts.set(list, (counts.get(list) ?? 0) + 1);
  }
  let fewest = Infinity;
  for (const [list, count] of counts) if (count < keysOf(list).length) fewest = Math.min(fewest, count);
  return Math.max(1, Math.min(MAX_DRIFT, Math.floor(fewest / 6)));
};

/** The near set still covers every item that may show after this pass. */
const holds = (g: GroupContext, near: NearSet): boolean => {
  if (near.session !== g.session.value) return false;
  near.drift -= g.session.value?.block.length ?? 1;
  return near.drift >= 0 && !near.probes.some(moved);
};

/** Visual rects of the items near the visible area, by key. */
const capture = (g: GroupContext): Map<Key, Snapshot> => {
  const { manager, items } = g;
  const snapshot = new Map<Key, Snapshot>();
  const near = g.near;
  if (near && holds(g, near)) {
    for (const key of near.keys) {
      const element = items.get(key)?.();
      if (element?.isConnected) {
        if (manager.isNearViewport(element)) snapshot.set(key, { element, rect: getRect(element) });
      } else if (!items.has(key)) {
        near.keys.delete(key);
      }
    }
    return snapshot;
  }
  const keys = new Set<Key>();
  for (const [key, getElement] of items) {
    const element = getElement();
    if (!element?.isConnected || !manager.isNearViewport(element)) continue;
    keys.add(key);
    snapshot.set(key, { element, rect: getRect(element) });
  }
  const probes = [...g.lists.values()].flatMap((list) => probeList(g, list));
  g.near = { keys, session: g.session.value, probes, drift: driftFor(g, keys) };
  return snapshot;
};

/**
 * Animates the items captured in `snapshot` to where the render put them. Of the items
 * the render created (`fresh`), a `'stack'` drag's others come back out of the overlay,
 * and the rest fade in with `fadeAppearing` (copies, items returning to their lists).
 */
const animate = (g: GroupContext, snapshot: Map<Key, Snapshot>, fresh: ReadonlySet<Key>, fadeAppearing: boolean) => {
  const { manager, items } = g;
  const byList = new Map<ListEntry, FlipEntry[]>();
  const add = (list: ListEntry, entry: FlipEntry) => {
    const entries = byList.get(list);
    if (entries) entries.push(entry);
    else byList.set(list, [entry]);
  };
  const appearing: Array<{ element: HTMLElement; list: ListEntry }> = [];
  const landing = manager.landingKey.value ?? manager.active.value?.id;
  const back = g.returning;
  g.returning = null;
  const pickup = g.gathering;
  g.gathering = false;
  // The overlay carries a clone of the item landing on `key` (multi-drag column).
  const carried = (key: Key) => key === landing || manager.overlayItems.has(manager.landings.value.get(key) ?? key);
  for (const [key, before] of snapshot) {
    const element = items.get(key)?.();
    if (!element?.isConnected) continue;
    const list = listOfKey(g, key, true);
    if (!list) continue;
    // A recreated element came from another list (a swap partner, a key a list didn't take).
    const crossing = before.element !== element;
    // The active slot entering another list was recreated: sliding it in from the
    // old list would be clipped by the new scroller, and the overlay shows it anyway.
    // The same goes for the items whose clones the overlay carries, except at pickup,
    // where the others visibly travel into the block.
    if (crossing && !pickup && carried(key)) continue;
    add(list, { key, element, first: before.rect, crossing });
  }
  for (const key of fresh) {
    const element = snapshot.has(key) ? null : items.get(key)?.();
    const list = element?.isConnected && listOfKey(g, key, true);
    if (!list) continue;
    g.near?.keys.add(key);
    if (back?.keys.has(key)) {
      // Multi-drag items coming back out of the overlay.
      add(list, { key, element: element!, first: back.from });
      appearing.push({ element: element!, list });
    } else if (fadeAppearing && key !== landing && manager.isNearViewport(element!)) {
      fadeIn(element!, list.animation());
    }
  }
  const batches: FlipBatch[] = [];
  for (const [list, entries] of byList) batches.push({ entries, option: list.animation() });
  flip(batches);
  for (const { element, list } of appearing) fadeIn(element, list.animation());
  manager.invalidateMeasurements();
  if (!g.session.value) g.near = null;
};

/** The drafts changed: a FLIP pass runs around the render. */
export const bump = (g: GroupContext) => {
  g.dragPass = true;
  g.version.value++;
};

/** Runs a FLIP pass around every render `bump` causes. Call inside the group's effect scope. */
export const watchLayout = (g: GroupContext) => {
  let snapshot = new Map<Key, Snapshot>();
  watch(
    g.version,
    () => {
      snapshot = capture(g);
      g.fresh = new Set();
    },
    { flush: 'pre' },
  );
  watch(
    g.version,
    () => {
      const fresh = g.fresh ?? NO_KEYS;
      g.fresh = null;
      g.dragPass = false;
      animate(g, snapshot, fresh, true);
    },
    { flush: 'post' },
  );
};

/** For layout changes the library didn't cause (virtualizer re-measures). Free while idle. */
export const captureLayout = (g: GroupContext) => {
  if (g.manager.status.value === 'idle') return;
  const snapshot = capture(g);
  void nextTick(() => animate(g, snapshot, NO_KEYS, false));
};
