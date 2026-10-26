/**
 * The options the tab edits: every option that isn't a callback, per kind of target, with
 * its editor. They are read and overridden through the bridge (`provider.overrides`), so
 * an edit applies at once and only in this page, never in the code. The library's own
 * modifiers and collision detections are offered by name: the core's exports, the very
 * functions the app imports, so the ones in the code are recognized.
 */

import { toValue, unref } from 'vue';
import {
  closestCenter,
  closestCorners,
  pointerFirst,
  pointerWithin,
  rectIntersection,
  restrictToFirstScrollableAncestor,
  restrictToHorizontalAxis,
  restrictToParent,
  restrictToVerticalAxis,
  restrictToWindowEdges,
  snapCenterToCursor,
} from '@vue-dnd-kit/core';
import type { DevtoolsProvider, OverrideTarget } from '@vue-dnd-kit/core/devtools';
import { TAG, type OptionView, type Preview } from '../protocol';
import { preview } from './preview';

type Spec = Omit<OptionView, 'name' | 'value' | 'code' | 'overridden'>;

const MODIFIERS: Record<string, unknown> = {
  restrictToVerticalAxis,
  restrictToHorizontalAxis,
  restrictToWindowEdges,
  restrictToParent,
  restrictToFirstScrollableAncestor,
  snapCenterToCursor,
};
const COLLISIONS: Record<string, unknown> = { pointerFirst, pointerWithin, rectIntersection, closestCenter, closestCorners };

const BOOLEAN: Spec = { choices: [true, false] };
const ANIMATION: Spec = { choices: [true, false], input: 'json', template: { duration: 200, easing: 'ease' }, fallback: 'true' };
const AUTO_SCROLL: Spec = { choices: [true, false], input: 'json', template: { threshold: 0.2, maxSpeed: 25, acceleration: 10 } };
const ANIMATE: Spec = {
  choices: [false, true],
  input: 'json',
  template: { duration: 200, easing: 'ease', move: true, enter: true, leave: true },
  fallback: 'false',
};
const ACTIVATION: Spec = { input: 'json', template: { mouse: { distance: 4 }, touch: { delay: 200, tolerance: 5 } } };
const MODIFIER_NAMES: Spec = { input: 'names', names: Object.keys(MODIFIERS), several: true };
const ACCEPT_MODE: Spec = { choices: ['all', 'some'], fallback: 'all' };
const PLACEHOLDER: Spec = { choices: ['item', 'indicator'], fallback: 'item' };
const DROP_OUTSIDE: Spec = { choices: ['placeholder', 'cancel', 'remove'] };

/** `DnDProvider`'s props. */
const PROVIDER: Record<string, Spec> = {
  overlayFit: { choices: ['slot', 'source'], fallback: 'slot' },
  autoScroll: { ...AUTO_SCROLL, fallback: 'true' },
  collision: { input: 'names', names: Object.keys(COLLISIONS), fallback: 'pointerFirst' },
  modifiers: MODIFIER_NAMES,
  animation: ANIMATION,
  dropAnimation: ANIMATION,
  animate: ANIMATE,
  activation: ACTIVATION,
  keyboard: { choices: [false], input: 'json', template: { step: 25 } },
  haptics: { choices: [true, false], input: 'json', template: { start: true, enter: false, drop: false, refuse: false } },
  copyModifier: { choices: ['Alt', 'Control', 'Shift', 'Meta', null], fallback: 'Alt' },
  screenReaderInstructions: { input: 'text' },
};

const LIST: Record<string, Spec> = {
  disabled: BOOLEAN,
  strategy: { choices: ['vertical', 'horizontal', 'grid'], fallback: 'vertical' },
  placeholder: PLACEHOLDER,
  behavior: { choices: ['sort', 'swap'], fallback: 'sort' },
  multiple: { choices: ['group', 'gaps', 'stack'], fallback: 'group' },
  sort: BOOLEAN,
  dropOutside: DROP_OUTSIDE,
  acceptMode: ACCEPT_MODE,
  animation: ANIMATION,
  animate: ANIMATE,
  autoScroll: AUTO_SCROLL,
  modifiers: MODIFIER_NAMES,
};

