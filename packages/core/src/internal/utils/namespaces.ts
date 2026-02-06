/**
 * DnD Kit data attributes and CSS selectors
 */
export const DnDAttributes = {
  SELECT_AREA: 'data-dnd-kit-select-area',
  DRAGGABLE: 'data-dnd-kit-draggable',
  DROPPABLE: 'data-dnd-kit-droppable',
  CONSTRAINT_AREA: 'data-dnd-kit-constraint-area',
  CONTAINER: 'data-dnd-kit-container'
} as const;

export const DnDSelectors = {
  SELECT_AREA: `[${DnDAttributes.SELECT_AREA}]`,
  DRAGGABLE: `[${DnDAttributes.DRAGGABLE}]`,
  DROPPABLE: `[${DnDAttributes.DROPPABLE}]`,
  CONSTRAINT_AREA: `[${DnDAttributes.CONSTRAINT_AREA}]`,
  CONTAINER: `[${DnDAttributes.CONTAINER}]`
} as const;

export const injectionKey = 'VueDnDKitProvider' as const
