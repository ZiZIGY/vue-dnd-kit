/**
 * Public API (external)
 * Re-exports from internal for future package consumers
 */

export { default as DnDProvider } from './components/DnDProvider.vue';

export { makeDraggable } from './composables/makeDraggable';
export { makeSelectableArea } from './composables/makeSelectableArea';
export { makeBoundingBox } from './composables/makeBoundingBox';
export { makeDroppable } from './composables/makeDroppable';
export { useDnDProvider } from './composables/useDnDProvider';

export type * from './types';
