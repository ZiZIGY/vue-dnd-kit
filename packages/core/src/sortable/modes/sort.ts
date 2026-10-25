/**
 * Sorting (`'move'`): the dragged item itself, with its block, moves through the drafts
 * to where the pointer projects it. Copies and created items move the same way
 * (`sortOver`); only the item itself can be exchanged instead, over a list that swaps.
 */

import type { DnDEvent } from '../../types';
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
  const projection = target.layout.project(atLead(g, current, event), {
    keys,
    items,
    activeKey: current.slot,
    activeIndex,
    strategy: target.strategy(),
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
