/**
 * Public exports of @vue-dnd-kit/core v3, grouped by how the module treats them.
 *
 * Static on purpose: v1 of this module scanned the built bundle with mlly, which
 * breaks on chunked re-exports (`export * from './chunk.js'`) and CJS entries.
 * `test/manifest.test.ts` compares this list with `packages/core/src/index.ts`, so
 * a new core export fails the tests until it is classified here.
 */

export const CORE_PACKAGE = '@vue-dnd-kit/core';

/** Registered as global components. */
export const components = ['DnDProvider'] as const;

/** Auto-imported by default. */
export const composables = [
  'makeDraggable',
  'makeDroppable',
  'makeSortableList',
  'makeSortableItem',
  'makeSortableTree',
  'makeSelectionArea',
  'useDnD',
  'useDnDMonitor',
] as const;

/** Generic names (`snapToGrid`, `restrictToParent`): auto-imported only with `autoImports.modifiers`. */
export const modifiers = [
  'restrictToVerticalAxis',
  'restrictToHorizontalAxis',
  'restrictToWindowEdges',
  'restrictToParent',
  'restrictToElement',
  'restrictToFirstScrollableAncestor',
  'snapToGrid',
  'snapCenterToCursor',
] as const;

/** Collision detection strategies: auto-imported only with `autoImports.collision`. */
export const collision = [
  'pointerFirst',
  'pointerWithin',
  'rectIntersection',
  'closestCenter',
  'closestCorners',
] as const;

/** Advanced bridge API (shadow roots, separate Vue apps): never auto-imported. */
export const advanced = ['useDnDContext', 'provideDnDContext'] as const;

/**
 * Type-only auto-imports. Only specific names: generic ones (`Key`, `Active`, `Over`,
 * `Modifier`, `Rect`) would clash with app types and are imported explicitly.
 */
export const types = [
  'AcceptRule',
  'BeforeDropResult',
  'DnDEndEvent',
  'DnDEvent',
  'DnDMonitor',
  'DnDProviderProps',
  'DnDSelection',
  'DnDState',
  'DnDStatus',
  'DraggableOptions',
  'DraggableReturn',
  'DroppableOptions',
  'DroppableReturn',
  'OverlaySlotProps',
  'SelectionAreaOptions',
  'SelectionAreaReturn',
  'SortableDropEvent',
  'SortableGroupOptions',
  'SortableItemOptions',
  'SortableItemReturn',
  'SortableListOptions',
  'SortableListReturn',
  'SortableTreeOptions',
  'SortableTreeReturn',
] as const;
