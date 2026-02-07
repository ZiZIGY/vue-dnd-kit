/**
 * Hover detection — applies collision result and triggers enter/leave events
 */

import {
  getClosestPlacement,
  getPointerBoxFromProvider,
} from '../utils/placement';
import {
  getFirstKey,
  triggerZoneEnterLeave,
  triggerDraggableHoverChange,
} from '../utils/events';
import { isDescendant } from '../utils/dom';
import type { IDnDProviderInternal } from '../types/provider';
import type { IHovered } from '../../external/types/provider';

/** First draggable inside zone (nested under cursor) or undefined */
const findNestedDraggable = (
  elements: HTMLElement[],
  zone: HTMLElement
): HTMLElement | undefined =>
  elements.find((el) => el !== zone && isDescendant(zone, el));

/** Applies collision result to hovered and triggers zone/draggable events */
export const applyCollisionResultToHovered = (
  provider: IDnDProviderInternal,
  hovered: IHovered,
  result: { elements: HTMLElement[]; zones: HTMLElement[] }
): void => {
  const prevZone = getFirstKey(hovered.droppable);
  const prevElement = getFirstKey(hovered.draggable);

  hovered.draggable.clear();
  hovered.droppable.clear();

  const pointerBox = getPointerBoxFromProvider(provider);
  const newZone = result.zones[0];
  const newElement = result.elements[0];

  const isDualRole =
    newZone &&
    newElement &&
    newZone === newElement &&
    provider.entities.droppableMap.has(newZone);

  if (isDualRole && newZone) {
    const rect = newZone.getBoundingClientRect();
    const margins =
      provider.entities.draggableMap.get(newZone)?.placementMargins;
    const placement = getClosestPlacement(pointerBox, rect, margins);

    if (placement.center) {
      hovered.droppable.set(newZone, placement);
      const nested = findNestedDraggable(result.elements, newZone);
      if (nested) {
        const nestedRect = nested.getBoundingClientRect();
        hovered.draggable.set(
          nested,
          getClosestPlacement(pointerBox, nestedRect, undefined)
        );
      }
    } else {
      hovered.draggable.set(newElement, placement);
      hovered.droppable.set(newZone, placement);
    }
  } else {
    if (newZone) {
      const rect = newZone.getBoundingClientRect();
      hovered.droppable.set(newZone, getClosestPlacement(pointerBox, rect));
    }
    if (newElement) {
      const rect = newElement.getBoundingClientRect();
      const margins =
        provider.entities.draggableMap.get(newElement)?.placementMargins;
      hovered.draggable.set(
        newElement,
        getClosestPlacement(pointerBox, rect, margins)
      );
    }
  }

  const finalZone = getFirstKey(hovered.droppable);
  const finalElement = getFirstKey(hovered.draggable);

  triggerZoneEnterLeave(provider, prevZone, finalZone);
  triggerDraggableHoverChange(provider, prevElement, finalElement);
};
