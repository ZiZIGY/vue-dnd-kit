import {
  reactive,
  shallowReactive,
  computed,
  type Component,
  TransitionProps,
  effectScope,
  type EffectScope,
  shallowRef,
} from 'vue';
import { IDraggable, IDragging, IDroppable, IPointerPosition } from '../@types';
import { createDnDObservers } from './observers';
import { createDnDEvents } from './events';

let scope: EffectScope | null = null;
let globalStore: ReturnType<typeof createContext> | null = null;

function createContext() {
  const elementsMap = reactive(new Map<HTMLElement, IDraggable>());
  const droppableMap = reactive(new Map<HTMLElement, IDroppable>());
  const draggingMap = reactive(new Map<HTMLElement, IDragging>());
  const selectedSet = shallowReactive(new Set<HTMLElement>());

  const isDragging = computed(() => draggingMap.size > 0);
  const isSelecting = shallowRef(false);

  const overlay = reactive({
    component: null as Component | null,
    ref: null as HTMLElement | null,
    options: null as TransitionProps | null,
    animating: {
      enter: false,
      leave: false,
      appear: false,
    },
  });

  const pointerPosition = shallowReactive<IPointerPosition>({
    current: [0, 0],
    start: [0, 0],
    end: [0, 0],
    offset: [0, 0],
    offsetPixel: [0, 0],
  });

  const visibleZones = shallowReactive<Set<HTMLElement | Element>>(new Set());
  const visibleElements = shallowReactive<Set<HTMLElement | Element>>(
    new Set()
  );

  const { observeElement, observeZone } = createDnDObservers(
    visibleZones,
    visibleElements
  );

  const { handlePointerDown } = createDnDEvents({
    elementsMap,
    draggingMap,
    droppableMap,
    selectedSet,
    visibleZones,
    visibleElements,
    isSelecting,
    pointerPosition,
    overlay,
    isDragging,
    observeElement,
    observeZone,
  });

  return {
    isDragging,
    isSelecting,

    elementsMap,
    draggingMap,
    droppableMap,
    selectedSet,
    visibleZones,
    visibleElements,
    overlay,
    pointerPosition,

    observeElement,
    observeZone,
    handlePointerDown,
  };
}

export const createDnDProvider = () => {
  if (scope) {
    scope.stop();
  }

  scope = effectScope(true);

  globalStore = scope.run(() => createContext())!;

  return globalStore;
};

export const useDnDProvider = () => {
  if (!globalStore) {
    throw new Error(
      'Vue DnD Kit plugin is not installed or missing store provider'
    );
  }
  return globalStore;
};

export const cleanupDnDProvider = () => {
  if (scope) {
    scope.stop();
    scope = null;
    globalStore = null;
  }
};
