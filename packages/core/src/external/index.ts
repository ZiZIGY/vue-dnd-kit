/**
 * Public API (external)
 * Re-exports from internal for future package consumers
 */

export { default as DnDProvider } from './components/DnDProvider.vue';

export { makeDraggable } from './composables/makeDraggable';
export { makeSelectionArea } from './composables/makeSelectionArea';
export { makeConstraintArea } from './composables/makeConstraintArea';
export { makeDroppable } from './composables/makeDroppable';
export { useDnDProvider } from './composables/useDnDProvider';

export type * from './types';
