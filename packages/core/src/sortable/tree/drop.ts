/**
 * The drop in a tree: the group's flat result becomes a move of nodes with their
 * subtrees (`TreeMove`), built as a new tree for `event.result` and applied through
 * `setChildren` by the default write. The event's `from` and `to` count among siblings.
 */

import type { Ref } from 'vue';
import type { Key, SortableDropEvent, SortableTreeDropEvent } from '../../types';
import { gapPosition, siblingIndexAt } from './depth';
import { applyTreeMove, buildTreeMove, type TreeMove } from './move';
import {
  indicating,
  movingRows,
  place,
  rows,
  setSpot,
  source,
  viewIndex,
  type DragState,
  type DropInfo,
  type Placement,
  type Spot,
  type TreeContext,
} from './context';

/** Where the dragged nodes would land in this tree, `null` when not here. */
const landingSpot = <T>(t: TreeContext<T>, current: DragState): Spot | null => {
  const { group, entry } = t;
  if (indicating(t)) {
    // No line: the lead's own place.
    if (!t.spot && current.origin) {
      const position = gapPosition(group.keysOf(entry), group.indexOf(entry, current.lead), movingRows(t, current), rows(t));
      setSpot(t, current, position, { depth: current.startDepth, parentKey: current.origin.parentKey });
    }
    return t.spot;
  }
  const index = viewIndex(t, current);
  if (index === -1) return null;
  // Projected again on the draft as it is now, at the last depth.
  place(t, current, group.viewOf(entry), index, t.placement.value?.depth ?? current.startDepth);
  return t.spot;
};

/**
 * What committing `next` does here (one list holds the slot, so nodes either land here
 * or leave): the nodes `inserted` at the slot land side by side at `to`, and the
 * dragged nodes of this tree leave their places, unless rejected back into them.
 */
const outcome = <T>(t: TreeContext<T>, current: DragState, next: Key[], inserted: readonly Key[]) => {
  const present = new Set(next);
  const landing = inserted.filter((key) => present.has(key));
  const removed = [...current.origins.keys()].filter((key) => landing.includes(key) || !present.has(key));
  const at = landing.length ? landingSpot(t, current) : null;
  const to: Placement | null = at && {
    ...at.projection,
    index: siblingIndexAt(at.position, at.projection, removed.map((key) => current.origins.get(key)!)),
  };
  return { landing, removed, to };
};

export const hasChanges = <T>(t: TreeContext<T>, next: Key[], inserted: readonly Key[]) => {
  const current = t.state!;
  const { landing, removed, to } = outcome(t, current, next, inserted);
  // Nodes leave the tree, or the landing ones aren't already side by side right there.
  return (
    (!to && removed.length > 0) ||
    landing.some((key, i) => {
      const origin = current.origins.get(key);
      return !origin || origin.parentKey !== to!.parentKey || origin.index !== to!.index + i;
    })
  );
};

/** The move a drop's `next` makes here; the event's `from` and `to` come with it. */
const moveOf = <T>(
  t: TreeContext<T>,
  current: DragState,
  next: Key[],
  lookup: (key: Key) => unknown,
  inserted: readonly Key[],
) => {
  const { landing, removed, to } = outcome(t, current, next, inserted);
  t.dropInfo = { from: current.origin, to };
  const move: TreeMove<T> = {
    keys: to ? landing : removed,
    node: (key) => lookup(key) as T | undefined,
    to: to && { parentKey: to.parentKey, index: to.index },
  };
  t.prepared = { next, move };
  return move;
};

/** The drop's `result` here: a new tree, the user's nodes untouched. */
export const build = <T>(t: TreeContext<T>, next: Key[], lookup: (key: Key) => unknown, inserted: readonly Key[]) => {
  const current = t.state;
  if (!current) return [...source(t)];
  return buildTreeMove(source(t), moveOf(t, current, next, lookup, inserted), { ...t.accessors, withChildren: t.withChildren });
};

/** The default write: the same move, through `setChildren`. */
export const commit = <T>(t: TreeContext<T>, next: Key[], lookup: (key: Key) => unknown, inserted: readonly Key[]) => {
  const current = t.state;
  if (!current) return;
  const move = t.prepared?.next === next ? t.prepared.move : moveOf(t, current, next, lookup, inserted);
  (t.options.items as Ref<T[]>).value = applyTreeMove(source(t), move, t.accessors);
};

/** Turns the group's flat indices into indices among siblings, plus parent keys. */
const toTreeEvent = <T>(event: SortableDropEvent, info: DropInfo | null): SortableTreeDropEvent<T> => {
  const treeEvent = event as SortableTreeDropEvent<T>;
  treeEvent.from.parentKey = info?.from?.parentKey ?? null;
  if (info?.from) treeEvent.from.index = info.from.index;
  treeEvent.to.parentKey = info?.to?.parentKey ?? null;
  if (info?.to) treeEvent.to.index = info.to.index;
  return treeEvent;
};

const liveDropInfo = <T>(t: TreeContext<T>): DropInfo | null =>
  t.state ? { from: t.state.origin, to: landingSpot(t, t.state) && t.placement.value } : null;

/** The user's `onBeforeDrop`: `result` was built for this event, its `from` and `to` go with it. */
export const beforeDrop = <T>(t: TreeContext<T>, event: SortableDropEvent) =>
  t.options.onBeforeDrop?.(toTreeEvent(event, t.dropInfo ?? liveDropInfo(t)));

/** The user's `onDrop`, with the `from` and `to` of the move. */
export const afterDrop = <T>(t: TreeContext<T>, event: SortableDropEvent) => {
  const info = t.dropInfo;
  t.dropInfo = null;
  t.options.onDrop?.(toTreeEvent(event, info));
};
