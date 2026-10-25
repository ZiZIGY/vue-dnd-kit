import { describe, expect, it } from 'vitest';
import { createRect } from '../animation/layout';
import {
  nextRowIndex,
  pickAdjacent,
  projectIndex,
  projectIndicator,
  projectSwap,
  type ProjectionItem,
} from './projection';

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

  it('catches up when the pointer skips items between frames', () => {
    // Moving down from 0, the pointer lands in the upper half of item 3: next to it, before it.
    expect(vertical(items, 0, 125)).toBe(2);
    // Moving up from 3, it lands in the lower half of item 0: right after it.
    expect(vertical(items, 3, 35)).toBe(1);
    // Next to the hovered item already: nothing moves (no oscillation after the catch-up).
    expect(vertical(column([40, 40, 40, 40], ['k0', 'k1', 'A', 'k3']), 2, 125)).toBeNull();
    expect(vertical(column([40, 40, 40, 40], ['k0', 'A', 'k2', 'k3']), 1, 35)).toBeNull();
  });

  it('does not swap back with a taller neighbour (no oscillation)', () => {
    // A (40px) is dragged below B (200px).
    expect(vertical(column([40, 200], ['A', 'B']), 0, 141)).toBe(1);
    // After the move B sits on top; the pointer is above B's new center.
    const moved = column([200, 40], ['B', 'A']);
    expect(vertical(moved, 1, 141)).toBeNull();
  });

  it('lands next to the hovered item when the pointer skipped items in one frame', () => {
    // Down from 0 into the upper half of k3: past k1 and k2, before k3.
    expect(vertical(items, 0, 125)).toBe(2);
    // Up from 3 into the lower half of k0: after k0.
    expect(vertical(items, 3, 30)).toBe(1);
    // Exactly on the next-but-one center: past the neighbour only.
    expect(vertical(items, 0, 100)).toBe(1);
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

  it('puts the slot between two items when the pointer jumped into the gap between them', () => {
    // 40px items, 10px gaps: k0 0-40, k1 50-90, k2 100-140, k3 150-190.
    const gapped = items.map((item, index) => ({ ...item, rect: createRect(0, index * 50, 100, 40) }));
    // Down from k0: the pointer skipped k1's lower half and is in the gap below k1.
    expect(vertical(gapped, 0, 95)).toBe(1);
    // Up from k3: in the gap above k1, past its center.
    expect(vertical(gapped, 3, 45)).toBe(1);
    // A gap next to the active slot changes nothing.
    expect(vertical(gapped, 3, 145)).toBeNull();
    expect(vertical(gapped, 1, 95)).toBeNull();
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
    expect(project({ x: 150, y: 150 })).toEqual({ index: 3, lock: 'd', key: 'd' });
  });

  it('ignores the locked cell until the pointer leaves it', () => {
    expect(project({ x: 150, y: 150 }, 'd')).toEqual({ index: null, lock: 'd', key: null });
    expect(project({ x: 150, y: 50 }, 'd')).toEqual({ index: 1, lock: 'b', key: 'b' });
  });

  it('keeps the slot while the pointer is on the active cell', () => {
    expect(project({ x: 50, y: 50 }, 'b')).toEqual({ index: null, lock: null, key: null });
  });

  it('moves to the end from the empty space after the last cell', () => {
    expect(project({ x: 150, y: 250 })).toEqual({ index: 3, lock: null, key: null });
  });

  it('does not ping-pong between cells of different sizes (masonry)', () => {
    // a (1 column) is dragged onto b, which spans 2 columns.
    const pointer = { x: 150, y: 50 };
    const before = [cell('a', 0, 0, 0), { key: 'b', index: 1, rect: createRect(100, 0, 200, 100) }];
    const first = projectIndex({ strategy: 'grid', pointer, items: before, activeKey: 'a', activeIndex: 0, length: 2, lock: null });
    expect(first).toEqual({ index: 1, lock: 'b', key: 'b' });
    // Reflowed: b now covers columns 1-2 and is still under the pointer.
    const after = [{ key: 'b', index: 0, rect: createRect(0, 0, 200, 100) }, cell('a', 1, 200, 0)];
    const project = (lock: string | null) =>
      projectIndex({ strategy: 'grid', pointer, items: after, activeKey: 'a', activeIndex: 1, length: 2, lock }).index;
    // Without the lock it would move straight back.
    expect(project(null)).toBe(0);
    expect(project(first.lock as string)).toBeNull();
  });
});

