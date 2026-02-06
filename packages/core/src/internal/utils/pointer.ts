import type { IDraggableEntity, IDraggingEntity, TPointerState } from '../../external/types';
import type { IDnDProviderInternal } from '../types/provider';

/**
 * Creates initial pointer state from event
 */
export function createPointerState(
  event: PointerEvent,
  offsetX: number = 0,
  offsetY: number = 0
): TPointerState {
  return {
    start: { x: event.clientX, y: event.clientY },
    current: { x: event.clientX, y: event.clientY },
    offset: { x: offsetX, y: offsetY },
  };
}

/**
 * Calculates offset between cursor and element
 */
export function calculateCursorOffset(
  event: PointerEvent,
  element: HTMLElement
): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

/**
 * Creates dragging entity with initial data
 */
export function createDraggingEntity(
  element: HTMLElement,
  draggableEntity?: IDraggableEntity
): IDraggingEntity {
  return {
    ...draggableEntity,
    initialHTML: element.innerHTML,
    initialRect: element.getBoundingClientRect(),
  };
}

/**
 * Инициализирует dragging для выбранных элементов
 */
export function initializeDraggingFromSelection(
  selectedSet: Set<HTMLElement>,
  draggableMap: Map<HTMLElement, IDraggableEntity>,
  draggingMap: Map<HTMLElement, IDraggingEntity>
): void {
  selectedSet.forEach((selected) => {
    const draggingEntity = draggableMap.get(selected);
    draggingMap.set(selected, createDraggingEntity(selected, draggingEntity));
  });
  selectedSet.clear();
}

/**
 * Initializes dragging for single element
 */
export function initializeDraggingFromElement(
  element: HTMLElement,
  draggableMap: Map<HTMLElement, IDraggableEntity>,
  draggingMap: Map<HTMLElement, IDraggingEntity>
): void {
  draggingMap.clear();
  const draggingEntity = draggableMap.get(element);
  draggingMap.set(element, createDraggingEntity(element, draggingEntity));
}

/**
 * Starts dragging for the current provider state (initiatingDraggable + selectedSet)
 */
export function startDraggingForProvider(provider: IDnDProviderInternal): void {
  if (!provider.entities.initiatingDraggable) return;
  provider.state.value = 'dragging';
  initializeDragging(
    provider.entities.initiatingDraggable,
    provider.entities.selectedSet,
    provider.entities.draggableMap,
    provider.entities.draggingMap
  );
}

/**
 * Initializes dragging (chooses between selection and single element)
 */
export function initializeDragging(
  initiatingElement: HTMLElement,
  selectedSet: Set<HTMLElement>,
  draggableMap: Map<HTMLElement, IDraggableEntity>,
  draggingMap: Map<HTMLElement, IDraggingEntity>
): void {
  if (selectedSet.has(initiatingElement)) {
    initializeDraggingFromSelection(selectedSet, draggableMap, draggingMap);
  } else {
    selectedSet.clear();
    initializeDraggingFromElement(initiatingElement, draggableMap, draggingMap);
  }
}
