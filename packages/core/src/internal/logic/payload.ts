/**
 * Creates drag/drop payloads from draggable and droppable entities
 */

import type {
  IDragPayload,
  IDropZonePayload,
  TDraggablePayload,
  TDroppablePayload,
} from '../../external/types';
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

/**
 * Resolves payload from a droppable zone.
 * Calls zone entity.payload() and returns { items, userData }.
 */
export const createDropZonePayload = (
  provider: IDnDProviderInternal,
  zone: HTMLElement
): IDropZonePayload | undefined => {
  const entity = provider.entities.droppableMap.get(zone);
  const payloadFn = entity?.payload as TDroppablePayload | undefined;
  if (!payloadFn) return undefined;

  const result = payloadFn();
  if (!Array.isArray(result) || result.length < 1) return undefined;

  const [items, userData] = result;
  return {
    items: Array.isArray(items) ? items : [],
    userData,
  };
};
