/**
 * Keyboard sorting by items (rfcs/0001-v3.md §10): the arrow along a list moves the slot
 * by one, the perpendicular one moves it to the adjacent list (kanban), and in grids
 * up/down go to the nearest item of the next row. Into an indicator list only the line
 * moves. Trees navigate rows and depth themselves (`makeSortableTree`), and a drag from
 * outside the lists enters them through its mode (`insert.enterByKey`).
 */

import { nextTick } from 'vue';
import type { Active, Coordinates, KeyboardMoveContext, Rect } from '../types';
import { createRect, getCenter, getLayoutRect } from '../animation/layout';
import { revealElement } from '../core/autoscroll';
import { isFocusLost } from '../utils/dom';
import { keysOf, type GroupContext, type Session } from './context';
import type { ListEntry } from './entry';
import { nextRowIndex, pickAdjacent, projectIndex } from './projection';
import { accepts } from './accept';
import { collect, viewOf } from './block';
import { keepSlotHome, moveActive, returnToOrigin } from './slot';
import { indicateAt, setIndicator } from './indicator';
import { intoPoint } from './combine';
import { enters } from './modes/mode';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/** Insertion index in `target` for the slot coming from `from` (cross-list keyboard moves). */
export const insertionIndex = (g: GroupContext, target: ListEntry, from: Rect, current: Session): number => {
  const keys = keysOf(target);
  const element = target.getElement();
  const center = getCenter(from);
  const strategy = target.strategy();
  if (strategy !== 'grid') {
    // Before the first item whose center is level with or past the slot's (rows that line up tie).
    const axis = strategy === 'vertical' ? 'y' : 'x';
    const next = collect(g, target).find((item) => getCenter(item.rect)[axis] >= center[axis] - 1);
    return next ? next.index : keys.length;
  }
  let pointer = center;
  if (element) {
    const box = getLayoutRect(element);
    pointer = { x: clamp(center.x, box.left + 1, box.right - 1), y: clamp(center.y, box.top + 1, box.bottom - 1) };
  }
  const projection = projectIndex({
    strategy: target.strategy(),
    pointer,
    items: collect(g, target),
    activeKey: current.slot,
    activeIndex: -1,
    length: keys.length,
    lock: null,
  });
  return projection.index ?? keys.length;
};

/** Closest list of the group in the arrow's direction that takes the drag: from `list`, or from `origin` outside the lists. */
export const adjacentList = (
  g: GroupContext,
  list: ListEntry | null,
  active: Active,
  direction: Coordinates,
  origin?: Rect,
): ListEntry | null => {
  const element = list?.getElement();
  const from = element ? getLayoutRect(element) : origin;
  if (!from) return null;
  const candidates: Array<{ list: ListEntry; rect: Rect }> = [];
  for (const other of g.lists.values()) {
    const node = other.getElement();
    if (other === list || !node?.isConnected || other.isDisabled() || !accepts(g, other, active)) continue;
    // Lists inside the dragged element (a column's own cards) can't take it.
    if (active.element.isConnected && active.element.contains(node)) continue;
    candidates.push({ list: other, rect: getLayoutRect(node) });
  }
  return pickAdjacent(from, candidates, direction)?.list ?? null;
};

/**
 * Once a keyboard move has rendered: reveals the slot and returns its center. A slot
 * that was recreated (in another list, or by a list that remounts its rows) gets the
 * focus back, as the old element took it along; an external draggable (no origin in
 * the lists) is still where it was and keeps it.
 */
export const slotCenter = (g: GroupContext, current: Session, recreated: boolean): Coordinates | undefined => {
  const element = g.items.get(current.slot)?.();
  if (!element?.isConnected) return undefined;
  revealElement(element);
  if (recreated && current.origin.list != null) {
    g.manager.getDraggable(current.slot)?.getFocusTarget()?.focus({ preventScroll: true });
  }
  return getCenter(getLayoutRect(element));
};

/**
 * The arrow takes the drag across into an indicator list, level with `from`. Such
 * lists never move: the slot stays (or goes back) home and only the line goes there.
 */
const indicateAcross = async (
  g: GroupContext,
  current: Session,
  target: ListEntry,
  from: Rect,
): Promise<Coordinates | undefined> => {
  const home = current.list;
  keepSlotHome(g, current);
  // Measured once the slot is back home.
  await nextTick();
  if (g.session.value !== current) return undefined;
  if (current.list !== home) slotCenter(g, current, true);
  return indicateAt(g, target, insertionIndex(g, target, from, current));
};

