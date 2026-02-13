import {
  computed,
  reactive,
  ref,
  shallowRef,
  type Component,
  type Ref,
} from 'vue';
import type {
  ICoordinates,
  IDelay,
  IEntities,
  TDnDState,
  TPointerState,
} from '../../external/types';
import type {
  IDnDProviderProps,
  IHovered,
} from '../../external/types/provider';
import { filterByModifiers } from '../utils/provider';
import { isEffectivelyDisabledDraggable } from '../utils/disabled';
import {
  filterByGroupsDraggables,
  filterByGroupsDroppables,
} from '../utils/groups';
import { createIntersectionObserver } from '../utils/observer';
import { useSizeObserver } from './useSizeObserver';
import { calculateDistanceProgress } from '../utils/drag-activation';
import { calculateConstrainedPosition } from '../utils/constraints';
import type { IDnDProviderInternal } from '../types/provider';

const DEFAULT_KEYS = {
  forDrag: ['Enter', 'Space'],
  forCancel: ['Escape'],
  forDrop: ['Enter', 'Space'],
  forMove: [
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'KeyW',
    'KeyA',
    'KeyS',
    'KeyD',
  ],
  forMoveFaster: ['ShiftLeft', 'ShiftRight'],
} as const;

export function useDnDProviderState(
  overlayRef: Ref<HTMLElement | null>,
  props?: IDnDProviderProps
): IDnDProviderInternal {
  const state = shallowRef<TDnDState>();
  const pointer = ref<TPointerState | undefined>();
  const pressedKeys = ref<Set<string>>(new Set());

  const keyboard = {
    keys: {
      pressedKeys,
      forDrag: [...DEFAULT_KEYS.forDrag],
      forCancel: [...DEFAULT_KEYS.forCancel],
      forDrop: [...DEFAULT_KEYS.forDrop],
      forMove: [...DEFAULT_KEYS.forMove],
      forMoveFaster: [...DEFAULT_KEYS.forMoveFaster],
    },
    step: 8,
    moveFaster: 4,
  };

  const entities = reactive<IEntities>({
    draggableMap: new Map(),
    droppableMap: new Map(),
    selectableAreaMap: new Map(),
    constraintsAreaMap: new Map(),

    initiatingDraggable: undefined,
    selectingArea: undefined,

    draggingMap: new Map(),
    selectedSet: new Set(),

    allowedDroppableSet: computed(() => {
      if (state.value) {
        const allowedDroppableSet = filterByGroupsDroppables(
          entities.visibleDroppableSet,
          entities.draggingMap,
          entities.draggableMap,
          entities.droppableMap
        );
        return allowedDroppableSet;
      }
      return new Set();
    }),

    allowedDraggableSet: computed(() => {
      if (state.value) {
        const allowedDraggableSet = filterByGroupsDraggables(
          entities.visibleDraggableSet,
          entities.draggingMap,
          entities.draggableMap
        );
        return allowedDraggableSet;
      }
      return new Set();
    }),
    modifiersSelectableAreaSet: computed(() => {
      const selectableSet = filterByModifiers(
        entities.selectableAreaMap,
        entities.visibleSelectableAreaSet,
        keyboard.keys.pressedKeys
      );
      return selectableSet;
    }),
    modifiersDraggableSet: computed(() => {
      const draggableSet = filterByModifiers(
        entities.draggableMap,
        entities.visibleDraggableSet,
        keyboard.keys.pressedKeys,
        (node) => isEffectivelyDisabledDraggable(node, { entities })
      );
      return draggableSet;
    }),

    visibleDraggableSet: new Set(),
    visibleDroppableSet: new Set(),
    visibleSelectableAreaSet: new Set(),
  });

  const hovered = reactive<IHovered>({
    draggable: new Map(),
    droppable: new Map(),
  });

  const collision = {
    throttle: shallowRef(0),
  };

  const scrollPosition = reactive<ICoordinates>({
    x: window.scrollX,
    y: window.scrollY,
  });

  const delay = reactive<IDelay>({
    progress: 0,
    startTime: 0,
  });

  const distanceProgress = computed(() => {
    if (!pointer.value || !entities.initiatingDraggable) return 0;

    const entity = entities.draggableMap.get(entities.initiatingDraggable);
    const distanceThreshold = entity?.activation?.distance;

    if (!distanceThreshold) return 1;

    return calculateDistanceProgress(pointer.value, distanceThreshold);
  });

  const draggableObserver = createIntersectionObserver(
    entities.visibleDraggableSet
  );
  const droppableObserver = createIntersectionObserver(
    entities.visibleDroppableSet
  );
  const selectableAreaObserver = createIntersectionObserver(
    entities.visibleSelectableAreaSet
  );

  const { overlaySize, overlaySizeObserver } = useSizeObserver(overlayRef);

  const overlayRender = ref<Component>();

  const overlayStyle = computed(() => {
    const draggable = entities.initiatingDraggable;

    return calculateConstrainedPosition(
      pointer.value,
      overlayRef.value,
      draggable || null,
      entities.constraintsAreaMap,
      overlaySize.value
    );
  });

  const overlayTo = computed<string | false | null | undefined>({
    get: () => props?.overlayTo,
    set: (value) => (overlayTo.value = value),
  });

  const autoScrollViewport = computed(() => props?.autoScrollViewport);

  return {
    state,
    pointer,
    entities,
    keyboard,
    scrollPosition,
    delay,
    distanceProgress,
    hovered,
    collision,
    overlay: {
      size: overlaySize,
      position: overlayStyle,
      render: overlayRender,
      ref: overlayRef,
      to: overlayTo,
    },
    lib: {
      draggableObserver,
      droppableObserver,
      selectableAreaObserver,
      overlaySizeObserver,
    },
    autoScrollViewport,
  };
}
