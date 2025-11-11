type EventHandlers = {
  move: (e: PointerEvent) => void;
  up: () => void;
} | null;

export const createDnDEvents = () => {
  let currentHandlers: EventHandlers = null;

  const cleanup = (): void => {
    if (currentHandlers) {
      document.removeEventListener('pointermove', currentHandlers.move);
      document.removeEventListener('pointerup', currentHandlers.up);
    }
    currentHandlers = null;
  };

  const startDrag = (): void => {
    cleanup();

    const handleMove = (e: PointerEvent): void => {
      console.log('Dragging:', e);
    };

    const handleUp = (): void => {
      cleanup();
    };

    document.addEventListener('pointermove', handleMove);
    document.addEventListener('pointerup', handleUp);

    currentHandlers = { move: handleMove, up: handleUp };
  };

  const startSelection = (): void => {
    cleanup();

    const handleMove = (e: PointerEvent): void => {
      console.log('Selecting:', e);
    };

    const handleUp = (): void => {
      cleanup();
    };

    document.addEventListener('pointermove', handleMove);
    document.addEventListener('pointerup', handleUp);

    currentHandlers = { move: handleMove, up: handleUp };
  };

  return {
    startDrag,
    startSelection,
    cleanup,
  };
};
