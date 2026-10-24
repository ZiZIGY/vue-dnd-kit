/**
 * Default position-aware announcements for sortable lists (rfcs/0001-v3.md §10).
 * The provider's `announcements` prop overrides them; the manager falls back to
 * its generic texts when a drag doesn't involve a sortable list.
 */

import type { Key } from '../types';

export interface SortableSpot {
  list: Key;
  /** Zero-based position in the list. */
  index: number;
  length: number;
}

export interface SortableSubject {
  key: Key;
  count: number;
  copy: boolean;
}

const subject = ({ key, count, copy }: SortableSubject, capital = true): string => {
  const base = count > 1 ? `${count} items` : `item ${key}`;
  const text = copy ? `copy of ${base}` : base;
  return capital ? text.charAt(0).toUpperCase() + text.slice(1) : text;
};

const where = ({ list, index, length }: SortableSpot) =>
  `position ${index + 1} of ${length} in list ${list}`;

export const sortableTexts = {
  start: (who: SortableSubject, spot: SortableSpot) =>
    `Picked up ${subject({ ...who, copy: false }, false)}. It is in ${where(spot)}.`,
  over: (who: SortableSubject, spot: SortableSpot) => `${subject(who)} moved to ${where(spot)}.`,
  end: (who: SortableSubject, spot: SortableSpot) => `${subject(who)} dropped at ${where(spot)}.`,
  removed: (who: SortableSubject, list: Key) => `${subject(who)} removed from list ${list}.`,
  cancel: (who: SortableSubject, spot: SortableSpot) =>
    `Dragging was cancelled. ${subject({ ...who, copy: false })} returned to ${where(spot)}.`,
};
