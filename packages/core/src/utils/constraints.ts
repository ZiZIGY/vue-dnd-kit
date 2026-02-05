import type { IConstraintsAreaEntity, TPointerState } from '../types';
import { DnDSelectors } from './namespaces';

/**
 * Находит constraint area для draggable элемента
 */
export function findConstraintArea(
  draggable: HTMLElement,
  constraintsAreaMap: Map<HTMLElement, IConstraintsAreaEntity>
): { element: HTMLElement; entity: IConstraintsAreaEntity } | null {
  const constraintElement = draggable.closest(
    DnDSelectors.CONSTRAINT_AREA
  ) as HTMLElement | null;

  if (!constraintElement || !constraintsAreaMap.has(constraintElement)) {
    return null;
  }

  return {
    element: constraintElement,
    entity: constraintsAreaMap.get(constraintElement)!,
  };
}

/**
 * Применяет ограничение по оси (axis)
 */
export function applyAxisConstraint(
  targetX: number,
  targetY: number,
  axis: 'x' | 'y' | 'both',
  draggableRect: DOMRect
): { x: number; y: number } {
  if (axis === 'x') {
    // Только горизонтальное движение
    return { x: targetX, y: draggableRect.top };
  } else if (axis === 'y') {
    // Только вертикальное движение
    return { x: draggableRect.left, y: targetY };
  }
  
  return { x: targetX, y: targetY };
}

/**
 * Применяет ограничение по границам контейнера
 */
export function applyBoundsConstraint(
  targetX: number,
  targetY: number,
  axis: 'x' | 'y' | 'both',
  constraintRect: DOMRect,
  overlayRect: DOMRect
): { x: number; y: number } {
  let x = targetX;
  let y = targetY;

  // Ограничиваем по X (если axis не только Y)
  if (axis !== 'y') {
    x = Math.max(
      constraintRect.left,
      Math.min(constraintRect.right - overlayRect.width, targetX)
    );
  }

  // Ограничиваем по Y (если axis не только X)
  if (axis !== 'x') {
    y = Math.max(
      constraintRect.top,
      Math.min(constraintRect.bottom - overlayRect.height, targetY)
    );
  }

  return { x, y };
}

/**
 * Вычисляет финальную позицию overlay с учетом всех ограничений
 */
export function calculateConstrainedPosition(
  pointer: TPointerState,
  overlayElement: HTMLElement | null,
  firstDraggable: HTMLElement | null,
  constraintsAreaMap: Map<HTMLElement, IConstraintsAreaEntity>
): { x: number; y: number } {
  if (!pointer || !overlayElement) {
    return { x: 0, y: 0 };
  }

  // Желаемая позиция (cursor - offset)
  let targetX = pointer.current.x - pointer.offset.x;
  let targetY = pointer.current.y - pointer.offset.y;

  if (!firstDraggable) {
    return { x: targetX, y: targetY };
  }

  // Ищем constraint area
  const constraint = findConstraintArea(firstDraggable, constraintsAreaMap);
  if (!constraint) {
    return { x: targetX, y: targetY };
  }

  const { element: constraintElement, entity } = constraint;
  const constraintRect = constraintElement.getBoundingClientRect();
  const overlayRect = overlayElement.getBoundingClientRect();
  const draggableRect = firstDraggable.getBoundingClientRect();

  // Применяем ограничение по оси
  const axisConstrained = applyAxisConstraint(
    targetX,
    targetY,
    entity.axis || 'both',
    draggableRect
  );

  // Применяем ограничение по границам контейнера
  if (entity.restrictToArea) {
    return applyBoundsConstraint(
      axisConstrained.x,
      axisConstrained.y,
      entity.axis || 'both',
      constraintRect,
      overlayRect
    );
  }

  return axisConstrained;
}
