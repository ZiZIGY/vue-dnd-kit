export interface CalendarEvent {
  id: string;
  title: string;
  /** 0 is Monday. */
  day: number;
  /** In hours: 9.5 is 9:30. */
  start: number;
  /** In hours. */
  duration: number;
  color: string;
}

/** The grid, in px. Whole numbers, so snapping never drifts. */
export const DAY_WIDTH = 120;
export const HOUR_HEIGHT = 44;
/** The hours the week shows. */
export const FIRST_HOUR = 9;
export const LAST_HOUR = 17;

/** The start of an event whose box is `y` px down a day, to the half hour. */
export const startAt = (y: number) => FIRST_HOUR + Math.round(y / (HOUR_HEIGHT / 2)) / 2;

export const formatTime = (hours: number) => `${Math.floor(hours)}:${hours % 1 ? '30' : '00'}`;
