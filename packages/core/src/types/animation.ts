/** Layout (FLIP), drop and data-change (`animateChanges`) animations. */

import type { Key, Rect } from './primitives';
import type { Active, Over } from './drag';

// ─── Animation ─────────────────────────────────────────────────────────────────

/** The timing of an animation. What is left out keeps the default of that animation. */
export interface AnimationOptions {
  /** In ms. Default 200 for layout moves, 250 for the drop; `0` turns the animation off. */
  duration?: number;
  /** A CSS easing (`'ease-out'`, `cubic-bezier(…)`). */
  easing?: string;
}

/** What a layout animation function gets, for one item that moves to its new place. */
export interface LayoutAnimationContext {
  /** Key of the item. */
  key: Key;
  /** The item's element, already in its new place. */
  element: HTMLElement;
  /** Visual rect before the change (where a running animation showed the item). */
  from: Rect;
  /** Layout rect after the change. */
  to: Rect;
  /** The timing the options give, defaults filled in. */
  options: Required<AnimationOptions>;
  /**
   * What moved the item: a drag (`'drag'`: sorting, the drop, a cancel), or a change of
   * your data that no drag made (`'change'`, with the list's `animateChanges` on).
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

/** What a drop animation function gets: the overlay, where it is and where it lands. */
export interface DropAnimationContext {
  /**
   * The overlay box; it lands on the active item's slot. In a multi-drag the clones of the
   * other items riding inside it (the default overlay's, the `DragPreview`s of a custom
   * one) land on their own slots by themselves (with the default timing when this is a
   * custom function).
   */
  overlay: HTMLElement;
  /** Where the overlay is when the drag ends. */
  from: Rect;
  /** Final rect of the dropped item; `null` when it isn't rendered or visible (the overlay fades out). */
  to: Rect | null;
  /**
   * The item isn't shown after a drop on a zone (not a sortable list), e.g. it was dropped
   * into another item (a folder) or a trash zone: the zone's visible rect. The default
   * animation shrinks the overlay into it as it fades out, instead of fading in place.
   */
  into: Rect | null;
  /** `'drop'`: the overlay lands where the drop put the item. `'cancel'`: it flies back to where the item was. */
  reason: 'drop' | 'cancel';
  /** The drag that ended. */
  active: Active;
  /** The target the drop lands on (a list, a zone); `null` on a cancel. */
  over: Over | null;
  /** The timing the options give, defaults filled in. */
  options: Required<AnimationOptions>;
  /**
   * `prefers-reduced-motion: reduce` is set. The library's own animations don't run then;
   * functions of yours always do, and decide with this (skip, or keep a fade).
   */
  reducedMotion: boolean;
}

/**
 * How the overlay lands on a drop and flies back on a cancel: `true` (default timing),
 * options, `false` (no flight: it ends where it was let go), or a function that animates
 * `overlay` from `from` to `to` and returns its `Animation`, a promise that settles when it
 * ends, or nothing.
 */
export type DropAnimation =
  | boolean
  | AnimationOptions
  | ((context: DropAnimationContext) => Animation | Promise<unknown> | void);

// ─── Data changes (`animateChanges`) ───────────────────────────────────────────

/** An item that appeared in a list with `animateChanges` on: added, or shown again (a filter, an expanded tree node). */
export interface EnterAnimationContext {
  /** Key of the item. */
  key: Key;
  /** The item's element, already in its place. */
  element: HTMLElement;
  /** Where it appeared (layout rect). */
  to: Rect;
  /** The timing the options give, defaults filled in. */
  options: Required<AnimationOptions>;
  /**
   * `prefers-reduced-motion: reduce` is set. The library's own animations don't run then;
   * functions of yours always do, and decide with this (skip, or keep a fade).
   */
  reducedMotion: boolean;
}

/** An item that left a list with `animateChanges` on: removed, or hidden (a filter, a collapsed tree node). */
export interface LeaveAnimationContext {
  /** Key of the item. */
  key: Key;
  /**
   * A copy of the item's element, shown where the item was (the item itself is gone):
   * positioned absolutely in its old parent, ignoring the pointer, marked
   * `data-dnd-leaving`. The library removes it when your animation ends.
   */
  element: HTMLElement;
  /** Where the item was. */
  from: Rect;
  /** The timing the options give, defaults filled in. */
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
 * `animateChanges` with its parts: `duration` and `easing` for all of them, and per kind of
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
