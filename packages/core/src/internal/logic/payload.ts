/**
 * Creates drag payload from initiating draggable
 */

import type { IDragPayload, TDraggablePayload } from '../../external/types';
import type { IDnDProviderInternal } from '../types/provider';

/**
 * Resolves payload from initiating draggable.
 * Calls entity.payload() and returns { index, items, dropData }.
 */
export const createDragPayload = (
  provider: IDnDProviderInternal
): IDragPayload | undefined => {
  const initiating = provider.entities.initiatingDraggable;
  if (!initiating) return undefined;

  const entity = provider.entities.draggableMap.get(initiating);
  const payloadFn = entity?.payload as TDraggablePayload | undefined;
  if (!payloadFn) return undefined;

  const result = payloadFn();
  if (!Array.isArray(result) || result.length < 2) return undefined;

  const [index, items, dropData] = result;
  return {
    index: Number(index),
    items: Array.isArray(items) ? items : [],
    dropData,
  };
};
