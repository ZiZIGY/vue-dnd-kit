/**
 * `placeholder: 'indicator'`: the list doesn't move, a line shows where the drop goes.
 * The slot stays (or goes back) where it started; the line is the group's `indicator`.
 */

import type { Coordinates, DnDEvent, Key, SortableIndicator } from '../types';
import { getCenter, getLayoutRect } from '../animation/layout';
import { revealElement } from '../core/autoscroll';
import { keysOf, type GroupContext } from './context';
import type { ListEntry } from './entry';
import { collect } from './block';
import { keepSlotHome } from './slot';
import { atLead } from './landing';
import { bandsAt } from './combine';
import { canSwap, isSwapping } from './accept';
import { hitItem } from './projection';

const INDICATOR_FIELDS = ['list', 'index', 'key', 'side', 'depth', 'parentKey'] as const;

const sameIndicator = (a: SortableIndicator | null, b: SortableIndicator | null) =>
  a === b || (!!a && !!b && INDICATOR_FIELDS.every((field) => a[field] === b[field]));

export const setIndicator = (g: GroupContext, value: SortableIndicator | null) => {
  if (sameIndicator(g.indicator.value, value)) return false;
  g.indicator.value = value;
  return true;
};

/** Shows the insertion line (trees move it with their own keys). */
export const showIndicator = (g: GroupContext, value: SortableIndicator | null) => {
  const current = g.session.value!;
  if (value) current.indicator = value;
  if (setIndicator(g, value) && value) g.manager.announce('onDragOver');
};

/**
 * In a list that swaps, the mark is on the item the drop would exchange with
 * (`side: 'swap'`); `null` over the dragged item itself or over one that can't take its place.
 */
export const swapMark = (g: GroupContext, target: ListEntry, key: Key | null): SortableIndicator | null => {
  const current = g.session.value!;
  if (key == null || key === current.slot || !canSwap(g, current, target, key)) return null;
  return { list: target.id, index: keysOf(target).indexOf(key), key, side: 'swap' };
};

/** The pointer moves over `target`, an indicator list: the line goes where it points. */
export const updateIndicator = (g: GroupContext, target: ListEntry, event: DnDEvent) => {
  const current = g.session.value!;
  keepSlotHome(g, current);
  const items = collect(g, target);
  if (isSwapping(g, current, target)) {
    // Between two items the mark stays; over the dragged item it goes.
    const hit = hitItem(target.strategy(), event.pointer, items);
    if (hit) showIndicator(g, swapMark(g, target, hit.key));
    return;
  }
  const result = target.layout.indicate(atLead(g, current, event), {
    keys: keysOf(target),
    items,
    activeKey: current.slot,
    activeIndex: -1,
    strategy: target.strategy(),
    lock: null,
    targets: bandsAt(g, event),
  });
  if (result !== undefined) showIndicator(g, result && { list: target.id, ...result });
};

/** Keyboard, a list that swaps: marks `key` (the dragged item: no mark); returns where the overlay goes. */
export const markSwapAt = (g: GroupContext, target: ListEntry, key: Key): Coordinates | undefined => {
  showIndicator(g, swapMark(g, target, key));
  const element = g.items.get(key)?.();
  if (!element?.isConnected) return undefined;
  revealElement(element);
  return getCenter(getLayoutRect(element));
};

/** Keyboard: shows the insertion line at `index` of `target`; returns where the overlay goes. */
export const indicateAt = (g: GroupContext, target: ListEntry, index: number): Coordinates | undefined => {
  const line = target.layout.indicateAt(keysOf(target), index);
  if (!line) return undefined;
  showIndicator(g, { list: target.id, ...line });
  const element = (line.key == null ? null : g.items.get(line.key)?.()) ?? target.getElement();
  if (!element?.isConnected) return undefined;
  revealElement(element);
  return getCenter(getLayoutRect(element));
};
