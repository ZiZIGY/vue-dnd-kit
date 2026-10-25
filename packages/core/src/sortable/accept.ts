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

export const createdIn = (g: GroupContext, list: ListEntry, current: Session): Key | null => {
  if (!list.create) return null;
  if (!current.created.has(list.id)) {
    const active = g.manager.active.value;
    const made = active ? list.create(active) : undefined;
    current.created.set(list.id, made ? made.key : null);
    if (made) current.items.set(made.key, made.item);
  }
  return current.created.get(list.id) ?? null;
};

/** Which dragged keys `list` takes: `group.put` per key with `acceptMode: 'some'`, all or none otherwise. */
export const partition = (g: GroupContext, list: ListEntry, current: Session): Partition => {
  const all = { accepted: current.keys, rejected: [] as Key[] };
  const none = { accepted: [] as Key[], rejected: current.keys };
  if (list.isDisabled()) return none;
  if (current.external) {
    const created = createdIn(g, list, current);
    if (created == null) return none;
    const context: SortablePutContext = {
      keys: current.keys,
      items: [lookup(g, created)],
      types: g.manager.active.value?.type ?? [],
      from: null,
      to: list.id,
    };
    return list.canPut(context) ? all : none;
  }
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
  return current.external && !list.create;
};

export const isSwapping = (g: GroupContext, current: Session, list: ListEntry | undefined) =>
  // Swap is a single-item exchange; multi-drag falls back to sorting (rfcs/0001-v3.md §6, §14 item 6).
  // Between lists both must swap: the partner takes the active item's place in its list.
  list?.behavior?.() === 'swap' &&
  listOf(g, current.origin.list)?.behavior?.() === 'swap' &&
  current.keys.length === 1 &&
  !current.external &&
  !current.copying;

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
