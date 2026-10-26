/**
 * A sortable group as the devtools bridge follows it: the drop each session made, and
 * the changes of the items that no drag made in lists with `animate` on (the passes of
 * `sortable/autoAnimate.ts`, seen the way it sees them).
 */

import { getCurrentScope, nextTick, watch, type WatchHandle } from 'vue';
import type { Key } from '../types';
import type { GroupContext } from '../sortable/context';
import { snapshotSortableDrop } from './snapshot';
import type { DevtoolsEvent, SortableDropSnapshot } from './types';

export interface GroupListener {
  /** A session ended with the drop it made (or prepared before a rejection). */
  drop(drop: SortableDropSnapshot): void;
  /** The items of a list with `animate` on changed, and no drag changed them. */
  change(event: Extract<DevtoolsEvent, { type: 'change' }>): void;
}

/** What changed from `previous` to `next`: `null` when nothing did. */
const diff = (previous: readonly Key[], next: readonly Key[]) => {
  const before = new Set(previous);
  const after = new Set(next);
  const added = next.filter((key) => !before.has(key));
  const removed = previous.filter((key) => !after.has(key));
  // The keys both have, in another order.
  const kept = next.filter((key) => before.has(key));
  const stayed = previous.filter((key) => after.has(key));
  const reordered = kept.some((key, index) => key !== stayed[index]);
  return added.length || removed.length || reordered ? { added, removed, reordered } : null;
};

/** Follows `g` until the returned stop, or the end of the effect scope it is called in. */
export function followGroup(g: GroupContext, listener: GroupListener): () => void {
  const scope = getCurrentScope();
  let stopped = false;
  // The session is set when a drag starts and cleared when it ends: what it held then
  // is the drop it made.
  const handles: WatchHandle[] = [
    watch(
      g.session,
      (_next, previous) => {
        const drop = previous && snapshotSortableDrop(g, previous);
        if (drop) listener.drop(drop);
      },
      { flush: 'sync' },
    ),
  ];
  // The group's lists aren't reactive: they are read once the render that creates the
  // group has added them all (and again whenever their keys change).
  void nextTick(() => {
    if (stopped || !scope?.active) return;
    const handle = scope.run(() =>
      watch(
        () => [...g.lists.values()].filter((list) => list.animate?.()).map((list) => [list.id, list.getKeys()] as const),
        (next, previous) => {
          // A drag's changes are its own (drafts, the drop's write): `autoAnimate` skips them too.
          if (g.dragPass || g.session.value) return;
          const before = new Map(previous);
          for (const [list, keys] of next) {
            const changed = before.has(list) && diff(before.get(list)!, keys);
            if (changed) listener.change({ type: 'change', group: g.name, list, ...changed });
          }
        },
        { flush: 'pre' },
      ),
    );
    if (handle) handles.push(handle);
  });
  return () => {
    stopped = true;
    handles.forEach((stop) => stop());
  };
}
