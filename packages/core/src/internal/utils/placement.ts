/**
 * Placement — closest edge/area (top, right, bottom, left) for drop insertion
 */

import type { IDnDProviderExternal } from "../../external";

export interface IPlacement {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

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
export const getPointerBoxFromProvider = (provider: IDnDProviderExternal): IRect => {
  const p = provider.pointer.value?.current;
  const x = p?.x ?? 0;
  const y = p?.y ?? 0;
  return createPointerBox(x, y, 5);
};

/**
 * Returns which edge of element is closest to pointer box center.
 * Exactly one of top/right/bottom/left is true.
 */
export const getClosestPlacement = (
  pointerBox: IRect,
  elementRect: DOMRect
): IPlacement => {
  const cx = pointerBox.left + pointerBox.width / 2;
  const cy = pointerBox.top + pointerBox.height / 2;

  const dTop = cy - elementRect.top;
  const dBottom = elementRect.bottom - cy;
  const dLeft = cx - elementRect.left;
  const dRight = elementRect.right - cx;

  const min = Math.min(dTop, dBottom, dLeft, dRight);

  return {
    top: dTop === min,
    bottom: dBottom === min,
    left: dLeft === min,
    right: dRight === min,
  };
};
