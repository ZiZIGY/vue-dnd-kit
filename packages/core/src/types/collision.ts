/** How a drag finds its target (collision detection) and where it may move (modifiers). */

import type { Coordinates, Key, Rect } from './primitives';
import type { Active, Over } from './drag';
import type { AnimationOptions } from './animation';

// ─── Collision ─────────────────────────────────────────────────────────────────

/** A drop target a collision detection can pick: enabled, on the page and not fully clipped. */
export interface CollisionCandidate {
  /** Id of the drop target. */
  id: Key;
  /** Visible part of the target: clipped by its scroll containers and the viewport. */
  rect: Rect;
  /** The target's `priority` (default 0): higher wins when targets overlap without nesting. Sortable items beat containers. */
  priority: number;
  /** Nesting level among drop targets: 0 at the top, deeper targets have higher values. */
  depth?: number;
}

/** What a collision detection gets, on every move of the drag. */
export interface CollisionArgs {
  /** Pointer in viewport coordinates, after modifiers. */
  pointer: Coordinates;
  /** Rect of the dragged box (the overlay, or the element itself with `overlay: false`) where the drag has moved it. */
  overlayRect: Rect | null;
  /** Every drop target the drag could go to, whether its `accept` rule takes the drag or not. */
  candidates: CollisionCandidate[];
  /** Drop targets under the pointer from hit-testing (respects z-order and shadow roots), best first. */
  hits: Key[];
}

/** Returns candidate ids, best first. */
export type CollisionDetection = (args: CollisionArgs) => Key[];

// ─── Modifiers ─────────────────────────────────────────────────────────────────

/** What a modifier gets, on every move of the drag. */
export interface ModifierArgs {
  /** Offset from the drag start, as modified by the previous modifiers. */
  transform: Coordinates;
  /** The drag. */
  active: Active;
  /** Rect of the dragged element at drag start. */
  activeRect: Rect;
  /**
   * Rect of the overlay box if it were moved by `transform`, at the size it has now. With
   * `overlayFit: 'slot'` the box resizes around the pointer, so it isn't always
   * `activeRect` moved by `transform`.
   */
  overlayRect: Rect;
  /** Pointer position at drag start. */
  origin: Coordinates;
  /** Sortable list container (or parent element) of the dragged item, where it is now (it follows scrolling). */
  containerRect: Rect | null;
  /**
   * How far the content the drag started in has moved on screen since the start: the
   * container moved (the page or a container around it scrolled, the layout shifted), and
   * its content scrolled inside it. Axis locks hold the other axis there, so the drag
   * stays on its row or column of that content.
   */
  containerShift: Coordinates;
  /** Rect of the window (the viewport). */
  windowRect: Rect;
  /** The drop target under the drag, as last found; `null` over nothing. */
  over: Over | null;
}

/** Changes where the dragged item goes: takes the drag's offset (`transform`) and returns a new one. */
export type Modifier = (args: ModifierArgs) => Coordinates;

/** Options of `snapToGrid`. */
export interface SnapToGridOptions {
  /** The cell's width in px. Without one (or 0), the drag moves freely along x. */
  x?: number;
  /** The cell's height in px. Without one (or 0), the drag moves freely along y: `{ y: 15 }` snaps the time of a calendar event only. */
  y?: number;
  /**
   * `'container'` (default): the overlay's top-left lands on grid lines drawn from the
   * container's top-left (`containerRect`: the sortable list or the parent element).
   * `'delta'`: the drag offset is rounded, keeping where the item started off-grid.
   */
  origin?: 'container' | 'delta';
  /**
   * Glide the overlay between snapped positions (default 80ms). Collision still
   * uses the snapped position at once.
   */
  smooth?: boolean | AnimationOptions;
}
