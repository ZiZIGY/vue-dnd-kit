import type {
  IPlacement,
  TInsertSide,
  TPlacementOrientation,
} from './placement';

// ── Result types ───────────────────────────────────────────────────────────────

/**
 * Result of suggestSort.
 * Same-list: sourceItems === targetItems (one array, reordered).
 * Cross-list: two different arrays — apply both.
 */
export interface ISuggestSortResult<T = unknown> {
  /** Source list after removing dragged items. Same ref as targetItems when sameList. */
  sourceItems: T[];
  /** Target list after inserting dragged items at targetIndex. */
  targetItems: T[];
  /** The items that were moved (in original order). */
  draggedItems: T[];
  sourceIndexes: number[];
  targetIndex: number;
  mode: 'insert' | 'append' | 'prepend';
  sameList: boolean;
}

/**
 * Result of suggestSwap.
 * Same-list: one array with positions swapped (sourceItems === targetItems).
 * Cross-list: two arrays with the items exchanged.
 * Multi-drag: dragged group exchanges with the single hovered item.
 */
export interface ISuggestSwapResult<T = unknown> {
  /** Source list after swap. */
  sourceItems: T[];
  /** Target list after swap. Same ref as sourceItems when sameList. */
  targetItems: T[];
  sourceIndexes: number[];
  targetIndex: number;
  sameList: boolean;
}

/**
 * Result of suggestCopy.
 * Source list is NEVER modified — only target receives new items.
 */
export interface ISuggestCopyResult<T = unknown> {
  /** Target list after inserting copies. */
  targetItems: T[];
  /** Shallow copies of the dragged items that were inserted. */
  copiedItems: T[];
  targetIndex: number;
  mode: 'insert' | 'append' | 'prepend';
}

/**
 * Result of suggestRemove.
 */
export interface ISuggestRemoveResult<T = unknown> {
  /** Source list after removing dragged items. */
  sourceItems: T[];
  /** The items that were removed. */
  removedItems: T[];
  sourceIndexes: number[];
}

/** Draggable element currently under the cursor (inside the drop zone). */
export interface IHoveredDraggableContext<T = unknown> {
  element: HTMLElement;
  /** Cursor position relative to this element. */
  placement: IPlacement;
  index: number;
  /** The actual object: items[index]. */
  item: T;
  items: T[];
  /** Custom data from the `data` option (reactive, always up-to-date) */
  data?: unknown;
}

/** Placement helpers: interpret placement flags by list orientation. */
export interface IPlacementHelpers {
  /** 'before' = top (vertical) / left (horizontal). 'after' = bottom / right. */
  getInsertSide(
    placement: IPlacement | undefined,
    orientation: TPlacementOrientation
  ): TInsertSide | null;
  isAtZoneStart(
    placement: IPlacement | undefined,
    orientation: TPlacementOrientation
  ): boolean;
  isAtZoneEnd(
    placement: IPlacement | undefined,
    orientation: TPlacementOrientation
  ): boolean;
}

/**
 * Helpers object available on every drag event via `event.helpers`.
 *
 * ── Low-level (stateless, no event context) ─────────────────────────────────
 * Array primitives and placement interpreters. Use these to build custom logic.
 *
 * ── High-level (event-bound) ────────────────────────────────────────────────
 * Preset operations that read the current event context.
 * The user decides which one to call based on `event.hoveredDraggable`:
 *
 * ```ts
 * onDrop(event) {
 *   if (event.hoveredDraggable) {
 *     // hovering over an element → sort / swap / copy into position
 *     const r = event.helpers.suggestSort()
 *     if (r) list.value = r.targetItems
 *   } else {
 *     // hovering over zone only → append / prepend / copy to zone
 *     const r = event.helpers.suggestSort()
 *     if (r) list.value = r.targetItems
 *   }
 * }
 * ```
 */
export interface IHelpers {
  // ── Low-level: array ops ──────────────────────────────────────────────────
  /** Insert toInsert items into items at index. Returns new array. */
  insertAt<T>(items: T[], index: number, toInsert: T[]): T[];
  /** Remove count items at index. Returns new array. */
  removeAt<T>(items: T[], index: number, count?: number): T[];
  /** Remove multiple indexes (high → low, safe). Returns new array. */
  removeIndexes<T>(items: T[], indexes: number[]): T[];
  /** Swap items at positions i and j. Returns new array. */
  swapAt<T>(items: T[], i: number, j: number): T[];

  // ── Low-level: placement ──────────────────────────────────────────────────
  /** 'before' or 'after' relative to the orientation axis, or null if ambiguous. */
  getInsertSide(
    placement: IPlacement | undefined,
    orientation: TPlacementOrientation
  ): TInsertSide | null;
  /** True when pointer is at the very start edge of the zone (no center). */
  isAtZoneStart(
    placement: IPlacement | undefined,
    orientation: TPlacementOrientation
  ): boolean;
  /** True when pointer is at the very end edge of the zone (no center). */
  isAtZoneEnd(
    placement: IPlacement | undefined,
    orientation: TPlacementOrientation
  ): boolean;

  // ── High-level: event-bound presets ───────────────────────────────────────

  /**
   * **Sort / Transfer** — universal insert.
   *
   * - With `hoveredDraggable`: inserts dragged items before or after the
   *   hovered element (determined by cursor placement).
   * - Without `hoveredDraggable`: appends to zone start/end based on zone placement.
   * - Same-list: reorders in place. Cross-list: transfers (removes from source, inserts into target).
   *
   * Returns null when context is insufficient (no draggedItems or no dropZone).
   * Cast result arrays to your item type: `r.targetItems as MyItem[]`.
   */
  suggestSort(orientation?: TPlacementOrientation): ISuggestSortResult | null;

  /**
   * **Swap** — exchange the single dragged item with the hovered element.
   *
   * - Same-list: swaps two positions in one array.
   * - Cross-list: exchanges items between two arrays.
   *
   * Returns null when multi-drag or no `hoveredDraggable`.
   */
  suggestSwap(): ISuggestSwapResult | null;

  /**
   * **Copy** — insert copies of dragged items at target position WITHOUT removing from source.
   *
   * Position logic is identical to `suggestSort`.
   * Useful for copy-on-drag (e.g. held Ctrl key).
   *
   * Returns null when context is insufficient.
   */
  suggestCopy(orientation?: TPlacementOrientation): ISuggestCopyResult | null;

  /**
   * **Remove** — remove dragged items from their source list.
   *
   * Returns null when there are no draggedItems.
   */
  suggestRemove(): ISuggestRemoveResult | null;
}
