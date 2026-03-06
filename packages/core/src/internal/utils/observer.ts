/**
 * Observers — IntersectionObserver (visibility)
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
export const createIntersectionObserver = (
  targetSet: Set<HTMLElement>
): IObserverWrapper => {
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