describe('projectIndex: horizontal lists', () => {
  const row = [0, 1, 2, 3].map((index) => ({
    key: `h${index}`,
    index,
    rect: createRect(index * 100, 0, 90, 40),
  }));
  const horizontal = (activeIndex: number, x: number, y = 20) =>
    projectIndex({
      strategy: 'horizontal',
      pointer: { x, y },
      items: row,
      activeKey: row[activeIndex]!.key,
      activeIndex,
      length: row.length,
      lock: null,
    }).index;

  it('moves along x after crossing the neighbour center', () => {
    expect(horizontal(0, 120)).toBeNull();
    expect(horizontal(0, 150)).toBe(1);
    expect(horizontal(3, 140)).toBe(1);
  });

  it('keeps sorting when the pointer drifts off the row vertically', () => {
    expect(horizontal(0, 150, 300)).toBe(1);
  });

  it('keeps the slot in the gaps between items', () => {
    expect(horizontal(0, 95)).toBeNull();
  });
});

describe('projectIndex: the active slot is the target after a reorder', () => {
  it('reports the hovered item that triggered the move', () => {
    const items = column([40, 40, 40]);
    const projection = projectIndex({
      strategy: 'vertical',
      pointer: { x: 50, y: 70 },
      items,
      activeKey: 'k0',
      activeIndex: 0,
      length: 3,
      lock: null,
    });
    expect(projection).toEqual({ index: 1, lock: null, key: 'k1' });
  });

  it('does nothing while the pointer is on the active item, even across a band overlap', () => {
    // A wide active item overlapping its neighbour's band must win.
    const items = [
      { key: 'a', index: 0, rect: createRect(0, 0, 100, 60) },
      { key: 'b', index: 1, rect: createRect(0, 50, 100, 40) },
    ];
    const projection = projectIndex({
      strategy: 'vertical',
      pointer: { x: 50, y: 55 },
      items,
      activeKey: 'a',
      activeIndex: 0,
      length: 2,
      lock: null,
    });
    expect(projection.index).toBeNull();
  });
});

describe('projectSwap', () => {
  const items = column([40, 40, 40, 40], ['a', 'b', 'c', 'd']);
  const swap = (y: number, partner: string | null) =>
    projectSwap({ strategy: 'vertical', pointer: { x: 50, y }, items, activeKey: 'a', partner }).partner;

  it('exchanges with the hovered item', () => {
    expect(swap(100, null)).toBe('c');
    expect(swap(140, 'c')).toBe('d');
  });

  it('reverts when the pointer is back over the active item original slot', () => {
    // After swapping a with c, c sits where a was.
    const swapped = column([40, 40, 40, 40], ['c', 'b', 'a', 'd']);
    expect(
      projectSwap({ strategy: 'vertical', pointer: { x: 50, y: 20 }, items: swapped, activeKey: 'a', partner: 'c' })
        .partner,
    ).toBeNull();
  });

  it('keeps the state over the active item and in gaps', () => {
    expect(swap(20, 'c')).toBeUndefined();
    const gapped = items.map((item, index) => ({ ...item, rect: createRect(0, index * 50, 100, 40) }));
    expect(
      projectSwap({ strategy: 'vertical', pointer: { x: 50, y: 45 }, items: gapped, activeKey: 'a', partner: 'c' })
        .partner,
    ).toBeUndefined();
  });
});

describe('keyboard geometry', () => {
  const cell = (key: string, index: number, x: number, y: number, h = 100): ProjectionItem => ({
    key,
    index,
    rect: createRect(x, y, 100, h),
  });

  it('nextRowIndex finds the nearest item by x in the next row', () => {
    const items = [cell('b', 1, 100, 0), cell('c', 2, 200, 0), cell('d', 3, 0, 100), cell('e', 4, 100, 100), cell('f', 5, 200, 100)];
    const active = createRect(100, 0, 100, 100);
    expect(nextRowIndex(items, active, 1)).toBe(4);
    expect(nextRowIndex(items, createRect(200, 100, 100, 100), -1)).toBe(2);
    expect(nextRowIndex(items, createRect(0, 100, 100, 100), 1)).toBeNull();
  });

  it('nextRowIndex takes the closest row in masonry layouts', () => {
    const items = [cell('b', 1, 100, 0, 150), cell('c', 2, 0, 120, 60), cell('d', 3, 100, 160, 60)];
    expect(nextRowIndex(items, createRect(0, 0, 100, 100), 1)).toBe(2);
  });

  it('pickAdjacent picks the closest container in the arrow direction', () => {
    const lists = [
      { id: 'left', rect: createRect(0, 0, 100, 400) },
      { id: 'right', rect: createRect(240, 0, 100, 400) },
      { id: 'far', rect: createRect(360, 0, 100, 400) },
    ];
    const from = createRect(120, 0, 100, 400);
    expect(pickAdjacent(from, lists, { x: 1, y: 0 })?.id).toBe('right');
    expect(pickAdjacent(from, lists, { x: -1, y: 0 })?.id).toBe('left');
    expect(pickAdjacent(from, lists, { x: 0, y: 1 })).toBeNull();
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
