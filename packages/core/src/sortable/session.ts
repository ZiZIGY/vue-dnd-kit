/**
 * The session core: a drag starts a session (`start`), and every move of the pointer
 * runs it over the list under the pointer (`move`), through the steps of its mode
 * (`modes/`). The drop ends it (`drop.ts`); keyboard drags move it by items
 * (`keyboard.ts`).
 *
 * The active slot is a key in the drafts. Usually it is the active item itself; when
 * copying it is the item's copy, and for a plain draggable from outside it is the
 * item `createItem` made. Projection, commit and FLIP only ever deal with that key.
 */

import { nextTick } from 'vue';
import type { DnDEvent, Key } from '../types';
import { listOf, listOfKey, orderedLists, type GroupContext, type Session, type SessionStart } from './context';
import { gather, pickUp } from './block';
import { setIndicator, updateIndicator } from './indicator';
import { syncManager } from './landing';
import { pickedUpAt } from './announcements';
import { bump } from './flip';
import { HYSTERESIS, blocksList, distance, settleHysteresis } from './stability';
import { enters } from './modes/mode';
import { sort } from './modes/sort';
import { modeOf } from './modes/swap';
import { startCopy, syncCopy } from './modes/copy';
import { startInsert } from './modes/insert';

export const start = (g: GroupContext, event: DnDEvent) => {
  const { lists, session } = g;
  const activeKey = event.active.id;
  // Drags that don't involve this group leave it untouched (no snapshot of its lists).
  if (!listOfKey(g, activeKey, false) && ![...lists.values()].some((list) => list.create)) return;
  const ordered = orderedLists(g);
  const snapshot = new Map<Key, unknown>();
  const sources = new Map<Key, { list: Key; index: number }>();
  for (const list of ordered) {
    list.getKeys().forEach((key, index) => {
      snapshot.set(key, list.getItem(key));
      sources.set(key, { list: list.id, index });
    });
  }
  const common: SessionStart = {
    activeKey,
    lock: null,
    items: snapshot,
    size: { width: event.active.rect.width, height: event.active.rect.height },
    result: null,
    sources,
    copies: new Map<Key, Key | null>(),
    created: new Map<Key, Key | null>(),
    swap: null,
    indicator: null,
    marker: null,
    hysteresis: null,
    target: null,
    removed: false,
    prevented: false,
    stop: null,
  };

  if (!sources.has(activeKey)) {
    // A plain draggable: only lists with `createItem` take part.
    if (!ordered.some((list) => list.create)) return;
    g.spokenSpot = null;
    g.columnList = null;
    session.value = startInsert(g, common);
  } else {
    const { origin, ...picked } = pickUp(g, event, ordered, sources, snapshot);
    const current: Session = {
      ...common,
      ...picked,
      origin: { list: origin.list, index: origin.index },
      slot: picked.lead,
      list: origin.list,
      mode: sort,
    };
    session.value = current;
    g.columnList = null;
    pickedUpAt(g, current);
    if (!startCopy(g, current)) {
      gather(g, current, event);
      for (const list of lists.values()) list.draft.value = picked.base.get(list.id)!;
    }
  }
  syncManager(g);
  bump(g);
};

/** The pointer is over no list of this group (or one that refuses the drag). */
const leave = (g: GroupContext, current: Session) => {
  setIndicator(g, null);
  modeOf(current).leave?.(g, current);
};

/** Extension hook: runs on every move over a valid target, guarded or not (trees update depth here). */
const afterMove = (g: GroupContext, current: Session, event: DnDEvent) => {
  listOf(g, current.list)?.layout.afterMove(event);
};

/**
 * A block that moved can leave the pointer over one of its members (items of other
 * sizes passed, the end of a list): project again once it has rendered, as the pointer
 * may not move again (WebKit delivers a whole glide within a frame or two, and a
 * release right after it runs the last frame inside the drop). Each pass steps toward
 * the pointer, so it ends within a pass per member.
 */
const followBlock = (g: GroupContext, current: Session, event: DnDEvent) => {
  if (current.block.length < 2 || g.followed++ > current.block.length) return;
  const pass: Promise<void> = nextTick(() => {
    if (g.following === pass) g.following = null;
    if (g.session.value === current && g.manager.status.value !== 'idle' && g.manager.pointer.value === event.pointer) {
      move(g, event);
    }
  });
  g.following = pass;
};

/** Resolves once no `followBlock` pass is pending. */
export const settleBlock = async (g: GroupContext) => {
  while (g.following) await g.following;
};

export const move = (g: GroupContext, event: DnDEvent) => {
  const { lists } = g;
  const current = g.session.value;
  if (!current || current.activeKey !== event.active.id) return;
  if (event.pointer !== g.movedAt) {
    g.movedAt = event.pointer;
    g.followed = 0;
  }
  // Keyboard drags move the slot in getKeyboardCoordinates. Trees (`nested`) answer
  // the keyboard themselves and keep the pointer path below (in indicator mode they
  // move the line themselves), and so does an external item (no origin) outside the
  // lists: its own keyboard moves (pixels, droppables) may take it in.
  if (event.active.sensor === 'keyboard' && (current.origin.list != null || current.list != null || g.indicator.value)) {
    const list = current.list == null ? undefined : lists.get(current.list);
    if (!list?.layout.nested || list.placeholder() === 'indicator' || g.indicator.value) return afterMove(g, current, event);
  }
  syncCopy(g, current);
  // No frame is ever skipped: the target follows pointer movement only, so a skipped
  // frame that carried the final position would leave the slot stale until the
  // pointer moves again (WebKit delivers a whole glide within a frame or two). The
  // frame after a cross-list move is safe without a guard: the FLIP pass invalidates
  // measurements post-flush, and the manager's target stabilizer plus the list
  // hysteresis below keep a layout shift from bouncing the item back.
  current.hysteresis = settleHysteresis(current.hysteresis, event.pointer);

  const over = event.over;
  if (!over) {
    // Last valid target: a pointer a few pixels past a list boundary keeps it.
    if (current.target && distance(event.pointer, current.target.at) < HYSTERESIS) return afterMove(g, current, event);
    current.target = null;
    return leave(g, current);
  }
  const target = lists.get(over.id);
  if (!target || !over.accepted || target.isDisabled()) {
    current.target = null;
    return leave(g, current);
  }
  // The list the slot just left can't take it back until the pointer moves on.
  const blocked = target.id !== current.list && blocksList(current.hysteresis, target.id);
  // Trees keep projecting while blocked: depth changes without a reorder.
  if (blocked && !target.layout.nested) return afterMove(g, current, event);
  if (!blocked) current.target = { list: target.id, at: event.pointer };

  // Each list makes its own item for an external draggable.
  if (!blocked && !enters(g, current, target)) return leave(g, current);

  if (target.placeholder() === 'indicator') {
    updateIndicator(g, target, event);
    return afterMove(g, current, event);
  }
  setIndicator(g, null);
  if (current.mode.over(g, current, target, event, blocked)) followBlock(g, current, event);
  afterMove(g, current, event);
};
