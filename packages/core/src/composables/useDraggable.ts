import { onBeforeUnmount, onMounted } from 'vue';

import type { IUseDragOptions } from '../types';
import { useDnDStore } from './useDnDStore';
import { useElementManager } from '../managers/useElementManager';
import { useEventManager } from '../managers/useEventManager';

export const useDraggable = (options?: IUseDragOptions) => {
  const {
    elementRef,
    registerElement,
    unregisterElement,
    isDragging,
    isOvered,
    isAllowed,
  } = useElementManager(options);

  const { pointerPosition } = useDnDStore();
  const { handleDragStart: start } = useEventManager();

  const handleDragStart = (event: PointerEvent | KeyboardEvent) => 
    start(event, elementRef, options)
  

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
