/**
 * Drop targets inside sortable items, "drop into an item" (rfcs/0001-v3.md §6): the
 * middle of an item drops into it, its edges sort as usual. The middle is the band
 * trees nest with, taken along the list's main axis (x in grids, whose rows run along x).
 */

import type { Coordinates, Rect, SortableStrategy } from '../types';
import { createRect, getCenter, intersectRect } from '../animation/layout';
import { NEST_BAND } from './tree';

/** The middle band of an item: across the whole item, `NEST_BAND` of it along the main axis. */
export const dropBand = (item: Rect, strategy: SortableStrategy): Rect => {
  const { start, end } = NEST_BAND;
  return strategy === 'vertical'
    ? createRect(item.left, item.top + item.height * start, item.width, item.height * (end - start))
    : createRect(item.left + item.width * start, item.top, item.width * (end - start), item.height);
};

/** Keyboard: where the pointer goes to drop into the item, on `target` inside its band; `null` when they don't meet. */
export const dropBandPoint = (item: Rect, target: Rect, strategy: SortableStrategy): Coordinates | null => {
  const area = intersectRect(dropBand(item, strategy), target);
  return area && getCenter(area);
};
