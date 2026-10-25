/**
 * Target detection: the drop target a point of the drag is over. Candidates are the
 * enabled, connected targets the integration rules let in, never one in a dragged item;
 * hit-testing and the provider's `collision` rank them, and the stabilizer damps the
 * switches between them (rfcs/0001-v3.md §6).
 */

import type { Active, CollisionCandidate, Coordinates, Key, Over, Rect } from '../../types';
import { containsPoint, unionRect } from '../../animation/layout';
import { createTargetStabilizer, pointerFirst } from '../collision';
import { containsComposed, elementFromPoint, parentOf } from '../../utils/dom';
import type { DroppableEntry } from './registry';
import type { ManagerContext } from './state';

export type Detection = ReturnType<typeof createDetection>;

export function createDetection(ctx: ManagerContext) {
  const stabilizer = createTargetStabilizer();
  /** Nesting depth of drop target elements among drop targets, per session. */
  let nesting = new WeakMap<Element, number>();
  /** Drop target elements in a dragged item or in a slot one lands in, per session. */
  let owned = new WeakMap<Element, boolean>();

  /**
   * Drop targets under the point: the topmost element (shadow roots included) and its
   * flat-tree ancestors. Higher priority first, then the deepest.
   */
  const hitTest = (point: Coordinates, byElement: Map<Element, DroppableEntry>): Key[] => {
    const hits: DroppableEntry[] = [];
    const top = elementFromPoint(point.x, point.y);
    ctx.pointerElement = point.x === ctx.raw.x && point.y === ctx.raw.y ? top : null;
    for (let element = top; element; element = parentOf(element)) {
      const entry = byElement.get(element);
      if (entry) hits.push(entry);
    }
    return hits
      .map((entry, depth) => ({ id: entry.id, priority: entry.getPriority(), depth }))
      .sort((a, b) => b.priority - a.priority || a.depth - b.depth)
      .map(({ id }) => id);
  };

  const depthOf = (element: Element, byElement: Map<Element, DroppableEntry>): number => {
    let depth = nesting.get(element);
    if (depth === undefined) {
      depth = 0;
      for (let parent = parentOf(element); parent; parent = parentOf(parent)) {
        if (byElement.has(parent)) {
          depth = depthOf(parent, byElement) + 1;
          break;
        }
      }
      nesting.set(element, depth);
    }
    return depth;
  };

  /**
   * Never drop items into themselves: a target in (or on) any dragged item, or in a slot
   * one lands in (a copy, a created item), is out for the whole drag.
   */
  const isOwned = (element: Element, current: Active): boolean => {
    let own = owned.get(element);
    if (own === undefined) {
      own = false;
      for (let node: Element | null = element; node && !own; node = parentOf(node)) {
        const id = ctx.draggableIds.get(node);
        own = id != null && (current.ids.includes(id) || id === ctx.landingKey.value || ctx.landings.value.has(id));
      }
      owned.set(element, own);
    }
    return own;
  };

  const detectOver = (current: Active, point: Coordinates): Over | null => {
    const { droppables, measurer } = ctx;
    const candidates: CollisionCandidate[] = [];
    // Every target that could be one (nesting depth), and the ones the rules let in now.
    const all = new Map<Element, DroppableEntry>();
    const byElement = new Map<Element, DroppableEntry>();
    const elements = new Map<Key, HTMLElement>();
    for (const entry of droppables.values()) {
      if (entry.isDisabled()) continue;
      const element = entry.getElement();
      if (!element?.isConnected || isOwned(element, current)) continue;
      all.set(element, entry);
      let hidden = false;
      for (const rule of ctx.targetRules) hidden ||= !rule(entry, element, point, current);
      if (hidden) continue;
      byElement.set(element, entry);
      elements.set(entry.id, element);
      measurer.observe(element);
    }
    for (const [element, entry] of byElement) {
      // Fully clipped by a scroll container or the viewport: not hittable.
      const rect = measurer.measureVisible(element);
      if (rect) {
        candidates.push({ id: entry.id, rect, priority: entry.getPriority(), depth: depthOf(element, all) });
      }
    }
    const hits = hitTest(point, byElement);
    const detect = ctx.props.collision ?? pointerFirst;
    const ranked = detect({
      pointer: point,
      overlayRect: ctx.overlay.getOverlayRect(current, ctx.transform.value),
      candidates,
      hits,
    });

    const visible = new Set<Key>(hits);
    for (const candidate of candidates) visible.add(candidate.id);
    const id = stabilizer.resolve({
      pointer: point,
      previous: ctx.over.value?.id ?? null,
      next: ranked.find((key) => elements.has(key)) ?? null,
      exact: current.sensor === 'keyboard',
      isValid: (key) => visible.has(key),
      isGap: (parent, child) => {
        const parentElement = elements.get(parent)!;
        const childElement = elements.get(child);
        if (!childElement || parentElement === childElement) return false;
        if (!containsComposed(parentElement, childElement)) return false;
        // The pointer is within the bounds of the targets nested in `parent`, but over none.
        let bounds: Rect | null = null;
        for (const candidate of candidates) {
          const element = elements.get(candidate.id)!;
          if (element === parentElement || !containsComposed(parentElement, element)) continue;
          if (containsPoint(candidate.rect, point)) return false;
          bounds = bounds ? unionRect(bounds, candidate.rect) : candidate.rect;
        }
        return !!bounds && containsPoint(bounds, point);
      },
    });
    if (id == null) return null;
    const entry = droppables.get(id)!;
    const element = elements.get(id)!;
    return {
      id,
      data: entry.getData(),
      element,
      rect: measurer.measure(element),
      accepted: entry.accepts(current),
    };
  };

  return {
    detectOver,
    isOwned,
    /** Damps target switches; `reset()` forgets the hysteresis (scrolling moved the content). */
    stabilizer,
    /** A new session: nesting and ownership are cached per drag. */
    begin() {
      stabilizer.reset();
      nesting = new WeakMap();
      owned = new WeakMap();
    },
  };
}
