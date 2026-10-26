/**
 * Values (`Preview`) as short text: for option values, chips and the log. The tagged
 * values (functions, elements, `undefined`, maps, sets) read as their label.
 */

import { TAG, type Preview } from '../../src/protocol';

export const isTagged = (value: Preview): value is { [key: string]: Preview } =>
  value !== null && typeof value === 'object' && !Array.isArray(value) && typeof value[TAG] === 'string';

/** `value` on one line, cut at `max` characters. */
export const short = (value: Preview, max = 80): string => {
  const text = line(value);
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
};

const line = (value: Preview): string => {
  if (value === null) return 'null';
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value !== 'object') return String(value);
  if (isTagged(value)) {
    if (value[TAG] === 'map') return `Map(${(value.entries as Preview[]).length})`;
    if (value[TAG] === 'set') return `Set(${(value.values as Preview[]).length})`;
    return String(value.label);
  }
  if (Array.isArray(value)) return `[${value.map(line).join(', ')}]`;
  return `{ ${Object.entries(value as { [key: string]: Preview })
    .map(([key, entry]) => `${key}: ${line(entry)}`)
    .join(', ')} }`;
};

/** A value as JSON for an editor; `null` when it can't be one (a function, an element). */
export const toJson = (value: Preview): string | null => {
  const plain = (entry: Preview): boolean =>
    entry === null || typeof entry !== 'object' ? true : isTagged(entry) ? false : Object.values(entry).every(plain);
  return plain(value) ? JSON.stringify(value, null, 2) : null;
};

/** Same value (option values, for "is this the code's value"). */
export const same = (a: Preview, b: Preview): boolean => JSON.stringify(a) === JSON.stringify(b);

/** `12:03:45.120` */
export const clock = (time: number): string => {
  const date = new Date(time);
  const pad = (value: number, size = 2) => String(value).padStart(size, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`;
};
