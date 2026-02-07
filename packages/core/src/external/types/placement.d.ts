export interface IPlacement {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
  /** True when pointer is in center zone (inside placementMargins). Used for dual-role draggable+zone. */
  center?: boolean;
}

export interface IPlacementMargins {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}
