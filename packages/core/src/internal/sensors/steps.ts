/**
 * Reusable sensor steps for the chainable builder
 */

import {
  checkCollision,
  containsPoint,
  type IBoundingBox,
} from '../utils/geometry';
import { isDescendant } from '../utils/dom';
import {
  isEffectivelyDisabledDraggable,
  isEffectivelyDisabledDroppable,
} from '../utils/disabled';
import type { IDnDProviderInternal } from '../types/provider';
import type {
  TSortCompareFn,
  TFilterFn,
  TCollisionCheckFn,
  TContainerBoxFn,
} from './sensor';

/** Container from overlay ref */
export const overlayContainer: (
  p: IDnDProviderInternal
) => HTMLElement | null = (provider) => provider.overlay.ref?.value ?? null;

/** Box from overlay style (x,y) + size — overlay uses fixed+transform, getBoundingClientRect is wrong */
export const overlayBoxFromStyle: TContainerBoxFn = (
  provider
): IBoundingBox => {
  const style = provider.overlay.style?.value ?? { x: 0, y: 0 };
  const size = provider.overlay.size?.value ?? null;
  const { x, y } = style;
  const w = size?.width ?? 0;
  const h = size?.height ?? 0;
  return {
    x,
    y,
    width: w,
    height: h,
    top: y,
    left: x,
    right: x + w,
    bottom: y + h,
  };
};

/** Visible draggables */
export const visibleElements = (p: IDnDProviderInternal) =>
  p.entities.visibleDraggableSet;

/** Visible droppables */
export const visibleZones = (p: IDnDProviderInternal) =>
  p.entities.visibleDroppableSet;

/** Exclude nodes being dragged */
export const filterNotDragging: TFilterFn = (node, provider) =>
  !provider.entities.draggingMap.has(node);

/** Exclude nodes that are descendants of any dragged element (nesting into self) */
export const filterNotDescendantOfDragged: TFilterFn = (node, provider) =>
  ![...provider.entities.draggingMap.keys()].some((dragged) =>
    isDescendant(dragged, node)
  );

/** Exclude disabled draggables and zones (including those inside disabled parents) */
export const filterNotDisabled: TFilterFn = (node, provider) => {
  if (provider.entities.draggableMap.has(node))
    return !isEffectivelyDisabledDraggable(node, provider);
  if (provider.entities.droppableMap.has(node))
    return !isEffectivelyDisabledDroppable(node, provider);
  return true;
};

/** Exclude: not dragging, not descendant of dragged, not disabled */
export const filterValidCollisionTarget: TFilterFn = (node, provider) =>
  filterNotDragging(node, provider) &&
  filterNotDescendantOfDragged(node, provider) &&
  filterNotDisabled(node, provider);

/** AABB overlap check (element vs container) — legacy */
export const aabbCollision: TCollisionCheckFn = (nodeBox, ctx) =>
  checkCollision(nodeBox, ctx.containerBox);

/** Pointer-in-element: cursor must be inside element (AABB of element) */
export const pointerInElementCollision: TCollisionCheckFn = (nodeBox, ctx) =>
  containsPoint(nodeBox, ctx.pointer.x, ctx.pointer.y);

/** Sort: deepest first (topmost visible element under cursor) */
export const sortByDepth: TSortCompareFn = (a, b) =>
  b.meta.depth - a.meta.depth;

/** Sort: pointer-in-element + depth when pointer INSIDE container; overlap % + centerDistance when OUTSIDE */
export const sortByOverlapAndPointer: TSortCompareFn = (a, b, ctx) => {
  const pointerInContainer =
    ctx.pointer.x >= ctx.containerBox.x &&
    ctx.pointer.x <= ctx.containerBox.x + ctx.containerBox.width &&
    ctx.pointer.y >= ctx.containerBox.y &&
    ctx.pointer.y <= ctx.containerBox.y + ctx.containerBox.height;

  // When pointer inside container: prioritize element under cursor (isPointerInElement + depth)
  // When pointer outside: use overlap % and center distance
  if (pointerInContainer) {
    if (a.meta.isPointerInElement && b.meta.isPointerInElement)
      return b.meta.depth - a.meta.depth;
    if (a.meta.isPointerInElement !== b.meta.isPointerInElement)
      return a.meta.isPointerInElement ? -1 : 1;
  }

  if (Math.abs(a.meta.overlapPercent - b.meta.overlapPercent) <= 1)
    return a.meta.centerDistance - b.meta.centerDistance;

  return b.meta.overlapPercent - a.meta.overlapPercent;
};
