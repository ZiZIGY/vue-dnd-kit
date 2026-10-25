/**
 * Keyboard moves in a tree: rows and depth. The tree answers the keyboard itself (the
 * group's keyboard skips nested layouts): the arrow picks a row and a depth, and the next
 * move applies them (`DragState.pending`).
 */

import type { Coordinates, Key, KeyboardMoveContext } from '../../types';
import { getLayoutRect } from '../../animation/layout';
import { revealElement } from '../../core/autoscroll';
import { depthRange, gapPosition, moveKey, parentAt, projectDepth, type DraftPosition } from './depth';
import {
  blockHere,
  depthFilter,
  indentation,
  indicating,
  movingRows,
  rows,
  slotKey,
  viewIndex,
  type DragState,
  type Spot,
  type TreeContext,
} from './context';
import { lineAt, lineBefore } from './layout';

/**
 * Pointer that puts the overlay over the slot `index` (FLIP-free layout rects): the
 * lead's clone over it, `offset` away from the pointer (see `group.leadOffset`).
 */
const slotCoordinates = <T>(
  t: TreeContext<T>,
  current: DragState,
  view: Key[],
  from: number,
  next: { index: number; depth: number },
  pointer: Coordinates,
  x: number,
  offset: Coordinates,
): Coordinates => {
  const rectOf = (key: Key | undefined) => {
    const element = key == null ? null : t.manager.getDraggable(key)?.getElement();
    return element?.isConnected ? getLayoutRect(element) : null;
  };
  const active = rectOf(slotKey(t, current));
  const passed = next.index === from ? null : rectOf(view[next.index]);
  if (!active || (next.index !== from && !passed)) return { x, y: pointer.y };
  // A multi-drag block moves as one: its first and last rows bound it.
  const block = blockHere(t);
  const first = rectOf(block[0]) ?? active;
  const last = rectOf(block[block.length - 1]) ?? active;
  let top = active.top;
  // Moving down, the passed row shifts up by the block: the block ends where the row ended.
  if (passed && next.index > from) top = passed.bottom - (last.bottom - active.top);
  else if (passed) top = passed.top + (active.top - first.top);
  // The keyboard drag starts at the row center, so the overlay's top follows `y - height / 2`.
  return { x, y: top + active.height / 2 - offset.y };
};

/**
 * Arrow keys: up/down move the slot by one visible row, keeping its depth where the
 * new neighbours allow it; left/right change the depth. In indicator mode the line
 * moves the same way, through the gaps between the rows that stay, skipping the
 * dragged node's own place at its own level (that drop would change nothing). A copy
 * or a created node moves like any node once it is here.
 */
export const keyboardCoordinates = <T>(
  t: TreeContext<T>,
  { active, pointer, direction }: KeyboardMoveContext,
): Coordinates | undefined => {
  const { group, entry } = t;
  const current = t.state;
  const session = group.session.value;
  if (!current || !session || !t.draft.value || active.id !== session.activeKey) return undefined;
  const slot = session.slot;
  const draftKeys = group.keysOf(entry);
  const at = group.indexOf(entry, slot);
  const from = viewIndex(t, current);
  const view = group.viewOf(entry);
  let positionAt = (index: number): DraftPosition => ({
    keys: index === from ? view : moveKey(view, slot, from, index),
    index,
    rows: rows(t),
  });
  let base = current.pending ?? { index: from, depth: t.placement.value?.depth ?? current.startDepth };
  let end = view.length - 1;
  let home = -1;
  if (indicating(t)) {
    const shown = group.indicator.value;
    const mine = shown?.list === t.id ? shown : null;
    // The line is in another list, or the dragged node isn't here.
    if (!mine && (shown || at === -1)) return undefined;
    const moving = movingRows(t, current);
    const gaps = gapPosition(draftKeys, mine ? mine.index : at, moving, rows(t));
    positionAt = (index) => ({ ...gaps, index });
    base = { index: gaps.index, depth: mine ? mine.depth! : current.startDepth };
    end = gaps.keys.length;
    // One node moving: its own place at its own level changes nothing (a copy there does).
    if (at !== -1 && session.mode.name !== 'copy' && session.keys.length < 2) {
      home = gapPosition(draftKeys, at, moving, rows(t)).index;
    }
  } else if (from === -1) {
    return undefined;
  }
  const filter = depthFilter(t);

  let next: Spot | null = null;
  if (direction.y) {
    const step = direction.y > 0 ? 1 : -1;
    for (let index = base.index + step; index >= 0 && index <= end; index += step) {
      const position = positionAt(index);
      const projection = projectDepth(position, base.depth, filter);
      if (projection && (index !== home || projection.depth !== current.startDepth)) {
        next = { position, projection };
        break;
      }
    }
  } else if (direction.x) {
    // One level in or out, only when that exact level is allowed here.
    const position = positionAt(base.index);
    const depth = base.depth + (direction.x > 0 ? 1 : -1);
    const { min, max } = depthRange(position);
    const parentKey = parentAt(position, depth);
    if (depth >= min && depth <= max && filter(depth, parentKey)) next = { position, projection: { depth, parentKey } };
  }
  // Staying put still answers, so the sensor doesn't fall back to pixel steps.
  if (!next) return pointer;
  const { position, projection } = next;
  // The overlay shifts by the levels it changes (from where it is: a node from another
  // list or a created one came in over the tree).
  const x = pointer.x + (projection.depth - base.depth) * indentation(t);
  // The grabbed row may ride in the lead: the lead's clone goes over the slot.
  const offset = group.leadOffset();
  if (!indicating(t)) {
    current.pending = { index: position.index, depth: projection.depth };
    return slotCoordinates(t, current, view, from, current.pending, pointer, x, offset);
  }
  const line = lineAt(t, current, position, projection.depth, lineBefore(t, position))!;
  group.showIndicator({ list: t.id, ...line });
  // The overlay goes over the row with the line.
  const element = (line.key == null ? null : t.manager.getDraggable(line.key)?.getElement()) ?? entry.getElement();
  if (!element?.isConnected) return pointer;
  revealElement(element);
  const rect = getLayoutRect(element);
  return { x, y: rect.top + rect.height / 2 - offset.y };
};
