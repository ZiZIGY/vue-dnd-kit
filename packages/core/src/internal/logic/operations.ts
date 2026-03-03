/**
 * DnD helpers: low-level array ops, placement helpers, suggest* methods,
 * and createHelpers() factory that binds them to an event context.
 */

import type { IPlacement } from '../../external/types/placement';
import type {
  IHelpers,
  IPlacementHelpers,
  ISuggestSortResult,
  ISuggestSwapResult,
  ISuggestCopyResult,
  ISuggestRemoveResult,
} from '../../external/types/operations';
import type {
  TInsertSide,
  TPlacementOrientation,
} from '../../external/types/placement';

/** Minimal event shape used by internal suggest* (avoids circular import). */
export interface IDropEventContext {
  draggables: Array<{
    index: number;
    item: unknown;
    items: unknown[];
    dropData?: unknown;
  }>;
  dropZone?: {
    items: unknown[];
    userData?: unknown;
    placement: IPlacement | undefined;
  };
  hoveredDraggable?: {
    element: HTMLElement;
    placement: IPlacement;
    index: number;
    item: unknown;
    items: unknown[];
    dropData?: unknown;
  };
}

// ── Low-level array ops (pure, no mutation) ───────────────────────────────────

export function insertAt<T>(items: T[], index: number, toInsert: T[]): T[] {
  const i = Math.max(0, Math.min(index, items.length));
  return [...items.slice(0, i), ...toInsert, ...items.slice(i)];
}

export function removeAt<T>(items: T[], index: number, count: number = 1): T[] {
  const i = Math.max(0, Math.min(index, items.length - 1));
  const c = Math.max(0, Math.min(count, items.length - i));
  return [...items.slice(0, i), ...items.slice(i + c)];
}

/** Remove multiple indexes (order-safe: removes high → low). Returns new array. */
export function removeIndexes<T>(items: T[], indexes: number[]): T[] {
  const sorted = [...new Set(indexes)]
    .filter((i) => i >= 0 && i < items.length)
    .sort((a, b) => b - a);
  let out = items;
  for (const i of sorted) out = removeAt(out, i, 1);
  return out;
}

