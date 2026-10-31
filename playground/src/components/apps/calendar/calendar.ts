import type { CollisionDetection } from '@vue-dnd-kit/core';

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
/** Day columns and 30-minute rows, in px. Whole numbers so snapping never drifts. */
export const DAY_WIDTH = 110;
export const SLOT_HEIGHT = 24;
export const SLOT_MINUTES = 30;
export const DAY_START = 8 * 60;
export const DAY_END = 18 * 60;
export const SLOTS = (DAY_END - DAY_START) / SLOT_MINUTES;

export interface CalendarEvent {
  id: string;
  title: string;
  day: number;
  /** Minutes since midnight. */
  start: number;
  /** Minutes. */
  duration: number;
  color: string;
}

/** What each time-slot drop target carries. */
export interface SlotData {
  day: number;
  minutes: number;
}

export const isWeekend = (day: number): boolean => day >= 5;

const event = (id: string, title: string, day: number, hour: number, duration: number, color: string) => ({
  id,
  title,
  day,
  start: hour * 60,
  duration,
  color,
});

export const createEvents = (): CalendarEvent[] => [
  event('standup', 'Team standup', 0, 9, 30, '#2563eb'),
  event('design', 'Design review', 1, 10, 60, '#7c3aed'),
  event('lunch', 'Lunch with Sam', 2, 12, 60, '#d97706'),
  event('planning', 'Sprint planning', 3, 14, 90, '#059669'),
  event('demo', 'Client demo', 4, 15.5, 60, '#db2777'),
];

export const formatTime = (minutes: number): string =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

export const formatRange = (day: number, start: number, duration: number): string =>
  `${DAYS[day]} ${formatTime(start)} – ${formatTime(start + duration)}`;

/**
 * The slot under the top row of the dragged event (not under the pointer, which may
 * hold the event anywhere): that's the slot the event starts in when dropped.
 */
export const eventTopSlot: CollisionDetection = ({ overlayRect, candidates }) => {
  if (!overlayRect) return [];
  const x = overlayRect.left + overlayRect.width / 2;
  const y = overlayRect.top + SLOT_HEIGHT / 2;
  return candidates
    .filter(({ rect }) => x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom)
    .map((candidate) => candidate.id);
};
