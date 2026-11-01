import type { Coordinates, Over } from '@vue-dnd-kit/core';
import type { CalendarEvent, Place } from './calendar';
import { DAY_MINUTES, STEP, STEP_PX, clamp, clock, longWeekday, minutesAt, shortWeekday, span, type Day } from './time';

/** What a drop target is (its `data`): the hours of a day, a day's all-day cell, or the task list. */
export type Target = { kind: 'hours'; day: Day } | { kind: 'all-day'; day: Day } | { kind: 'tasks' };

/**
 * What a drag carries (its `data`): an event, the start or end edge of one, or empty time
 * pressed `from` px down a day.
 */
export type DragData =
  | { kind: 'event'; event: CalendarEvent }
  | { kind: 'edge'; event: CalendarEvent; edge: 'start' | 'end' }
  | { kind: 'new'; day: Day; from: number };

/** The height of an event's edges (Edge.vue), in px: the edge itself is in their middle. */
const EDGE_PX = 8;

/**
 * Where a drop on `over` would put the event. The overlay's label, the ghost in the day,
 * what screen readers hear and the drop itself all ask this, so they never disagree.
 * `position` is where the dragged box's top-left corner is in the target.
 */
export function placeOf(event: CalendarEvent, over: Over | null, position: Coordinates | null): Place | null {
  const target = over?.accepted ? (over.data as Target) : null;
  if (!target) return null;
  if (target.kind === 'tasks') return { day: null, start: null };
  if (target.kind === 'all-day') return { day: target.day, start: null };
  if (!position) return null;
  return { day: target.day, start: clamp(minutesAt(position.y), 0, DAY_MINUTES - event.duration) };
}

/** The event with one edge dragged to `position` (the edge's box in the day): at least a quarter of an hour long. */
export function resizeTo(event: CalendarEvent, edge: 'start' | 'end', position: Coordinates) {
  const start = event.start ?? 0;
  const end = start + event.duration;
  const at = clamp(minutesAt(position.y + EDGE_PX / 2), 0, DAY_MINUTES);
  if (edge === 'start') {
    const from = Math.min(at, end - STEP);
    return { start: from, duration: end - from };
  }
  return { start, duration: Math.max(at, start + STEP) - start };
}

/** The quarters of an hour between two points of a day, `from` the press `to` the pointer. */
export function rangeOf(from: number, to: number) {
  const start = clamp(Math.floor(Math.min(from, to) / STEP_PX) * STEP, 0, DAY_MINUTES - STEP);
  const end = clamp(Math.ceil(Math.max(from, to) / STEP_PX) * STEP, start + STEP, DAY_MINUTES);
  return { start, duration: end - start };
}

/** "Tue 10:30 – 11:15", "Tue · All day", "Unscheduled": for the overlay. */
export function labelOf(place: Place, duration: number): string {
  if (place.day === null) return 'Unscheduled';
  if (place.start === null) return `${shortWeekday(place.day)} · All day`;
  return `${shortWeekday(place.day)} ${span(place.start, duration)}`;
}

/** "Tuesday, 10:30 to 11:15", "Tuesday, all day", "Unscheduled": for screen readers. */
export function spokenOf(place: Place, duration: number): string {
  if (place.day === null) return 'Unscheduled';
  if (place.start === null) return `${longWeekday(place.day)}, all day`;
  return `${longWeekday(place.day)}, ${clock(place.start)} to ${clock(place.start + duration)}`;
}

/** A block of half an hour or less has room for one line; a quarter of an hour, for a small one. */
export const sizeOf = (duration: number) => (duration <= 15 ? 'tiny' : duration <= 30 ? 'short' : undefined);

export interface Slot {
  event: CalendarEvent;
  column: number;
  columns: number;
}

/**
 * Overlapping events go side by side: each takes the first column free when it starts, and
 * events that overlap one another, directly or through others, share the day's width.
 */
export function layoutDay(events: CalendarEvent[]): Slot[] {
  const sorted = [...events].sort((a, b) => a.start! - b.start! || b.duration - a.duration);
  const slots: Slot[] = [];
  let group: Slot[] = [];
  /** When each column of the group is free again. */
  let ends: number[] = [];

  for (const event of sorted) {
    const start = event.start!;
    // Everything so far has ended: the next group begins.
    if (ends.every((end) => end <= start)) {
      for (const slot of group) slot.columns = ends.length;
      group = [];
      ends = [];
    }
    let column = ends.findIndex((end) => end <= start);
    if (column === -1) column = ends.length;
    ends[column] = start + event.duration;
    const slot = { event, column, columns: 1 };
    group.push(slot);
    slots.push(slot);
  }
  for (const slot of group) slot.columns = ends.length;
  return slots;
}
