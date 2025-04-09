import { preventEvent } from '../utils/events';

export const useInteractionManager = () => {
  let originalUserSelect = '';
  let originalTouchAction = '';
  let originalOverscrollBehavior = '';

  const disableInteractions = () => {
    const body = document.body;

    originalUserSelect = body.style.userSelect;

    body.style.userSelect = 'none';

    window.addEventListener('contextmenu', preventEvent);
    window.addEventListener('selectstart', preventEvent);
    window.addEventListener('touchstart', preventEvent);
    window.addEventListener('touchmove', preventEvent);
  };

  const enableInteractions = () => {
    const body = document.body;

    body.style.userSelect = originalUserSelect;
    body.style.touchAction = originalTouchAction;
    body.style.overscrollBehavior = originalOverscrollBehavior;

    window.removeEventListener('contextmenu', preventEvent);
    window.removeEventListener('selectstart', preventEvent);
    window.removeEventListener('touchstart', preventEvent);
    window.removeEventListener('touchmove', preventEvent);
  };

  return {
    disableInteractions,
    enableInteractions,
  };
};
