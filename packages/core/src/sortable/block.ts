/**
 * Multi-drag (rfcs/0001-v3.md §6): which dragged keys travel and how. In `'group'` mode
 * the others travel with the slot as a block, contiguous in the draft and in drop order;
 * projection and keyboard moves count the block once (`viewOf`, `collect`). `'stack'`
 * collapses the others into the overlay, `'gaps'` leaves them in place until the drop.
 */

import type { DnDEvent, DragItem, Key } from '../types';
import { getRect } from '../animation/layout';
import { indicesOf, keysOf, listOf, sameKeys, type GroupContext, type Session } from './context';
import type { ListEntry } from './entry';
import type { ProjectionItem } from './projection';
import { itemTypes, partition } from './accept';
import { collapseIntoOverlay } from './multiple';

/** `view` (a draft counting the block once, as `slot`) with the whole block in the slot's place. */
export const expand = (view: Key[], slot: Key, block: Key[]): Key[] =>
  block.length > 1 ? view.flatMap((key) => (key === slot ? block : [key])) : view;

/** The dragged keys a drag starts with, and the drafts its multi-drag mode starts from. */
export type PickUp = Pick<Session, 'lead' | 'keys' | 'others' | 'stacked' | 'grouped' | 'block' | 'base'> & {
  origin: { list: Key; index: number };
};

/**
 * The drag starts with the active key, one of `sources` (keys at drag start by list, of
 * `ordered`, the lists in document order).
 */
export const pickUp = (
  g: GroupContext,
  event: DnDEvent,
  ordered: ListEntry[],
  sources: Session['sources'],
  snapshot: Session['items'],
): PickUp => {
  const { lists, manager } = g;
  const activeKey = event.active.id;
  const order = (key: Key) => {
    const source = sources.get(key)!;
    return ordered.findIndex((list) => list.id === source.list) * 1e9 + source.index;
  };
  let keys = event.active.ids.filter((key) => sources.has(key)).sort((a, b) => order(a) - order(b));
  // A selected tree node inside another selected one travels in its subtree, not on its
  // own. The grabbed one too (as in VS Code): the node it rides in leads the drag, and
  // the grabbed node stays inside it, under the pointer.
  const ridesIn = new Map<Key, Key>();
  for (const list of ordered) list.carried?.(keys).forEach((carrier, key) => ridesIn.set(key, carrier));
  if (ridesIn.size) keys = keys.filter((key) => !ridesIn.has(key));
  const lead = ridesIn.get(activeKey) ?? activeKey;
  const origin = sources.get(lead)!;
  const originList = lists.get(origin.list)!;

  // Multi-drag ids may belong to unmounted rows or other groups (or ride inside others): keep ours only.
  const ids = [activeKey, ...keys.filter((key) => key !== activeKey)];
  if (!sameKeys(ids, event.active.ids)) {
    const dragItems: DragItem[] = ids.map((key) => ({
      id: key,
      item: snapshot.get(key),
      data: manager.getDraggable(key)?.getData(),
      type: itemTypes(g, key),
    }));
    manager.updateActive({ ids, items: dragItems });
  }

  const others = new Set(keys.filter((key) => key !== lead));
  // Indicator lists don't move: their others stay in place whatever the mode.
  const multiple = others.size > 0 && originList.placeholder() === 'item' ? (originList.multiple?.() ?? 'stack') : null;
  const stacked = multiple === 'stack';
  const grouped = multiple === 'group';
  const base = new Map<Key, Key[]>();
  for (const list of lists.values()) {
    const source = list.getKeys();
    let draft = stacked || grouped ? source.filter((key) => !others.has(key)) : [...source];
    // The block forms around the lead: the others leave their places and join it in drop order.
    if (grouped && list === originList) draft = expand(draft, lead, keys);
    base.set(list.id, list.prepareDraft?.(draft, { lead, keys, copying: false }) ?? draft);
  }
  return { lead, keys, origin, others, stacked, grouped, block: grouped ? keys : [lead], base };
};

/**
 * The others leave for the overlay as the drag starts: in `'stack'` mode they unmount,
 * so clones of them fly into it; in `'group'` mode the next FLIP pass takes them into
 * the block, from other lists too.
 */
