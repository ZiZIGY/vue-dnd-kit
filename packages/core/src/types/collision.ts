/** How a drag finds its target (collision detection) and where it may move (modifiers). */

import type { Coordinates, Key, Rect } from './primitives';
import type { Active, Over } from './drag';

// ─── Collision ─────────────────────────────────────────────────────────────────

export interface CollisionCandidate {
  id: Key;
  /** Visible part of the target: clipped by its scroll containers and the viewport. */
  rect: Rect;
  priority: number;
  /** Nesting level among drop targets: 0 at the top, deeper targets have higher values. */
  depth?: number;
}

export interface CollisionArgs {
  pointer: Coordinates;
  overlayRect: Rect | null;
  candidates: CollisionCandidate[];
  /** Drop targets under the pointer from hit-testing (respects z-order and shadow roots), best first. */
  hits: Key[];
}

/** Returns candidate ids, best first. */
export type CollisionDetection = (args: CollisionArgs) => Key[];

// ─── Modifiers ─────────────────────────────────────────────────────────────────

export interface ModifierArgs {
  /** Offset from the drag start, as modified by the previous modifiers. */
  transform: Coordinates;
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
  windowRect: Rect;
  over: Over | null;
}

export type Modifier = (args: ModifierArgs) => Coordinates;
