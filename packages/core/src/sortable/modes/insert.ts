/**
 * Inserting (`createItem`): a plain draggable from outside the group, or a drag from
 * outside the page (`external`). Each list it enters makes its items, the first of which
 * takes the slot there; the drop inserts them all. Outside the lists the drag is what it
 * is. Items of the group dragged in from another window of the app come in as themselves.
 */

import type { Active, Key, SortablePutContext } from '../../types';
import { lookup, type GroupContext, type Session, type SessionStart } from '../context';
import type { CreatedItem, ListEntry } from '../entry';
import { takesExternal } from '../../core/native/data';
import { removeSlot } from '../slot';
import { enterNearest } from '../keyboard';
import type { SortableMode } from './mode';
import { sortOver } from './sort';

/**
 * Whether `list` may take the drag `active` in as items of its own: with `createItem`, a
 * drag from outside the page only if its `external` takes it; another window's items of
 * its group always. Asks no `createItem`.
 */
export const mayMake = (g: GroupContext, list: ListEntry, active: Active): boolean => {
  const { external } = active;
  if (external?.group) return external.group === g.name && !!(list.create || list.keyOf);
  if (external) return !!list.create && takesExternal(list.external?.(), external);
  return !!list.create;
};

/** The items `list` makes for `active` (see `mayMake`); none when it makes none. */
export const makeFor = (g: GroupContext, list: ListEntry, active: Active): CreatedItem[] => {
  if (!mayMake(g, list, active)) return [];
  if (list.create) return list.create(active) ?? [];
  // Another window's items, as they are.
  return active.items.map(({ item }) => ({ key: list.keyOf!(item), item }));
};

/** The item `list` makes for the drag, once per session; `null` when it makes none. */
const createdIn = (g: GroupContext, list: ListEntry, current: Session): Key | null => {
  if (!current.created.has(list.id)) {
    const active = g.manager.active.value;
    const made = active ? makeFor(g, list, active) : [];
    current.created.set(list.id, made[0]?.key ?? null);
    for (const { key, item } of made) current.items.set(key, item);
    current.extra.set(list.id, made.slice(1).map(({ key }) => key));
  }
  return current.created.get(list.id) ?? null;
};

/**
 * A drag from outside the page brings its data with the drop: `list`, where it goes, makes
 * its items again from it (`createItem` is asked with `external.dropped`), and those go in.
 */
export const remake = (g: GroupContext, list: ListEntry, current: Session, active: Active) => {
  const made = makeFor(g, list, active);
  if (!made.length) return;
  const [first, ...rest] = made;
  for (const { key, item } of made) current.items.set(key, item);
  const slot = current.slot;
  if (first!.key !== slot) {
    if (list.draft.value?.includes(slot)) list.draft.value = list.draft.value.map((key) => (key === slot ? first!.key : key));
    current.created.set(list.id, first!.key);
    current.slot = first!.key;
  }
  current.extra.set(list.id, rest.map(({ key }) => key));
};

/** The session of a plain draggable: no list holds its slot until one makes an item for it. */
export const startInsert = (g: GroupContext, common: SessionStart): Session => {
  const { activeKey } = common;
  const base = new Map<Key, Key[]>();
  for (const list of g.lists.values()) {
    const draft = [...list.getKeys()];
    list.draft.value = list.layout.prepareDraft(draft, { lead: activeKey, keys: [activeKey], copying: false });
    base.set(list.id, list.draft.value);
  }
  return {
    ...common,
    lead: activeKey,
    keys: [activeKey],
    origin: { list: null, index: -1 },
    slot: activeKey,
    list: null,
    others: new Set(),
    stacked: false,
    grouped: false,
    block: [activeKey],
    base,
    mode: insert,
  };
};

export const insert: SortableMode = {
  name: 'insert',
  moves: false,
  // In a list that shows a line instead of moving, the item made is in no draft: the line says it goes in.
  dragMode: (g, current) => (current.list != null || g.indicator.value != null ? 'insert' : 'move'),
  // The list must make an item, and take it.
  partition: (g, list, current) => {
    const all = { accepted: current.keys, rejected: [] as Key[] };
    const none = { accepted: [] as Key[], rejected: current.keys };
    const created = createdIn(g, list, current);
    if (created == null) return none;
    const made = [created, ...(current.extra.get(list.id) ?? [])];
    const context: SortablePutContext = {
      keys: current.keys,
      items: made.map((key) => lookup(g, key)),
      types: g.manager.active.value?.type ?? [],
      from: null,
      to: list.id,
    };
    return list.canPut(context) ? all : none;
  },
  inert: (list, g) => {
    const active = g.manager.active.value;
    return !active || !mayMake(g, list, active);
  },
  // The slot becomes the item `target` makes for the drag.
  enter: (g, current, target) => {
    const created = createdIn(g, target, current);
    if (created == null) return false;
    if (current.slot !== created) {
      if (current.list != null) removeSlot(g);
      current.slot = created;
    }
    return true;
  },
  over: sortOver,
  leave: (g, current) => {
    if (current.list != null) removeSlot(g);
  },
  // The slot, then the other items the list made: all of them go in.
  inserted: (g, current, keys) => {
    if (!keys.length) return [];
    const list = current.list ?? current.marker?.list ?? g.indicator.value?.list ?? null;
    return [current.slot, ...((list != null && current.extra.get(list)) || [])];
  },
  placed: (current) => current.slot,
  /**
   * Outside the lists, the arrow takes the drag into the closest list in its direction.
   * Without one that way it moves as the plain draggable it is (pixels, droppables).
   */
  enterByKey: enterNearest,
};
