/**
 * Drop targets inside sortable items, "drop into an item" (rfcs/0001-v3.md §6): the
 * middle of an item drops into it, its edges sort as usual. The middle is the band
 * trees nest with, taken along the list's main axis (x in grids, whose rows run along x).
 *
 * The target is no list, so the drop is the target's (the lists change only if its
 * `onDrop` calls `e.source.remove()`). The group keeps the target from counting outside
 * the middle band (`targetRule`) and the projection still over the band (`bandsAt`),
 * and lets the keyboard stop on the target (`intoPoint`) and the announcements name it
 * (`isInto`).
 */

import type { Active, Coordinates, DnDEvent, Key, Rect, SortableStrategy } from '../types';
import type { TargetRule } from '../core/manager';
import { containsPoint, createRect, getCenter, getRect, intersectRect, stopLayoutAnimation } from '../animation/layout';
import { revealElement } from '../core/autoscroll';
import { listOfKey, type GroupContext } from './context';
import type { ListEntry } from './entry';
import { accepts } from './accept';
import { NEST_BAND } from './tree/projection';

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

/** The bands for projecting `event`: of its own target detection. */
export const bandsAt = (g: GroupContext, event: DnDEvent) =>
  g.targets.at === event.pointer ? g.targets.bands : undefined;

/**
 * A drop target inside an item of a list that takes the drag (rfcs/0001-v3.md §6)
 * counts only while the pointer is in the item's middle: the drop goes into the item
 * there, and at its edges the list sorts as usual. A target that doesn't take the drag
 * is left out, so the list sorts over it like over any item. Nested lists are lists.
 */
export const targetRule =
  (g: GroupContext): TargetRule =>
  (entry, element, point, active) => {
    const current = g.session.value;
    if (!current || current.activeKey !== active.id || entry.sortable) return true;
    const found = g.manager.findDraggable(element);
    const key = found?.entry.id;
    const list = key != null && g.items.get(key)?.() === found!.element ? listOfKey(g, key, true) : undefined;
    if (!list || !accepts(g, list, active)) return true;
    if (!entry.accepts(active)) return false;
    if (g.targets.at !== point) g.targets = { at: point, bands: new Map(), ids: new Set() };
    // Layout rects, as projection uses: an item still sliding into place counts where it lands.
    const band = dropBand(g.manager.measure(found!.element), list.strategy());
    g.targets.bands.set(key!, band);
    if (!containsPoint(band, point)) return false;
    g.targets.ids.add(entry.id);
    return true;
  };

/** The drag is over a drop target inside an item: dropping goes into that item. */
export const isInto = (g: GroupContext, event: DnDEvent) =>
  !!event.over && g.targets.at === event.pointer && g.targets.ids.has(event.over.id);

/** Keyboard: where the pointer drops into item `key`, on a target in its middle that takes the drag; `null` without one. */
export const intoPoint = (g: GroupContext, key: Key, list: ListEntry, active: Active): Coordinates | null => {
  const { manager } = g;
  const element = g.items.get(key)?.();
  if (!element?.isConnected) return null;
  let rect: Rect | null = null;
  for (const entry of manager.getDroppables()) {
    const target = entry.getElement();
    if (!target?.isConnected || entry.sortable || entry.isDisabled() || manager.isOwned(target, active)) continue;
    if (manager.findDraggable(target)?.element !== element || !entry.accepts(active)) continue;
    if (!rect) {
      // The hit test sees the item where it lands: a passed item may still be sliding there.
      stopLayoutAnimation(element);
      revealElement(element);
      rect = getRect(element);
    }
    const point = dropBandPoint(rect, getRect(target), list.strategy());
    if (point) return point;
  }
  return null;
};
