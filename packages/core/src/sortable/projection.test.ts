import { describe, expect, it } from 'vitest';
import { createRect } from '../animation/layout';
import { projectIndex, projectIndicator, type ProjectionItem } from './projection';

/** Vertical stack of items with the given heights, starting at y = 0. */
const column = (heights: number[], keys = heights.map((_, i) => `k${i}`)): ProjectionItem[] => {
  let top = 0;
  return heights.map((height, index) => {
    const item = { key: keys[index]!, index, rect: createRect(0, top, 100, height) };
    top += height;
    return item;
  });
};

const vertical = (items: ProjectionItem[], activeIndex: number, y: number, x = 50) =>
  projectIndex({
    strategy: 'vertical',
    pointer: { x, y },
    items,
    activeKey: activeIndex >= 0 ? items[activeIndex]!.key : 'external',
    activeIndex,
    length: items.length,
    lock: null,
  }).index;

describe('projectIndex: vertical lists', () => {
  const items = column([40, 40, 40, 40]);

  it('moves down only after crossing the neighbour center', () => {
    expect(vertical(items, 0, 50)).toBeNull();
    expect(vertical(items, 0, 70)).toBe(1);
    expect(vertical(items, 0, 150)).toBe(3);
  });

  it('moves up only after crossing the neighbour center', () => {
    expect(vertical(items, 2, 70)).toBeNull();
    expect(vertical(items, 2, 50)).toBe(1);
  });

  it('keeps the slot while the pointer is over the active item', () => {
    expect(vertical(items, 1, 60)).toBeNull();
  });

  it('does not swap back with a taller neighbour (no oscillation)', () => {
    // A (40px) is dragged below B (200px).
    expect(vertical(column([40, 200], ['A', 'B']), 0, 141)).toBe(1);
    // After the move B sits on top; the pointer is above B's new center.
    const moved = column([200, 40], ['B', 'A']);
    expect(vertical(moved, 1, 141)).toBeNull();
  });

  it('keeps sorting while the pointer drifts sideways (band hit)', () => {
    expect(vertical(items, 0, 70, 400)).toBe(1);
  });

  it('moves to the end below the last item, and keeps the slot in gaps', () => {
    expect(vertical(items, 0, 500)).toBe(3);
    const gapped = items.map((item, index) => ({
      ...item,
      rect: createRect(0, index * 50, 100, 40),
    }));
    expect(vertical(gapped, 0, 45)).toBeNull();
  });

  it('inserts an item from another list before or after the hovered one', () => {
    expect(vertical(items, -1, 45)).toBe(1);
    expect(vertical(items, -1, 75)).toBe(2);
    expect(vertical(items, -1, 500)).toBe(4);
    expect(vertical([], -1, 10)).toBe(0);
  });
});

describe('projectIndex: grids', () => {
  const cell = (key: string, index: number, x: number, y: number): ProjectionItem => ({
    key,
    index,
    rect: createRect(x, y, 100, 100),
  });
  const grid = [cell('a', 0, 0, 0), cell('b', 1, 100, 0), cell('c', 2, 0, 100), cell('d', 3, 100, 100)];
  const project = (pointer: { x: number; y: number }, lock: string | null = null) =>
    projectIndex({ strategy: 'grid', pointer, items: grid, activeKey: 'a', activeIndex: 0, length: 4, lock });

  it('moves to the hovered cell and locks it', () => {
    expect(project({ x: 150, y: 150 })).toEqual({ index: 3, lock: 'd' });
  });

  it('ignores the locked cell until the pointer leaves it', () => {
    expect(project({ x: 150, y: 150 }, 'd')).toEqual({ index: null, lock: 'd' });
    expect(project({ x: 150, y: 50 }, 'd')).toEqual({ index: 1, lock: 'b' });
  });
});

describe('projectIndicator', () => {
  const items = column([40, 40, 40]);
  const indicator = (y: number) =>
    projectIndicator({ strategy: 'vertical', pointer: { x: 50, y }, items, activeKey: 'k0', length: 3 });

  it('splits the hovered item into before and after halves', () => {
    expect(indicator(45)).toEqual({ index: 1, key: 'k1', side: 'before' });
    expect(indicator(75)).toEqual({ index: 2, key: 'k1', side: 'after' });
  });

  it('shows nothing over the active item and keeps the previous value in gaps', () => {
    expect(indicator(20)).toBeNull();
    const gapped = items.map((item, index) => ({ ...item, rect: createRect(0, index * 50, 100, 40) }));
    expect(
      projectIndicator({ strategy: 'vertical', pointer: { x: 50, y: 45 }, items: gapped, activeKey: 'k0', length: 3 }),
    ).toBeUndefined();
  });
});
