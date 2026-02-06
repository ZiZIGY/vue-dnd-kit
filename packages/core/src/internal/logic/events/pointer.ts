import { DnDSelectors } from '../../utils/namespaces';
import {
  disableInteractions,
  enableInteractions,
} from '../../utils/dom';
import {
  createPointerState,
  calculateCursorOffset,
  startDraggingForProvider,
} from '../../utils/pointer';
import {
  checkDragHandle,
  tryStartDragIfActivationComplete,
  createActivationDelayTimer,
} from '../../utils/drag-activation';
import { resetDnDSession } from '../../utils/session';
import { updateSelectionByBox } from '../../utils/selection';
import type { IDnDProviderInternal } from '../../types/provider';

export const createPointerHandlers = (provider: IDnDProviderInternal) => {
  let delayTimer: ReturnType<typeof createActivationDelayTimer> | null = null;

  const pointerUp = () => {
    enableInteractions();

    delayTimer?.cancel();
    delayTimer = null;

    resetDnDSession(provider);
    
    document.removeEventListener('pointerup', pointerUp);
    document.removeEventListener('pointermove', pointerMove);
  };

  const pointerMove = (event: PointerEvent) => {
    if (!provider.pointer.value) return;
    provider.pointer.value.current = { x: event.clientX, y: event.clientY };

    if (tryStartDragIfActivationComplete(provider)) return;

    if (provider.state.value === 'selecting') {
      updateSelectionByBox(provider);
    }
  };

  const pointerDown = (event: PointerEvent) => {
    document.addEventListener('pointerup', pointerUp);
    document.addEventListener('pointermove', pointerMove);

    const target = event.target as HTMLElement;
    const closestSelectionArea = target.closest(DnDSelectors.SELECT_AREA) as HTMLElement;

    if (provider.entities.modifiersSelectableAreaSet.size > 0 &&
        provider.entities.modifiersSelectableAreaSet.has(closestSelectionArea)) {
      disableInteractions();
      provider.pointer.value = createPointerState(event);
      provider.state.value = 'selecting';
      provider.entities.selectingArea = closestSelectionArea;
      return;
    }

    const closestDraggable = target.closest(DnDSelectors.DRAGGABLE) as HTMLElement;

    if (provider.entities.modifiersDraggableSet.size > 0 &&
        provider.entities.modifiersDraggableSet.has(closestDraggable)) {
      disableInteractions();
      const entity = provider.entities.draggableMap.get(closestDraggable);
      if (!checkDragHandle(target, closestDraggable, entity?.dragHandle)) return;

      provider.entities.initiatingDraggable = closestDraggable;
      const offset = calculateCursorOffset(event, closestDraggable);
      provider.pointer.value = createPointerState(event, offset.x, offset.y);
      const hasActivation = entity?.activation?.distance || entity?.activation?.delay;

      if (hasActivation) {
        provider.state.value = 'activating';
        if (entity?.activation?.delay) {
          provider.delayStartTime.value = Date.now();
          delayTimer = createActivationDelayTimer(provider, () => startDraggingForProvider(provider));
        }
      } else {
        startDraggingForProvider(provider);
      }
    }
  };

  const cleanup = () => {
    delayTimer?.cancel();
    document.removeEventListener('pointerup', pointerUp);
    document.removeEventListener('pointermove', pointerMove);
    provider.lib.draggableObserver.disconnect();
    provider.lib.droppableObserver.disconnect();
    provider.lib.selectableAreaObserver.disconnect();
  };

  return { pointerDown, pointerUp, pointerMove, cleanup };
};
