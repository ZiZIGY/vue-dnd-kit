import type {
  IConstraintsAreaEntity,
  IDragPayload,
  IDropZonePayload,
  IDraggableEntity,
  IDroppableEntity,
  IEntities,
  ISelectableAreaEntity,
  TDnDNode,
} from './entities';
import type { ICoordinates, TPointerState } from './pointer';
import type { IAutoScrollOptions, IPlacement } from './placement';
import type {
  Component,
  ComputedRef,
  CSSProperties,
  Reactive,
  Ref,
  ShallowRef,
  WritableComputedRef,
} from 'vue';

/** Event object passed to drag/drop handlers */
export interface IDragEvent<
  T = unknown,
  D = unknown,
  U = unknown,
  V = unknown,
> {
  /** Payload from the dragged item (draggable payload) */
  payload: IDragPayload<T, D> | undefined;
  /** Payload from the drop zone (droppable payload), set for onEnter/onDrop/onLeave */
  dropZonePayload?: IDropZonePayload<U, V>;
  provider: IDnDProviderExternal;
}

/** Map element → placement for elements under cursor during drag */
export type THoveredMap = Map<HTMLElement, IPlacement>;

export interface IHovered {
  draggable: THoveredMap;
  droppable: THoveredMap;
}

export interface IDnDProviderExternal {
  teleportTo: WritableComputedRef<string | false | null | undefined>;
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
  };
  hovered: IHovered;
  collision: {
    run?: (provider: any) => {
      elements: HTMLElement[];
      zones: HTMLElement[];
    };
    throttle: Ref<number>;
  };
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
  /** Teleport to element: 'body' = defaults, string = element id. false | null | undefined = disabled. */
  teleportTo?: string | false | null;
}
