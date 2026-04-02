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
  ICollision,
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
  previewRef: Ref<HTMLElement | null>,
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
    selectionBase: new Set(),

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

  const collision: ICollision = {
    throttle: shallowRef(0),
  };

  const scrollPosition = reactive<ICoordinates>({
    x: typeof window !== 'undefined' ? window.scrollX : 0,
    y: typeof window !== 'undefined' ? window.scrollY : 0,
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

  const previewRender = ref<Component>();

  const previewSize = shallowRef<DOMRect>(typeof DOMRect !== 'undefined' ? new DOMRect() : {} as DOMRect);

  const previewStyle = computed(() => {
    scrollPosition.x;
    scrollPosition.y;
    const size = previewSize.value;
    const draggable = entities.initiatingDraggable;
    const draggingEntity = draggable ? entities.draggingMap.get(draggable) : null;
    const effectiveSize =
      size.width && size.height ? size : (draggingEntity?.initialRect ?? null);

    return calculateConstrainedPosition(
      pointer.value,
      effectiveSize,
      draggable || null,
      entities.constraintsAreaMap
    );
  });

  const previewTo = computed<string | false | null | undefined>({
    get: () => props?.previewTo,
    set: (value) => (previewTo.value = value),
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
    preview: {
      size: previewSize,
      position: previewStyle,
      render: previewRender,
      ref: previewRef,
      to: previewTo,
    },
    lib: {
      draggableObserver,
      droppableObserver,
      selectableAreaObserver,
      rectCache: new Map<HTMLElement, DOMRect>(),
    },
    autoScrollViewport,
  };
}
