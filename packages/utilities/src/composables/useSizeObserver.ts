import { onBeforeUnmount, watch, type Ref } from 'vue';

export interface UseSizeObserverOptions {
  /**
   * Немедленно вызвать callback при монтировании
   * @default true
   */
  immediate?: boolean;
}

/**
 * Наблюдает за изменениями размеров элемента
 * @param element - Элемент для наблюдения
 * @param callback - Функция, вызываемая при изменении размеров
 * @param options - Опции наблюдателя
 */
export function useSizeObserver(
  element: Ref<HTMLElement | null>,
  callback: (entry: ResizeObserverEntry) => void,
  options: UseSizeObserverOptions = {}
) {
  const { immediate = true } = options;
  let resizeObserver: ResizeObserver | null = null;

  const cleanup = () => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  };

  const setupObserver = () => {
    if (!element.value) return;

    cleanup();

    resizeObserver = new ResizeObserver(([entry]) => {
      if (entry) callback(entry);
    });

    resizeObserver.observe(element.value);

    // Вызываем callback сразу если нужно
    if (immediate) {
      const rect = element.value.getBoundingClientRect();
      callback({
        contentRect: rect,
        target: element.value,
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      });
    }
  };

  // Следим за изменением элемента
  watch(
    () => element.value,
    (newElement) => {
      if (newElement) {
        setupObserver();
      } else {
        cleanup();
      }
    },
    { immediate: true }
  );

  onBeforeUnmount(cleanup);

  return cleanup;
}
