/**
 * `placeholder: 'indicator'`: the list doesn't move, a line shows where the drop goes.
 * The slot stays (or goes back) where it started; the line is the group's `indicator`.
 */

import type { Coordinates, DnDEvent, SortableIndicator } from '../types';
import { getCenter, getLayoutRect } from '../animation/layout';
import { revealElement } from '../core/autoscroll';
import { keysOf, type GroupContext } from './context';
import type { ListEntry } from './entry';
import { projectIndicator, type IndicatorProjection } from './projection';
import { collect } from './block';
import { keepSlotHome } from './slot';
import { atLead } from './landing';
import { bandsAt } from './combine';

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

/** The pointer moves over `target`, an indicator list: the line goes where it points. */
export const updateIndicator = (g: GroupContext, target: ListEntry, event: DnDEvent) => {
  const current = g.session.value!;
  keepSlotHome(g, current);
  const items = collect(g, target);
  const lead = atLead(g, current, event);
  const result = target.indicate
    ? target.indicate(lead, items)
    : projectIndicator({
        strategy: target.strategy(),
        pointer: lead.pointer,
        items,
        activeKey: current.slot,
        length: keysOf(target).length,
        targets: bandsAt(g, event),
      });
  if (result !== undefined) showIndicator(g, result && { list: target.id, ...result });
};

/** Keyboard: shows the insertion line at `index` of `target`; returns where the overlay goes. */
export const indicateAt = (g: GroupContext, target: ListEntry, index: number): Coordinates | undefined => {
  const keys = keysOf(target);
  const line: IndicatorProjection | null = target.indicateAt
    ? target.indicateAt(index)
    : index < keys.length
      ? { index, key: keys[index]!, side: 'before' }
      : { index, key: keys[keys.length - 1] ?? null, side: 'after' };
  if (!line) return undefined;
  showIndicator(g, { list: target.id, ...line });
  const element = (line.key == null ? null : g.items.get(line.key)?.()) ?? target.getElement();
  if (!element?.isConnected) return undefined;
  revealElement(element);
  return getCenter(getLayoutRect(element));
};
