import { shallowRef, type Ref } from 'vue';
import { useSizeObserver } from './useSizeObserver';

export interface ElementSize {
  width: number;
  height: number;
}

/**
 * Отслеживает изменения размеров элемента
 */
export function useElementSize(
  element: Ref<HTMLElement | null>,
  initialSize: ElementSize = { width: 0, height: 0 }
) {
  const width = shallowRef(initialSize.width);
  const height = shallowRef(initialSize.height);

  useSizeObserver(
    element,
    (entry) => {
      width.value = entry.contentRect.width;
      height.value = entry.contentRect.height;
    },
    { immediate: true }
  );

  return {
    width,
    height,
  };
}
