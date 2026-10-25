import { describe, expect, it } from 'vitest';
import type { Key } from '../types';
import { changedRun, patchIndexMap } from './draft';

const indexMap = (keys: readonly Key[]) => new Map(keys.map((key, index) => [key, index]));

const move = (keys: readonly Key[], from: number, to: number) => {
  const next = [...keys];
  next.splice(to, 0, ...next.splice(from, 1));
  return next;
};

const keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

describe('changedRun', () => {
  it('covers the keys a move passes', () => {
    expect(changedRun(keys, move(keys, 2, 5))).toEqual({ start: 2, end: 6, nextEnd: 6 });
    expect(changedRun(keys, move(keys, 5, 2))).toEqual({ start: 2, end: 6, nextEnd: 6 });
  });

  it('is empty for the same order', () => {
    expect(changedRun(keys, [...keys])).toEqual({ start: 8, end: 8, nextEnd: 8 });
    expect(changedRun([], [])).toEqual({ start: 0, end: 0, nextEnd: 0 });
  });

  it('reaches the end when the length changes', () => {
    expect(changedRun(keys, ['a', 'b', 'x', ...keys.slice(2)])).toEqual({ start: 2, end: 8, nextEnd: 9 });
    expect(changedRun(keys, keys.filter((key) => key !== 'g'))).toEqual({ start: 6, end: 8, nextEnd: 7 });
    expect(changedRun(keys, [])).toEqual({ start: 0, end: 8, nextEnd: 0 });
  });
});

describe('patchIndexMap', () => {
  const patched = (previous: readonly Key[], next: readonly Key[]) => {
    const map = indexMap(previous);
    return patchIndexMap(map, previous, next) ? map : null;
  };

  it('turns the map of a list into the map of its next order', () => {
    const many = Array.from({ length: 40 }, (_, index) => `k${index}`);
    const next = [
      move(many, 3, 9),
      move(many, 30, 25),
      ['x', ...many.slice(0, 39)],
      many.filter((key) => key !== 'k35'),
      [...many.slice(0, 20), 'y', 'z', ...many.slice(20)],
    ];
    for (const order of next) {
      const map = patched(many, order);
      if (map) expect([...map].sort()).toEqual([...indexMap(order)].sort());
    }
    // Moves and changes near the end are patched, not rebuilt.
    expect(patched(many, next[0]!)).not.toBeNull();
    expect(patched(many, next[3]!)).not.toBeNull();
  });

  it('leaves the map alone when most of the list changed', () => {
    const map = indexMap(keys);
    expect(patchIndexMap(map, keys, ['x', ...keys])).toBe(false);
    expect(map).toEqual(indexMap(keys));
  });

  it('drops keys that left and takes keys that came', () => {
    const many = Array.from({ length: 20 }, (_, index) => index);
    const next = [...many.slice(0, 15), 99, ...many.slice(16)];
    const map = patched(many, next)!;
    expect(map.has(15)).toBe(false);
    expect(map.get(99)).toBe(15);
    expect(map.size).toBe(20);
  });
});
