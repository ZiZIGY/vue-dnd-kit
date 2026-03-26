import { DnDSelectors } from '../utils/namespaces';
import { disableInteractions, enableInteractions } from '../utils/dom';
import {
  createPointerState,
  calculateCursorOffset,
  startDraggingForProvider,
} from '../utils/pointer';
import {
  checkDragHandle,
  tryStartDragIfActivationComplete,
  createActivationDelayTimer,
} from '../utils/drag-activation';
import { resetDnDSession } from '../utils/session';
import { updateSelectionByBox } from '../utils/selection';
import {
  triggerSelfDragFromEvent,
  triggerSelfDragForElement,
  triggerDragForAll,
  triggerZoneLeave,
  triggerDropCancelEvents,
} from '../utils/events';
import { getDragEvent } from '../utils/events';
import { isEffectivelyDisabledDroppable } from '../utils/disabled';
import { areGroupsCompatible } from '../utils/groups';
import { applyCollisionResultToHovered } from './hover';
import { defaultCollisionDetection } from '../sensors/default-collision';
import { createHelpers } from './operations';
import type { IDnDProviderInternal } from '../types/provider';
import type { TDropResult } from '../../external';
import type { IDragItem } from '../../external/types/entities';

export function runCollisionAndApply(provider: IDnDProviderInternal): void {
  const result = defaultCollisionDetection(provider);
  applyCollisionResultToHovered(provider, provider.hovered, result);
}

function runThrottledCollision(
  provider: IDnDProviderInternal,
  lastRun: { value: number }
): void {
  const throttleMs = provider.collision?.throttle?.value ?? 0;
  if (throttleMs <= 0) {
    runCollisionAndApply(provider);
    return;
  }
  const now = Date.now();
  if (now - lastRun.value >= throttleMs) {
    lastRun.value = now;
    runCollisionAndApply(provider);
  }
}

export async function handleDropAndFinish(
  provider: IDnDProviderInternal
): Promise<TDropResult> {
  const hoveredZone = provider.hovered.droppable.keys().next().value;
  if (!hoveredZone) return 'accept';

  if (isEffectivelyDisabledDroppable(hoveredZone, provider)) return 'accept';

  const zoneEntity = provider.entities.droppableMap.get(hoveredZone);
  const dragEvent = getDragEvent(provider, hoveredZone);

  // ── groupMatch: 'some' — split valid/invalid, run onValidate if present ────
  let finalDragEvent = dragEvent;
  if (
    zoneEntity?.groupMatch === 'some' &&
    (zoneEntity.groups?.length ?? 0) > 0
  ) {
    const zoneGroups = zoneEntity.groups!;

    // For each dragged item, find its groups from draggingMap by index + items identity
    const validItems = dragEvent.draggedItems.filter((item) => {
      for (const [, draggingEntity] of provider.entities.draggingMap) {
        const payload = draggingEntity.payload?.();
        if (!Array.isArray(payload) || payload.length < 2) continue;
        if (Number(payload[0]) === item.index && payload[1] === item.items) {
          return areGroupsCompatible(draggingEntity.groups ?? [], zoneGroups);
        }
      }
      return true;
    });
    const invalidItems = dragEvent.draggedItems.filter(
      (item) => !validItems.includes(item)
    );

    if (invalidItems.length > 0) {
      const makeEvent = (items: IDragItem[]) => ({
        ...dragEvent,
        draggedItems: items,
        helpers: createHelpers({ ...dragEvent, draggedItems: items }),
      });

      if (zoneEntity.events?.onValidate) {
        const validateResult = zoneEntity.events.onValidate({
          validItems,
          invalidItems,
          dropZone: dragEvent.dropZone,
          hoveredDraggable: dragEvent.hoveredDraggable,
        });

        const isValidatePromise =
          validateResult != null &&
          typeof (validateResult as Promise<unknown>).then === 'function';

        let resolved: void | false | IDragItem[];
        if (isValidatePromise) {
          provider.state.value = 'pending';
          try {
            resolved = await (validateResult as Promise<
              void | false | IDragItem[]
            >);
          } catch {
            const initiating = provider.entities.initiatingDraggable;
            triggerSelfDragForElement(provider, initiating, 'onSelfDragCancel');
            triggerDragForAll(provider, 'onDragCancel');
            triggerDropCancelEvents(provider, provider.hovered);
            return 'cancel';
          }
        } else {
          resolved = validateResult as void | false | IDragItem[];
        }

        if (resolved === false) {
          provider.state.value = 'dragging';
          return 'decline';
        }

        const itemsToUse: IDragItem[] = Array.isArray(resolved)
          ? resolved
          : validItems;
        if (itemsToUse.length === 0) return 'accept';
        finalDragEvent = makeEvent(itemsToUse);
      } else {
        // Default: silently drop only valid items
        if (validItems.length === 0) return 'accept';
        finalDragEvent = makeEvent(validItems);
      }
    }
  }
  // ────────────────────────────────────────────────────────────────────────────

  const result = zoneEntity?.events?.onDrop?.(finalDragEvent);

  const isPromise =
    result != null && typeof (result as Promise<unknown>).then === 'function';
  if (isPromise) {
    provider.state.value = 'pending';
    let resolvedValue: boolean | void;
    try {
      resolvedValue = await (result as Promise<boolean | void>);
    } catch {
      // Promise rejected → hard cancel with cancel events, then reset
      const initiating = provider.entities.initiatingDraggable;
      triggerSelfDragForElement(provider, initiating, 'onSelfDragCancel');
      triggerDragForAll(provider, 'onDragCancel');
      triggerDropCancelEvents(provider, provider.hovered);
      return 'cancel';
    }
    // Resolved false → decline this drop, keep drag active (no reset, user can move and drop elsewhere)
    if (resolvedValue === false) {
      provider.state.value = 'dragging';
      return 'decline';
    }
    return 'accept';
  }
  // Sync false → decline (keep drag active)
  return (result as boolean | void | undefined) === false
    ? 'decline'
    : 'accept';
}

