import type {
  IConstraintsAreaEntity,
  IDraggableEntity,
  IDroppableEntity,
  IEntities,
  ISelectableAreaEntity,
  TDnDNode,
} from './entities';
import type { ICoordinates, TPointerState } from './pointer';
import type { Component, ComputedRef, CSSProperties, Reactive, Ref, ShallowRef } from 'vue';

export interface IDnDProviderExternal  {
  state: Ref<TDnDState | undefined>;
  pointer: Ref<TPointerState | undefined>;
  entities: Reactive<IEntities>;
  modifiers: Ref<Set<string>>;
  scrollPosition: Reactive<ICoordinates>;
  delay: Reactive<IDelay>,
  distanceProgress: ComputedRef<number>;
  overlay: {
    style: ComputedRef<ICoordinates>;
    size: Ref<DOMRect| null>;
    render: Ref<Component | undefined>;
  }
}

export interface IDelay {
  progress: number;
  startTime: number;
}

export type TDnDState = 'dragging' | 'selecting' | 'activating' | null | undefined;
