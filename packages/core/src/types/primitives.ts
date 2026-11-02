/** Building blocks of the other types: ids, values the library reads, geometry, statuses. */

import type { ComponentPublicInstance, Ref } from 'vue';

// ─── Primitives ────────────────────────────────────────────────────────────────

/** An id or a key: of a draggable, a drop target, a list, an item of a list. */
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

/**
 * An element: an HTML or SVG element, or a component instance (its root element, `$el`),
 * as a template ref gives them. `null` or `undefined` while there is none (not mounted yet).
 */
export type MaybeElement =
  | HTMLElement
  | SVGElement
  | ComponentRef
  | null
  | undefined;
/**
 * The element a composable works on (`makeDraggable(target)`): the element, a template ref
 * (`useTemplateRef`) or a getter. It may change (a `v-if`): the library follows it.
 */
export type MaybeElementRef = MaybeReadonlyRefOrGetter<MaybeElement>;

/**
 * A point or an offset, in px: a position from the viewport's top-left corner, or an offset
 * from where the drag started (`delta`, `transform`).
 */
export interface Coordinates {
  /** Horizontal, growing to the right. */
  x: number;
  /** Vertical, growing downward. */
  y: number;
}

/** A width and a height, in px. */
export interface Size {
  /** Width in px. */
  width: number;
  /** Height in px. */
  height: number;
}

/** A box in px, in viewport coordinates, as `getBoundingClientRect()` gives it. */
export interface Rect {
  /** Its top edge, from the top of the viewport. */
  top: number;
  /** Its left edge, from the left of the viewport. */
  left: number;
  /** Its width. */
  width: number;
  /** Its height. */
  height: number;
  /** Its right edge, from the left of the viewport: `left + width`. */
  right: number;
  /** Its bottom edge, from the top of the viewport: `top + height`. */
  bottom: number;
}

/** A value, or a promise of it: what a hook that may be async returns (`onBeforeDrop`). */
export type MaybePromise<T> = T | Promise<T>;

/**
 * What the provider is doing:
 * - `'idle'`: nothing;
 * - `'activating'`: a press waits for its activation constraint (a distance, a long press);
 * - `'dragging'`: a drag runs;
 * - `'dropping'`: a drop is decided (an async `onBeforeDrop`), or an overlay still lands;
 * - `'selecting'`: a selection area draws its band.
 */
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
/** The kind of pointer that pressed (`PointerEvent.pointerType`): activation is set per kind. */
export type PointerKind = 'mouse' | 'touch' | 'pen';

// ─── Activation ────────────────────────────────────────────────────────────────

/**
 * What a press must do before it becomes a drag: travel `distance`, or be held for `delay`,
 * whichever comes first. Nothing set: the drag starts at once.
 */
export interface ActivationConstraint {
  /** Pixels the pointer must travel before the drag starts. */
  distance?: number;
  /** Milliseconds the pointer must be held before the drag starts. */
  delay?: number;
  /** With `delay`: movement in px that aborts activation, so the page can scroll. */
  tolerance?: number;
}

/** Per pointer kind. Defaults: mouse `{ distance: 4 }` (immediate on a handle), pen `{ distance: 4 }`, touch `{ delay: 200, tolerance: 5 }`. */
export type ActivationOptions = Partial<
  Record<PointerKind, ActivationConstraint>
>;
