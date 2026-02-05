import type { IDraggableEntity, IDraggingEntity, TPointerState } from '../types';

/**
 * Создает начальное состояние pointer
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
 * Вычисляет offset между курсором и элементом
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
 * Создает dragging entity с начальными данными
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
 * Инициализирует dragging для одного элемента
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
 * Инициализирует dragging (выбирает между selection и single element)
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
