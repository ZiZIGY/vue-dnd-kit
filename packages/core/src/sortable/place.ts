/**
 * Programmatic moves (`SensorDrag.place`, `moveItem` of `@vue-dnd-kit/actions`): the slot
 * goes straight to a position of a list, the way keyboard moves take it there
 * (`keyboard.ts`). Another list takes it only if it accepts the drag; an indicator list
 * shows its line there instead; trees aren't placed (their positions have a depth).
 */

import { nextTick } from 'vue';
import type { Active, Coordinates, SortablePosition } from '../types';
import { getCenter } from '../animation/layout';
import { isFocusLost } from '../utils/dom';
import { keysOf, listOf, type GroupContext } from './context';
import { accepts } from './accept';
import { viewOf } from './block';
import { keepSlotHome, moveActive, returnToOrigin } from './slot';
import { indicateAt, setIndicator } from './indicator';
import { slotCenter } from './keyboard';
import { enters } from './modes/mode';

/** `index` within 0…`max`; none (or not a number) is the end. */
const clampIndex = (index: number | undefined, max: number) =>
  index === undefined || Number.isNaN(index) ? max : Math.min(Math.max(Math.trunc(index), 0), max);

/** Puts the slot of `active` at `position`; returns where the drag goes, `undefined` when it can't go there. */
export const placeAt = async (
  g: GroupContext,
  active: Active,
  position: SortablePosition,
): Promise<Coordinates | undefined> => {
  const current = g.session.value;
  if (!current || current.activeKey !== active.id) return undefined;
  const from = listOf(g, current.list);
  const target = position.list == null ? (from ?? listOf(g, current.origin.list)) : g.lists.get(position.list);
  if (!target || target.layout.nested || target.isDisabled() || !accepts(g, target, active)) return undefined;
  const settled = async () => {
    await nextTick();
    return g.session.value === current;
  };

  if (target.placeholder() === 'indicator') {
    if (!enters(g, current, target)) return undefined;
    // The list doesn't move: the slot stays (or goes back) home, the line goes there.
    const home = current.list;
    keepSlotHome(g, current);
    if (!(await settled())) return undefined;
    if (current.list !== home) slotCenter(g, current, true);
    const keys = keysOf(target);
    const own = target.id === current.list ? keys.indexOf(current.slot) : -1;
    // Counted without the item: past its own place, the line goes one further.
    let line = clampIndex(position.index, own >= 0 ? keys.length - 1 : keys.length);
    if (own >= 0 && line > own) line++;
    return indicateAt(g, target, line);
  }

  setIndicator(g, null);
  if (target === from) {
    if (!target.canSort()) return undefined;
    moveActive(g, target, clampIndex(position.index, viewOf(target, current).length - 1), null);
  } else if (target.id === current.origin.list && !target.canSort()) {
    // Its own list, which doesn't sort: the item can only go back to its place.
    returnToOrigin(g, null);
  } else {
    if (!enters(g, current, target)) return undefined;
    moveActive(g, target, clampIndex(position.index, keysOf(target).length), null);
  }
  if (!(await settled())) return undefined;
  return (
    slotCenter(g, current, target !== from || isFocusLost()) ?? g.manager.pointer.value ?? getCenter(active.rect)
  );
};