const TREE: Record<string, Spec> = {
  disabled: BOOLEAN,
  placeholder: PLACEHOLDER,
  indentation: { input: 'number', fallback: '24' },
  nesting: { choices: ['offset', 'hover', 'both'] },
  maxDepth: { input: 'number' },
  dropOutside: DROP_OUTSIDE,
  acceptMode: ACCEPT_MODE,
  animation: ANIMATION,
  animate: ANIMATE,
  autoScroll: AUTO_SCROLL,
  modifiers: MODIFIER_NAMES,
};

const DRAGGABLE: Record<string, Spec> = {
  disabled: BOOLEAN,
  keyboard: { choices: ['pixels', 'droppables'], fallback: 'pixels' },
  activation: ACTIVATION,
};

const DROPPABLE: Record<string, Spec> = {
  disabled: BOOLEAN,
  priority: { input: 'number', fallback: '0' },
  // Types, comma-separated; `*` takes anything.
  accept: { choices: ['*'], input: 'text' },
  acceptMode: ACCEPT_MODE,
};

const specsOf = (target: OverrideTarget, tree: boolean): Record<string, Spec> => {
  if (target.kind === 'provider') return PROVIDER;
  if (target.kind === 'list') return tree ? TREE : LIST;
  return target.kind === 'draggable' ? DRAGGABLE : DROPPABLE;
};

/** A function of the library by its export name; any other as a preview. */
const nameOf = (spec: Spec, value: unknown): Preview => {
  const named = spec.several ? MODIFIERS : COLLISIONS;
  const name = Object.keys(named).find((key) => named[key] === value);
  return name ?? preview(value);
};

const shown = (spec: Spec, value: unknown): Preview =>
  spec.input !== 'names' || value == null ? preview(value) : Array.isArray(value) ? value.map((entry) => nameOf(spec, entry)) : nameOf(spec, value);

/** Options whose functions are values (an animation, an accept rule), not getters. */
const FUNCTION_VALUES = new Set(['animation', 'dropAnimation', 'accept', 'collision']);

/** The code's value of an option, its ref or getter read (the props of a provider are values). */
const codeValue = (target: OverrideTarget, option: string, code: unknown): unknown => {
  if (target.kind === 'provider' || FUNCTION_VALUES.has(option)) return unref(code);
  return toValue(code);
};

/** The options of `target` with their editors; none when it isn't mounted. */
export const optionViews = (provider: DevtoolsProvider, target: OverrideTarget, tree = false): OptionView[] => {
  const views: OptionView[] = [];
  for (const [name, spec] of Object.entries(specsOf(target, tree))) {
    const read = provider.overrides.read(target, name);
    if (!read) continue;
    const code = shown(spec, codeValue(target, name, read.code));
    views.push({ name, ...spec, value: shown(spec, read.value), code, overridden: read.overridden });
  }
  return views;
};

/**
 * What an edit sets: the value itself, or (an editor of names) the library's functions.
 * Modifiers keep the code's own ones (not the library's) and add the names picked.
 */
export const decodeValue = (provider: DevtoolsProvider, target: OverrideTarget, option: string, value: Preview): unknown => {
  // Lists and trees edit modifiers alike.
  const spec = specsOf(target, false)[option];
  if (option === 'accept' && typeof value === 'string' && value !== '*') {
    const types = value.split(',').map((type) => type.trim()).filter(Boolean);
    return types.length === 1 ? types[0] : types;
  }
  if (spec?.input !== 'names' || value === null || typeof value !== 'object' || Array.isArray(value) || value[TAG] !== 'names') {
    return value;
  }
  const names = (value.names as string[]) ?? [];
  if (!spec.several) return names[0] ? COLLISIONS[names[0]] : undefined;
  const code = codeValue(target, option, provider.overrides.read(target, option)?.code);
  const own = (Array.isArray(code) ? code : []).filter((modifier) => !Object.values(MODIFIERS).includes(modifier));
  return [...own, ...names.map((name) => MODIFIERS[name]).filter(Boolean)];
};
