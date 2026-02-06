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

export interface IDnDProviderExternal  {
  state: Ref<TDnDState | undefined>;
  pointer: Ref<TPointerState | undefined>;
  entities: Reactive<IEntities>;
  modifiers: Ref<Set<string>>;
  scrollPosition: ICoordinates;
  delayProgress: Ref<number>;
  delayStartTime: Ref<number>;
  distanceProgress: ComputedRef<number>;
  overlayStyle: ComputedRef<ICoordinates>;
}

export type TDnDState = 'dragging' | 'selecting' | 'activating' | null | undefined;