export const gather = (g: GroupContext, current: Session, event: DnDEvent) => {
  if (current.stacked) {
    const elements = [...current.others]
      .map((key) => g.items.get(key)?.())
      .filter((element): element is HTMLElement => !!element?.isConnected);
    collapseIntoOverlay(elements, event.active.rect, listOf(g, current.origin.list)!.animation());
  }
  g.gathering = current.grouped;
};

/** The drag ends: the others of a `'stack'` drag fly out of the overlay into their slots (copied ones never left). */
export const scatter = (g: GroupContext, current: Session) => {
  if (!current.stacked || !current.mode.moves) return;
  const overlay = g.manager.overlayElement.value;
  if (overlay?.isConnected) g.returning = { keys: new Set(current.others), from: getRect(overlay) };
};

/**
 * What travels with the slot into `target`: the slot alone, or in multi-drag `'group'`
 * every dragged key in drop order. A list taking only some of them (`group.put` with
 * `acceptMode: 'some'`) gets those, if the lead is one: the rest stay where they
 * started, as the drop would leave them. Copies when copying.
 */
export const blockFor = (g: GroupContext, current: Session, target: ListEntry | undefined): Key[] => {
  if (!current.grouped) return [current.slot];
  let keys = current.keys;
  if (target) {
    const { accepted } = partition(g, target, current);
    if (accepted.length < keys.length && accepted.includes(current.lead)) keys = accepted;
  }
  return current.mode.inserted(g, current, keys);
};

/** A source's draft with the block's keys out of it: those the list doesn't take stay there. */
export const withoutBlock = (current: Session, list: ListEntry, moving: ReadonlySet<Key>): Key[] =>
  (current.grouped ? list.getKeys() : (current.base.get(list.id) ?? list.getKeys())).filter((key) => !moving.has(key));

/** `list`'s draft as projection and keyboard moves count it: a block once, as the slot. */
export const viewOf = (list: ListEntry, current: Session): Key[] => {
  const keys = keysOf(list);
  if (current.block.length < 2 || current.list !== list.id) return keys;
  const members = new Set(current.block);
  return keys.filter((key) => key === current.slot || !members.has(key));
};

/**
 * Inserts the dragged `key` into `keys` (a draft of its source `list`) where it started:
 * after its nearest original predecessor that is there and isn't in `moving`.
 */
export const putBack = (keys: Key[], list: ListEntry, key: Key, index: number, moving: ReadonlySet<Key>) => {
  const original = list.getKeys();
  let at = 0;
  for (let i = index - 1; i >= 0; i--) {
    const previous = original[i]!;
    if (moving.has(previous)) continue;
    const position = keys.indexOf(previous);
    if (position !== -1) {
      at = position + 1;
      break;
    }
  }
  keys.splice(at, 0, key);
};

/**
 * Mounted items of `list` with layout rects, in draft order. The block holding the
 * slot counts once (see `viewOf`): its other members share the slot's index and are
 * tagged with their side of it.
 */
export const collect = (g: GroupContext, list: ListEntry): ProjectionItem[] => {
  const indices = indicesOf(g, list);
  const current = g.session.value;
  const block = current && current.block.length > 1 && current.list === list.id ? current.block : null;
  const first = block ? (indices.get(block[0]!) ?? -1) : -1;
  const slot = block ? (indices.get(current!.slot) ?? -1) : -1;
  const found: Array<[number, ProjectionItem]> = [];
  for (const [key, getElement] of g.items) {
    const at = indices.get(key);
    if (at === undefined) continue;
    const element = getElement();
    // Clipped to the visible area; rows fully clipped (overscan) can't be targeted.
    const rect = element?.isConnected ? g.manager.measureVisible(element) : null;
    if (!rect) continue;
    let index = at;
    let side: -1 | 1 | undefined;
    if (first !== -1 && at >= first) {
      if (at >= first + block!.length) index = at - block!.length + 1;
      else {
        index = first;
        if (at !== slot) side = at < slot ? -1 : 1;
      }
    }
    found.push([at, side ? { key, index, rect, side } : { key, index, rect }]);
  }
  return found.sort((a, b) => a[0] - b[0]).map(([, item]) => item);
};
