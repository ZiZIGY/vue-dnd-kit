import { Ref, markRaw } from 'vue';

import type { IUseDragOptions } from '../types';
import { createGlobalState } from '@vueuse/core';
import { preventEvent } from '../utils/events';
import { useDnDStore } from '../composables/useDnDStore';
import { useSensor } from '../composables/useSensor';

enum EKeyboardKey {
  ESCAPE = 'Escape',
  SPACE = 'Space',
  ENTER = 'Enter',
  W = 'KeyW',
  A = 'KeyA',
  S = 'KeyS',
  D = 'KeyD',
}

export const useEventManager = createGlobalState(() => {
  let originalUserSelect = '';
  let originalTouchAction = '';
  let originalOverscrollBehavior = '';

  let currentMoveHandler: ((event: any) => void) | null = null;
  let currentEndHandler: ((triggerEvents?: boolean) => void) | null = null;
  let currentScrollHandler: ((event: WheelEvent) => void) | null = null;
  let currentKeyHandler: ((event: KeyboardEvent) => void) | null = null;

  const { activeContainer, keyboard } = useDnDStore();

  const disableInteractions = () => {
    const body = document.body;

    originalUserSelect = body.style.userSelect;

    body.style.userSelect = 'none';

    window.addEventListener('contextmenu', preventEvent);
    window.addEventListener('selectstart', preventEvent);
    window.addEventListener('touchstart', preventEvent);
    window.addEventListener('touchmove', preventEvent);
  };

  const enableInteractions = () => {
    const body = document.body;

    body.style.userSelect = originalUserSelect;
    body.style.touchAction = originalTouchAction;
    body.style.overscrollBehavior = originalOverscrollBehavior;

    window.removeEventListener('contextmenu', preventEvent);
    window.removeEventListener('selectstart', preventEvent);
    window.removeEventListener('touchstart', preventEvent);
    window.removeEventListener('touchmove', preventEvent);
  };

  const clearAllListeners = () => {
    if (currentMoveHandler) {
      document.removeEventListener('pointermove', currentMoveHandler);
      currentMoveHandler = null;
    }

    if (currentEndHandler) {
      document.removeEventListener('pointerup', () => currentEndHandler?.());
      currentEndHandler = null;
    }

    if (currentScrollHandler) {
      document.removeEventListener('wheel', currentScrollHandler);
      currentScrollHandler = null;
    }

    if (currentKeyHandler) {
      document.removeEventListener('keydown', currentKeyHandler);
      document.removeEventListener('keypress', currentKeyHandler);
      document.removeEventListener('keyup', currentKeyHandler);
      currentKeyHandler = null;
    }
  };

  const handleDragStart = (
    event: PointerEvent | KeyboardEvent,
    elementRef: Ref<HTMLElement | null>,
    options?: IUseDragOptions
  ) => {
    clearAllListeners();

    (event.target as HTMLElement).blur();

    if (options?.container)
      activeContainer.component.value = markRaw(options.container);

    const { activate, track, deactivate } = useSensor(elementRef, options);

    currentEndHandler = (triggerEvents = true) => {
      activeContainer.component.value = null;
      enableInteractions();
      deactivate(triggerEvents);
      clearAllListeners();
    };

    currentMoveHandler = (event: PointerEvent | KeyboardEvent) => track(event);
    currentScrollHandler = (event: WheelEvent) => track(event);
    currentKeyHandler = (event: KeyboardEvent) => {
      if (event.type === 'keydown') keyPressed(event, true);
      if (event.type === 'keypress') keyPressed(event, true);
      if (event.type === 'keyup') {
        if (event.code === EKeyboardKey.ESCAPE) currentEndHandler?.(false);
        if (event.code === EKeyboardKey.ENTER) currentEndHandler?.();
        keyPressed(event, false);
      }

      track(event);
    };

    disableInteractions();
    activate(event);

    document.addEventListener('pointermove', currentMoveHandler);
    document.addEventListener('pointerup', () => currentEndHandler?.());
    document.addEventListener('wheel', currentScrollHandler);
    document.addEventListener('keydown', currentKeyHandler);
    document.addEventListener('keypress', currentKeyHandler);
    document.addEventListener('keyup', currentKeyHandler);
  };

  const keyPressed = (event: KeyboardEvent, isKeyDown = true) => {
    if (event.code === EKeyboardKey.W) keyboard.w.value = isKeyDown;
    if (event.code === EKeyboardKey.A) keyboard.a.value = isKeyDown;
    if (event.code === EKeyboardKey.S) keyboard.s.value = isKeyDown;
    if (event.code === EKeyboardKey.D) keyboard.d.value = isKeyDown;
  };

  return {
    handleDragStart,
  };
});
