import { preventEvent } from './events';

export const setupDnDAttributes = (
  element: HTMLElement,
  type: 'draggable' | 'droppable'
) => {
  if (type === 'draggable') {
    element.setAttribute('draggable', 'false');
    element.setAttribute('data-dnd-draggable', 'true');

    element.addEventListener('dragstart', preventEvent);
    element.addEventListener('dragend', preventEvent);
    element.addEventListener('dragenter', preventEvent);
    element.addEventListener('dragleave', preventEvent);
    element.addEventListener('dragover', preventEvent);
  } else element.setAttribute('data-dnd-droppable', 'true');
};
