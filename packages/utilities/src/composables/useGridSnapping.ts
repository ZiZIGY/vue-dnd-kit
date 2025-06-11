import { shallowRef } from 'vue';
import type { IPoint } from '@vue-dnd-kit/core';

export const useGridSnapping = (gridSize = 20) => {
  const size = shallowRef(gridSize);
  const enabled = shallowRef(true);

  const snapToGrid = (value: number): number => {
    if (!enabled.value) return value;
    return Math.round(value / size.value) * size.value;
  };

  const snapPointToGrid = (point: IPoint): IPoint => {
    if (!enabled.value) return point;
    return {
      x: snapToGrid(point.x),
      y: snapToGrid(point.y),
    };
  };

  return {
    snapToGrid,
    snapPointToGrid,
    size,
    enabled,
  };
};
