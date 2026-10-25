/** Layout (FLIP) and drop animations. */

import type { Key, Rect } from './primitives';
import type { Active } from './drag';

// ─── Animation ─────────────────────────────────────────────────────────────────

export interface AnimationOptions {
  duration?: number;
  easing?: string;
}

export interface LayoutAnimationContext {
  key: Key;
  element: HTMLElement;
  /** Visual rect before the change (where a running animation showed the item). */
  from: Rect;
  /** Layout rect after the change. */
  to: Rect;
  options: Required<AnimationOptions>;
  /**
   * What moved the item: a drag (`'drag'`: sorting, the drop, a cancel), or a change of
   * your data that no drag made (`'change'`, with the list's `animate` on).
   */
  reason: 'drag' | 'change';
  /**
   * Aborted when the library interrupts the animation: the item moves again before it
   * ends (the next animation starts where it is shown), or animations are turned off. A
   * returned `Animation` is cancelled for you. Stop anything else here and undo the styles
   * it set, at once: the layout is measured right after.
   */
  signal: AbortSignal;
}

/**
 * How items move to their new places: `true` (default timing), options, `false` (they
 * jump), or a function that animates one item from `from` to `to` and returns its
 * `Animation`, a promise that settles when it ends, or nothing.
 */
export type LayoutAnimation =
  | boolean
  | AnimationOptions
  | ((context: LayoutAnimationContext) => Animation | Promise<unknown> | void);

export interface DropAnimationContext {
  /**
   * The overlay box; it lands on the active item's slot. In a multi-drag the clones of the
   * other items riding inside it (the default overlay's, the `DragPreview`s of a custom
   * one) land on their own slots by themselves (with the default timing when this is a
   * custom function).
   */
  overlay: HTMLElement;
  from: Rect;
  /** Final rect of the dropped item; `null` when it isn't rendered or visible (the overlay fades out). */
  to: Rect | null;
  /**
   * The item isn't shown after a drop on a zone (not a sortable list), e.g. it was dropped
   * into another item (a folder) or a trash zone: the zone's visible rect. The default
   * animation shrinks the overlay into it as it fades out, instead of fading in place.
   */
  into: Rect | null;
  reason: 'drop' | 'cancel';
  active: Active;
  options: Required<AnimationOptions>;
}

export type DropAnimation =
  | boolean
  | AnimationOptions
  | ((context: DropAnimationContext) => Animation | Promise<unknown> | void);