export function swapAt<T>(items: T[], i: number, j: number): T[] {
  if (i === j || i < 0 || j < 0 || i >= items.length || j >= items.length)
    return items;
  const arr = [...items];
  [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  return arr;
}

// ── Placement helpers ─────────────────────────────────────────────────────────

export const placementHelpers: IPlacementHelpers = {
  getInsertSide(
    placement: IPlacement | undefined,
    orientation: TPlacementOrientation,
  ): TInsertSide | null {
    if (!placement) return null;
    if (orientation === 'vertical') {
      if (placement.top && !placement.bottom) return 'before';
      if (placement.bottom && !placement.top) return 'after';
      if (placement.top) return 'before';
      return null;
    }
    if (placement.left && !placement.right) return 'before';
    if (placement.right && !placement.left) return 'after';
    if (placement.left) return 'before';
    return null;
  },

  isAtZoneStart(
    placement: IPlacement | undefined,
    orientation: TPlacementOrientation,
  ): boolean {
    return (
      placementHelpers.getInsertSide(placement, orientation) === 'before' &&
      !placement?.center
    );
  },

  isAtZoneEnd(
    placement: IPlacement | undefined,
    orientation: TPlacementOrientation,
  ): boolean {
    return (
      placementHelpers.getInsertSide(placement, orientation) === 'after' &&
      !placement?.center
    );
  },
};

// ── Shared: resolve target array + insert index ───────────────────────────────
//
// Target selection rule:
//   hoveredDraggable present → use hoveredDraggable.items as target list.
//   hoveredDraggable absent  → use dropZone.items as target list.
//
// This enables tree/nested structures: when hovering over an element,
// you insert into that element's own list — not the outer zone's list.

function resolveTarget(
  event: IDropEventContext,
  orientation: TPlacementOrientation,
): { targetIndex: number; mode: ISuggestSortResult['mode']; targetArr: unknown[] } | null {
  const { draggables, dropZone, hoveredDraggable } = event;
  if (!draggables.length) return null;

  // Effective target array
  const targetArr = hoveredDraggable?.items ?? dropZone?.items;
  if (!targetArr) return null;

  const sourceItems = draggables[0]!.items;
  const sourceIndexes = draggables.map((d) => d.index);
  const targetLen = targetArr.length;

  let targetIndex: number;
  let mode: ISuggestSortResult['mode'];

  if (hoveredDraggable) {
    // isSelf: hovered element is one of the items being dragged
    const isSelf =
      hoveredDraggable.items === sourceItems &&
      sourceIndexes.includes(hoveredDraggable.index);

    if (isSelf && draggables.length === 1) {
      // Single drag onto itself — fall back to zone edge
      const atStart = placementHelpers.isAtZoneStart(dropZone?.placement, orientation);
      targetIndex = atStart ? 0 : targetLen;
      mode = atStart ? 'prepend' : 'append';
    } else if (isSelf) {
      // Multi-drag: one of the dragged items is hovered — skip
      return null;
    } else {
      const side = placementHelpers.getInsertSide(hoveredDraggable.placement, orientation);
      const idx = hoveredDraggable.index;
      if (side === 'before') {
        targetIndex = Math.max(0, idx);
        mode = 'insert';
      } else if (side === 'after') {
        targetIndex = Math.min(targetLen, idx + 1);
        mode = 'insert';
      } else {
        targetIndex = targetLen;
        mode = 'append';
      }
    }
  } else {
    if (!dropZone) return null;
    const atStart = placementHelpers.isAtZoneStart(dropZone.placement, orientation);
    targetIndex = atStart ? 0 : targetLen;
    mode = atStart ? 'prepend' : 'append';
  }

  return { targetIndex, mode, targetArr };
}

// ── Internal suggest implementations ─────────────────────────────────────────

export function _suggestSort(
  event: IDropEventContext,
  orientation: TPlacementOrientation = 'vertical',
): ISuggestSortResult | null {
  const { draggables } = event;
  if (!draggables.length) return null;

  const resolved = resolveTarget(event, orientation);
  if (!resolved) return null;

  const { targetArr, mode } = resolved;
  let { targetIndex } = resolved;

  const sourceIndexes = draggables.map((d) => d.index);
  const draggedItems = draggables.map((d) => d.item);
  const sourceArr = draggables[0]!.items as unknown[];
  const sameList = sourceArr === targetArr;

  if (sameList) {
    // Adjust for index shift caused by removal of source items
    const shift = sourceIndexes.filter((i) => i < targetIndex).length;
    targetIndex = Math.max(0, targetIndex - shift);
    const result = insertAt(removeIndexes(sourceArr, sourceIndexes), targetIndex, draggedItems);
    return { sourceItems: result, targetItems: result, draggedItems, sourceIndexes, targetIndex, mode, sameList: true };
  } else {
    const sourceItems = removeIndexes(sourceArr, sourceIndexes);
    const targetItems = insertAt(targetArr, targetIndex, draggedItems);
    return { sourceItems, targetItems, draggedItems, sourceIndexes, targetIndex, mode, sameList: false };
  }
}

export function _suggestSwap(
  event: IDropEventContext,
): ISuggestSwapResult | null {
  const { draggables, hoveredDraggable } = event;
  // Swap always requires a hovered target element
  if (!draggables.length || !hoveredDraggable) return null;

  const sourceIndexes = draggables.map((d) => d.index);
  const targetIndex = hoveredDraggable.index;
  const draggedItems = draggables.map((d) => d.item);
  const displacedItem = hoveredDraggable.item;

  const sourceArr = draggables[0]!.items as unknown[];
  // Target is always the hovered element's own list, not the drop zone.
  const targetArr = hoveredDraggable.items as unknown[];
  const sameList = sourceArr === targetArr;

  // Can't swap if target is one of the dragged items (same list)
  if (sameList && sourceIndexes.includes(targetIndex)) return null;

  if (draggables.length === 1) {
    // ── Single: true positional swap ──────────────────────────────────────────
    const srcIdx = sourceIndexes[0]!;
    if (sameList) {
      const result = swapAt(sourceArr, srcIdx, targetIndex);
      return { sourceItems: result, targetItems: result, sourceIndexes, targetIndex, sameList: true };
    } else {
      const after_source = [...sourceArr];
      const after_target = [...targetArr];
      after_source[srcIdx] = targetArr[targetIndex]!;
      after_target[targetIndex] = sourceArr[srcIdx]!;
      return { sourceItems: after_source, targetItems: after_target, sourceIndexes, targetIndex, sameList: false };
    }
  } else {
    // ── Multi: group exchange — dragged group ↔ displaced item ────────────────
    //
    // Same-list example: [A,B,C,D,E], drag [A(0),C(2)], hover D(3)
    //   → Remove A,C: [B,D,E]
    //   → adjTarget = 3 - 2 = 1. Insert [A,C] at 1: [B,A,C,E]
    //   → adjFirstSrc = 0. After inserting [A,C] at 1, slot 0 still 0. Insert D at 0: [D,B,A,C,E]
    //
    // Cross-list example: ListA=[A1,A2,A3], drag [A1(0),A2(1)], hover B1(0) in ListB
    //   → sourceAfterRemove = [A3]. adjFirstSrc = 0. Insert B1 at 0: [B1,A3]
    //   → Remove B1 from ListB: [B2]. Insert [A1,A2] at 0: [A1,A2,B2]

    const firstSrcIdx = Math.min(...sourceIndexes);

    if (sameList) {
      const tgtShift = sourceIndexes.filter((i) => i < targetIndex).length;
      const adjTarget = Math.max(0, targetIndex - tgtShift);

      const srcShift = sourceIndexes.filter((i) => i < firstSrcIdx).length;
      const adjFirstSrc = Math.max(0, firstSrcIdx - srcShift);

      let result = removeIndexes(sourceArr, sourceIndexes);
      result = insertAt(result, adjTarget, draggedItems);
      // After inserting the group at adjTarget, the displaced item goes to adjFirstSrc.
      // If adjFirstSrc >= adjTarget it was pushed right by the group insertion.
      const finalDisplacedIdx = adjFirstSrc >= adjTarget
        ? adjFirstSrc + draggedItems.length
        : adjFirstSrc;
      result = insertAt(result, finalDisplacedIdx, [displacedItem]);

      return { sourceItems: result, targetItems: result, sourceIndexes, targetIndex: adjTarget, sameList: true };
    } else {
      const srcShift = sourceIndexes.filter((i) => i < firstSrcIdx).length;
      const adjFirstSrc = Math.max(0, firstSrcIdx - srcShift);

      // Source: remove dragged group, insert displaced item at first source slot
      let after_source = removeIndexes(sourceArr, sourceIndexes);
      after_source = insertAt(after_source, adjFirstSrc, [displacedItem]);

      // Target: remove displaced item, insert dragged group at its original position
      let after_target = removeAt(targetArr, targetIndex);
      after_target = insertAt(after_target, targetIndex, draggedItems);

      return { sourceItems: after_source, targetItems: after_target, sourceIndexes, targetIndex, sameList: false };
    }
  }
}

export function _suggestCopy(
  event: IDropEventContext,
  orientation: TPlacementOrientation = 'vertical',
): ISuggestCopyResult | null {
  const { draggables } = event;
  if (!draggables.length) return null;

  const resolved = resolveTarget(event, orientation);
  if (!resolved) return null;

  const { targetArr, targetIndex, mode } = resolved;
  const copiedItems = draggables.map((d) => d.item);
  const targetItems = insertAt(targetArr as unknown[], targetIndex, copiedItems);

  return { targetItems, copiedItems, targetIndex, mode };
}

export function _suggestRemove(
  event: IDropEventContext,
): ISuggestRemoveResult | null {
  const { draggables } = event;
  if (!draggables.length) return null;

  const sourceIndexes = draggables.map((d) => d.index);
  const removedItems = draggables.map((d) => d.item);
  const sourceArr = draggables[0]!.items as unknown[];
  const sourceItems = removeIndexes(sourceArr, sourceIndexes);

  return { sourceItems, removedItems, sourceIndexes };
}

// ── Factory: create event-bound helpers ───────────────────────────────────────

export function createHelpers(ctx: IDropEventContext): IHelpers {
  return {
    // Low-level array ops
    insertAt,
    removeAt,
    removeIndexes,
    swapAt,

    // Placement helpers
    getInsertSide: (placement, orientation) =>
      placementHelpers.getInsertSide(placement, orientation),
    isAtZoneStart: (placement, orientation) =>
      placementHelpers.isAtZoneStart(placement, orientation),
    isAtZoneEnd: (placement, orientation) =>
      placementHelpers.isAtZoneEnd(placement, orientation),

    // High-level (event-bound)
    suggestSort: (orientation) => _suggestSort(ctx, orientation),
    suggestSwap: () => _suggestSwap(ctx),
    suggestCopy: (orientation) => _suggestCopy(ctx, orientation),
    suggestRemove: () => _suggestRemove(ctx),
  };
}
