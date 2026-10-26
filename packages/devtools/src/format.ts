/**
 * The DevTools API's types (taken from `setupDevtoolsPlugin`: `@vue/devtools-api` doesn't
 * export them) and how the plugin shows values: tags, keys, accept rules, elements.
 */

import type { setupDevtoolsPlugin } from '@vue/devtools-api';
import type { AcceptRule, DnDStatus, Key } from '@vue-dnd-kit/core';

export type DevtoolsApi = Parameters<Parameters<typeof setupDevtoolsPlugin>[1]>[0];
export type TreePayload = Parameters<Parameters<DevtoolsApi['on']['getInspectorTree']>[0]>[0];
export type StatePayload = Parameters<Parameters<DevtoolsApi['on']['getInspectorState']>[0]>[0];
export type InspectorNode = TreePayload['rootNodes'][number];
export type InspectorTag = NonNullable<InspectorNode['tags']>[number];
export type InspectorState = StatePayload['state'];
export type StateField = InspectorState[string][number];
export type TimelineEvent = Parameters<DevtoolsApi['addTimelineEvent']>[0]['event'];

/** Vue's green, and the colors of tags and the timeline. */
export const COLORS = {
  green: 0x42b883,
  blue: 0x3b82f6,
  orange: 0xf59e0b,
  red: 0xef4444,
  purple: 0x8b5cf6,
  grey: 0x9ca3af,
  slate: 0x475569,
} as const;

export const STATUS_COLORS: Record<DnDStatus, number> = {
  idle: COLORS.grey,
  activating: COLORS.blue,
  dragging: COLORS.green,
  dropping: COLORS.orange,
  selecting: COLORS.purple,
};

export const tag = (label: string, backgroundColor: number, tooltip?: string): InspectorTag => ({
  label,
  textColor: 0xffffff,
  backgroundColor,
  ...(tooltip ? { tooltip } : {}),
});

/** A key as a label: as it is (numbers too); `—` for none. */
export const keyLabel = (key: Key | null | undefined): string => (key == null ? '—' : String(key));

/** A short list of keys: the first few, then how many more. */
export const keysLabel = (keys: readonly Key[], max = 3): string =>
  keys.length <= max ? keys.map(keyLabel).join(', ') : `${keys.slice(0, max).map(keyLabel).join(', ')} +${keys.length - max}`;

/** What an `accept` rule takes, in words. */
export const acceptLabel = (rule: AcceptRule | undefined): string => {
  if (rule == null || rule === '*') return 'anything';
  if (typeof rule === 'function') return rule.name ? `${rule.name}()` : 'a function';
  return Array.isArray(rule) ? rule.join(' | ') : rule;
};

/**
 * An element as a state value. The DevTools show HTML elements as such (tag and
 * attributes); other elements (SVG) as their tag, which is all that is safe to send.
 */
export const elementValue = (element: Element | string | null): unknown => {
  if (element == null || typeof element === 'string') return element;
  if (typeof HTMLElement !== 'undefined' && element instanceof HTMLElement) return element;
  return `<${element.tagName.toLowerCase()}>`;
};

/** At most `max` entries of a long array (drafts of big lists), with the count of the rest. */
export const capped = <T>(values: readonly T[], max = 200): T[] | { first: T[]; more: number } =>
  values.length <= max ? [...values] : { first: values.slice(0, max), more: values.length - max };

/** State fields from a record (`key: value`), skipping `undefined` when `defined` is set. */
export const fields = (record: Record<string, unknown>, defined = false): StateField[] =>
  Object.entries(record)
    .filter(([, value]) => !defined || value !== undefined)
    .map(([key, value]) => ({ key, value }));
