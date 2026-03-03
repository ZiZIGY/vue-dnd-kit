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
import { applyCollisionResultToHovered } from './hover';
import { defaultCollisionDetection } from '../sensors/default-collision';
import {
  getCollisionWorker,
  type ICollisionWorkerInput,
} from '../sensors/collision-worker';
import {
  overlayBoxFromStyle,
  filterValidCollisionTarget,
} from '../sensors/steps';
import type { IDnDProviderInternal } from '../types/provider';

function packBoxes(
  elements: HTMLElement[],
  cache: Map<HTMLElement, DOMRect>
): number[] {
  const result: number[] = [];
  for (const el of elements) {
    let r = cache.get(el);
    if (!r) {
      r = el.getBoundingClientRect();
      cache.set(el, r);
    }
    result.push(r.x, r.y, r.width, r.height);
  }
  return result;
}

let _latestCollisionRequestId = 0;

function runCollisionViaWorker(provider: IDnDProviderInternal): void {
  const worker = getCollisionWorker();
  const requestId = ++_latestCollisionRequestId;

  const elementCandidates = [...provider.entities.allowedDraggableSet].filter(
    (el) => filterValidCollisionTarget(el, provider)
  );
  const zoneCandidates = [...provider.entities.allowedDroppableSet].filter(
    (el) => filterValidCollisionTarget(el, provider)
  );

  const overlayBox = overlayBoxFromStyle(provider);
  const rawPointer = provider.pointer.value?.current;
  const cache = provider.lib.rectCache;

  const input: ICollisionWorkerInput = {
    containerBox: {
      x: overlayBox.x,
      y: overlayBox.y,
      width: overlayBox.width,
      height: overlayBox.height,
    },
    pointer: { x: rawPointer?.x ?? 0, y: rawPointer?.y ?? 0 },
    elements: packBoxes(elementCandidates, cache),
    elementCount: elementCandidates.length,
    zones: packBoxes(zoneCandidates, cache),
    zoneCount: zoneCandidates.length,
    config: { minOverlapPercent: 10 },
  };

  worker.run(input).then((workerResult) => {
    if (requestId !== _latestCollisionRequestId) return;
    if (provider.state.value !== 'dragging') return;

    const elements = workerResult.elementIndices.map(
      (i) => elementCandidates[i] as HTMLElement
    );
    const zones = workerResult.zoneIndices.map(
      (i) => zoneCandidates[i] as HTMLElement
    );
    applyCollisionResultToHovered(provider, provider.hovered, {
      elements,
      zones,
    });
  });
}

export function runCollisionAndApply(provider: IDnDProviderInternal): void {
  if (provider.collision?.run) {
    const result = provider.collision.run(provider);
    applyCollisionResultToHovered(provider, provider.hovered, result);
    return;
  }

  const worker = getCollisionWorker();
  if (worker.isSupported) {
    runCollisionViaWorker(provider);
  } else {
    const result = defaultCollisionDetection(provider);
    applyCollisionResultToHovered(provider, provider.hovered, result);
  }
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
): Promise<boolean> {
  const hoveredZone = provider.hovered.droppable.keys().next().value;
  if (!hoveredZone) return true;

  if (isEffectivelyDisabledDroppable(hoveredZone, provider)) return true;

  const zoneEntity = provider.entities.droppableMap.get(hoveredZone);
  const dragEvent = getDragEvent(provider, hoveredZone);

  const result = zoneEntity?.events?.onDrop?.(dragEvent);

  const isPromise =
    result != null && typeof (result as Promise<unknown>).then === 'function';
  if (isPromise) {
    try {
      await (result as Promise<unknown>);
      return true;
    } catch {
      const initiating = provider.entities.initiatingDraggable;
      triggerSelfDragForElement(provider, initiating, 'onSelfDragCancel');
      triggerDragForAll(provider, 'onDragCancel');
      triggerDropCancelEvents(provider, provider.hovered);
      return false;
    }
  }
  return true;
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
      const dropOk = await handleDropAndFinish(provider);
      if (!dropOk) {
        resetDnDSession(provider);
        document.removeEventListener('pointerup', pointerUp);
        document.removeEventListener('pointermove', pointerMove);
        return;
      }
      finishDragSession(provider);
    } else if (state === 'selecting') {
      finishSelectionSession(provider);
    }

    resetDnDSession(provider);
    document.removeEventListener('pointerup', pointerUp);
    document.removeEventListener('pointermove', pointerMove);
  };

  const pointerMove = (event: PointerEvent) => {
    if (!provider.pointer.value) return;
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

    const target = event.target as HTMLElement;
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
    provider.lib.overlaySizeObserver.disconnect();
  };

  return { pointerDown, pointerUp, pointerMove, cleanup };
};
