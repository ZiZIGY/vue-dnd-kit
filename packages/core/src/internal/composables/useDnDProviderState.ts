import { computed, reactive, ref, shallowRef, type Ref } from 'vue';
import type { ICoordinates, IEntities, TDnDState, TPointerState } from '../../external/types';
import { filterByModifiers } from '../utils/provider';
import { createObserver } from '../utils/observer';
import { calculateDistanceProgress } from '../utils/drag-activation';
import { calculateConstrainedPosition } from '../utils/constraints';
import type { IDnDProviderInternal } from '../types/provider';

export function useDnDProviderState(
  overlayRef: Ref<HTMLElement | null>
): IDnDProviderInternal {
  const state = shallowRef<TDnDState>();
  const pointer = ref<TPointerState | undefined>();
  const modifiers = ref<Set<string>>(new Set());

  const entities = reactive<IEntities>({
    draggableMap: new Map(),
    droppableMap: new Map(),
    selectableAreaMap: new Map(),
    constraintsAreaMap: new Map(),

    initiatingDraggable: undefined,
    selectingArea: undefined,

    draggingMap: new Map(),
    selectedSet: new Set(),

    modifiersSelectableAreaSet: computed(() => {
      const selectableSet = filterByModifiers(
        entities.selectableAreaMap,
        entities.visibleSelectableAreaSet,
        modifiers
      )
      return selectableSet;
    }),
    modifiersDraggableSet: computed(() => {
      const draggableSet = filterByModifiers(
        entities.draggableMap,
        entities.visibleDraggableSet,
        modifiers
      )
      return draggableSet;
    }),

    visibleDraggableSet: new Set(),
    visibleDroppableSet: new Set(),
    visibleSelectableAreaSet: new Set(),
  });

  const scrollPosition = reactive<ICoordinates>({
    x: window.scrollX,
    y: window.scrollY,
  });

  const delayProgress = shallowRef(0);
  const delayStartTime = ref(0);

  const distanceProgress = computed(() => {
    if (!pointer.value || !entities.initiatingDraggable) return 0;

    const entity = entities.draggableMap.get(entities.initiatingDraggable);
    const distanceThreshold = entity?.activation?.distance;

    if (!distanceThreshold) return 1;

    return calculateDistanceProgress(pointer.value, distanceThreshold);
  });

  const draggableObserver = createObserver(entities.visibleDraggableSet);
  const droppableObserver = createObserver(entities.visibleDroppableSet);
  const selectableAreaObserver = createObserver(
    entities.visibleSelectableAreaSet
  );

  const overlaySize = ref<{ width: number; height: number } | null>(null);


  const overlayStyle = computed(() => {
    scrollPosition.y;
    scrollPosition.x;

    const draggable = entities.initiatingDraggable;

    return calculateConstrainedPosition(
      pointer.value,
      overlayRef.value,
      draggable || null,
      entities.constraintsAreaMap,
    );
  });

  return {
    state,
    pointer,
    entities,
    modifiers,
    scrollPosition,
    delayProgress,
    delayStartTime,
    distanceProgress,
    overlayStyle,
    lib: {
      draggableObserver,
      droppableObserver,
      selectableAreaObserver
    }
  };
}
