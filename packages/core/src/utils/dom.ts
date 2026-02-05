import type { ComponentPublicInstance } from 'vue';
import type { ICoordinates, TDnDNodeRef } from '../types';

let originalUserSelect = '';
let originalTouchAction = '';
let originalOverscrollBehavior = '';

export const getNode = (node: TDnDNodeRef) => {
  if (!node.value) return null;
  if (node.value instanceof HTMLElement) {
    return node.value;
  } else {
    const component = node.value as ComponentPublicInstance;
    return component.$el as HTMLElement;
  }
};

export const checkIntersection = (rect1: DOMRect, rect2: DOMRect): boolean => {
  const noIntersection =
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom;

  return !noIntersection;
};

export const isNotDirectClick = (
  event: Event,
  container: HTMLElement | null
): boolean => {
  return (
    container !== null &&
    event.target !== container &&
    !container.contains(event.target as Node)
  );
};

export const getAutoScrollDirection = (
  coords: ICoordinates,
  container: HTMLElement,
  threshold: number = 50
): { x: number; y: number } => {
  const rect = container.getBoundingClientRect();

  const distanceFromLeft = coords.x - rect.left;
  const distanceFromRight = rect.right - coords.x;
  const distanceFromTop = coords.y - rect.top;
  const distanceFromBottom = rect.bottom - coords.y;

  let scrollX = 0;
  let scrollY = 0;

  if (distanceFromLeft < threshold && distanceFromLeft > 0) {
    scrollX = -1;
  } else if (distanceFromRight < threshold && distanceFromRight > 0) {
    scrollX = 1;
  }

  if (distanceFromTop < threshold && distanceFromTop > 0) {
    scrollY = -1;
  } else if (distanceFromBottom < threshold && distanceFromBottom > 0) {
    scrollY = 1;
  }

  return { x: scrollX, y: scrollY };
};

export const isClient = () => typeof window !== 'undefined'

export const disableInteractions = () => {
  const body = document.body;

  originalUserSelect = body.style.userSelect;

  body.style.userSelect = 'none';

  window.addEventListener('contextmenu', preventEvent);
  window.addEventListener('selectstart', preventEvent);
  window.addEventListener('touchstart', preventEvent);
  window.addEventListener('touchmove', preventEvent);
};

export const enableInteractions = () => {
  const body = document.body;

  body.style.userSelect = originalUserSelect;
  body.style.touchAction = originalTouchAction;
  body.style.overscrollBehavior = originalOverscrollBehavior;

  window.removeEventListener('contextmenu', preventEvent);
  window.removeEventListener('selectstart', preventEvent);
  window.removeEventListener('touchstart', preventEvent);
  window.removeEventListener('touchmove', preventEvent);
};

export const preventEvent = (event: Event) => event.preventDefault();
