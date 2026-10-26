/**
 * Where the inspector moves an item of a sortable list: its buttons (up, down, to the
 * start, to the end) and the edits of its `position`. Read from the provider's snapshot
 * when the move's turn comes (`drive.ts` runs the moves).
 */

import type { Key, SortablePosition } from '@vue-dnd-kit/core';
import type { ProviderSnapshot } from '@vue-dnd-kit/core/devtools';

/** Where an item of a sortable list is. */
export interface ItemPosition {
  list: Key;
  /** Its index in the list's items (where `moveItem` would leave it). */
  index: number;
  /** Items in the list, the item included. */
  count: number;
}

/** Where `id` is, when it is an item of a sortable list (trees place items by depth too: not them). */
export const positionOf = (snapshot: ProviderSnapshot, id: Key): ItemPosition | null => {
  for (const group of snapshot.groups) {
    for (const list of group.lists) {
      const index = list.kind === 'list' ? list.keys.indexOf(id) : -1;
      if (index !== -1) return { list: list.id, index, count: list.count };
    }
  }
  return null;
};

/** Where to move an item, from where it is when its turn comes. */
export type MoveTarget = (current: ItemPosition) => SortablePosition;

/** Moves of the inspector's buttons (`moveItem` clamps the index to the list). */
export const MOVES = {
  up: ({ index }) => ({ index: index - 1 }),
  down: ({ index }) => ({ index: index + 1 }),
  start: () => ({ index: 0 }),
  end: () => ({}),
} satisfies Record<string, MoveTarget>;

/** `to` leaves the item where it is (no drag for it). */
const unchanged = (current: ItemPosition, to: SortablePosition): boolean =>
  (to.list ?? current.list) === current.list &&
  Math.min(Math.max(to.index ?? current.count - 1, 0), current.count - 1) === current.index;

/** Where `target` moves the item `id`, from where the snapshot has it; `null`: nowhere (not an item of a list, or already there). */
export const resolveMove = (snapshot: ProviderSnapshot, id: Key, target: MoveTarget): SortablePosition | null => {
  const current = positionOf(snapshot, id);
  if (!current) return null;
  const to = target(current);
  return unchanged(current, to) ? null : to;
};

const isKey = (value: unknown): value is Key => typeof value === 'string' || typeof value === 'number';
const isIndex = (value: unknown): value is number => typeof value === 'number' && Number.isInteger(value);

/**
 * The move an edit of an item's `position` (`{ list, index }`) asks for: the whole object
 * (`path` is `['position']`), or one of its fields (`['position', 'list' | 'index']`, the
 * other one kept). `null` for anything else (a removed or added field, a wrong value).
 */
export const editedMove = (path: string | readonly string[], value: unknown): MoveTarget | null => {
  const [head, field] = typeof path === 'string' ? [path] : path;
  if (head !== 'position') return null;
  if (field === 'index') return isIndex(value) ? () => ({ index: value }) : null;
  if (field === 'list') return isKey(value) ? ({ index }) => ({ list: value, index }) : null;
  if (field !== undefined || typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const { list, index } = value as { list?: unknown; index?: unknown };
  if ((list !== undefined && !isKey(list)) || (index !== undefined && !isIndex(index))) return null;
  return () => ({ ...(list !== undefined ? { list } : {}), ...(index !== undefined ? { index } : {}) });
};
