import type { Ref } from 'vue';
import { getBoundingBox } from '../utils/geometry';
import { preventEvent } from '../utils/events';
import { useDnDStore } from './useDnDStore';

export interface IKeyboardOptions {
  moveStep?: number;
}

export const useKeyboard = (
  elementRef: Ref<HTMLElement | null>,
  options?: IKeyboardOptions
) => {
  const { pointerPosition, keyboard } = useDnDStore();
  const moveStep = options?.moveStep || 10;

  const onKeyboardStart = (event: KeyboardEvent) => {
    preventEvent(event);

    const rect = getBoundingBox(elementRef.value);

    elementRef.value?.blur();

    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;

    pointerPosition.start.value = {
      x: centerX,
      y: centerY,
    };

    pointerPosition.current.value = {
      x: centerX,
      y: centerY,
    };

    pointerPosition.offset.pixel.value = {
      x: rect.width / 2,
      y: rect.height / 2,
    };

    pointerPosition.offset.percent.value = {
      x: 50,
      y: 50,
    };
  };

  const onKeyboardMove = () => {
    if (!pointerPosition.current.value) return;

    const currentX = pointerPosition.current.value.x;
    const currentY = pointerPosition.current.value.y;

    let newX = currentX;
    let newY = currentY;

    if (keyboard.w.value) newY -= moveStep;
    if (keyboard.s.value) newY += moveStep;
    if (keyboard.a.value) newX -= moveStep;
    if (keyboard.d.value) newX += moveStep;

    pointerPosition.current.value = {
      x: newX,
      y: newY,
    };
  };

  const onKeyboardEnd = () => {
    pointerPosition.current.value = null;
    pointerPosition.start.value = null;
    pointerPosition.offset.pixel.value = null;
    pointerPosition.offset.percent.value = null;
  };

  return {
    onKeyboardStart,
    onKeyboardMove,
    onKeyboardEnd,
  };
};
