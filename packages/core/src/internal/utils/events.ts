/**
 * DnD event triggering utilities
 */

import { DnDSelectors } from './namespaces';
import {
  isEffectivelyDisabledDraggable,
  isEffectivelyDisabledDroppable,
} from './disabled';
import { createDragPayload } from '../logic/payload';
import type { IDnDProviderInternal } from '../types/provider';
import type { IDragEvent } from '../../external/types';
import type { IHovered } from '../../external/types/provider';

export type TSelfDragEvent = 'onSelfDragStart' | 'onSelfDragMove' | 'onSelfDragEnd' | 'onSelfDragCancel';

/** First key from Map or undefined */
export const getFirstKey = <K>(map: Map<K, unknown>): K | undefined =>
  map.keys().next().value;

/** Closest draggable from event target */
export const getClosestDraggableFromEvent = (event: PointerEvent): HTMLElement | null =>
  (event.target as HTMLElement).closest(DnDSelectors.DRAGGABLE) as HTMLElement | null;

const getDragEvent = (provider: IDnDProviderInternal): IDragEvent => ({
  payload: createDragPayload(provider),
});

/** Triggers onSelf* for element from event if it's in draggingMap */
export const triggerSelfDragFromEvent = (
  provider: IDnDProviderInternal,
  event: PointerEvent,
  eventName: TSelfDragEvent
): void => {
  const el = getClosestDraggableFromEvent(event);
  if (!el || !provider.entities.draggingMap.has(el)) return;
  const dragEvent = getDragEvent(provider);
  provider.entities.draggingMap.get(el)?.events?.[eventName]?.(dragEvent);
};

/** Triggers onSelf* only for the initiating element (event.target.closest), skip if disabled */
export const triggerSelfDragForElement = (
  provider: IDnDProviderInternal,
  element: HTMLElement | undefined,
  eventName: TSelfDragEvent
): void => {
  if (!element || isEffectivelyDisabledDraggable(element, provider)) return;
  const dragEvent = getDragEvent(provider);
  provider.entities.draggableMap.get(element)?.events?.[eventName]?.(dragEvent);
};

/** Triggers onDrag* for ALL non-disabled draggable elements */
export const triggerDragForAll = (
  provider: IDnDProviderInternal,
  eventName: 'onDragStart' | 'onDragMove' | 'onDragEnd' | 'onDragCancel'
): void => {
  const dragEvent = getDragEvent(provider);
  provider.entities.draggableMap.forEach((entity, node) => {
    if (isEffectivelyDisabledDraggable(node, provider)) return;
    entity.events?.[eventName]?.(dragEvent);
  });
};

/** Triggers zone onEnter/onLeave when zone changes, skip disabled zones */
export const triggerZoneEnterLeave = (
  provider: IDnDProviderInternal,
  prevZone: HTMLElement | undefined,
  newZone: HTMLElement | undefined
): void => {
  if (prevZone !== newZone) {
    const dragEvent = getDragEvent(provider);
    if (prevZone && !isEffectivelyDisabledDroppable(prevZone, provider))
      provider.entities.droppableMap.get(prevZone)?.events?.onLeave?.(dragEvent);
    if (newZone && !isEffectivelyDisabledDroppable(newZone, provider))
      provider.entities.droppableMap.get(newZone)?.events?.onEnter?.(dragEvent);
  }
};

/** Triggers onHover/onLeave when hovered draggable changes, skip disabled */
export const triggerDraggableHoverChange = (
  provider: IDnDProviderInternal,
  prevEl: HTMLElement | undefined,
  newEl: HTMLElement | undefined
): void => {
  if (prevEl !== newEl) {
    const dragEvent = getDragEvent(provider);
    if (prevEl && !isEffectivelyDisabledDraggable(prevEl, provider))
      provider.entities.draggableMap.get(prevEl)?.events?.onLeave?.(dragEvent);
    if (newEl && !isEffectivelyDisabledDraggable(newEl, provider))
      provider.entities.draggableMap.get(newEl)?.events?.onHover?.(dragEvent);
  }
};

/** Triggers zone onLeave on drag end, skip disabled */
export const triggerZoneLeave = (provider: IDnDProviderInternal, hovered: IHovered): void => {
  const zone = getFirstKey(hovered.droppable);
  if (zone && !isEffectivelyDisabledDroppable(zone, provider)) {
    const dragEvent = getDragEvent(provider);
    provider.entities.droppableMap.get(zone)?.events?.onLeave?.(dragEvent);
  }
};

/** Triggers zone onLeave on drop failure, skip disabled */
export const triggerDropCancelEvents = (
  provider: IDnDProviderInternal,
  hovered: IHovered
): void => {
  const zone = getFirstKey(hovered.droppable);
  if (zone && !isEffectivelyDisabledDroppable(zone, provider)) {
    const dragEvent = getDragEvent(provider);
    provider.entities.droppableMap.get(zone)?.events?.onLeave?.(dragEvent);
  }
};
