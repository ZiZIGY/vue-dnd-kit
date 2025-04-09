export const isDescendant = (
  element: HTMLElement | null,
  container: HTMLElement
): boolean => {
  if (!element) return false;
  return container.contains(element);
};
