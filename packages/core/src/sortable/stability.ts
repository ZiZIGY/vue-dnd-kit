/**
 * Guards against oscillation (rfcs/0001-v3.md §6). The draft order changes the
 * layout under a still pointer, so a move can make another move look valid.
 * Pure helpers: the group keeps the state in its session.
 */

import type { Coordinates, Key } from '../types';

/** Pixels the pointer must travel before a key the slot just passed can trigger again. */
export const HYSTERESIS = 10;

/** Most keys remembered per move; a fast drag past more of them can't come back in 10px anyway. */
const MAX_KEYS = 64;

export interface Hysteresis {
  /** Keys whose position the last move changed. */
  keys: ReadonlySet<Key>;
  /** List the slot just left (cross-list moves). */
  list: Key | null;
  /** Pointer position at the move. */
  at: Coordinates;
}

export const distance = (a: Coordinates, b: Coordinates): number => Math.hypot(a.x - b.x, a.y - b.y);

/** Keys that change index when the item at `from` moves to `to` (same list). */
export const passedKeys = (keys: readonly Key[], from: number, to: number): Set<Key> => {
  const result = new Set<Key>();
  const [start, end] = from < to ? [from + 1, to] : [to, from - 1];
  for (let index = start; index <= end && result.size < MAX_KEYS; index++) {
    const key = keys[index];
    if (key !== undefined) result.add(key);
  }
  return result;
};

/** Neighbours of an insertion point: the keys a cross-list entry slides past. */
export const neighbourKeys = (keys: readonly Key[], index: number): Set<Key> => {
  const result = new Set<Key>();
  for (const key of [keys[index - 1], keys[index]]) if (key !== undefined) result.add(key);
  return result;
};

/** Keeps the hysteresis while the pointer stays within `HYSTERESIS` px of the move. */
export const settleHysteresis = (
  hysteresis: Hysteresis | null,
  pointer: Coordinates,
): Hysteresis | null =>
  hysteresis && distance(pointer, hysteresis.at) < HYSTERESIS ? hysteresis : null;

export const blocksKey = (hysteresis: Hysteresis | null, key: Key | null | undefined): boolean =>
  !!hysteresis && key != null && hysteresis.keys.has(key);

export const blocksList = (hysteresis: Hysteresis | null, list: Key): boolean =>
  !!hysteresis && hysteresis.list === list;
