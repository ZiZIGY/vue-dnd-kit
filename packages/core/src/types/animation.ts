/** Layout (FLIP), drop and data-change (`animate`) animations. */

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
  /**
   * `prefers-reduced-motion: reduce` is set. The library's own animations don't run then;
   * functions of yours always do, and decide with this (skip, or keep a fade).
   */
  reducedMotion: boolean;
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
  /**
   * `prefers-reduced-motion: reduce` is set. The library's own animations don't run then;
   * functions of yours always do, and decide with this (skip, or keep a fade).
   */
  reducedMotion: boolean;
}

export type DropAnimation =
  | boolean
  | AnimationOptions
  | ((context: DropAnimationContext) => Animation | Promise<unknown> | void);

// ─── Data changes (`animate`) ──────────────────────────────────────────────────

/** An item that appeared in a list with `animate` on: added, or shown again (a filter, an expanded tree node). */
export interface EnterAnimationContext {
  key: Key;
  /** The item's element, already in its place. */
  element: HTMLElement;
  /** Where it appeared (layout rect). */
  to: Rect;
  options: Required<AnimationOptions>;
  /**
   * `prefers-reduced-motion: reduce` is set. The library's own animations don't run then;
   * functions of yours always do, and decide with this (skip, or keep a fade).
   */
  reducedMotion: boolean;
}

/** An item that left a list with `animate` on: removed, or hidden (a filter, a collapsed tree node). */
export interface LeaveAnimationContext {
  key: Key;
  /**
   * A copy of the item's element, shown where the item was (the item itself is gone):
   * positioned absolutely in its old parent, ignoring the pointer, marked
   * `data-dnd-leaving`. The library removes it when your animation ends.
   */
  element: HTMLElement;
  /** Where the item was. */
  from: Rect;
  options: Required<AnimationOptions>;
  /**
   * `prefers-reduced-motion: reduce` is set. The library's own animations don't run then;
   * functions of yours always do, and decide with this (skip, or keep a fade).
   */
  reducedMotion: boolean;
}

/** `true`, options, `false` (the item just appears), or a function that animates it in. */
export type EnterAnimation =
  | boolean
  | AnimationOptions
  | ((context: EnterAnimationContext) => Animation | Promise<unknown> | void);

/**
 * `true`, options, `false` (the item just disappears), or a function that animates out the
 * copy left in its place: return its `Animation` or a promise, and the copy is removed
 * when it ends (at once when the function returns nothing).
 */
export type LeaveAnimation =
  | boolean
  | AnimationOptions
  | ((context: LeaveAnimationContext) => Animation | Promise<unknown> | void);

/**
 * `animate` with its parts: `duration` and `easing` for all of them, and per kind of
 * change `true`, options (over the shared ones), `false`, or a function of your own.
 */
export interface AutoAnimationOptions extends AnimationOptions {
  /** Items that changed places (the default FLIP, as `animation`'s; a function replaces it). */
  move?: LayoutAnimation;
  /** Items that appeared. Default: they fade in where they are. */
  enter?: EnterAnimation;
  /** Items that left. Default: a copy of the item fades out where it was, shrinking a little. */
  leave?: LeaveAnimation;
}

/**
 * Animates changes of a list's (or tree's) items that no drag made: items added, removed,
 * moved (a sort, a shuffle, a move between lists of one group) or filtered. Off by default
 * (`false`); `true` animates moves, entering and leaving items with the default timing.
 * Drags keep their own animations (`animation`, `dropAnimation`). With
 * `prefers-reduced-motion: reduce` the default animations don't run; functions of yours
 * still do (with `reducedMotion: true`). Only items near the visible area animate
 * (unmounted rows of a virtual list are skipped).
 */
export type AutoAnimation = boolean | AutoAnimationOptions;
