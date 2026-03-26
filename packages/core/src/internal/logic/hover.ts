import {
  getClosestPlacement,
  getPointerBoxFromProvider,
} from "../utils/placement";
import {
  getFirstKey,
  triggerDraggableHoverChange,
  triggerZoneEnterLeave,
} from "../utils/events";

import type { IDnDProviderInternal } from "../types/provider";
import type { IHovered } from "../../external/types/provider";
import type { IPlacement } from "../../external/types/placement";
import { getDistanceToRectCenter } from "../utils/hover";
import { isDescendant } from "../utils/dom";

function isSamePlacement(
  a: IPlacement | undefined,
  b: IPlacement | undefined,
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.top === b.top &&
    a.right === b.right &&
    a.bottom === b.bottom &&
    a.left === b.left &&
    a.center === b.center
  );
}

function setHoveredPlacement(
  entity: { hoveredPlacement?: IPlacement },
  placement: IPlacement | undefined,
): void {
  if (!isSamePlacement(entity.hoveredPlacement, placement)) {
    entity.hoveredPlacement = placement;
  }
}

const findNestedDraggable = (
  elements: HTMLElement[],
  zone: HTMLElement,
): HTMLElement | undefined =>
  elements.find((el) => el !== zone && isDescendant(zone, el));

export const applyCollisionResultToHovered = (
  provider: IDnDProviderInternal,
  hovered: IHovered,
  result: { elements: HTMLElement[]; zones: HTMLElement[] },
): void => {
  const prevZone = getFirstKey(hovered.droppable);
  const prevElement = getFirstKey(hovered.draggable);

  if (prevElement) hovered.draggable.delete(prevElement);
  if (prevZone) hovered.droppable.delete(prevZone);

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
      // Центр — это зона, draggable не записываем (только если есть nested внутри)
      hovered.droppable.set(newZone, placement);
      const nested = findNestedDraggable(result.elements, newZone);
      if (nested) {
        const nestedRect = nested.getBoundingClientRect();
        hovered.draggable.set(
          nested,
          getClosestPlacement(pointerBox, nestedRect, undefined),
        );
      }
    } else {
      // Не центр — это draggable, зону не записываем напрямую.
      // Но используем следующую зону из результата коллизии (родительский контейнер)
      // как fallback-дропзону, чтобы onDrop мог сработать для сортировки.
      hovered.draggable.set(newElement, placement);
      const fallbackZone = result.zones.find((z) => z !== newZone);
      if (fallbackZone) {
        const fRect = fallbackZone.getBoundingClientRect();
        hovered.droppable.set(
          fallbackZone,
          getClosestPlacement(pointerBox, fRect),
        );
      }
    }
  } else {
    if (newZone) {
      const rect = newZone.getBoundingClientRect();
      hovered.droppable.set(newZone, getClosestPlacement(pointerBox, rect));
    }
    if (newElement) {
      // Если есть и зона, и элемент:
      // - Если элемент внутри зоны → записываем оба (зона для drop, элемент для сортировки)
      // - Если элемент не внутри зоны → выбираем ближайший к курсору
      if (newZone) {
        if (isDescendant(newZone, newElement)) {
          // Элемент внутри зоны — записываем оба
          const rect = newElement.getBoundingClientRect();
          const margins =
            provider.entities.draggableMap.get(newElement)?.placementMargins;
          hovered.draggable.set(
            newElement,
            getClosestPlacement(pointerBox, rect, margins),
          );
        } else {
          // Элемент не внутри зоны — выбираем ближайший к курсору
          const pointer = provider.pointer.value?.current ?? { x: 0, y: 0 };
          const zoneRect = newZone.getBoundingClientRect();
          const elementRect = newElement.getBoundingClientRect();

          const zoneDistance = getDistanceToRectCenter(pointer, zoneRect);
          const elementDistance = getDistanceToRectCenter(pointer, elementRect);

          if (elementDistance < zoneDistance) {
            // Элемент ближе — убираем зону, оставляем элемент
            hovered.droppable.clear();
            const margins =
              provider.entities.draggableMap.get(newElement)?.placementMargins;
            hovered.draggable.set(
              newElement,
              getClosestPlacement(pointerBox, elementRect, margins),
            );
          }
          // Иначе зона ближе — зона уже записана выше, элемент не записываем
        }
      } else {
        // Нет зоны — просто записываем элемент
        const rect = newElement.getBoundingClientRect();
        const margins =
          provider.entities.draggableMap.get(newElement)?.placementMargins;
        hovered.draggable.set(
          newElement,
          getClosestPlacement(pointerBox, rect, margins),
        );
      }
    }
  }

  const finalZone = getFirstKey(hovered.droppable);
  const finalElement = getFirstKey(hovered.draggable);

  // Sync hoveredPlacement: clear only elements that left, update only elements that changed.
  // Avoids double-trigger when the same element stays hovered (clear → set → 2 computed runs).
  if (prevElement && prevElement !== finalElement) {
    const entity = provider.entities.draggableMap.get(prevElement);
    if (entity) setHoveredPlacement(entity, undefined);
  }
  if (prevZone && prevZone !== finalZone) {
    const entity = provider.entities.droppableMap.get(prevZone);
    if (entity) setHoveredPlacement(entity, undefined);
  }
  if (finalElement) {
    const entity = provider.entities.draggableMap.get(finalElement);
    if (entity)
      setHoveredPlacement(entity, hovered.draggable.get(finalElement));
  }
  if (finalZone) {
    const entity = provider.entities.droppableMap.get(finalZone);
    if (entity) setHoveredPlacement(entity, hovered.droppable.get(finalZone));
  }

  triggerZoneEnterLeave(provider, prevZone, finalZone);
  triggerDraggableHoverChange(provider, prevElement, finalElement);
};
