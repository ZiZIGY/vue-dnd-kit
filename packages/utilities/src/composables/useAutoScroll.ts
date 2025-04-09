import { ref, watch } from 'vue';

import type { IAutoScrollOptions } from '../types';
import type { IPoint } from '@vue-dnd-kit/core';
import type { Ref } from 'vue';

/**
 * Hook for automatic scrolling when pointer approaches container edges.
 * Universal utility that can be used for any pointer-based interactions,
 * not limited to drag and drop operations.
 *
 * @param container - Reference to the scrollable container element
 * @param point - Reference to the current pointer position
 * @param options - Auto-scroll configuration options
 * @returns Object containing scroll state
 *
 * @example
 * ```ts
 * // Basic usage
 * const container = ref<HTMLElement | null>(null);
 * const point = ref<IPoint | null>(null);
 * const { isScrolling } = useAutoScroll(container, point);
 *
 * // With custom options
 * const options = {
 *   threshold: 100, // Start scrolling 100px from edges
 *   speed: 15,     // Scroll 15px per frame
 *   disabled: false // Enable/disable scrolling
 * };
 * const { isScrolling } = useAutoScroll(container, point, options);
 * ```
 */
export const useAutoScroll = (
  container: Ref<HTMLElement | null>,
  point: Ref<IPoint | null>,
  options: IAutoScrollOptions = {}
) => {
  const { threshold = 50, speed = 10, disabled = false } = options;
  /** Flag indicating if auto-scroll is currently active */
  const isScrolling = ref(false);
  /** Request animation frame ID for scroll animation */
  let rafId: number | null = null;

  /** Timestamp of last scroll update for smooth animation */
  let lastTime: number | null = null;

  /** Target frames per second for smooth scrolling */
  const targetFPS = 144;
  /** Time between frames in milliseconds */
  const frameTime = 1000 / targetFPS;

  /** Cache for optimizing DOM reads */
  let lastRect: DOMRect | null = null;
  let lastScrollTop = 0;
  let lastScrollLeft = 0;

  /**
   * Performs one step of auto-scroll animation.
   * Checks if pointer is near container edges and scrolls accordingly.
   * Uses RAF for smooth animation and performance optimization.
   *
   * @param timestamp - Current animation timestamp from requestAnimationFrame
   */
  const performScroll = (timestamp: number) => {
    if (!container.value || !point.value || disabled) {
      isScrolling.value = false;
      return;
    }

    // Вычисляем дельту времени
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;

    // Пропускаем кадр если прошло слишком мало времени
    if (deltaTime < frameTime) {
      rafId = requestAnimationFrame(performScroll);
      return;
    }

    // Вычисляем множитель скорости на основе дельты
    const speedMultiplier = deltaTime / frameTime;
    const currentSpeed = speed * speedMultiplier;

    lastTime = timestamp;

    // Обновляем кэш только если изменились размеры или позиция
    const currentScrollTop = container.value.scrollTop;
    const currentScrollLeft = container.value.scrollLeft;

    if (
      !lastRect ||
      lastScrollTop !== currentScrollTop ||
      lastScrollLeft !== currentScrollLeft
    ) {
      lastRect = container.value.getBoundingClientRect();
      lastScrollTop = currentScrollTop;
      lastScrollLeft = currentScrollLeft;
    }

    let needsScroll = false;

    // Используем кэшированные значения и скорректированную скорость
    if (point.value.y - lastRect.top < threshold) {
      container.value.scrollTop = lastScrollTop - currentSpeed;
      needsScroll = true;
    }
    if (lastRect.bottom - point.value.y < threshold) {
      container.value.scrollTop = lastScrollTop + currentSpeed;
      needsScroll = true;
    }

    if (point.value.x - lastRect.left < threshold) {
      container.value.scrollLeft = lastScrollLeft - currentSpeed;
      needsScroll = true;
    }
    if (lastRect.right - point.value.x < threshold) {
      container.value.scrollLeft = lastScrollLeft + currentSpeed;
      needsScroll = true;
    }

    isScrolling.value = needsScroll;

    if (needsScroll) {
      rafId = requestAnimationFrame(performScroll);
    }
  };

  /**
   * Stops auto-scroll animation and resets all cached values.
   * Called when pointer leaves container or component is disabled.
   */
  const stopScroll = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    lastRect = null;
    lastScrollTop = 0;
    lastScrollLeft = 0;
    lastTime = null;
    isScrolling.value = false;
  };

  // Start/stop scrolling when pointer position changes
  watch(point, (newPoint) => {
    if (newPoint) {
      if (rafId) cancelAnimationFrame(rafId);
      lastTime = null;
      performScroll(performance.now());
    } else {
      stopScroll();
    }
  });

  // Stop scrolling when disabled
  watch(
    () => disabled,
    (isDisabled) => {
      if (isDisabled) {
        stopScroll();
      }
    }
  );

  return {
    isScrolling,
  };
};
