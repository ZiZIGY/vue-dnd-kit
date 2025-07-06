export const createDnDObservers = (
  visibleZones: Set<HTMLElement | Element>,
  visibleElements: Set<HTMLElement | Element>
) => {
  const hasIntersectionObserver =
    typeof window !== 'undefined' && 'IntersectionObserver' in window;

  const elementObserver = hasIntersectionObserver
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) =>
          visibleElements[entry.isIntersecting ? 'add' : 'delete'](entry.target)
        );
      })
    : null;

  const zoneObserver = hasIntersectionObserver
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) =>
          visibleZones[entry.isIntersecting ? 'add' : 'delete'](entry.target)
        );
      })
    : null;

  const observeElement = (
    action: 'add' | 'remove',
    element: HTMLElement | Element
  ) => {
    if (!elementObserver) return;

    if (action === 'add') {
      elementObserver.observe(element);
    } else {
      elementObserver.unobserve(element);
      visibleElements.delete(element);
    }
  };

  const observeZone = (
    action: 'add' | 'remove',
    element: HTMLElement | Element
  ) => {
    if (!zoneObserver) return;

    if (action === 'add') {
      zoneObserver.observe(element);
    } else {
      zoneObserver.unobserve(element);
      visibleZones.delete(element);
    }
  };

  return {
    observeElement,
    observeZone,
  };
};
