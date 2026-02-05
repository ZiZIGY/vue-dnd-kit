import type {
  IConstraintsAreaEntity,
  IDraggableEntity,
  IDroppableEntity,
  IEntities,
  ISelectableAreaEntity,
  TDnDNode,
} from './entities';
import type { ICoordinates, TPointerState } from './pointer';
import type { ComputedRef, CSSProperties, Reactive, Ref, ShallowRef } from 'vue';

export interface IDnDProvider {
  state: Ref<TDnDState>;
  pointer: Ref<TPointerState | null>;
  entities: Reactive<IEntities>;
  distanceProgress: ComputedRef<number>;
  delayProgress: ShallowRef<number>;
  overlayStyle: ComputedRef<CSSProperties>;
  scrollPosition: Reactive<ICoordinates>
  lib: {
    draggableObserver: IIntersectionObserverWrapper;
    droppableObserver: IIntersectionObserverWrapper;
    selectableAreaObserver: IIntersectionObserverWrapper;
  };
}

export interface IIntersectionObserverWrapper {
  observe: (element: HTMLElement) => void;
  unobserve: (element: HTMLElement) => void;
  disconnect: () => void;
}

export type TDnDState = 'dragging' | 'selecting' | 'activating' | null | undefined;
