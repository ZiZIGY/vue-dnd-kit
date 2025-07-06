import { IDnDContext } from '../@types';
import { getOffset } from '../utils/math';

export const createDnDSensor = (provider: IDnDContext) => {
  const startTracking = (
    event: PointerEvent | KeyboardEvent,
    element: HTMLElement
  ) => {
    if (event instanceof PointerEvent) {
      const { percent, pixel } = getOffset(element, {
        x: event.clientX,
        y: event.clientY,
      });
      provider.pointerPosition.start = [event.clientX, event.clientY];
      provider.pointerPosition.current = [event.clientX, event.clientY];
      provider.pointerPosition.offset = [percent.x, percent.y];
      provider.pointerPosition.offsetPixel = [pixel.x, pixel.y];
    }

    setDraggingItems(element);
  };

  const track = (event: PointerEvent) => {
    provider.pointerPosition.current = [event.clientX, event.clientY];
  };

  const stopTracking = () => {
    provider.pointerPosition.end = provider.pointerPosition.current;
    provider.isSelecting.value = false;

    provider.draggingMap.clear();

    provider.pointerPosition.start = [0, 0];
    provider.pointerPosition.offset = [0, 0];
    provider.pointerPosition.offsetPixel = [0, 0];
    provider.pointerPosition.current = [0, 0];
    provider.pointerPosition.end = [0, 0];
  };

  const setDraggingItems = (element: HTMLElement) => {
    const isDraggableInSelection = provider.selectedSet.has(element);

    if (provider.selectedSet.size > 0 && isDraggableInSelection) {
      provider.selectedSet.forEach((node) => {
        const element = provider.elementsMap.get(node);
        if (!element) return;

        provider.draggingMap.set(node, {
          ...element,
        });
      });
    }

    provider.selectedSet.clear();

    const draggableElement = provider.elementsMap.get(element);
    if (draggableElement) provider.draggingMap.set(element, draggableElement);
  };

  return {
    startTracking,
    stopTracking,
    track,
  };
};
