import { IDnDContext } from '../@types';
import { disableInteractions, enableInteractions } from '../utils/events';
import { createDnDSensor } from './sensor';

export const createDnDEvents = (provider: IDnDContext) => {
  let currentMoveHandler: ((event: any) => void) | null = null;
  let currentEndHandler: (() => void) | null = null;
  let currentCancelHandler: (() => void) | null = null;
  let currentScrollHandler: ((event: WheelEvent) => void) | null = null;
  let currentKeyHandler: ((event: KeyboardEvent) => void) | null = null;

  let originalUserSelect = '';
  let originalTouchAction = '';
  let originalOverscrollBehavior = '';

  const sensor = createDnDSensor(provider);

  const clearAllListeners = () => {
    if (currentMoveHandler) {
      document.removeEventListener('pointermove', currentMoveHandler);
      currentMoveHandler = null;
    }

    if (currentEndHandler) {
      document.removeEventListener('pointerup', currentEndHandler);
      currentEndHandler = null;
    }

    if (currentCancelHandler) {
      currentCancelHandler = null;
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

  const handlePointerDown = (
    event: PointerEvent | KeyboardEvent,
    element: HTMLElement
  ) => {
    clearAllListeners();
    disableInteractions(originalUserSelect);

    sensor.startTracking(event, element);

    currentEndHandler = () => {
      sensor.stopTracking();

      clearAllListeners();
      enableInteractions(
        originalUserSelect,
        originalTouchAction,
        originalOverscrollBehavior
      );
    };

    currentCancelHandler = () => {
      clearAllListeners();
      enableInteractions(
        originalUserSelect,
        originalTouchAction,
        originalOverscrollBehavior
      );

      sensor.stopTracking();
    };

    currentMoveHandler = (moveEvent: PointerEvent) => {
      sensor.track(moveEvent);
    };

    currentScrollHandler = (scrollEvent: WheelEvent) => {};

    currentKeyHandler = (keyEvent: KeyboardEvent) => {
      if (keyEvent.type === 'keyup') {
        if (keyEvent.code === 'Escape') currentCancelHandler?.();
        if (keyEvent.code === 'Enter') currentEndHandler?.();
      }
    };

    document.addEventListener('pointermove', currentMoveHandler);
    document.addEventListener('pointerup', currentEndHandler);
    document.addEventListener('wheel', currentScrollHandler);
    document.addEventListener('keydown', currentKeyHandler);
    document.addEventListener('keypress', currentKeyHandler);
    document.addEventListener('keyup', currentKeyHandler);
  };

  return {
    handlePointerDown,
  };
};
