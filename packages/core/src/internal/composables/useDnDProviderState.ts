import { computed, reactive, ref, shallowRef, type Component, type Ref } from 'vue';
import type { ICoordinates, IDelay, IEntities, TDnDState, TPointerState } from '../../external/types';
import { filterByModifiers } from '../utils/provider';
import { createIntersectionObserver } from '../utils/observer';
import { useSizeObserver } from './useSizeObserver';
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
  
  const delay = reactive<IDelay>({
    progress: 0,
    startTime: 0,
  })

  const distanceProgress = computed(() => {
    if (!pointer.value || !entities.initiatingDraggable) return 0;

    const entity = entities.draggableMap.get(entities.initiatingDraggable);
    const distanceThreshold = entity?.activation?.distance;

    if (!distanceThreshold) return 1;

    return calculateDistanceProgress(pointer.value, distanceThreshold);
  });

  const draggableObserver = createIntersectionObserver(entities.visibleDraggableSet);
  const droppableObserver = createIntersectionObserver(entities.visibleDroppableSet);
  const selectableAreaObserver = createIntersectionObserver(
    entities.visibleSelectableAreaSet
  );

  const { overlaySize, overlaySizeObserver } = useSizeObserver(overlayRef);

  const overlayRender = ref<Component>()
  const overlayStyle = computed(() => {
    scrollPosition.y;
    scrollPosition.x;

    const draggable = entities.initiatingDraggable;

    return calculateConstrainedPosition(
      pointer.value,
      overlayRef.value,
      draggable || null,
      entities.constraintsAreaMap,
      overlaySize.value
    );
  });

  return {
    state,
    pointer,
    entities,
    modifiers,
    scrollPosition,
    delay,
    distanceProgress,
    overlay: {
      size: overlaySize,
      style: overlayStyle,
      render: overlayRender,
    },
    lib: {
      draggableObserver,
      droppableObserver,
      selectableAreaObserver,
      overlaySizeObserver,
    },
  };
}
