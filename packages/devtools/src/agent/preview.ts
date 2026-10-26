/**
 * Values as the tab shows them (`Preview`): what a `BroadcastChannel` can carry. The
 * user's data may hold functions, elements, components, maps and cycles: those become
 * tagged labels, long lists and deep objects are cut.
 */

import { isRef, toRaw } from 'vue';
import type { Key } from '@vue-dnd-kit/core';
import { TAG, type Preview } from '../protocol';

/** Entries of an array or object shown; the rest is counted. */
const MAX_ENTRIES = 50;
const MAX_DEPTH = 4;
const MAX_STRING = 500;

const tagged = (kind: string, label: string): Preview => ({ [TAG]: kind, label });

/** `<li.card.done#a1>`: an element as a label. */
export const elementLabel = (element: Element): string => {
  const id = element.id ? `#${element.id}` : '';
  const classes = [...element.classList]
    .slice(0, 3)
    .map((name) => `.${name}`)
    .join('');
  return `<${element.tagName.toLowerCase()}${id}${classes}>`;
};

/** A key as a label: as it is; `—` for none. */
export const keyLabel = (key: Key | null | undefined): string => (key == null ? '—' : String(key));

/** A short list of keys: the first few, then how many more. */
export const keysLabel = (keys: readonly Key[], max = 3): string =>
  keys.length <= max ? keys.map(keyLabel).join(', ') : `${keys.slice(0, max).map(keyLabel).join(', ')} +${keys.length - max}`;

/** `value` as the tab shows it. */
export const preview = (value: unknown, depth = 0, seen = new WeakSet<object>()): Preview => {
  if (value === null || typeof value === 'boolean') return value;
  if (typeof value === 'number') return Number.isFinite(value) ? value : tagged('number', String(value));
  if (typeof value === 'string') return value.length > MAX_STRING ? `${value.slice(0, MAX_STRING)}…` : value;
  if (value === undefined) return tagged('undefined', 'undefined');
  if (typeof value === 'function') return tagged('function', value.name ? `${value.name}()` : 'ƒ()');
  if (typeof value !== 'object') return tagged('other', String(value));
  if (typeof Element !== 'undefined' && value instanceof Element) return tagged('element', elementLabel(value));
  if (isRef(value)) return preview(value.value, depth, seen);
  const raw = toRaw(value) as object;
  if (seen.has(raw)) return tagged('other', '[circular]');
  // A component (`markRaw`ed options or a setup function's object).
  if ('setup' in raw || 'render' in raw || '__name' in raw) return tagged('other', `<${componentName(raw)}>`);
  if (depth >= MAX_DEPTH) return tagged('other', Array.isArray(raw) ? `Array(${raw.length})` : '{…}');
  seen.add(raw);
  const nested = (entry: unknown) => preview(entry, depth + 1, seen);
  const cut = <T>(entries: T[]) => (entries.length > MAX_ENTRIES ? entries.slice(0, MAX_ENTRIES) : entries);
  const more = (count: number): Preview[] => (count > MAX_ENTRIES ? [tagged('more', `+${count - MAX_ENTRIES}`)] : []);
  if (Array.isArray(raw)) return [...cut(raw).map(nested), ...more(raw.length)];
  if (raw instanceof Map) {
    return { [TAG]: 'map', entries: [...cut([...raw]).map(([key, entry]) => [nested(key), nested(entry)]), ...more(raw.size)] };
  }
  if (raw instanceof Set) return { [TAG]: 'set', values: [...cut([...raw]).map(nested), ...more(raw.size)] };
  if (raw instanceof Date) return tagged('other', raw.toISOString());
  const entries = Object.entries(raw);
  const result: { [key: string]: Preview } = {};
  for (const [key, entry] of cut(entries)) result[key] = nested(entry);
  if (entries.length > MAX_ENTRIES) result['…'] = `+${entries.length - MAX_ENTRIES}`;
  return result;
};

const componentName = (component: object) => {
  const { name, __name } = component as { name?: string; __name?: string };
  return name ?? __name ?? 'component';
};
