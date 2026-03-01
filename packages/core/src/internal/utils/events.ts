/**
 * DnD event triggering utilities
 */

import { DnDSelectors } from './namespaces';
import { isEffectivelyDisabledDroppable } from './disabled';
import { createDragPayload, createDropZonePayload } from '../logic/payload';
import type { IDnDProviderInternal } from '../types/provider';
import type { IDragEvent, IHovered } from '../../external/types/provider';

export type TSelfDragEvent =
  | 'onSelfDragStart'
  | 'onSelfDragMove'
  | 'onSelfDragEnd'
  | 'onSelfDragCancel';

/** First key from Map or undefined */
export const getFirstKey = <K>(map: Map<K, unknown>): K | undefined =>
  map.keys().next().value;

/** Closest draggable from event target */
export const getClosestDraggableFromEvent = (
  event: PointerEvent
): HTMLElement | null =>
  (event.target as HTMLElement).closest(
    DnDSelectors.DRAGGABLE
  ) as HTMLElement | null;

export const getDragEvent = (
  provider: IDnDProviderInternal,
  dropZone?: HTMLElement
): IDragEvent => {
  const event: IDragEvent = {
    payload: createDragPayload(provider),
    provider,
  };
  if (dropZone) {
    event.dropZonePayload = createDropZonePayload(provider, dropZone);
  }
  return event;
};

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
  if (!element) return;
  // Prefer draggingMap entity (survives unmount for virtual lists) over draggableMap.
  // Check entity.disabled directly — avoids iterating all visibleDraggableSet on every call.
  const entity =
    provider.entities.draggingMap.get(element) ??
    provider.entities.draggableMap.get(element);
  if (!entity || entity.disabled) return;
  const dragEvent = getDragEvent(provider);
  entity.events?.[eventName]?.(dragEvent);
};

/** Triggers onDrag* for ALL non-disabled draggable elements */
export const triggerDragForAll = (
  provider: IDnDProviderInternal,
  eventName: 'onDragStart' | 'onDragMove' | 'onDragEnd' | 'onDragCancel'
): void => {
  const dragEvent = getDragEvent(provider);
  provider.entities.draggingMap.forEach((entity) => {
    // entity is a snapshot from drag start — disabled state is captured there.
    // Avoids iterating all visibleDraggableSet via isEffectivelyDisabledDraggable on every call.
    if (entity.disabled) return;
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
    if (prevZone && !isEffectivelyDisabledDroppable(prevZone, provider)) {
      const dragEvent = getDragEvent(provider, prevZone);
      provider.entities.droppableMap
        .get(prevZone)
        ?.events?.onLeave?.(dragEvent);
    }
    if (newZone && !isEffectivelyDisabledDroppable(newZone, provider)) {
      const dragEvent = getDragEvent(provider, newZone);
      provider.entities.droppableMap.get(newZone)?.events?.onEnter?.(dragEvent);
    }
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
    if (prevEl) {
      const prevEntity = provider.entities.draggableMap.get(prevEl);
      if (prevEntity && !prevEntity.disabled) prevEntity.events?.onLeave?.(dragEvent);
    }
    if (newEl) {
      const newEntity = provider.entities.draggableMap.get(newEl);
      if (newEntity && !newEntity.disabled) newEntity.events?.onHover?.(dragEvent);
    }
  }
};

/** Triggers zone onLeave on drag end, skip disabled */
export const triggerZoneLeave = (
  provider: IDnDProviderInternal,
  hovered: IHovered
): void => {
  const zone = getFirstKey(hovered.droppable);
  if (zone && !isEffectivelyDisabledDroppable(zone, provider)) {
    const dragEvent = getDragEvent(provider, zone);
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
    const dragEvent = getDragEvent(provider, zone);
    provider.entities.droppableMap.get(zone)?.events?.onLeave?.(dragEvent);
  }
};