export function finishDragSession(provider: IDnDProviderInternal): void {
  const initiating = provider.entities.initiatingDraggable;
  triggerSelfDragForElement(provider, initiating, 'onSelfDragEnd');
  triggerDragForAll(provider, 'onDragEnd');
  triggerZoneLeave(provider, provider.hovered);
}

function finishSelectionSession(provider: IDnDProviderInternal): void {
  const selectingArea = provider.entities.selectingArea;
  if (!selectingArea) return;

  const areaEntity = provider.entities.selectableAreaMap.get(selectingArea);
  const selected = [...provider.entities.selectedSet];
  areaEntity?.events?.onSelected?.(selected);
}

export const createPointerHandlers = (provider: IDnDProviderInternal) => {
  const delayTimer = {
    current: null as ReturnType<typeof createActivationDelayTimer> | null,
  };
  const lastCollisionRun = { value: 0 };

  const pointerUp = async () => {
    enableInteractions();

    delayTimer.current?.cancel();
    delayTimer.current = null;

    const state = provider.state.value;

    if (state === 'dragging') {
      const dropResult = await handleDropAndFinish(provider);
      if (dropResult === 'accept') {
        finishDragSession(provider);
      }
      if (dropResult === 'accept' || dropResult === 'cancel') {
        resetDnDSession(provider);
        document.removeEventListener('pointerup', pointerUp);
        document.removeEventListener('pointermove', pointerMove);
        return;
      }
      // dropResult === 'decline' — don't reset, keep drag active so user can move and drop elsewhere
      return;
    } else if (state === 'selecting') {
      finishSelectionSession(provider);
    }

    resetDnDSession(provider);
    document.removeEventListener('pointerup', pointerUp);
    document.removeEventListener('pointermove', pointerMove);
  };

  const pointerMove = (event: PointerEvent) => {
    if (!provider.pointer.value) return;
    if (provider.state.value === 'pending') return;
    provider.pointer.value.current = { x: event.clientX, y: event.clientY };

    if (tryStartDragIfActivationComplete(provider)) {
      triggerSelfDragFromEvent(provider, event, 'onSelfDragStart');
      triggerDragForAll(provider, 'onDragStart');
      return;
    }

    if (provider.state.value === 'dragging') {
      runThrottledCollision(provider, lastCollisionRun);
      const initiating = provider.entities.initiatingDraggable;
      triggerSelfDragForElement(provider, initiating, 'onSelfDragMove');
      triggerDragForAll(provider, 'onDragMove');
    }

    if (provider.state.value === 'selecting') {
      updateSelectionByBox(provider);
    }
  };

  const pointerDown = (event: PointerEvent) => {
    document.addEventListener('pointerup', pointerUp);
    document.addEventListener('pointermove', pointerMove);

    // composedPath()[0] gives the real target even across shadow root boundaries
    // (event.target is re-targeted to the host element when leaving a shadow root)
    const target = ((event.composedPath?.()[0]) ?? event.target) as HTMLElement;
    const closestSelectionArea = target.closest(
      DnDSelectors.SELECT_AREA
    ) as HTMLElement;
    const closestDraggable = target.closest(
      DnDSelectors.DRAGGABLE
    ) as HTMLElement;

    if (
      provider.entities.modifiersSelectableAreaSet.size > 0 &&
      provider.entities.modifiersSelectableAreaSet.has(closestSelectionArea)
    ) {
      disableInteractions();
      provider.pointer.value = createPointerState(event);
      provider.state.value = 'selecting';
      provider.entities.selectingArea = closestSelectionArea;
      // Snapshot current selection so previous picks survive the new rubber-band pass
      provider.entities.selectionBase = new Set(provider.entities.selectedSet);
      return;
    }

    if (
      provider.entities.modifiersDraggableSet.size > 0 &&
      provider.entities.modifiersDraggableSet.has(closestDraggable)
    ) {
      const entity = provider.entities.draggableMap.get(closestDraggable);
      if (!checkDragHandle(target, closestDraggable, entity?.dragHandle))
        return;

      disableInteractions();
      provider.entities.initiatingDraggable = closestDraggable;
      const offset = calculateCursorOffset(event, closestDraggable);
      provider.pointer.value = createPointerState(event, offset.x, offset.y);

      const hasActivation =
        entity?.activation?.distance || entity?.activation?.delay;

      if (hasActivation) {
        provider.state.value = 'activating';
        if (entity?.activation?.delay) {
          provider.delay.startTime = Date.now();
          delayTimer.current = createActivationDelayTimer(provider, () => {
            startDraggingForProvider(provider);
            triggerSelfDragFromEvent(provider, event, 'onSelfDragStart');
            triggerDragForAll(provider, 'onDragStart');
          });
        }
      } else {
        startDraggingForProvider(provider);
        triggerSelfDragFromEvent(provider, event, 'onSelfDragStart');
        triggerDragForAll(provider, 'onDragStart');
      }
    }
  };

  const cleanup = () => {
    delayTimer.current?.cancel();
    document.removeEventListener('pointerup', pointerUp);
    document.removeEventListener('pointermove', pointerMove);
    provider.lib.draggableObserver.disconnect();
    provider.lib.droppableObserver.disconnect();
    provider.lib.selectableAreaObserver.disconnect();
  };

  return { pointerDown, pointerUp, pointerMove, cleanup };
};
