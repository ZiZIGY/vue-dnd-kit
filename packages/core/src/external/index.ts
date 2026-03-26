/**
 * Public API (external)
 * Re-exports from internal for future package consumers
 */

import DnDProvider from './components/DnDProvider.vue';
import DragPreview from './components/DragPreview.vue';

export { DnDProvider, DragPreview };
export { makeDraggable } from './composables/makeDraggable';
export { makeSelectionArea } from './composables/makeSelectionArea';
export { makeConstraintArea } from './composables/makeConstraintArea';
export { makeDroppable } from './composables/makeDroppable';
export { useDnDProvider } from './composables/useDnDProvider';
export { injectionKey } from '../internal/utils/namespaces';
export {
  makeAutoScroll,
  type IAutoScrollOptions,
} from './composables/makeAutoScroll';

export type * from './types';
