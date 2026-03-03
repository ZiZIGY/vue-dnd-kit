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

/**
 * Box from overlay style (x,y) + size.
 * The overlay is `position:fixed; top:0; left:0; transform:translate(x,y)`, so
 * getBoundingClientRect() is unreliable for the position (transform offsets it from 0,0).
 * However the SIZE from getBoundingClientRect IS correct and is used as a fallback
 * when the ResizeObserver hasn't fired yet (`overlay.size.value` is still null).
 *
 * Without the fallback: size=0 → containerBox is a zero-size point → pointer.x <= box.x+0
 * fails whenever offset.x>0 (grabbed away from left edge) → pointerInContainer=false always.
 */
export const overlayBoxFromStyle: TContainerBoxFn = (
  provider
): IBoundingBox => {
  const position = provider.overlay.position?.value ?? { x: 0, y: 0 };
  const { x, y } = position;

  const sizeValue = provider.overlay.size?.value;
  let w: number;
  let h: number;
  if (sizeValue) {
    w = sizeValue.width;
    h = sizeValue.height;
  } else {
    // ResizeObserver hasn't fired yet — fall back to live rect for size only
    const rect = provider.overlay.ref?.value?.getBoundingClientRect();
    w = rect?.width ?? 0;
    h = rect?.height ?? 0;
  }

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

/** Allowed draggedItems (visible + filtered by groups) */
export const visibleElements = (p: IDnDProviderInternal) =>
  p.entities.allowedDraggableSet;

/** Allowed droppables (visible + filtered by groups) */
export const allowedVisibleZones = (p: IDnDProviderInternal) =>
  p.entities.allowedDroppableSet;

/** Exclude nodes being dragged */
export const filterNotDragging: TFilterFn = (node, provider) =>
  !provider.entities.draggingMap.has(node);

/** Exclude nodes that are descendants of any dragged element (nesting into self) */
export const filterNotDescendantOfDragged: TFilterFn = (node, provider) =>
  ![...provider.entities.draggingMap.keys()].some((dragged) =>
    isDescendant(dragged, node)
  );

/** Exclude disabled draggedItems and zones (including those inside disabled parents) */
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

/** Always true — no container check (for "closest on screen" regardless of overlay position) */
export const noContainerCollision: TCollisionCheckFn = () => true;

/** Sort: deepest first (topmost visible element under cursor) */
export const sortByDepth: TSortCompareFn = (a, b) =>
  b.meta.depth - a.meta.depth;

/** Sort: by distance from pointer to element center (closest first) */
export const sortByPointerDistance: TSortCompareFn = (a, b, ctx) => {
  const distA = Math.hypot(
    ctx.pointer.x - (a.box.x + a.box.width / 2),
    ctx.pointer.y - (a.box.y + a.box.height / 2)
  );
  const distB = Math.hypot(
    ctx.pointer.x - (b.box.x + b.box.width / 2),
    ctx.pointer.y - (b.box.y + b.box.height / 2)
  );
  return distA - distB;
};

/**
 * Sort: pointer-in-element + depth when pointer inside container; overlap % + centerDistance when outside.
 *
 * The container box MUST be computed via overlayBoxFromStyle (not getBoundingClientRect) so that
 * position is correct for a fixed+transform overlay. The size fallback in overlayBoxFromStyle ensures
 * the box is never zero-sized on the first frame, making `pointerInContainer` reliably true whenever
 * the cursor is above the drag ghost.
 */
export const sortByOverlapAndPointer: TSortCompareFn = (a, b, ctx) => {
  const pointerInContainer = containsPoint(
    ctx.containerBox,
    ctx.pointer.x,
    ctx.pointer.y
  );

  if (pointerInContainer) {
    if (a.meta.isPointerInElement !== b.meta.isPointerInElement)
      return a.meta.isPointerInElement ? -1 : 1;

    if (a.meta.isPointerInElement && b.meta.isPointerInElement)
      return b.meta.depth - a.meta.depth;
  }

  if (Math.abs(a.meta.overlapPercent - b.meta.overlapPercent) <= 1)
    return a.meta.centerDistance - b.meta.centerDistance;

  return b.meta.overlapPercent - a.meta.overlapPercent;
};
