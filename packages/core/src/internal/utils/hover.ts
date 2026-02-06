/**
 * Hover detection — hovered.draggable and hovered.droppable Maps (element → placement)
 */
import { getClosestPlacement, getPointerBoxFromProvider } from './placement';
import { containsPoint, isDescendant } from './dom';
import type { IDnDProviderInternal } from '../types/provider';
import type { IHovered } from '../../external/types/provider';

type BestMap = Map<HTMLElement, DOMRect>;

const getArea = (rect: DOMRect) => rect.width * rect.height;

const pickSmallest = (current: BestMap, candidate: HTMLElement, candidateRect: DOMRect): void => {
  const [, currentRect] = current.entries().next().value ?? [null, null];
  const currentArea = currentRect ? getArea(currentRect) : Infinity;
  if (getArea(candidateRect) < currentArea) {
    current.clear();
    current.set(candidate, candidateRect);
  }
};

const isDescendantOfDragged = (provider: IDnDProviderInternal, candidate: HTMLElement): boolean =>
  [...provider.entities.draggingMap.keys()].some((dragged) => isDescendant(dragged, candidate));

/**
 * True if pointer is inside overlay container. If outside — clear hover (lost).
 */
const isPointerInsideContainer = (
  provider: IDnDProviderInternal,
  pointerCoordinates: { x: number; y: number }
): boolean => {
  const container = provider.overlay.ref?.value?.firstElementChild;
  if (!container) return true;
  const containerRect = container.getBoundingClientRect();
  return containsPoint(containerRect, pointerCoordinates.x, pointerCoordinates.y);
};

/**
 * Updates hovered.draggable and hovered.droppable from pointer position (when dragging).
 * bestZone/bestElement: Map<element, rect> — getBoundingClientRect() once per candidate.
 * Skips hover when pointer is outside overlay container.
 */
export const updateHoveredFromPointer = (
  provider: IDnDProviderInternal,
  hovered: IHovered
): void => {
  const pointerCoordinates = provider.pointer.value?.current;
  if (!pointerCoordinates) {
    hovered.draggable.clear();
    hovered.droppable.clear();
    return;
  }

  if (!isPointerInsideContainer(provider, pointerCoordinates)) {
    hovered.draggable.clear();
    hovered.droppable.clear();
    return;
  }

  hovered.draggable.clear();
  hovered.droppable.clear();
  const pointerBox = getPointerBoxFromProvider(provider);

  const bestZone: BestMap = new Map();
  const bestElement: BestMap = new Map();

  for (const droppableCandidate of provider.entities.visibleDroppableSet) {
    if (isDescendantOfDragged(provider, droppableCandidate)) continue;
    const droppableRect = droppableCandidate.getBoundingClientRect();
    if (containsPoint(droppableRect, pointerCoordinates.x, pointerCoordinates.y)) {
      pickSmallest(bestZone, droppableCandidate, droppableRect);
    }
  }

  const zoneElement = bestZone.size ? [...bestZone.keys()][0] : null;

  for (const draggableCandidate of provider.entities.visibleDraggableSet) {
    if (provider.entities.draggingMap.has(draggableCandidate)) continue;
    if (isDescendantOfDragged(provider, draggableCandidate)) continue;
    const draggableRect = draggableCandidate.getBoundingClientRect();
    if (containsPoint(draggableRect, pointerCoordinates.x, pointerCoordinates.y)) {
      if (zoneElement && (zoneElement === draggableCandidate || zoneElement.contains(draggableCandidate))) {
        pickSmallest(bestElement, draggableCandidate, draggableRect);
      } else if (!zoneElement) {
        pickSmallest(bestElement, draggableCandidate, draggableRect);
      }
    }
  }

  if (bestElement.size && !bestZone.size) {
    const elementUnderCursor = [...bestElement.keys()][0]!;
    for (const candidateZone of provider.entities.visibleDroppableSet) {
      if (isDescendantOfDragged(provider, candidateZone)) continue;
      if (candidateZone.contains(elementUnderCursor)) {
        bestZone.set(candidateZone, candidateZone.getBoundingClientRect());
        break;
      }
    }
  }

  for (const [element, rect] of bestZone) {
    hovered.droppable.set(element, getClosestPlacement(pointerBox, rect));
  }
  for (const [element, rect] of bestElement) {
    hovered.draggable.set(element, getClosestPlacement(pointerBox, rect));
  }
};
