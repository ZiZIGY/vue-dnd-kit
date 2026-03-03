import type {
  IConstraintsAreaEntity,
  IDraggableEntity,
  IDroppableEntity,
  IEntities,
  ISelectableAreaEntity,
  TDnDNode,
  IDragItem,
  IDropZoneContext,
} from './entities';
import type { ICoordinates, TPointerState } from './pointer';
import type { IAutoScrollOptions } from './placement';
import type { IHelpers, IHoveredDraggableContext } from './operations';
import type {
  Component,
  ComputedRef,
  CSSProperties,
  Reactive,
  Ref,
  ShallowRef,
  WritableComputedRef,
} from 'vue';

/** Event object passed to all drag/drop handlers */
export interface IDragEvent<
  DragT = unknown,
  DragD = unknown,
  ZoneT = unknown,
  ZoneU = unknown,
> {
  /** All dragged items sorted by index. Length > 1 means multi-drag. */
  draggables: IDragItem<DragT, DragD>[];
  /** Drop zone context — present in onEnter / onDrop / onLeave. */
  dropZone: IDropZoneContext<ZoneT, ZoneU> | undefined;
  /** Draggable element under cursor inside the zone — use for insert-before/after. */
  hoveredDraggable: IHoveredDraggableContext | undefined;
  provider: IDnDProviderExternal;
  /** Helpers bound to this event. Low-level array ops + high-level suggest* presets. */
  helpers: IHelpers;
}

/** Map element → placement for elements under cursor during drag */
export type THoveredMap = Map<HTMLElement, IPlacement>;

export interface IHovered {
  draggable: THoveredMap;
  droppable: THoveredMap;
}

export interface ICollision {
  run?: (provider: any) => {
    elements: HTMLElement[];
    zones: HTMLElement[];
  };
  throttle: Ref<number>;
}

export interface IDnDProviderExternal {
  state: Ref<TDnDState | undefined>;
  pointer: Ref<TPointerState | undefined>;
  entities: Reactive<IEntities>;
  keyboard: {
    keys: {
      pressedKeys: Ref<Set<string>>;
      forDrag: string[];
      forCancel: string[];
      forDrop: string[];
      forMove: string[];
      forMoveFaster: string[];
    };
    step: number;
    moveFaster: number;
  };
  scrollPosition: Reactive<ICoordinates>;
  delay: Reactive<IDelay>;
  distanceProgress: ComputedRef<number>;
  overlay: {
    ref: Ref<HTMLElement | null>;
    position: ComputedRef<ICoordinates>;
    size: Ref<DOMRect | null>;
    render: Ref<Component | undefined>;
    to: WritableComputedRef<string | false | null | undefined>;
  };
  hovered: IHovered;
  collision: ICollision;
  autoScrollViewport: ComputedRef<
    IAutoScrollOptions | true | false | null | undefined
  >;
}

export interface IDelay {
  progress: number;
  startTime: number;
}

export type TDnDState =
  | 'dragging'
  | 'selecting'
  | 'activating'
  | null
  | undefined;

/** DnDProvider props */
export interface IDnDProviderProps {
  /** Enable viewport auto-scroll: true = defaults, object = options. false | null | undefined = disabled. */
  autoScrollViewport?: IAutoScrollOptions | true | false | null;
  /** Teleport overlay to element: 'body' = defaults, string = element id. false | null | undefined = disabled. */
  overlayTo?: string | false | null;
}
