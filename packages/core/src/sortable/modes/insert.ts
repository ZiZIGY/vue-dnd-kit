/**
 * Inserting (`createItem`): a plain draggable from outside the group. Each list it enters
 * makes an item for it, which takes the slot there and is what the drop inserts; outside
 * the lists the drag is the plain draggable it is.
 */

import { nextTick } from 'vue';
import type { Key, SortablePutContext } from '../../types';
import { createRect } from '../../animation/layout';
import { lookup, type GroupContext, type Session, type SessionStart } from '../context';
import type { ListEntry } from '../entry';
import { moveActive, removeSlot } from '../slot';
import { indicateAt } from '../indicator';
import { adjacentList, insertionIndex, slotCenter } from '../keyboard';
import { enters, type SortableMode } from './mode';
import { sortOver } from './sort';

/** The item `list` makes for the drag, once per session; `null` when it makes none. */
const createdIn = (g: GroupContext, list: ListEntry, current: Session): Key | null => {
  if (!list.create) return null;
  if (!current.created.has(list.id)) {
    const active = g.manager.active.value;
    const made = active ? list.create(active) : undefined;
    current.created.set(list.id, made ? made.key : null);
    if (made) current.items.set(made.key, made.item);
  }
  return current.created.get(list.id) ?? null;
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
  dragMode: (_g, current) => (current.list != null ? 'insert' : 'move'),
  // The list must make an item, and take it.
  partition: (g, list, current) => {
    const all = { accepted: current.keys, rejected: [] as Key[] };
    const none = { accepted: [] as Key[], rejected: current.keys };
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
  },
  inert: (list) => !list.create,
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
  inserted: (_g, current, keys) => (keys.length ? [current.slot] : []),
  placed: (current) => current.slot,
  /**
   * Outside the lists, the arrow takes the drag into the closest list in its direction,
   * at the position level with the drag, as moves between lists do. Without one that
   * way it moves as the plain draggable it is (pixels, droppables).
   */
  enterByKey: async (g, current, { active, pointer, direction }) => {
    const from = createRect(pointer.x, pointer.y, 0, 0);
    const target = adjacentList(g, null, active, direction, from);
    if (!target || !enters(g, current, target)) return undefined;
    const index = insertionIndex(g, target, from, current);
    if (target.placeholder() === 'indicator') return indicateAt(g, target, index) ?? pointer;
    moveActive(g, target, index, null);
    await nextTick();
    if (g.session.value !== current) return undefined;
    return slotCenter(g, current, false) ?? pointer;
  },
};
