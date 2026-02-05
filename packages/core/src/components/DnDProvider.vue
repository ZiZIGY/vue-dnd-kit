<script setup lang="ts">
  import {
    computed,
    onBeforeUnmount,
    onMounted,
    provide,
    reactive,
    ref,
    shallowRef,
    useTemplateRef,
    type Component,
    type CSSProperties,
  } from 'vue';
  import type {
    IDnDProvider,
    IEntities,
    ICoordinates,
    TDnDState,
    TPointerState,
  } from '../types';
  import { DnDSelectors, injectionKey } from '../utils/namespaces';
  import { filterByModifiers } from '../utils/provider';
  import { createObserver } from '../utils/observer';
  import { getSelectionBoxRect } from '../utils/selection';
  import { checkIntersection, disableInteractions, enableInteractions } from '../utils/dom';
  import { calculateConstrainedPosition } from '../utils/constraints';
  import {
    createPointerState,
    calculateCursorOffset,
    initializeDragging,
  } from '../utils/pointer';
  import {
    checkDragHandle,
    calculateDistanceProgress,
  } from '../utils/drag-activation'; 
import DefaultOverlay from './DefaultOverlay.vue';

  const state = shallowRef<TDnDState>();
  const pointer = ref<TPointerState | undefined>();
  const entities = reactive<IEntities>({
    draggableMap: new Map(),
    droppableMap: new Map(),
    selectableAreaMap: new Map(),
    constraintsAreaMap: new Map(),
    
    selectingArea: undefined,
    initiatingDraggable: undefined,
    
    draggingMap: new Map(),
    selectedSet: new Set(),

    modifiersSelectableAreaSet: computed(() => {
      const selectableSet = filterByModifiers(
        entities.selectableAreaMap,
        entities.visibleSelectableAreaSet,
        modifiers
      );
      return selectableSet;
    }),
    modifiersDraggableSet: computed(() => {
      const selectableSet = filterByModifiers(
        entities.draggableMap,
        entities.visibleDraggableSet,
        modifiers
      );
      return selectableSet;
    }),

    visibleDraggableSet: new Set(),
    visibleDroppableSet: new Set(),
    visibleSelectableAreaSet: new Set(),
  });
  
  const modifiers = ref<Set<string>>(new Set());
  const overlayRef = useTemplateRef<HTMLElement>('overlayRef');
  const overlayView = ref<Component>()
  const scrollPosition = reactive<ICoordinates>({
    x: window.screenTop,
    y: window.screenLeft,
  });

  const delayProgress = shallowRef(0);
  const delayStartTime = ref(0);

  let delayTimerRAF: number | null = null;

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

  const handleKeyDown = (event: KeyboardEvent) =>
    modifiers.value.add(event.code);
  const handleKeyUp = (event: KeyboardEvent) =>
    modifiers.value.delete(event.code);

  const handleScroll = () => {
    if (state.value) {
      scrollPosition.x = window.scrollX;
      scrollPosition.y = window.scrollY;
    };
  };

  const handlePointerDown = (event: PointerEvent) => {
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointermove', handlePointerMove);

    const target = event.target as HTMLElement;

    const closestSelectionArea = target.closest(
      DnDSelectors.SELECT_AREA
    ) as HTMLElement;

    if (
      !!entities.modifiersSelectableAreaSet.size &&
      entities.modifiersSelectableAreaSet.has(closestSelectionArea)
    ) {
      disableInteractions();
      pointer.value = createPointerState(event);
      state.value = 'selecting';
      entities.selectingArea = closestSelectionArea;
      return;
    }

    const closestDraggable = target.closest(
      DnDSelectors.DRAGGABLE
    ) as HTMLElement;

    if (
      !!entities.modifiersDraggableSet.size &&
      entities.modifiersDraggableSet.has(closestDraggable)
    ) {
      disableInteractions();
      const entity = entities.draggableMap.get(closestDraggable);

      if (!checkDragHandle(target, closestDraggable, entity?.dragHandle)) return;

      entities.initiatingDraggable = closestDraggable;

      const offset = calculateCursorOffset(event, closestDraggable);
      pointer.value = createPointerState(event, offset.x, offset.y);

      const hasActivation = entity?.activation?.distance || entity?.activation?.delay;

      if (hasActivation) {
        state.value = 'activating';

        if (entity?.activation?.delay) {
          delayStartTime.value = Date.now();
          startDelayTimer();
        }
      } else {
        state.value = 'dragging';
        startDragging();
      }
    }
  };

  const startDelayTimer = () => {
    const update = () => {
      if (state.value !== 'activating' || !entities.initiatingDraggable) {
        delayTimerRAF = null;
        return;
      }

      const entity = entities.draggableMap.get(entities.initiatingDraggable);
      const delay = entity?.activation?.delay;

      if (!delay) {
        delayTimerRAF = null;
        return;
      }

      const elapsed = Date.now() - delayStartTime.value;
      delayProgress.value = Math.min(elapsed / (delay * 1000), 1);

      if (delayProgress.value >= 1 && distanceProgress.value >= 1) {
        startDragging();
      } else {
        delayTimerRAF = requestAnimationFrame(update);
      }
    };

    delayTimerRAF = requestAnimationFrame(update);
  };

  const startDragging = () => {
    if (!entities.initiatingDraggable) return;

    state.value = 'dragging';

    initializeDragging(
      entities.initiatingDraggable,
      entities.selectedSet,
      entities.draggableMap,
      entities.draggingMap
    );
  };

  const handlePointerUp = () => {
    enableInteractions();

    if (delayTimerRAF !== null) {
      cancelAnimationFrame(delayTimerRAF);
      delayTimerRAF = null;
    }

    pointer.value = undefined;
    state.value = undefined;
    entities.selectingArea = undefined;
    entities.initiatingDraggable = undefined;
    
    delayProgress.value = 0;
    delayStartTime.value = 0;
    
    entities.draggingMap.clear()

    document.removeEventListener('pointerup', handlePointerUp);
    document.removeEventListener('pointermove', handlePointerMove);
  };

  const overlayStyle = computed<CSSProperties>(() => {
    scrollPosition.y;
    scrollPosition.x;

    const draggable = entities.initiatingDraggable
    
    const position = calculateConstrainedPosition(
      pointer.value,
      overlayRef.value,
      draggable || null,
      entities.constraintsAreaMap
    );
    
    return {
      transform: `translate3d(${position.x}px, ${position.y}px, 0px)`, 
    }
  });

  const handlePointerMove = (event: PointerEvent) => {
    if (!pointer.value) return;

    pointer.value.current = {
      x: event.clientX,
      y: event.clientY,
    };

    if (state.value === 'activating' && entities.initiatingDraggable) {
      const entity = entities.draggableMap.get(entities.initiatingDraggable);
      
      if (distanceProgress.value >= 1) {
        if (!entity?.activation?.delay || delayProgress.value >= 1) startDragging();
      }
      return;
    }

    if (state.value === 'selecting' && entities.selectingArea) {
      const selectionArea = entities.selectingArea;

      const selectionBoxRect = getSelectionBoxRect(
        pointer.value.start,
        pointer.value.current
      );

      entities.visibleDraggableSet.forEach((draggableElement) => {
        if (!selectionArea.contains(draggableElement)) return;

        const draggableRect = draggableElement.getBoundingClientRect();

        checkIntersection(selectionBoxRect, draggableRect)
          ? entities.selectedSet.add(draggableElement)
          : entities.selectedSet.delete(draggableElement);
      });
    }
  };

  const handleClearModifiers = () => modifiers.value.clear();

  onMounted(() => {
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('blur', handleClearModifiers);
    document.addEventListener('scroll', handleScroll, true);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handlePointerDown);
    document.removeEventListener('pointerup', handlePointerUp);
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    document.removeEventListener('blur', handleClearModifiers);
    document.removeEventListener('scroll', handleScroll, true);

    if (delayTimerRAF !== null) cancelAnimationFrame(delayTimerRAF);

    draggableObserver.disconnect();
    droppableObserver.disconnect();
    selectableAreaObserver.disconnect();
  });

  provide<IDnDProvider>(injectionKey, {
    state,
    pointer,
    entities,
    distanceProgress,
    delayProgress,
    overlayStyle,
    scrollPosition,
    lib: {
      draggableObserver,
      droppableObserver,
      selectableAreaObserver,
    },
  });
</script>

<template>
  <slot />

  <div
    ref="overlayRef" class="dnd-kit-overlay-container"
  >
    <slot name="overlay">
      <component :is="overlayView || DefaultOverlay" ref="overlayRef"/>
    </slot>
  </div>
  
  <pre>
    {{ entities }}
  </pre>
</template>

<style>
  pre {
    position: fixed;
    width: 300px;
    height: 100%;
    overflow: scroll;
    text-align: left;
  }
  .dnd-kit-overlay-container {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
  }
</style>
