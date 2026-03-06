/**
 * DnD event triggering utilities
 */

import type { IDragEvent, IHovered } from '../../external/types/provider';

import { DnDSelectors } from './namespaces';
import type { IDnDProviderInternal } from '../types/provider';
import type { IDragItem, TDraggablePayload } from '../../external/types/entities';
import { createHelpers } from '../logic/operations';
import { isEffectivelyDisabledDroppable } from './disabled';

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

// ─── Dragged items builder ─────────────────────────────────────────────────────

function buildDraggedItems(provider: IDnDProviderInternal): IDragItem[] {
  const initiating = provider.entities.initiatingDraggable;
  if (!initiating) return [];

  const entity =
    provider.entities.draggingMap.get(initiating) ??
    provider.entities.draggableMap.get(initiating);
  const payloadFn = entity?.payload as TDraggablePayload | undefined;

  // Data-only mode: no payload, just custom data
  if (!payloadFn) {
    if (!entity?.data) return [];
    return [{ index: -1, item: undefined as never, items: [], data: entity.data() }];
  }

  const baseResult = payloadFn();
  if (!Array.isArray(baseResult) || baseResult.length < 2) return [];

  const [baseIdx, baseItemsArr] = baseResult;
  const baseIndex = Number(baseIdx);
  const itemsRef = baseItemsArr as unknown[];

  const byIndex = new Map<number, IDragItem>();
  byIndex.set(baseIndex, {
    index: baseIndex,
    item: itemsRef[baseIndex],
    items: itemsRef,
    data: entity?.data?.(),
  });

  // Collect all currently-dragged elements (draggingMap is built from selection).
  provider.entities.draggingMap.forEach((_, el) => {
    const e2 = provider.entities.draggableMap.get(el);
    const fn2 = e2?.payload as TDraggablePayload | undefined;
    if (!fn2) return;
    const r2 = fn2();
    if (!Array.isArray(r2) || r2.length < 2) return;
    const [idx2, items2] = r2;
    if ((items2 as unknown) !== itemsRef) return; // different list — skip
    const i2 = Number(idx2);
    if (!byIndex.has(i2)) {
      byIndex.set(i2, {
        index: i2,
        item: (items2 as unknown[])[i2],
        items: itemsRef,
        data: e2?.data?.(),
      });
    }
  });

  return [...byIndex.values()].sort((a, b) => a.index - b.index);
}

// ─── getDragEvent ─────────────────────────────────────────────────────────────

export const getDragEvent = (
  provider: IDnDProviderInternal,
  dropZoneEl?: HTMLElement
): IDragEvent => {
  const draggedItems = buildDraggedItems(provider);
  let dropZone: IDragEvent['dropZone'] = undefined;
  let hoveredDraggable: IDragEvent['hoveredDraggable'] = undefined;

  if (dropZoneEl) {
    // ── Drop zone ─────────────────────────────────────────────────────────────
    const dzEntity = provider.entities.droppableMap.get(dropZoneEl);
    if (dzEntity) {
      const dzPayloadFn = dzEntity.payload;
      dropZone = {
        items: dzPayloadFn ? (dzPayloadFn() as unknown[]) : [],
        placement: provider.hovered.droppable.get(dropZoneEl),
        data: dzEntity.data?.(),
      };
    }

    // ── Hovered draggable (element under cursor inside the zone) ──────────────
    const hoveredEl = getFirstKey(provider.hovered.draggable);
    const inZone =
      hoveredEl && (hoveredEl === dropZoneEl || dropZoneEl.contains(hoveredEl));

    if (inZone && hoveredEl) {
      const elEntity = provider.entities.draggableMap.get(hoveredEl);
      const elPayloadFn = elEntity?.payload as TDraggablePayload | undefined;
      const elPlacement = provider.hovered.draggable.get(hoveredEl);
      const defaultPlacement = { top: false, right: false, bottom: false, left: false, center: false };

      if (elPayloadFn) {
        const elResult = elPayloadFn();
        if (Array.isArray(elResult) && elResult.length >= 2) {
          const [elIdx, elItems] = elResult;
          const idx = Number(elIdx);
          hoveredDraggable = {
            element: hoveredEl,
            placement: elPlacement ?? defaultPlacement,
            index: idx,
            item: (elItems as unknown[])[idx],
            items: elItems as unknown[],
            data: elEntity?.data?.(),
          };
        }
      } else if (elEntity?.data) {
        // Data-only mode: no payload, just custom data on the hovered element
        hoveredDraggable = {
          element: hoveredEl,
          placement: elPlacement ?? defaultPlacement,
          index: -1,
          item: undefined as never,
          items: [],
          data: elEntity.data(),
        };
      }
    }
  }

  return {
    draggedItems,
    dropZone,
    hoveredDraggable,
    provider,
    helpers: createHelpers({ draggedItems, dropZone, hoveredDraggable }),
  };
};

// ─── Trigger helpers ──────────────────────────────────────────────────────────

/** Triggers onSelf* only for the initiating element (event.target.closest), skip if disabled */
export const triggerSelfDragForElement = (
  provider: IDnDProviderInternal,
  element: HTMLElement | undefined,
  eventName: TSelfDragEvent
): void => {
  if (!element) return;
  const entity =
    provider.entities.draggingMap.get(element) ??
    provider.entities.draggableMap.get(element);
  if (!entity || entity.disabled) return;
  entity.events?.[eventName]?.(getDragEvent(provider));
};

/** Triggers onDrag* for ALL non-disabled draggable elements */
export const triggerDragForAll = (
  provider: IDnDProviderInternal,
  eventName: 'onDragStart' | 'onDragMove' | 'onDragEnd' | 'onDragCancel'
): void => {
  const dragEvent = getDragEvent(provider);
  provider.entities.draggingMap.forEach((entity) => {
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
      if (prevEntity && !prevEntity.disabled)
        prevEntity.events?.onLeave?.(dragEvent);
    }
    if (newEl) {
      const newEntity = provider.entities.draggableMap.get(newEl);
      if (newEntity && !newEntity.disabled)
        newEntity.events?.onHover?.(dragEvent);
    }
  }
};

/** Triggers onSelf* from pointer event */
export const triggerSelfDragFromEvent = (
  provider: IDnDProviderInternal,
  event: PointerEvent,
  eventName: TSelfDragEvent
): void => {
  const el = getClosestDraggableFromEvent(event);
  if (!el || !provider.entities.draggingMap.has(el)) return;
  provider.entities.draggingMap
    .get(el)
    ?.events?.[eventName]?.(getDragEvent(provider));
};

/** Triggers zone onLeave on drag end */
export const triggerZoneLeave = (
  provider: IDnDProviderInternal,
  hovered: IHovered
): void => {
  const zone = getFirstKey(hovered.droppable);
  if (zone && !isEffectivelyDisabledDroppable(zone, provider)) {
    provider.entities.droppableMap
      .get(zone)
      ?.events?.onLeave?.(getDragEvent(provider, zone));
  }
};

/** Triggers zone onLeave on drop cancel */
export const triggerDropCancelEvents = (
  provider: IDnDProviderInternal,
  hovered: IHovered
): void => {
  const zone = getFirstKey(hovered.droppable);
  if (zone && !isEffectivelyDisabledDroppable(zone, provider)) {
    provider.entities.droppableMap
      .get(zone)
      ?.events?.onLeave?.(getDragEvent(provider, zone));
  }
};
