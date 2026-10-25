export { DnDProvider } from './core/DnDProvider';
export { DragPreview } from './core/DragPreview';
export { makeDraggable } from './core/makeDraggable';
export { makeDroppable } from './core/makeDroppable';
export { useDnD, useDnDMonitor, useDnDContext, provideDnDContext } from './core/context';
export { makeSortableList } from './sortable/makeSortableList';
export { makeSortableItem } from './sortable/makeSortableItem';
export { makeSortableTree } from './sortable/makeSortableTree';
export { makeSelectionArea } from './core/makeSelectionArea';
export { defineSensor, useSensor } from './core/sensors/host';
export { pointerSensor } from './core/sensors/pointer';
export { keyboardSensor } from './core/sensors/keyboard';

export {
  pointerFirst,
  pointerWithin,
  rectIntersection,
  closestCenter,
  closestCorners,
} from './core/collision';

export {
  restrictToVerticalAxis,
  restrictToHorizontalAxis,
  restrictToWindowEdges,
  restrictToParent,
  restrictToElement,
  restrictToFirstScrollableAncestor,
  snapToGrid,
  snapCenterToCursor,
  type SnapToGridOptions,
} from './core/modifiers';

// Public types, listed one by one: a type added to `types/` is internal until it is
// exported here. Every type a public one refers to is public too.
export type {
  // Primitives and option values
  Key,
  Coordinates,
  Size,
  Rect,
  MaybePromise,
  MaybeReadonlyRefOrGetter,
  MaybeReadonlyRef,
  MaybeElement,
  MaybeElementRef,
  DnDStatus,
  SensorType,
  PointerKind,
  ActivationConstraint,
  ActivationOptions,
  KeyboardOptions,
  AutoScrollOptions,

  // Sensors
  Sensor,
  SensorContext,
  SensorActivation,
  SensorDrag,
  SensorDragState,
  SensorDirection,
  SensorStepOptions,
  SortablePosition,

  // Drag state and events
  DragItem,
  Active,
  Over,
  DragSource,
  DragMode,
  DnDEvent,
  DnDEndEvent,
  BeforeDropResult,
  DnDMonitor,
  KeyboardMoveContext,
  DnDState,
  DnDSelection,
  Announcements,

  // Accept rules
  AcceptContext,
  AcceptRule,
  AcceptMode,

  // Animations
  AnimationOptions,
  LayoutAnimation,
  LayoutAnimationContext,
  DropAnimation,
  DropAnimationContext,

  // Collision detection and modifiers
  CollisionDetection,
  CollisionArgs,
  CollisionCandidate,
  Modifier,
  ModifierArgs,

  // Provider, context and overlay
  DnDProviderProps,
  DnDContext,
  OverlaySlotProps,
  OverlayProps,
  DragPreviewProps,

  // makeDraggable, makeDroppable
  DraggableOptions,
  DraggableReturn,
  DroppableOptions,
  DroppableReturn,
  Placement,

  // makeSortableList, makeSortableItem
  SortableListOptions,
  SortableListReturn,
  SortableItems,
  SortableItemOptions,
  SortableItemReturn,
  SortableStrategy,
  SortableBehavior,
  SortablePlaceholder,
  MultipleMode,
  DropOutside,
  SortableGroupOptions,
  SortablePutContext,
  SortableDropEvent,
  SortableIndicator,

  // makeSortableTree
  SortableTreeOptions,
  SortableTreeReturn,
  SortableTreeDropEvent,
  TreeNesting,
  FlatNode,
  TreeProjection,

  // makeSelectionArea
  SelectionAreaOptions,
  SelectionAreaReturn,
  SelectionStrategy,
  SelectionModifier,
} from './types';
