import type { Announcements } from '../types';

export const DEFAULT_INSTRUCTIONS =
  'To pick up a draggable item, press space or enter. While dragging, use the arrow keys to move the item. Press space or enter again to drop the item in its new position, or press escape to cancel.';

export const defaultAnnouncements: Announcements = {
  onDragStart: ({ active }) => `Picked up draggable item ${active.id}.`,
  onDragOver: ({ active, over }) =>
    over
      ? `Draggable item ${active.id} was moved over droppable area ${over.id}.`
      : `Draggable item ${active.id} is no longer over a droppable area.`,
  onDragEnd: ({ active, over }) =>
    over
      ? `Draggable item ${active.id} was dropped over droppable area ${over.id}.`
      : `Draggable item ${active.id} was dropped.`,
  onDragCancel: ({ active }) =>
    `Dragging was cancelled. Draggable item ${active.id} was dropped.`,
};

export const VISUALLY_HIDDEN = {
  position: 'fixed',
  width: '1px',
  height: '1px',
  margin: '-1px',
  padding: '0',
  border: '0',
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(100%)',
  whiteSpace: 'nowrap',
} as const;
