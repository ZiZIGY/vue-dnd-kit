/**
 * Observers — IntersectionObserver (visibility) and ResizeObserver (size)
 */

export interface IObserverWrapper {
  observe: (element: HTMLElement) => void;
  unobserve: (element: HTMLElement) => void;
  disconnect: () => void;
}

/**
 * Creates an IntersectionObserver that manages a Set of visible elements
 *
 * @param targetSet - Set to add/remove elements
 * @returns Object with observe/unobserve/disconnect methods
 */
export const createIntersectionObserver = (targetSet: Set<HTMLElement>): IObserverWrapper => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const element = entry.target as HTMLElement;
      targetSet[entry.isIntersecting ? 'add' : 'delete'](element);
    });
  });

  return {
    observe: (el) => observer.observe(el),
    unobserve: (el) => observer.unobserve(el),
    disconnect: () => observer.disconnect(),
  };
};

/**
 * Creates a ResizeObserver that tracks element size and writes to target ref
 *
 * @param target - Ref to write { width, height } on resize
 * @returns Object with observe/unobserve/disconnect methods
 */
export const createSizeObserver = (
  target: { value: { width: number; height: number } | null }
): IObserverWrapper => {
  const observer = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;
    const { width, height } = entry.contentRect;
    target.value = { width, height };
  });

  return {
    observe: (el) => observer.observe(el),
    unobserve: (el) => observer.unobserve(el),
    disconnect: () => observer.disconnect(),
  };
};
