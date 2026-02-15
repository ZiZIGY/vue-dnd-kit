/**
 * Placement — closest edge/area (top, right, bottom, left, center) for drop insertion
 */

import type {
  IDnDProviderExternal,
  IPlacement,
  IPlacementMargins,
} from '../../external';

export interface IRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * Creates pointer box from coordinates (e.g. cursor as 5×5)
 */
export const createPointerBox = (
  x: number,
  y: number,
  size: number = 5
): IRect => {
  const half = size / 2;
  return {
    left: x - half,
    top: y - half,
    width: size,
    height: size,
  };
};

/**
 * Creates pointer box from provider (cursor as 5×5)
 */
export const getPointerBoxFromProvider = (
  provider: IDnDProviderExternal
): IRect => {
  const p = provider.pointer.value?.current;
  const x = p?.x ?? 0;
  const y = p?.y ?? 0;
  return createPointerBox(x, y, 5);
};

/**
 * Returns placement: which side(s) of the element the pointer is in.
 * - If placementMargins set and pointer in center zone → center: true, top/right/bottom/left all false.
 * - Else → center: false, and top/right/bottom/left by quadrants (e.g. top+right for top-right);
 *   several can be true at once, only center is exclusive.
 */
export const getClosestPlacement = (
  pointerBox: IRect,
  elementRect: DOMRect,
  margins?: IPlacementMargins
): IPlacement => {
  const cx = pointerBox.left + pointerBox.width / 2;
  const cy = pointerBox.top + pointerBox.height / 2;

  if (margins) {
    const t = margins.top ?? 0;
    const r = margins.right ?? 0;
    const b = margins.bottom ?? 0;
    const l = margins.left ?? 0;
    const innerLeft = elementRect.left + l;
    const innerRight = elementRect.right - r;
    const innerTop = elementRect.top + t;
    const innerBottom = elementRect.bottom - b;
    if (
      innerLeft < innerRight &&
      innerTop < innerBottom &&
      cx >= innerLeft &&
      cx <= innerRight &&
      cy >= innerTop &&
      cy <= innerBottom
    ) {
      return {
        top: false,
        right: false,
        bottom: false,
        left: false,
        center: true,
      };
    }
  }

  const midX = elementRect.left + elementRect.width / 2;
  const midY = elementRect.top + elementRect.height / 2;

  return {
    top: cy < midY,
    bottom: cy > midY,
    left: cx < midX,
    right: cx > midX,
    center: false,
  };
};
