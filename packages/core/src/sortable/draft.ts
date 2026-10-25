/**
 * A draft change usually moves a few keys (a reorder), so what is derived from a draft
 * (the key → index map, the rendered items) is patched over the changed run instead of
 * rebuilt: with 50k rows a rebuild per reorder costs more than a frame.
 */

import type { Key } from '../types';

/** `previous[start, end)` became `next[start, nextEnd)`; the rest matches position by position. */
export interface ChangedRun {
  start: number;
  end: number;
  nextEnd: number;
}

/**
 * The run where `next` differs from `previous`. When their lengths differ every later
 * index shifts, so the run reaches the end of both.
 */
export const changedRun = (previous: readonly Key[], next: readonly Key[]): ChangedRun => {
  const shared = Math.min(previous.length, next.length);
  let start = 0;
  while (start < shared && previous[start] === next[start]) start++;
  let end = previous.length;
  let nextEnd = next.length;
  if (end === nextEnd) {
    while (end > start && previous[end - 1] === next[end - 1]) {
      end--;
      nextEnd--;
    }
  }
  return { start, end, nextEnd };
};

/**
 * Turns `map` (key → index in `previous`) into the map of `next`, if their changed run
 * is at most half of `next`; `false` when building a new map is cheaper.
 */
export const patchIndexMap = (map: Map<Key, number>, previous: readonly Key[], next: readonly Key[]): boolean => {
  const { start, end, nextEnd } = changedRun(previous, next);
  if (nextEnd - start > next.length / 2) return false;
  for (let index = start; index < end; index++) map.delete(previous[index]!);
  for (let index = start; index < nextEnd; index++) map.set(next[index]!, index);
  return true;
};
