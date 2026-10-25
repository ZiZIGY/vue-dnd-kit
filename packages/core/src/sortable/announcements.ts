/**
 * Default position-aware announcements for sortable lists (rfcs/0001-v3.md §10).
 * The provider's `announcements` prop overrides them (its texts that return `undefined`
 * fall back to them); the manager falls back to its generic texts when a drag doesn't
 * involve a sortable list.
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

/** The item a swap exchanged the dragged one with, and where it went. */
export interface SortablePartner {
  key: Key;
  spot: SortableSpot;
}

const where = ({ list, index, length }: SortableSpot) =>
  `position ${index + 1} of ${length} in list ${list}`;

const swapped = (partner?: SortablePartner) =>
  partner ? `, swapped with item ${partner.key} (now at ${where(partner.spot)})` : '';

export const sortableTexts = {
  start: (who: SortableSubject, spot: SortableSpot) =>
    `Picked up ${subject({ ...who, copy: false }, false)} at ${where(spot)}.`,
  over: (who: SortableSubject, spot: SortableSpot, partner?: SortablePartner) =>
    `${subject(who)} moved to ${where(spot)}${swapped(partner)}.`,
  end: (who: SortableSubject, spot: SortableSpot, partner?: SortablePartner) =>
    `${subject(who)} dropped at ${where(spot)}${swapped(partner)}.`,
  removed: (who: SortableSubject, list: Key) => `${subject(who)} removed from list ${list}.`,
  cancel: (who: SortableSubject, spot: SortableSpot) =>
    `Dragging was cancelled. ${subject({ ...who, copy: false })} returned to ${where(spot)}.`,
};
