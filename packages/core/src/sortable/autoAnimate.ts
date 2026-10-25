/**
 * `animate` (rfcs/0001-v3.md §8): changes of a list's items that no drag made animate. A
 * list with it on watches its keys; a change measures the list's items near the visible
 * area before it renders, and once it has rendered moves them to their new places (FLIP,
 * across lists of the group too), fades in the items the render created and plays the
 * exit of the items it removed (`animation/presence.ts`). With it off, nothing runs.
 *
 * A drag's changes are the drag's own: drafts show while it runs, and its FLIP pass
 * animates the drop. Unmounted rows of a virtual list have nothing to animate.
 */

import { computed, nextTick, watch, type WatchHandle } from 'vue';
import type { Key, Rect } from '../types';
import { NEAR_VIEWPORT } from '../core/measure';
import { expandRect, flip, getRect, intersects, type FlipBatch, type FlipEntry } from '../animation/layout';
import { enter, leave, resolveAutoAnimation, type AutoAnimationParts, type Leaving } from '../animation/presence';
import { indexMap, listOfKey, sameKeys, type GroupContext } from './context';
import type { ListEntry } from './entry';

interface Captured {
  element: HTMLElement;
  /** Visual rect before the change. */
  rect: Rect;
  parent: Element | null;
  list: ListEntry;
}

export interface AutoPass {
  /** Lists whose items changed, with their `animate` and the keys they showed before. */
  lists: Map<ListEntry, { parts: AutoAnimationParts; previous: readonly Key[] }>;
  /** Items of those lists that were near the visible area before the change. */
  snapshot: Map<Key, Captured>;
}

const NO_KEYS: ReadonlySet<Key> = new Set();

/** The visible area of `list` grown by the near margin; `null` when none of it shows. */
const nearRegion = (g: GroupContext, list: ListEntry): Rect | null => {
  const element = list.getElement();
  const visible = element?.isConnected ? g.manager.measureVisible(element) : null;
  return visible && expandRect(visible, visible.width * NEAR_VIEWPORT, visible.height * NEAR_VIEWPORT);
};

/** Before the change renders: the items `list` showed (`previous`) near the visible area. */
const measure = (g: GroupContext, list: ListEntry, previous: readonly Key[]) => {
  // Drafts show while a drag runs, and its own FLIP pass animates the drop's writes.
  if (g.dragPass || g.session.value) return;
  const parts = resolveAutoAnimation(list.animate?.());
  if (!parts) return;
  let pass = g.auto;
  if (!pass) {
    const created: AutoPass = (pass = g.auto = { lists: new Map(), snapshot: new Map() });
    g.fresh ??= new Set();
    // The render may unmount this list before its post-flush watcher plays the pass.
    void nextTick(() => {
      if (g.auto !== created) return;
      g.auto = null;
      g.fresh = null;
    });
  }
  pass.lists.set(list, { parts, previous });
  const region = nearRegion(g, list);
  if (!region) return;
  for (const key of previous) {
    const element = g.items.get(key)?.();
    if (!element?.isConnected) continue;
    const rect = getRect(element);
    if (intersects(rect, region)) pass.snapshot.set(key, { element, rect, parent: element.parentElement, list });
  }
};

/** After the render: moves, entrances and exits of the lists in the pass. */
const play = (g: GroupContext) => {
  const pass = g.auto;
  // No pass: the render was a drag's, whose own FLIP pass reads `fresh`.
  if (!pass) return;
  const fresh = g.fresh ?? NO_KEYS;
  g.auto = null;
  g.fresh = null;
  const { lists, snapshot } = pass;
  const moves = new Map<ListEntry, FlipEntry[]>();
  const leaving = new Map<ListEntry, Leaving[]>();
  const comeBack = (key: Key) => {
    g.leaving.get(key)?.();
    g.leaving.delete(key);
  };

  for (const [key, before] of snapshot) {
    const element = g.items.get(key)?.();
    if (element?.isConnected) {
      // A recreated element moved here from another list.
      const list = element === before.element ? before.list : listOfKey(g, key, false);
      const move = list && lists.get(list)?.parts.move;
      if (!move || move.option === false) continue;
      comeBack(key);
      const entries = moves.get(list) ?? [];
      entries.push({ key, element, first: before.rect, crossing: element !== before.element });
      moves.set(list, entries);
    } else if (!listOfKey(g, key, false) && lists.get(before.list)?.parts.leave) {
      // Gone from every list of the group (still in one: a virtual list unmounted its row).
      const parent = before.parent?.isConnected ? before.parent : before.list.getElement();
      if (!parent) continue;
      const items = leaving.get(before.list) ?? [];
      items.push({ key, element: before.element, parent, from: before.rect });
      leaving.set(before.list, items);
    }
  }

  // Items the render created that no list showed before: a virtual list's newly mounted
  // rows were there all along.
  const entering: Array<{ key: Key; element: HTMLElement; to: Rect; parts: AutoAnimationParts }> = [];
  const regions = new Map<ListEntry, Rect | null>();
  for (const key of fresh) {
    if (snapshot.has(key)) continue;
    const element = g.items.get(key)?.();
    const list = element?.isConnected ? listOfKey(g, key, false) : undefined;
    const parts = list && lists.get(list)?.parts;
    if (!list || !parts?.enter) continue;
    if ([...lists.values()].some(({ previous }) => indexMap(g, previous).has(key))) continue;
    if (!regions.has(list)) regions.set(list, nearRegion(g, list));
    const region = regions.get(list);
    const to = getRect(element!);
    if (region && intersects(to, region)) entering.push({ key, element: element!, to, parts });
  }

  const batches: FlipBatch[] = [];
  for (const [list, entries] of moves) {
    const { option, defaults } = lists.get(list)!.parts.move;
    batches.push({ entries, option, defaults });
  }
  flip(batches, 'change');
  for (const { key, element, to, parts } of entering) {
    comeBack(key);
    enter(parts.enter!, key, element, to);
  }
  for (const [list, items] of leaving) {
    for (const [key, { remove, ended }] of leave(lists.get(list)!.parts.leave!, items)) {
      comeBack(key);
      g.leaving.set(key, remove);
      void ended.then(() => {
        if (g.leaving.get(key) === remove) g.leaving.delete(key);
      });
    }
  }
};

/**
 * Animates the changes of `list`'s items that no drag made, while its `animate` is on.
 * Call in the list's setup: the watchers stop with it.
 */
export const watchChanges = (g: GroupContext, list: ListEntry): void => {
  const on = computed(() => !!list.animate?.());
  let stops: WatchHandle[] = [];
  watch(
    on,
    (value) => {
      stops.forEach((stop) => stop());
      stops = [];
      if (!value) return;
      const keys = () => list.getKeys();
      stops = [
        watch(keys, (next, previous) => !sameKeys(next, previous) && measure(g, list, previous), { flush: 'pre' }),
        watch(keys, () => play(g), { flush: 'post' }),
      ];
    },
    { immediate: true },
  );
};
