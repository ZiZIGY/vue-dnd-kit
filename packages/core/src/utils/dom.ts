export const isDescendant = (
  element: HTMLElement | Element | null,
  container: HTMLElement | Element
): boolean => {
  if (!element) return false;
  return container.contains(element);
};
