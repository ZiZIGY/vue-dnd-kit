/**
 * Disabled check — element is disabled if itself or any parent is disabled.
 * Split by context to avoid iterating both maps when only one is needed.
 */

import { isDescendant } from './dom';
import type { IEntities } from '../../external/types';

/** Minimal context for draggable/droppable checks */
export type IEffectivelyDisabledContext = { entities: Pick<IEntities, 'draggableMap' | 'droppableMap'> };

/** True if node is disabled as draggable (self or inside disabled draggable). O(draggableMap.size) */
export const isEffectivelyDisabledDraggable = (
  node: HTMLElement,
  ctx: IEffectivelyDisabledContext
): boolean => {
  const entity = ctx.entities.draggableMap.get(node);
  if (entity?.disabled) return true;
  for (const [el, e] of ctx.entities.draggableMap) {
    if (e.disabled && isDescendant(el, node)) return true;
  }
  return false;
};

/** True if node is disabled as droppable (self or inside disabled droppable). O(droppableMap.size) */
export const isEffectivelyDisabledDroppable = (
  node: HTMLElement,
  ctx: IEffectivelyDisabledContext
): boolean => {
  const entity = ctx.entities.droppableMap.get(node);
  if (entity?.disabled) return true;
  for (const [el, e] of ctx.entities.droppableMap) {
    if (e.disabled && isDescendant(el, node)) return true;
  }
  return false;
};
