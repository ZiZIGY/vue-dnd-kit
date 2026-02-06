import type { IConstraintsAreaEntity, TPointerState } from '../../external/types';
import { DnDSelectors } from './namespaces';

/**
 * Finds constraint area for a draggable element
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
 * Applies axis constraint
 */
export function applyAxisConstraint(
  targetX: number,
  targetY: number,
  axis: 'x' | 'y' | 'both',
  draggableRect: DOMRect
): { x: number; y: number } {
  if (axis === 'x') {
    // Horizontal movement only
    return { x: targetX, y: draggableRect.top };
  } else if (axis === 'y') {
    // Vertical movement only
    return { x: draggableRect.left, y: targetY };
  }
  
  return { x: targetX, y: targetY };
}

/**
 * Applies bounds constraint within container
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

  // Constrain X (if axis is not Y only)
  if (axis !== 'y') {
    x = Math.max(
      constraintRect.left,
      Math.min(constraintRect.right - overlayRect.width, targetX)
    );
  }

  // Constrain Y (if axis is not X only)
  if (axis !== 'x') {
    y = Math.max(
      constraintRect.top,
      Math.min(constraintRect.bottom - overlayRect.height, targetY)
    );
  }

  return { x, y };
}

/**
 * Calculates final overlay position with all constraints applied
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

  // Desired position (cursor - offset)
  let targetX = pointer.current.x - pointer.offset.x;
  let targetY = pointer.current.y - pointer.offset.y;

  if (!firstDraggable) {
    return { x: targetX, y: targetY };
  }

  // Find constraint area
  const constraint = findConstraintArea(firstDraggable, constraintsAreaMap);
  if (!constraint) {
    return { x: targetX, y: targetY };
  }

  const { element: constraintElement, entity } = constraint;
  const constraintRect = constraintElement.getBoundingClientRect();
  const overlayRect = overlayElement.getBoundingClientRect();
  const draggableRect = firstDraggable.getBoundingClientRect();

  // Apply axis constraint
  const axisConstrained = applyAxisConstraint(
    targetX,
    targetY,
    entity.axis || 'both',
    draggableRect
  );

  // Apply bounds constraint
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