const keyboardIndicator = async (
  g: GroupContext,
  current: Session,
  list: ListEntry,
  { active, pointer, direction }: KeyboardMoveContext,
): Promise<Coordinates | undefined> => {
  const strategy = list.strategy();
  const step = strategy === 'vertical' ? direction.y : direction.x;
  if (!step) {
    const other = adjacentList(g, list, active, direction);
    if (!other || !enters(g, current, other)) return undefined;
    // The line, where the keyboard took the drag, stands for the slot.
    const from = createRect(pointer.x, pointer.y, 0, 0);
    if (other.placeholder() === 'indicator') return indicateAcross(g, current, other, from);
    // A list that moves takes the slot; the line goes away.
    setIndicator(g, null);
    moveActive(g, other, insertionIndex(g, other, from, current), null);
    await nextTick();
    return g.session.value === current ? slotCenter(g, current, true) : undefined;
  }
  const keys = keysOf(list);
  const own = list.id === current.list ? keys.indexOf(current.slot) : -1;
  const shown = g.indicator.value;
  const marker = shown?.list === list.id ? shown : null;
  let next = (marker ? marker.index : Math.max(own, 0)) + step;
  // Right before or after the active item the drop changes nothing: skip those positions.
  while (own >= 0 && (next === own || next === own + 1)) next += step;
  if (next < 0 || next > keys.length) return undefined;
  return indicateAt(g, list, next);
};

/**
 * Keyboard sorting by items (see above). The item a list made for an external draggable
 * moves like any other.
 */
export const getKeyboardCoordinates = async (
  g: GroupContext,
  context: KeyboardMoveContext,
): Promise<Coordinates | undefined> => {
  const { active, pointer, direction } = context;
  const { lists, items } = g;
  const current = g.session.value;
  if (!current || current.activeKey !== active.id) return;
  const marker = g.indicator.value;
  const list = marker ? lists.get(marker.list) : current.list == null ? undefined : lists.get(current.list);
  if (!list) return current.mode.enterByKey?.(g, current, context);
  // Trees navigate depth themselves; copies over their palette have no slot to move.
  if (list.layout.nested) return;
  // Staying put still answers, so the sensor doesn't fall back to pixel steps.
  const center = () => {
    const element = items.get(current.slot)?.() ?? items.get(current.activeKey)?.();
    return element?.isConnected ? getCenter(getLayoutRect(element)) : pointer;
  };
  if (list.placeholder() === 'indicator') {
    return (await keyboardIndicator(g, current, list, context)) ?? center();
  }

  const strategy = list.strategy();
  // A block moves by items as one unit.
  const keys = viewOf(list, current);
  const position = keys.indexOf(current.slot);
  const slot = items.get(current.slot)?.();
  if (position === -1 || !slot?.isConnected) return center();
  const slotRect = getLayoutRect(slot);
  // Resting on a drop target in an item: the arrow that went there goes on past the
  // item, the opposite one comes back to the slot, any other moves from the slot.
  const stop = current.stop;
  current.stop = null;
  // Leaving the target: detect again even where the pointer stays (the slot that took
  // the item's place has its center where the target's was).
  if (stop) g.manager.scheduleFrame();
  const onward = !!stop && direction.x === stop.direction.x && direction.y === stop.direction.y;
  if (stop && !onward && direction.x === -stop.direction.x && direction.y === -stop.direction.y) return center();

  let target = list;
  let index: number | null = null;
  let across = false;
  if (strategy === 'grid' && direction.y) {
    const others = collect(g, list).filter((item) => item.index !== position);
    index = nextRowIndex(others, slotRect, direction.y > 0 ? 1 : -1);
    across = index === null;
  } else {
    const step = strategy === 'vertical' ? direction.y : direction.x;
    if (step) {
      const next = position + step;
      if (next >= 0 && next < keys.length) index = next;
    } else {
      across = true;
    }
  }
  if (across) {
    const other = adjacentList(g, list, active, direction);
    if (other?.placeholder() === 'indicator') {
      const line = enters(g, current, other) ? await indicateAcross(g, current, other, slotRect) : undefined;
      return line ?? center();
    }
    if (other) {
      target = other;
      index = insertionIndex(g, other, slotRect, current);
    }
  }
  if (index !== null) {
    if (target === list && !list.canSort()) index = null;
    else if (target !== list && target.id === current.origin.list && !target.canSort()) {
      returnToOrigin(g, null);
      index = null;
    }
  }
  // Passing an item with a drop target that takes the drag stops on the target first:
  // the next press drops into the item (or goes on past it, as the pointer does).
  const passed = index !== null && target === list && !onward ? keys[index] : undefined;
  const into = passed === undefined ? null : intoPoint(g, passed, list, active);
  if (into) {
    current.stop = { key: passed!, direction };
    return into;
  }
  // An external item takes the item the other list makes for it.
  if (index !== null && enters(g, current, target)) moveActive(g, target, index, null);

  await nextTick();
  if (g.session.value !== current) return;
  // In this list too when it keys its rows by index (Vuetify's v-data-table-virtual
  // remounts every row whose index changed).
  return slotCenter(g, current, target !== list || isFocusLost()) ?? center();
};
