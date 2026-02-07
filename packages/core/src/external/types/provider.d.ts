import type {
  IConstraintsAreaEntity,
  IDraggableEntity,
  IDroppableEntity,
  IEntities,
  ISelectableAreaEntity,
  TDnDNode,
} from './entities';
import type { ICoordinates, TPointerState } from './pointer';
import type { IPlacement } from './placement';
import type { Component, ComputedRef, CSSProperties, Reactive, Ref, ShallowRef } from 'vue';

/** Map element → placement for elements under cursor during drag */
export type THoveredMap = Map<HTMLElement, IPlacement>;

export interface IHovered {
  draggable: THoveredMap;
  droppable: THoveredMap;
}

export interface IDnDProviderExternal  {
  state: Ref<TDnDState | undefined>;
  pointer: Ref<TPointerState | undefined>;
  entities: Reactive<IEntities>;
  modifiers: Ref<Set<string>>;
  scrollPosition: Reactive<ICoordinates>;
  delay: Reactive<IDelay>,
  distanceProgress: ComputedRef<number>;
  overlay: {
    ref: Ref<HTMLElement | null>;
    style: ComputedRef<ICoordinates>;
    size: Ref<DOMRect| null>;
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
}

export interface IDelay {
  progress: number;
  startTime: number;
}

export type TDnDState = 'dragging' | 'selecting' | 'activating' | null | undefined;
