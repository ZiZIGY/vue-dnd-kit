/**
 * Days and times. A day is a whole number counted from 1970-01-01, so the next week is +7
 * and no time zone or daylight saving change gets in the way. A time is minutes from midnight.
 */

export type Day = number;

const DAY_MS = 86_400_000;

/** The day a date falls on, where you are. */
export const toDay = (date: Date): Day => Math.round(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS);

/** A day as a date, to be read in UTC, as `toDay` wrote it. */
const dateOf = (day: Day) => new Date(day * DAY_MS);

/** 0 is Monday, 6 is Sunday. */
export const weekdayOf = (day: Day) => (dateOf(day).getUTCDay() + 6) % 7;
export const mondayOf = (day: Day): Day => day - weekdayOf(day);
export const dateNumber = (day: Day) => dateOf(day).getUTCDate();
export const isWeekend = (day: Day) => weekdayOf(day) >= 5;

/** The first day of the month `months` after the one `day` is in. */
export const firstOfMonth = (day: Day, months = 0): Day => {
  const date = dateOf(day);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1) / DAY_MS;
};

/** ISO week number: week 1 has the year's first Thursday. */
export const weekNumber = (day: Day) => {
  const thursday = mondayOf(day) + 3;
  const january = Date.UTC(dateOf(thursday).getUTCFullYear(), 0, 1) / DAY_MS;
  return Math.floor((thursday - january) / 7) + 1;
};

const formatter = (options: Intl.DateTimeFormatOptions) => {
  const format = new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'UTC' });
  return (day: Day) => format.format(dateOf(day));
};

export const shortWeekday = formatter({ weekday: 'short' }); // Tue
export const longWeekday = formatter({ weekday: 'long' }); // Tuesday
export const shortMonth = formatter({ month: 'short' }); // Nov
export const year = formatter({ year: 'numeric' }); // 2026
export const monthYear = formatter({ month: 'long', year: 'numeric' }); // November 2026
export const fullDate = formatter({ weekday: 'long', month: 'long', day: 'numeric' }); // Tuesday, November 3

// ─── The hours ─────────────────────────────────────────────────────────────────

/** An hour is 48 px tall, and events snap to quarters of an hour: 12 px, a whole number. */
export const HOUR_PX = 48;
export const STEP = 15;
export const STEP_PX = (HOUR_PX * STEP) / 60;
export const DAY_MINUTES = 24 * 60;

export const toPx = (minutes: number) => (minutes * HOUR_PX) / 60;

/** The time `y` px down a day stands for, to the quarter of an hour. */
export const minutesAt = (y: number) => Math.round(y / STEP_PX) * STEP;

export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/** 9:05, 14:30 */
export const clock = (minutes: number) => `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;

/** 10:30 – 11:15 */
export const span = (start: number, duration: number) => `${clock(start)} – ${clock(start + duration)}`;

/** 15m, 1h, 1h 30m */
export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return [hours && `${hours}h`, rest && `${rest}m`].filter(Boolean).join(' ');
};
