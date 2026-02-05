export const DnDAttributes = {
  SELECT_AREA: 'data-dnd-kit-select-area',
  DRAGGABLE: 'data-dnd-kit-draggable',
  DROPPABLE: 'data-dnd-kit-droppable',
  CONSTRAINT_AREA: 'data-dnd-kit-constraint-area',
} as const;

export const DnDSelectors = {
  SELECT_AREA: `[${DnDAttributes.SELECT_AREA}]`,
  DRAGGABLE: `[${DnDAttributes.DRAGGABLE}]`,
  DROPPABLE: `[${DnDAttributes.DROPPABLE}]`,
  CONSTRAINT_AREA: `[${DnDAttributes.CONSTRAINT_AREA}]`,
} as const;

export const injectionKey = 'DnDProvider' as const
