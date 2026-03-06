/**
 * Default collision: two-phase strategy.
 *
 * Phase 1 — cursor-based (ancestor-walk from elementFromPoint):
 *   document.elementFromPoint returns the actual topmost element under the cursor,
 *   respecting z-index and pointer-events. Walking up the ancestor chain collects
 *   registered draggables/droppables in the same DOM branch. This naturally handles
 *   modal/overlay occlusion: elements behind a modal are never ancestors of modal
 *   contents, so they are skipped.
 *
 * Phase 1b — nearest draggable within zone:
 *   If Phase 1 found a droppable zone but no draggable (cursor is in a gap between
 *   items), find the closest draggable inside that zone by distance to cursor center.
 *   Only iterates elements within the found zone — no full-set scan.
 *
 * Phase 2 — overlay-based fallback (AABB):
 *   If nothing is under the cursor at all, fall back to AABB overlap with the overlay
 *   box. Sorted by distance from cursor to element center (closest first).
 */

import type { CollisionDetectionFn } from './sensor';
import type { IDnDProviderInternal } from '../types/provider';
import {
  previewContainer,
  previewBoxFromStyle,
  visibleElements,
  allowedVisibleZones,
  filterValidCollisionTarget,
} from './steps';
import {
  getBoundingBox,
  checkCollision,
  getOverlapPercent,
  type IBoundingBox,
} from '../utils/geometry';

const MIN_OVERLAP_PERCENT = 10;

function pointerDistance(
  box: IBoundingBox,
  pointer: { x: number; y: number }
): number {
  return Math.hypot(
    pointer.x - (box.x + box.width / 2),
    pointer.y - (box.y + box.height / 2)
  );
}

/**
 * Phase 1: ancestor-walk from the topmost element under the cursor.
 *
 * document.elementFromPoint (singular) returns the actual hit-tested element —
 * the same target as a real pointer event. Walking up from it collects only
 * registered elements that are ancestors (or the element itself), which means
 * elements behind a modal are never included even though they share the same
 * screen coordinates.
 *
 * Returns null when no registered element or zone is found in the ancestor chain.
 */
export function runCursorPhase(
  provider: IDnDProviderInternal
): { elements: HTMLElement[]; zones: HTMLElement[] } | null {
  const pointer = provider.pointer.value?.current ?? { x: 0, y: 0 };
  const topEl = document.elementFromPoint(pointer.x, pointer.y) as HTMLElement | null;
  if (!topEl) return null;

  const draggableSet = visibleElements(provider) as unknown as Set<HTMLElement>;
  const droppableSet = allowedVisibleZones(provider) as unknown as Set<HTMLElement>;

  const elements: HTMLElement[] = [];
  const zones: HTMLElement[] = [];

  let el: HTMLElement | null = topEl;
  while (el) {
    if (draggableSet.has(el) || droppableSet.has(el)) {
      if (filterValidCollisionTarget(el, provider)) {
        if (draggableSet.has(el)) elements.push(el);
        if (droppableSet.has(el)) zones.push(el);
      }
    }
    el = el.parentElement;
  }

  if (elements.length === 0 && zones.length === 0) return null;
  return { elements, zones };
}

export const defaultCollisionDetection: CollisionDetectionFn = (provider) => {
  const containerEl = previewContainer(provider);
  if (!containerEl) return { elements: [], zones: [] };

  const pointer = provider.pointer.value?.current ?? { x: 0, y: 0 };

  // Phase 1: ancestor-walk — finds registered elements in the same DOM branch as the
  // actual hit-tested element, ignoring anything behind a modal or z-stacked overlay.
  const cursorResult = runCursorPhase(provider);

  if (cursorResult) {
    // Fast path: both a draggable and a zone were found directly under the cursor.
    if (cursorResult.elements.length > 0) return cursorResult;

    // Phase 1b: cursor is in a gap between items (zone found, no draggable under cursor).
    // Use AABB: check which draggables inside the zone the overlay box overlaps,
    // then sort by distance to cursor. Same logic as Phase 2 but scoped to the zone.
    const zone = cursorResult.zones[0];
    if (!zone) return cursorResult;

    const containerBox = previewBoxFromStyle(provider);
    const draggableSet = visibleElements(provider) as unknown as Set<HTMLElement>;

    const nearestInZone = [...draggableSet]
      .filter(
        (el) => zone.contains(el) && filterValidCollisionTarget(el, provider)
      )
      .map((el) => ({ el, box: getBoundingBox(el) }))
      .filter(
        ({ box }) =>
          checkCollision(box, containerBox) &&
          getOverlapPercent(box, containerBox) >= MIN_OVERLAP_PERCENT
      )
      .sort((a, b) => pointerDistance(a.box, pointer) - pointerDistance(b.box, pointer))
      .map(({ el }) => el);

    return { elements: nearestInZone, zones: cursorResult.zones };
  }

  // Phase 2: AABB fallback — overlay overlaps element, closest to cursor wins
  const containerBox = previewBoxFromStyle(provider);

  const allElements = [...visibleElements(provider)].filter((n) =>
    filterValidCollisionTarget(n, provider)
  );
  const allZones = [...allowedVisibleZones(provider)].filter((n) =>
    filterValidCollisionTarget(n, provider)
  );

  const aabbElements = allElements
    .map((n) => ({ n, box: getBoundingBox(n) }))
    .filter(
      ({ box }) =>
        checkCollision(box, containerBox) &&
        getOverlapPercent(box, containerBox) >= MIN_OVERLAP_PERCENT
    )
    .sort((a, b) => pointerDistance(a.box, pointer) - pointerDistance(b.box, pointer))
    .map(({ n }) => n);

  const aabbZones = allZones
    .map((n) => ({ n, box: getBoundingBox(n) }))
    .filter(
      ({ box }) =>
        checkCollision(box, containerBox) &&
        getOverlapPercent(box, containerBox) >= MIN_OVERLAP_PERCENT
    )
    .sort((a, b) => pointerDistance(a.box, pointer) - pointerDistance(b.box, pointer))
    .map(({ n }) => n);

  return { elements: aabbElements, zones: aabbZones };
};
