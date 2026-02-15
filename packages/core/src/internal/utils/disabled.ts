/**
 * Disabled check — element is disabled if itself or any parent is disabled.
 * Split by context to avoid iterating both maps when only one is needed.
 */

import { isDescendant } from './dom';
import type { IEntities } from '../../external/types';

/** Minimal context for draggable/droppable checks */
export type IEffectivelyDisabledContext = {
  entities: Pick<
    IEntities,
    | 'draggableMap'
    | 'droppableMap'
    | 'visibleDraggableSet'
    | 'visibleDroppableSet'
  >;
};

/** True if node is disabled as draggable (self or inside disabled draggable). Only checks visible elements. */
export const isEffectivelyDisabledDraggable = (
  node: HTMLElement,
  ctx: IEffectivelyDisabledContext
): boolean => {
  const entity = ctx.entities.draggableMap.get(node);
  if (entity?.disabled) return true;
  // Only iterate visible draggables, not all draggableMap
  for (const el of ctx.entities.visibleDraggableSet) {
    const e = ctx.entities.draggableMap.get(el);
    if (e?.disabled && isDescendant(el, node)) return true;
  }
  return false;
};

/** True if node is disabled as droppable (self or inside disabled droppable). Only checks visible elements. */
export const isEffectivelyDisabledDroppable = (
  node: HTMLElement,
  ctx: IEffectivelyDisabledContext
): boolean => {
  const entity = ctx.entities.droppableMap.get(node);
  if (entity?.disabled) return true;
  // Only iterate visible droppables, not all droppableMap
  for (const el of ctx.entities.visibleDroppableSet) {
    const e = ctx.entities.droppableMap.get(el);
    if (e?.disabled && isDescendant(el, node)) return true;
  }
  return false;
};
