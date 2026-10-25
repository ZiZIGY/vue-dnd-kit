/**
 * Sorting (`'move'`): the dragged item itself, with its block, moves through the drafts
 * to where the pointer projects it. Copies and created items move the same way
 * (`sortOver`); only the item itself can be exchanged instead, over a list that swaps.
 */

import type { DnDEvent, Key } from '../../types';
import type { GroupContext, Session } from '../context';
import type { ListEntry } from '../entry';
import { projectIndex } from '../projection';
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
    if (sameList && !target.project) return false;
  }

  const keys = viewOf(target, current);
  const projectionItems = collect(g, target);
  const activeIndex = sameList ? keys.indexOf(current.slot) : -1;
  const lead = atLead(g, current, event);
  let index: number | null;
  let trigger: Key | null = null;
  if (target.project) {
    index = target.project(lead, { keys, items: projectionItems, activeKey: current.slot, activeIndex });
    // A list that can't sort still projects (tree depth), but keeps its order.
    if (sameList && !target.canSort()) index = null;
  } else {
    const projection = projectIndex({
      strategy: target.strategy(),
      pointer: lead.pointer,
      items: projectionItems,
      activeKey: current.slot,
      activeIndex,
      length: keys.length,
      lock: current.lock,
      targets: bandsAt(g, event),
    });
    current.lock = projection.lock;
    index = projection.index;
    trigger = projection.key;
  }
  if (index == null || blocked || blocksKey(current.hysteresis, trigger)) return false;
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
