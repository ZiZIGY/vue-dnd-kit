/**
 * Where the tab moves an item of a sortable list: its buttons (up, down, to the start, to
 * the end, to another list). Read from the provider's snapshot when the move's turn
 * comes (`drive.ts` runs the moves).
 */

import type { Key, SortablePosition } from '@vue-dnd-kit/core';
import type { ProviderSnapshot } from '@vue-dnd-kit/core/devtools';
import type { MoveTo } from '../protocol';

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

/** Moves of the tab's buttons (`moveItem` clamps the index to the list). */
export const MOVES = {
  up: ({ index }) => ({ index: index - 1 }),
  down: ({ index }) => ({ index: index + 1 }),
  start: () => ({ index: 0 }),
  end: () => ({}),
} satisfies Record<string, MoveTarget>;

/** The move a command asks for. */
export const moveTarget = (to: MoveTo): MoveTarget =>
  typeof to === 'string' ? MOVES[to] : () => (to.index === undefined ? { list: to.list } : { list: to.list, index: to.index });

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
