/**
 * Default position-aware announcements for sortable lists (rfcs/0001-v3.md §10).
 * The provider's `announcements` prop overrides them (its texts that return `undefined`
 * fall back to them); the manager falls back to its generic texts when a drag doesn't
 * involve a sortable list.
 */

import type { AnnouncedPosition, AnnouncementContext, Announcer, DnDEndEvent, DnDEvent, Key } from '../types';
import { isForeign, keysOf, spotIn, type GroupContext, type Session } from './context';
import type { DropResult } from './drop';
import { isInto } from './combine';

export type SortableSpot = AnnouncedPosition;

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

const sortableTexts = {
  start: (who: SortableSubject, spot: SortableSpot) =>
    `Picked up ${subject({ ...who, copy: false }, false)} at ${where(spot)}.`,
  over: (who: SortableSubject, spot: SortableSpot, partner?: SortablePartner) =>
    `${subject(who)} moved to ${where(spot)}${swapped(partner)}.`,
  end: (who: SortableSubject, spot: SortableSpot, partner?: SortablePartner) =>
    `${subject(who)} dropped at ${where(spot)}${swapped(partner)}.`,
  removed: (who: SortableSubject, list: Key) => `${subject(who)} removed from list ${list}.`,
  /** Over a drop target inside an item (drop into the item). */
  target: (who: SortableSubject, target: Key) => `Over ${target}: dropping puts ${subject(who, false)} inside.`,
  into: (who: SortableSubject, target: Key) => `${subject(who)} dropped into ${target}.`,
  cancel: (who: SortableSubject, spot: SortableSpot) =>
    `Dragging was cancelled. ${subject({ ...who, copy: false })} returned to ${where(spot)}.`,
};

// ─── The group's announcer ──────────────────────────────────────────────────────

const spotKey = ({ list, index, length }: SortableSpot) => `${String(list)}\u0000${index}\u0000${length}`;

// What moves: the lead, which carries the active node when that rides in it.
const subjectOf = (current: Session): SortableSubject => ({
  key: current.lead,
  count: current.keys.length,
  copy: current.mode.name === 'copy',
});

export const spotOf = (g: GroupContext, current: Session): SortableSpot | null => {
  const shown = g.indicator.value;
  if (shown) {
    const list = g.lists.get(shown.list);
    const keys = list ? keysOf(list) : [];
    const own = keys.indexOf(current.slot);
    const index = own >= 0 && own < shown.index ? shown.index - 1 : shown.index;
    return { list: shown.list, index, length: own >= 0 ? keys.length : keys.length + 1 };
  }
  if (current.list == null) return null;
  const keys = keysOf(g.lists.get(current.list)!);
  // A block is placed where it starts.
  return { list: current.list, index: keys.indexOf(current.block[0]!), length: keys.length };
};

/** What a text says, for the provider's own texts (`AnnouncementContext`). */
const contextOf = (
  who: SortableSubject,
  spot?: SortableSpot | null,
  partner?: SortablePartner,
): Partial<AnnouncementContext> => ({
  count: who.count,
  copy: who.copy,
  ...(spot && { position: spot }),
  ...(partner && { partner: { key: partner.key, position: partner.spot } }),
});

/** A swap partner sits where the active item started. */
const partnerOf = (g: GroupContext, current: Session): SortablePartner | undefined =>
  current.swap == null ? undefined : { key: current.swap, spot: spotIn(g, current.origin.list!, current.origin.index) };

/** The text of a drag's end, and what it is about. */
export interface SortableAnnouncement {
  text: string | undefined;
  context: Partial<AnnouncementContext>;
}

/** The pickup announcement names where the drag starts: the first target of the drag doesn't repeat it. */
export const pickedUpAt = (g: GroupContext, current: Session) => {
  const origin = current.origin.list!;
  const formed = current.base.get(origin)!;
  g.spokenSpot = current.grouped
    ? spotKey({ list: origin, index: formed.indexOf(current.keys[0]!), length: formed.length })
    : spotKey(spotIn(g, origin, current.origin.index));
};

