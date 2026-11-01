import type { Active, Announcements, Over } from '../types';

export const DEFAULT_INSTRUCTIONS =
  'To pick up a draggable item, press space or enter. While dragging, use the arrow keys to move the item. Press space or enter again to drop the item in its new position, or press escape to cancel.';

// What the texts call things: their `label` as written, else a phrase with the id.
const item = (active: Active) => active.label ?? `draggable item ${active.id}`;
const Item = (active: Active) => active.label ?? `Draggable item ${active.id}`;
const area = (over: Over) => over.label ?? `droppable area ${over.id}`;

export const defaultAnnouncements: Announcements = {
  onDragStart: ({ active }) => `Picked up ${item(active)}.`,
  onDragOver: ({ active, over }) =>
    over ? `${Item(active)} was moved over ${area(over)}.` : `${Item(active)} is no longer over a droppable area.`,
  onDragEnd: ({ active, over }) => (over ? `${Item(active)} was dropped over ${area(over)}.` : `${Item(active)} was dropped.`),
  onDragCancel: ({ active }) => `Dragging was cancelled. ${Item(active)} was dropped.`,
  onDragResume: ({ active }) => `${Item(active)} was not dropped. It is still being moved.`,
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
