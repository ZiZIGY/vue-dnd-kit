import { computed, type Ref } from 'vue';
import type { IPoint } from '@vue-dnd-kit/core';
import { getDirection as _getDirection } from '../utils';

/**
 * Hook for calculating geometric relationships between two points.
 * Independent utility that can be used for any geometric calculations,
 * commonly used in drag and drop but not limited to it.
 *
 * @param pointA - Reference to the first point coordinates
 * @param pointB - Reference to the second point coordinates
 * @returns Object containing geometric calculations:
 * - delta: difference between points
 * - direction: cardinal direction from pointA to pointB
 * - distance: euclidean distance between points
 * - angle: angle in degrees between points
 *
 * @example
 * ```ts
 * const start = ref<IPoint>({ x: 0, y: 0 });
 * const end = ref<IPoint>({ x: 100, y: 100 });
 * const { delta, direction, distance, angle } = useGeometry(start, end);
 * ```
 */
export const useGeometry = (
  pointA: Ref<IPoint | null>,
  pointB: Ref<IPoint | null>
) => {
  /** Vector between two points */
  const delta = computed(() => ({
    x: (pointB.value?.x ?? 0) - (pointA.value?.x ?? 0),
    y: (pointB.value?.y ?? 0) - (pointA.value?.y ?? 0),
  }));

  /** Cardinal direction from pointA to pointB */
  const direction = computed(() => _getDirection(delta.value));

  /** Euclidean distance between points */
  const distance = computed(() => {
    const dx = (pointB.value?.x ?? 0) - (pointA.value?.x ?? 0);
    const dy = (pointB.value?.y ?? 0) - (pointA.value?.y ?? 0);
    return Math.sqrt(dx * dx + dy * dy);
  });

  /** Angle in degrees between points (0° is right, 90° is down) */
  const angle = computed(() => {
    const dx = (pointB.value?.x ?? 0) - (pointA.value?.x ?? 0);
    const dy = (pointB.value?.y ?? 0) - (pointA.value?.y ?? 0);
    return Math.atan2(dy, dx) * (180 / Math.PI);
  });

  return {
    delta,
    direction,
    distance,
    angle,
  };
};