/** What the end of the drag says, computed while the session still exists. */
export const endAnnouncement = (
  g: GroupContext,
  current: Session,
  event: DnDEndEvent,
  result: DropResult | null,
): SortableAnnouncement => {
  const who = subjectOf(current);
  if (isInto(g, event)) return { text: sortableTexts.into(who, event.over!.id), context: contextOf(who) };
  if (current.removed) {
    return { text: result ? sortableTexts.removed(who, result.event.to.list) : undefined, context: contextOf(who) };
  }
  if (result && result.event.to.index >= 0) {
    const list = g.lists.get(result.event.to.list);
    // The committed keys: a `defineModel` ref only shows the new array after the parent re-renders.
    const committed = list ? (result.next.get(list) ?? list.getKeys()) : [];
    const spot = { list: result.event.to.list, index: result.event.to.index, length: committed.length };
    // A swap changes no list's length.
    const swapped = result.event.partner;
    const partner = swapped && { key: swapped.key, spot: spotIn(g, swapped.to.list, swapped.to.index) };
    return { text: sortableTexts.end(who, spot, partner), context: contextOf(who, spot, partner) };
  }
  if (!result && !isForeign(g, event) && current.mode.moves && current.origin.list != null) {
    const spot = spotIn(g, current.origin.list, current.origin.index);
    return { text: sortableTexts.end(who, spot), context: contextOf(who, spot) };
  }
  return { text: undefined, context: contextOf(who) };
};

/** What a cancel says: the items went back home. */
export const cancelAnnouncement = (g: GroupContext, current: Session): SortableAnnouncement => {
  const who = subjectOf(current);
  const spot = spotIn(g, current.origin.list!, current.origin.index);
  return { text: sortableTexts.cancel(who, spot), context: contextOf(who, spot) };
};

const ours = (g: GroupContext, event: DnDEvent) => {
  const current = g.session.value;
  return current && current.activeKey === event.active.id && !isForeign(g, event) ? current : null;
};

export const createAnnouncer = (g: GroupContext): Announcer => ({
  describe: (name, event) => {
    if (name === 'onDragEnd' || name === 'onDragCancel') {
      return g.announced?.key === event.active.id ? g.announced.context : undefined;
    }
    const current = ours(g, event);
    if (!current) return undefined;
    const who = subjectOf(current);
    if (name === 'onDragStart') {
      return contextOf(who, current.origin.list == null ? null : spotIn(g, current.origin.list, current.origin.index));
    }
    // Over a drop target in an item, the drop goes into it: no position in the list.
    return isInto(g, event) ? contextOf(who) : contextOf(who, spotOf(g, current), partnerOf(g, current));
  },
  onDragStart: (event) => {
    const current = ours(g, event);
    if (!current || current.origin.list == null) return undefined;
    return sortableTexts.start(subjectOf(current), spotIn(g, current.origin.list, current.origin.index));
  },
  onDragOver: (event) => {
    const into = g.session.value;
    if (into?.activeKey === event.active.id && isInto(g, event)) {
      // Back over the list, the position is spoken again.
      g.spokenSpot = null;
      return sortableTexts.target(subjectOf(into), event.over!.id);
    }
    const current = ours(g, event);
    const spot = current && spotOf(g, current);
    if (!spot) return undefined;
    // '' tells the manager there is nothing new, without cancelling a pending text.
    const key = spotKey(spot);
    if (key === g.spokenSpot) return '';
    g.spokenSpot = key;
    return sortableTexts.over(subjectOf(current), spot, partnerOf(g, current));
  },
  onDragEnd: (event) => (g.announced?.key === event.active.id ? g.announced.text : undefined),
  onDragCancel: (event) => (g.announced?.key === event.active.id ? g.announced.text : undefined),
});
