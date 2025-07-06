export const preventEvent = (event: Event) => {
  event.preventDefault();
};

export const disableInteractions = (originalUserSelect: string) => {
  const body = document.body;

  originalUserSelect = body.style.userSelect;

  body.style.userSelect = 'none';

  window.addEventListener('contextmenu', preventEvent);
  window.addEventListener('selectstart', preventEvent);
  window.addEventListener('touchstart', preventEvent);
  window.addEventListener('touchmove', preventEvent);
};

export const enableInteractions = (
  originalUserSelect: string,
  originalTouchAction: string,
  originalOverscrollBehavior: string
) => {
  const body = document.body;

  body.style.userSelect = originalUserSelect;
  body.style.touchAction = originalTouchAction;
  body.style.overscrollBehavior = originalOverscrollBehavior;

  window.removeEventListener('contextmenu', preventEvent);
  window.removeEventListener('selectstart', preventEvent);
  window.removeEventListener('touchstart', preventEvent);
  window.removeEventListener('touchmove', preventEvent);
};
