import { computed, type CSSProperties } from 'vue';
import { TDnDNode } from '../@types';
import { useDnDProvider } from '../provider/context';
import { getElementFromRef } from '../utils/vue';

export const setupSelectionArea = (ref: TDnDNode) => {
  const context = useDnDProvider();
  const { handlePointerDown, pointerPosition, isSelecting } = context;

  const style = computed<CSSProperties>(() => {
    if (!isSelecting.value) return {};

    const startX = Math.min(pointerPosition.startX, pointerPosition.currentX);
    const startY = Math.min(pointerPosition.startY, pointerPosition.currentY);
    const width = Math.abs(pointerPosition.currentX - pointerPosition.startX);
    const height = Math.abs(pointerPosition.currentY - pointerPosition.startY);

    return {
      position: 'absolute',
      left: `${startX}px`,
      top: `${startY}px`,
      width: `${width}px`,
      height: `${height}px`,
      background: 'rgba(63, 81, 181, 0.2)',
      border: '1px solid rgba(63, 81, 181, 0.5)',
      pointerEvents: 'none',
      zIndex: 9999,
      boxSizing: 'border-box',
    };
  });

  const handleSelectionStart = (event: PointerEvent | KeyboardEvent) => {
    const element = getElementFromRef(ref);
    isSelecting.value = true;

    handlePointerDown(event, element);
  };

  return {
    style,
    handleSelectionStart,
  };
};
