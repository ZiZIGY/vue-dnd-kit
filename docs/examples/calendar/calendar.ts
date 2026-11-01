import { computed, inject, reactive, ref, shallowRef, type InjectionKey } from 'vue';
import type { Key } from '@vue-dnd-kit/core';
import { clock, mondayOf, shortWeekday, span, type Day } from './time';

export const CALENDARS = [
  { id: 'work', name: 'Work', color: '#3b82f6' },
  { id: 'product', name: 'Product', color: '#a855f7' },
  { id: 'focus', name: 'Focus', color: '#42b883' },
  { id: 'personal', name: 'Personal', color: '#f59e0b' },
] as const;

export type CalendarId = (typeof CALENDARS)[number]['id'];

export const colorOf = (id: CalendarId) => CALENDARS.find((calendar) => calendar.id === id)!.color;

export interface CalendarEvent {
  id: string;
  title: string;
  calendar: CalendarId;
  /** `null`: not planned yet, a task in the side panel. */
  day: Day | null;
  /** Minutes from midnight; `null`: all day, or not planned. */
  start: number | null;
  /** Minutes. Kept all day and unplanned too: back in the hours, the event has its length again. */
  duration: number;
}

/** Where an event is: at a time on a day, all day on a day, or nowhere yet. */
export type Place = Pick<CalendarEvent, 'day' | 'start'>;

/** A week of events around `monday` (and next week's standups), plus tasks to plan. */
function seed(monday: Day): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  /** `day` counts from this Monday; `at` is in hours (9.5 is 9:30), `null` all day. */
  const add = (title: string, calendar: CalendarId, day: number | null, at: number | null, duration = 60) =>
    events.push({
      id: `event-${events.length + 1}`,
      title,
      calendar,
      day: day === null ? null : monday + day,
      start: at === null ? null : at * 60,
      duration,
    });

  for (const day of [0, 1, 2, 3, 4, 7, 8, 9, 10, 11]) add('Standup', 'work', day, 9.5, 15);
  add('Sprint planning', 'product', 0, 10, 90);
  add('Lunch with Sam', 'personal', 0, 12.5);
  add('Deep work', 'focus', 0, 14, 120);
  add('Design review', 'product', 1, 11);
  add('1:1 with Maya', 'work', 1, 11.5, 45);
  add('Interview: frontend', 'work', 1, 15);
  add('Gym', 'personal', 2, 7.5);
  add('Write the API docs', 'focus', 2, 10, 120);
  add('Demo prep', 'product', 2, 13.5, 45);
  add('Client demo', 'work', 2, 14);
  add('Team lunch', 'personal', 3, 12, 75);
  add('Roadmap sync', 'product', 3, 16, 90);
  add('Retro', 'work', 4, 11);
  add('Ship v3.2', 'focus', 4, 14, 120);
  add('Farmers market', 'personal', 5, 10, 90);
  add('Long run', 'personal', 6, 9, 75);
  add('Plan the week', 'focus', 6, 18, 30);
  add('Ana’s birthday', 'personal', 3, null);
  add('Release day', 'work', 4, null);
  add('Team offsite', 'work', 9, null);
  add('Write release notes', 'work', null, null, 45);
  add('Review PR #482', 'work', null, null, 30);
  add('Plan the offsite agenda', 'product', null, null);
  add('Book the dentist', 'personal', null, null, 15);
  add('Sketch onboarding flow', 'product', null, null, 90);
  return events;
}

/** What changed, for the toast and for undo. */
function describe(event: CalendarEvent, to: Place): string {
  if (to.day === null) return `“${event.title}” is back in Unscheduled`;
  if (to.start === null) return `“${event.title}” is all day on ${shortWeekday(to.day)}`;
  const when = `${shortWeekday(to.day)} ${clock(to.start)}`;
  return event.day === null ? `Scheduled “${event.title}” for ${when}` : `Moved “${event.title}” to ${when}`;
}

/**
 * The calendar's state, shared by its components: the events, the calendars switched off,
 * the event being named, and an undo history. Every change goes through `change()`.
 */
export function createCalendar(today: Day) {
  const events = ref<CalendarEvent[]>(seed(mondayOf(today)));
  /** Calendars switched off in the side panel: their events are left out everywhere. */
  const hidden = reactive(new Set<CalendarId>());
  /** The event whose title is being typed: a new one. */
  const editing = ref<string | null>(null);
  /** The events before each change, and what the change was. */
  const history = shallowRef<Array<{ before: CalendarEvent[]; text: string }>>([]);
  /** The last change, for the toast. `id` tells two changes with the same text apart. */
  const notice = shallowRef<{ id: number; text: string; undoable: boolean } | null>(null);

  const shown = computed(() => events.value.filter((event) => !hidden.has(event.calendar)));
  /** Where new events go: the first calendar shown, so they don't vanish into one switched off. */
  const fresh = computed<CalendarId>(() => CALENDARS.find(({ id }) => !hidden.has(id))?.id ?? 'work');
  const tasks = computed(() => shown.value.filter((event) => event.day === null));
  const on = (day: Day) => shown.value.filter((event) => event.day === day);
  const find = (id: Key) => events.value.find((event) => event.id === id);

  const change = (text: string, apply: () => void) => {
    history.value = [...history.value, { before: events.value.map((event) => ({ ...event })), text }];
    apply();
    notice.value = { id: (notice.value?.id ?? 0) + 1, text, undoable: true };
  };

  const undo = () => {
    const last = history.value.at(-1);
    if (!last) return;
    history.value = history.value.slice(0, -1);
    events.value = last.before;
    editing.value = null;
    notice.value = { id: (notice.value?.id ?? 0) + 1, text: `Undone: ${last.text}`, undoable: false };
  };

  /** To a time on a day, all day on a day (`start: null`), or back among the tasks (`day: null`). */
  const place = (id: Key, to: Place) => {
    const event = find(id);
    if (!event || (event.day === to.day && event.start === to.start)) return;
    change(describe(event, to), () => Object.assign(event, to));
  };

  const resize = (id: Key, to: { start: number; duration: number }) => {
    const event = find(id);
    if (!event || (event.start === to.start && event.duration === to.duration)) return;
    change(`“${event.title}” is now ${span(to.start, to.duration)}`, () => Object.assign(event, to));
  };

  let created = 0;
  /** A new event, named right away: its title is typed in place (`editing`). */
  const create = (day: Day, start: number, duration: number) => {
    const calendar = fresh.value;
    hidden.delete(calendar); // all of them were switched off
    const event: CalendarEvent = { id: `new-${++created}`, title: '', calendar, day, start, duration };
    change(`New event on ${shortWeekday(day)} ${span(start, duration)}`, () => events.value.push(event));
    editing.value = event.id;
  };

  /** Names a new event: part of its creation, which undo takes back as a whole. */
  const rename = (id: Key, title: string) => {
    const event = find(id);
    if (event) event.title = title.trim() || 'New event';
    editing.value = null;
  };

  const remove = (id: Key) => {
    const event = find(id);
    if (!event) return;
    change(`Deleted “${event.title}”`, () => events.value.splice(events.value.indexOf(event), 1));
  };

  return {
    hidden,
    fresh,
    editing,
    notice,
    tasks,
    on,
    canUndo: computed(() => history.value.length > 0),
    undo,
    place,
    resize,
    create,
    rename,
    remove,
  };
}

export type Calendar = ReturnType<typeof createCalendar>;

export const CALENDAR: InjectionKey<Calendar> = Symbol('calendar');

export const useCalendar = () => inject(CALENDAR)!;
