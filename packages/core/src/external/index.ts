/**
 * Public API (external)
 * Re-exports from internal for future package consumers
 */

import DnDProvider from './components/DnDProvider.vue';

export { DnDProvider };
export { makeDraggable } from './composables/makeDraggable';
export { makeSelectionArea } from './composables/makeSelectionArea';
export { makeConstraintArea } from './composables/makeConstraintArea';
export { makeDroppable } from './composables/makeDroppable';
export { useDnDProvider } from './composables/useDnDProvider';
export {
  makeAutoScroll,
  type IAutoScrollOptions,
} from './composables/makeAutoScroll';
export {
  makeSnappedOverlayPosition,
  type TSnapOverlayOptions,
} from './composables/makeSnappedOverlayPosition';

export {
  createSensor,
  defaultCollisionDetection,
  type CollisionDetectionFn,
  type TMergeStrategy,
} from '../internal/sensors';

export type * from './types';
