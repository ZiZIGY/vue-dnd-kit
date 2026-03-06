import type {
  IConstraintsAreaEntity,
  TPointerState,
} from '../../external/types';
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
  overlayRect: { width: number; height: number }
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
  overlaySize: { width: number; height: number } | null,
  firstDraggable: HTMLElement | null,
  constraintsAreaMap: Map<HTMLElement, IConstraintsAreaEntity>
): { x: number; y: number } {
  if (!pointer) {
    return { x: 0, y: 0 };
  }

  const width = overlaySize?.width ?? 0;
  const height = overlaySize?.height ?? 0;
  // offset is ratio (0–1)
  let targetX = pointer.current.x - width * pointer.offset.x;
  let targetY = pointer.current.y - height * pointer.offset.y;

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
      overlaySize ?? { width: 0, height: 0 }
    );
  }

  return axisConstrained;
}

/**
 * Updates pointer.current with constraint-applied coordinates.
 * When constraints exist, stores the "effective" position so pointer matches overlay.
 */
export function updatePointerWithConstraints(
  pointer: TPointerState,
  rawX: number,
  rawY: number,
  overlaySize: { width: number; height: number } | null,
  firstDraggable: HTMLElement | null,
  constraintsAreaMap: Map<HTMLElement, IConstraintsAreaEntity>
): void {
  if (!pointer) return;

  const width = overlaySize?.width ?? 0;
  const height = overlaySize?.height ?? 0;

  const tempPointer = {
    start: pointer.start,
    current: { x: rawX, y: rawY },
    offset: pointer.offset,
  };

  const constrained = calculateConstrainedPosition(
    tempPointer,
    overlaySize,
    firstDraggable,
    constraintsAreaMap
  );

  pointer.current.x = constrained.x + width * pointer.offset.x;
  pointer.current.y = constrained.y + height * pointer.offset.y;
}
