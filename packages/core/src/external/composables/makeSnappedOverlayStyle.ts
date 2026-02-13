import { computed, type ComputedRef } from 'vue';
import type { ICoordinates } from '@vue-dnd-kit/core';

/** Per-axis grid (no grid = step 1, no snap) */
export type TSnapOverlayOptions =
  | {
      grid: number;
      gridX?: never;
      gridY?: never;
    }
  | {
      grid?: never;
      gridX: number;
      gridY: number;
    };

function snapToGrid(value: number, step: number): number {
  if (step <= 0) return value;
  return Math.round(value / step) * step;
}

/**
 * Returns a computed that maps overlay position (x, y) to grid‑snapped coordinates.
 * Core keeps writing raw coordinates; use this for overlay display only.
 *
 * @param options - grid (or gridX / gridY)
 * @returns ComputedRef<ICoordinates> — use for --position-x / --position-y in overlay
 */
export function makeSnappedOverlayStyle(
  overlayStyle: ComputedRef<ICoordinates>,
  options?: TSnapOverlayOptions
): ComputedRef<ICoordinates> {
  const hasGrid =
    options && 'grid' in options && (options as { grid: number }).grid != null;
  const stepX = !options
    ? 1
    : hasGrid
    ? (options as { grid: number }).grid
    : (options as { gridX: number; gridY: number }).gridX;
  const stepY = !options
    ? 1
    : hasGrid
    ? (options as { grid: number }).grid
    : (options as { gridX: number; gridY: number }).gridY;

  return computed<ICoordinates>(() => {
    const { x, y } = overlayStyle.value;
    return {
      x: snapToGrid(x, stepX),
      y: snapToGrid(y, stepY),
    };
  });
}
