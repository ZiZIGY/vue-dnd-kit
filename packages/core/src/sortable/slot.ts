/**
 * Moves of the slot, and of the block travelling with it, through the drafts of a group.
 * Every move mirrors the session into the manager and runs a FLIP pass.
 */

import type { Coordinates, Key } from '../types';
import { keysOf, listOf, type GroupContext, type Session } from './context';
import type { ListEntry } from './entry';
import { blockFor, expand, putBack, viewOf } from './block';
import { syncManager } from './landing';
import { bump } from './flip';
import { neighbourKeys, passedKeys } from './stability';

/**
 * Moves the slot to `index` of `target`'s draft (counted as `viewOf` counts it),
 * removing it from the list that held it. A block moves along as one unit; entering a
 * list, the members before the slot go before `index`, so the block lines up with the
 * overlay's column around the pointer. `blockStart`: `index` is where the block starts.
 */
export const moveActive = (
  g: GroupContext,
  target: ListEntry,
  index: number,
  pointer: Coordinates | null,
  blockStart = false,
) => {
  const current = g.session.value!;
  const slot = current.slot;
  const from = listOf(g, current.list);
  let passed: Set<Key>;
  if (from === target) {
    const view = [...viewOf(from, current)];
    const position = view.indexOf(slot);
    if (position === -1 || position === index) return;
    passed = passedKeys(view, position, index);
    view.splice(position, 1);
    view.splice(index, 0, slot);
    from.draft.value = expand(view, slot, current.block);
  } else {
    const old = current.block;
    const block = blockFor(g, current, target);
    const leaving = new Set(old);
    // Keys put back while another list didn't take them join the block again.
    const joining = new Set(block.filter((key) => !leaving.has(key)));
    const before = keysOf(target);
    // Keys about to join don't count: the block starts `members before the slot` keys
    // ahead of `index`, before the first key from there that stays.
    let start = Math.min(index, before.length);
    for (let skip = blockStart ? 0 : block.indexOf(slot); skip > 0 && start > 0; ) {
      if (!joining.has(before[--start]!)) skip--;
    }
    let anchor: Key | null = null;
    for (let i = start; i < before.length; i++) {
      if (!joining.has(before[i]!)) {
        anchor = before[i]!;
        break;
      }
    }
    if (from) from.draft.value = keysOf(from).filter((key) => !leaving.has(key));
    if (joining.size) {
      for (const list of g.lists.values()) {
        const keys = keysOf(list);
        if (keys.some((key) => joining.has(key))) list.draft.value = keys.filter((key) => !joining.has(key));
      }
    }
    if (current.mode.name !== 'copy') {
      // Keys this list doesn't take go back to where they started (copies just leave).
      const moving = new Set(block);
      const dropped = old
        .filter((key) => !moving.has(key))
        .map((key) => ({ key, source: current.sources.get(key) }))
        .sort((a, b) => (a.source?.index ?? 0) - (b.source?.index ?? 0));
      for (const { key, source } of dropped) {
        const list = source && g.lists.get(source.list);
        if (!list) continue;
        const keys = [...keysOf(list)];
        putBack(keys, list, key, source.index, moving);
        list.draft.value = keys;
      }
    }
    const keys = [...keysOf(target)];
    const at = anchor == null ? keys.length : keys.indexOf(anchor);
    passed = neighbourKeys(keys, at);
    keys.splice(at, 0, ...block);
    target.draft.value = keys;
    current.block = block;
    current.list = target.id;
  }
  current.hysteresis = pointer
    ? { keys: passed, list: from && from !== target ? from.id : null, at: pointer }
    : null;
  current.indicator = null;
  syncManager(g);
  bump(g);
  g.manager.announce('onDragOver');
};

/** Takes the slot (and its block) out of every draft (a copy over its palette, an external item leaving). */
export const removeSlot = (g: GroupContext) => {
  const current = g.session.value!;
  const list = listOf(g, current.list);
  if (!list) return;
  const block = new Set(current.block);
  list.draft.value = keysOf(list).filter((key) => !block.has(key));
  current.list = null;
  syncManager(g);
  bump(g);
};

/** Over a list that can't be sorted: the active item (and its block) goes back to where it started. */
export const returnToOrigin = (g: GroupContext, pointer: Coordinates | null) => {
  const current = g.session.value!;
  if (current.slot !== current.lead) return removeSlot(g);
  const origin = listOf(g, current.origin.list);
  const base = origin && current.base.get(origin.id);
  const start = base ? base.indexOf(current.lead) : -1;
  if (!origin || !base || start < 0) return;
  const members = new Set(current.grouped ? current.keys : []);
  members.delete(current.lead);
  if (current.list === origin.id) {
    // Counted as `viewOf` counts it: the block once.
    moveActive(g, origin, base.slice(0, start).filter((key) => !members.has(key)).length, pointer);
    return;
  }
  // From another list: before the key that followed the block at the start.
  const anchor = base.slice(start + 1).find((key) => !members.has(key));
  const keys = keysOf(origin);
  const index = anchor === undefined ? -1 : keys.indexOf(anchor);
  moveActive(g, origin, index === -1 ? keys.length : index, pointer, true);
};

/** Indicator lists don't move: the slot stays (or goes back) where it started. */
export const keepSlotHome = (g: GroupContext, current: Session) => {
  if (current.slot !== current.lead) {
    if (current.list != null) removeSlot(g);
  } else if (current.list !== current.origin.list) {
    returnToOrigin(g, null);
  }
};
