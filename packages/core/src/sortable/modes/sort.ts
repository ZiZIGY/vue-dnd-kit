/**
 * Sorting (`'move'`): the dragged item itself, with its block, moves through the drafts
 * to where the pointer projects it. Copies and created items move the same way
 * (`sortOver`); only the item itself can be exchanged instead, over a list that swaps.
 */

import type { DnDEvent, SortableStrategy } from '../../types';
import type { GroupContext, Session } from '../context';
import type { ListEntry } from '../entry';
import { blocksKey } from '../stability';
import { isSwapping, partitionMoved } from '../accept';
import { collect, viewOf } from '../block';
import { moveActive, returnToOrigin } from '../slot';
import { atLead } from '../landing';
import { bandsAt } from '../combine';
import { asItself, itself, movingDragMode, type SortableMode } from './mode';
import { swap } from './swap';

/**
 * The event to project, its point along the list's axis. A modifier that keeps the overlay
 * in a box (`restrictToParent`, a drag area's `restrictToArea`) holds the point where the
 * item is held while the pointer goes on past the box's edge: held near its leading edge,
 * the item could never pass the center of the last item (or of the first). Once the pointer
 * has left the overlay along the axis, the projection follows the pointer. Grids keep the
 * point: there the overlay held at the edge covers the edge cell, and the point is in it.
 */
const heldBack = (g: GroupContext, event: DnDEvent, strategy: SortableStrategy): DnDEvent => {
  const { manager } = g;
  const active = manager.active.value;
  if (strategy === 'grid' || !active) return event;
  const [axis, start, end] = strategy === 'horizontal' ? (['x', 'left', 'right'] as const) : (['y', 'top', 'bottom'] as const);
  const pointer = manager.getRawPointer()[axis];
  const box = manager.getOverlayRect(active, manager.transform.value);
  if (pointer >= box[start] && pointer <= box[end]) return event;
  return { ...event, pointer: { ...event.pointer, [axis]: pointer } };
};

/** The slot goes to the index the pointer projects in `target` (see `SortableMode.over`). */
export const sortOver = (
  g: GroupContext,
  current: Session,
  target: ListEntry,
  event: DnDEvent,
  blocked: boolean,
): boolean => {
  const sameList = target.id === current.list;
  // `sort: false`: items can enter the list but not move inside it; back over its
  // own origin list the item returns to where it started (palettes).
  if (!target.canSort()) {
    if (!sameList && target.id === current.origin.list) {
      if (!blocked) returnToOrigin(g, event.pointer);
      return false;
    }
    if (sameList && !target.layout.nested) return false;
  }

  const keys = viewOf(target, current);
  const items = collect(g, target);
  const activeIndex = sameList ? keys.indexOf(current.slot) : -1;
  const strategy = target.strategy();
  const projection = target.layout.project(atLead(g, current, heldBack(g, event, strategy)), {
    keys,
    items,
    activeKey: current.slot,
    activeIndex,
    strategy,
    lock: current.lock,
    targets: bandsAt(g, event),
  });
  current.lock = projection.lock;
  // A list that can't sort still projects (tree depth), but keeps its order.
  const index = sameList && !target.canSort() ? null : projection.index;
  if (index == null || blocked || blocksKey(current.hysteresis, projection.key)) return false;
  moveActive(g, target, index, event.pointer);
  return true;
};

export const sort: SortableMode = {
  name: 'move',
  moves: true,
  dragMode: movingDragMode,
  partition: partitionMoved,
  over: (g, current, target, event, blocked) => {
    // A list that swaps (as the origin does) exchanges the item instead; over one that
    // sorts, an exchange made there is undone.
    if (isSwapping(g, current, target)) return swap.over(g, current, target, event, blocked);
    if (current.swap != null) swap.leave!(g, current);
    return sortOver(g, current, target, event, blocked);
  },
  inserted: itself,
  placed: asItself,
};
