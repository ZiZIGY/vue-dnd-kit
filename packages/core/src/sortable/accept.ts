/**
 * Which lists of a group take the drag, and which of its keys: `group.pull` of the list
 * the drag comes from, `group.put` and `acceptMode` of the one it goes to.
 */

import type { Active, Key, SortablePutContext } from '../types';
import { listOf, lookup, type GroupContext, type Session } from './context';
import type { ListEntry } from './entry';

export interface Partition {
  accepted: Key[];
  rejected: Key[];
}

export const itemTypes = (g: GroupContext, key: Key): string[] => g.manager.getDraggable(key)?.getTypes() ?? [g.name];

/** Which dragged keys `list` takes, by the rules of the session's mode; none for a disabled list. */
export const partition = (g: GroupContext, list: ListEntry, current: Session): Partition =>
  list.isDisabled() ? { accepted: [], rejected: current.keys } : current.mode.partition(g, list, current);

/**
 * The rules for the dragged items themselves (or their copies): `group.pull` of their
 * list, then `group.put` of `list`, per key with `acceptMode: 'some'`, all or none otherwise.
 */
export const partitionMoved = (g: GroupContext, list: ListEntry, current: Session): Partition => {
  const all = { accepted: current.keys, rejected: [] as Key[] };
  const none = { accepted: [] as Key[], rejected: current.keys };
  if (list.id === current.origin.list) return all;
  if (listOf(g, current.origin.list)?.pull() === false) return none;
  const context = (keys: Key[]): SortablePutContext => ({
    keys,
    items: keys.map((key) => lookup(g, key)),
    types: [...new Set(keys.flatMap((key) => itemTypes(g, key)))],
    from: current.origin.list,
    to: list.id,
  });
  if ((list.acceptMode?.() ?? 'all') === 'all') return list.canPut(context(current.keys)) ? all : none;
  const accepted: Key[] = [];
  const rejected: Key[] = [];
  for (const key of current.keys) (list.canPut(context([key])) ? accepted : rejected).push(key);
  return { accepted, rejected };
};

export const accepts = (g: GroupContext, list: ListEntry, active: Active) => {
  const current = g.session.value;
  if (!current || current.activeKey !== active.id) return false;
  const { accepted, rejected } = partition(g, list, current);
  return (list.acceptMode?.() ?? 'all') === 'some' ? accepted.length > 0 : !rejected.length;
};

/** The current drag can never enter `list` (another group, or a plain draggable it can't create items for). */
export const isInert = (g: GroupContext, list: ListEntry) => {
  const active = g.manager.active.value;
  if (!active) return false;
  const current = g.session.value;
  if (!current || current.activeKey !== active.id) return true;
  return !!current.mode.inert?.(list);
};

export const isSwapping = (g: GroupContext, current: Session, list: ListEntry | undefined) =>
  // Swap is a single-item exchange; multi-drag falls back to sorting (rfcs/0001-v3.md §6, §14 item 6).
  // Between lists both must swap: the partner takes the active item's place in its list.
  list?.behavior?.() === 'swap' &&
  listOf(g, current.origin.list)?.behavior?.() === 'swap' &&
  current.keys.length === 1 &&
  current.mode.moves;

/**
 * Whether `partner`, an item of `list`, can take the active item's place. From another
 * list it leaves `list` and enters the origin list, under the rules any item entering
 * it follows: `list` must let it go, the origin must take it.
 */
export const canSwap = (g: GroupContext, current: Session, list: ListEntry, partner: Key): boolean => {
  const origin = listOf(g, current.origin.list)!;
  return (
    list === origin ||
    (list.pull() === true &&
      !origin.isDisabled() &&
      origin.canPut({
        keys: [partner],
        items: [lookup(g, partner)],
        types: itemTypes(g, partner),
        from: list.id,
        to: origin.id,
      }))
  );
};
