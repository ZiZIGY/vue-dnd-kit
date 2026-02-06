/**
 * Creates an IntersectionObserver that manages a Set of visible elements
 * 
 * @param targetSet - Set to add/remove elements
 * @returns Object with observe/unobserve/disconnect methods
 * 
 * @example
 * const visibleElements = new Set<HTMLElement>();
 * const observer = createObserver(visibleElements);
 * 
 * observer.observe(element);
 * observer.unobserve(element);
 * observer.disconnect();
 */
export const createObserver = (targetSet: Set<HTMLElement>) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const element = entry.target as HTMLElement;
      targetSet[entry.isIntersecting ? 'add' : 'delete'](element);
      
    });
  });

  return observer;
};
