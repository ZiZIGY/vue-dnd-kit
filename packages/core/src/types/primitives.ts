/** Building blocks of the other types: ids, values the library reads, geometry, statuses. */

import type { ComponentPublicInstance, Ref } from 'vue';

// ─── Primitives ────────────────────────────────────────────────────────────────

export type Key = string | number;

/**
 * A value, a getter or any ref (writable, shallow, computed, readonly — e.g. from
 * `useTemplateRef`) that the library only reads. Unlike Vue's `MaybeRefOrGetter`
 * it accepts `Ref<string>` where `string | number` is expected.
 */
export type MaybeReadonlyRefOrGetter<T> = T | Readonly<Ref<T>> | (() => T);

/**
 * A value or any ref, for options where a function is a value of its own (an overlay
 * component, an accept rule, a custom animation), so a getter can't be told apart.
 * Hold components in a `shallowRef` (or a computed): Vue must not make them reactive.
 */
export type MaybeReadonlyRef<T> = T | Readonly<Ref<T>>;

/**
 * A component instance as a template ref gives it. Only `$el` is read: Vue's full
 * `ComponentPublicInstance` would reject every component that declares typed emits
 * (its `$emit` takes any event name), which is most UI kit components.
 */
type ComponentRef = Pick<ComponentPublicInstance, '$el'>;

export type MaybeElement =
  | HTMLElement
  | SVGElement
  | ComponentRef
  | null
  | undefined;
export type MaybeElementRef = MaybeReadonlyRefOrGetter<MaybeElement>;

export interface Coordinates {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
}

export type MaybePromise<T> = T | Promise<T>;

export type DnDStatus =
  | 'idle'
  | 'activating'
  | 'dragging'
  | 'dropping'
  | 'selecting';
/**
 * How a drag moves, whichever sensor drives it (`SensorActivation.type`): `'pointer'`
 * follows points, `'keyboard'` moves by items.
 */
export type SensorType = 'pointer' | 'keyboard';
export type PointerKind = 'mouse' | 'touch' | 'pen';

// ─── Activation ────────────────────────────────────────────────────────────────

export interface ActivationConstraint {
  /** Pixels the pointer must travel before the drag starts. */
  distance?: number;
  /** Milliseconds the pointer must be held before the drag starts. */
  delay?: number;
  /** With `delay`: movement in px that aborts activation, so the page can scroll. */
  tolerance?: number;
}

/** Per pointer kind. Defaults: mouse/pen `{ distance: 4 }` (immediate on a handle), touch `{ delay: 200, tolerance: 5 }`. */
export type ActivationOptions = Partial<
  Record<PointerKind, ActivationConstraint>
>;
