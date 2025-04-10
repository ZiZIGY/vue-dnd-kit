import { markRaw, onBeforeUnmount, onMounted } from 'vue';

import type { IUseDragOptions } from '../types';
import { preventEvent } from '../utils/events';
import { useDnDStore } from './useDnDStore';
import { useElementManager } from '../managers/useElementManager';
import { useInteractionManager } from '../managers/useInteractionManager';
import { useSensor } from './useSensor';

export const useDraggable = (options?: IUseDragOptions) => {
  const {
    elementRef,
    registerElement,
    unregisterElement,
    isDragging,
    isOvered,
    isAllowed,
  } = useElementManager(options);

  const { disableInteractions, enableInteractions } = useInteractionManager();

  const { activeContainer, pointerPosition } = useDnDStore();

  const { activate, track, deactivate } = useSensor(elementRef, options);

  const handleDragStart = (event: PointerEvent | KeyboardEvent) => {
    if (options?.container)
      activeContainer.component.value = markRaw(options.container);

    disableInteractions();

    activate(event);

    console.log(activeContainer.ref);

    document.addEventListener('pointermove', handleDragMove);
    document.addEventListener('pointerup', handleDragEnd);
    document.addEventListener('wheel', handleScroll);
  };

  const handleDragMove = (event: PointerEvent) => track(event);

  const handleScroll = (event: WheelEvent) => track(event);

  const handleDragEnd = () => {
    activeContainer.component.value = null;

    enableInteractions();

    deactivate();

    document.removeEventListener('pointermove', handleDragMove);
    document.removeEventListener('pointerup', handleDragEnd);
    document.removeEventListener('wheel', handleScroll);
  };

  onMounted(registerElement);
  onBeforeUnmount(unregisterElement);

  return {
    pointerPosition,
    elementRef,
    isDragging,
    isOvered,
    isAllowed,
    handleDragStart,
  };
};
