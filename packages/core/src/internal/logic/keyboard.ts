import {
  calculateCursorOffset,
  createPointerState,
  startDraggingForProvider,
} from '../utils/pointer';
import { disableInteractions, enableInteractions } from '../utils/dom';
import { finishDragSession, handleDropAndFinish } from './pointer';
import {
  triggerDragForAll,
  triggerDropCancelEvents,
  triggerSelfDragForElement,
} from '../utils/events';

import { DnDSelectors } from '../utils/namespaces';
import type { IDnDProviderInternal } from '../types/provider';
import { applyCollisionResultToHovered } from './hover';
import { checkDragHandle } from '../utils/drag-activation';
import { defaultCollisionDetection } from '../sensors/default-collision';
import { resetDnDSession } from '../utils/session';

const MOVE_MAP: Record<string, { dx: number; dy: number }> = {
  ArrowUp: { dx: 0, dy: -1 },
  ArrowDown: { dx: 0, dy: 1 },
  ArrowLeft: { dx: -1, dy: 0 },
  ArrowRight: { dx: 1, dy: 0 },
  KeyW: { dx: 0, dy: -1 },
  KeyA: { dx: -1, dy: 0 },
  KeyS: { dx: 0, dy: 1 },
  KeyD: { dx: 1, dy: 0 },
};

const handleKeyDown =
  (provider: IDnDProviderInternal) => (event: KeyboardEvent) => {
    const { keys } = provider.keyboard;

    keys.pressedKeys.value.add(event.code);

    const state = provider.state.value;

    if (state === 'dragging') {
      if (keys.forCancel.includes(event.code)) {
        event.preventDefault();
        enableInteractions();
        triggerSelfDragForElement(
          provider,
          provider.entities.initiatingDraggable,
          'onSelfDragCancel'
        );
        triggerDragForAll(provider, 'onDragCancel');
        triggerDropCancelEvents(provider, provider.hovered);
        resetDnDSession(provider);
        return;
      }
      if (keys.forDrop.includes(event.code)) {
        event.preventDefault();
        (async () => {
          const ok = await handleDropAndFinish(provider);
          if (ok) finishDragSession(provider);
          enableInteractions();
          resetDnDSession(provider);
        })();
        return;
      }
      const move = MOVE_MAP[event.code];
      if (move && keys.forMove.includes(event.code) && provider.pointer.value) {
        event.preventDefault();
        const faster = keys.forMoveFaster.some((k) =>
          keys.pressedKeys.value.has(k)
        );
        const dist =
          provider.keyboard.step * (faster ? provider.keyboard.moveFaster : 1);
        provider.pointer.value.current = {
          x: provider.pointer.value.current.x + move.dx * dist,
          y: provider.pointer.value.current.y + move.dy * dist,
        };

        const result = defaultCollisionDetection(provider);
        applyCollisionResultToHovered(provider, provider.hovered, result);
        triggerSelfDragForElement(
          provider,
          provider.entities.initiatingDraggable,
          'onSelfDragMove'
        );
        triggerDragForAll(provider, 'onDragMove');
        return;
      }
      return;
    }

    if (keys.forDrag.includes(event.code)) {
      const active = document.activeElement as HTMLElement | null;
      if (!active) return;

      const closestDraggable = active.closest(
        DnDSelectors.DRAGGABLE
      ) as HTMLElement | null;
      if (!closestDraggable) return;

      if (
        provider.entities.modifiersDraggableSet.size === 0 ||
        !provider.entities.modifiersDraggableSet.has(closestDraggable)
      )
        return;

      const entity = provider.entities.draggableMap.get(closestDraggable);
      if (!checkDragHandle(active, closestDraggable, entity?.dragHandle, true))
        return;

      event.preventDefault();
      disableInteractions();

      const rect = closestDraggable.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const syntheticEvent = {
        clientX: centerX,
        clientY: centerY,
        target: closestDraggable,
      } as unknown as PointerEvent;

      provider.entities.initiatingDraggable = closestDraggable;
      const offset = calculateCursorOffset(syntheticEvent, closestDraggable);
      provider.pointer.value = createPointerState(
        syntheticEvent,
        offset.x,
        offset.y
      );

      startDraggingForProvider(provider);

      const result = defaultCollisionDetection(provider);
      applyCollisionResultToHovered(provider, provider.hovered, result);

      triggerSelfDragForElement(provider, closestDraggable, 'onSelfDragStart');
      triggerDragForAll(provider, 'onDragStart');
    }
  };

const handleKeyUp =
  (provider: IDnDProviderInternal) => (event: KeyboardEvent) => {
    provider.keyboard.keys.pressedKeys.value.delete(event.code);
  };

const handleClear = (provider: IDnDProviderInternal) => () => {
  provider.keyboard.keys.pressedKeys.value.clear();
};

export const handleKeyboardEvents = {
  keyDown: handleKeyDown,
  keyUp: handleKeyUp,
  clear: handleClear,
};
