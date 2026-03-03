/**
 * Which side(s) of the element/zone the pointer is in.
 * Multiple flags can be true (e.g. top + right for corner). Do not normalize.
 * - vertical list: top = before, bottom = after
 * - horizontal list: left = before, right = after
 * - center: pointer in center zone (dual-role draggable+zone)
 */
export interface IPlacement {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
  /** True when pointer is in center zone (inside placementMargins). Used for dual-role draggable+zone. */
  center: boolean;
}

export type TPlacementOrientation = 'vertical' | 'horizontal';

/** 'before' | 'after' for insert position along one axis */
export type TInsertSide = 'before' | 'after';

export interface IPlacementMargins {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

/** Options for makeAutoScroll and DnDProvider autoScrollViewport prop */
export interface IAutoScrollOptions {
  threshold?: number | IPlacementMargins;
  speed?: number;
  disabled?: boolean;
}
