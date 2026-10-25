import { describe, expect, it } from 'vitest';
import type { Rect } from '../types';
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

  it("keeps a multi-drag 'group' block in gaps inside it or at its edges, moves it in gaps beyond", () => {
    // 40px items, 10px gaps: k0 | m1 S m3 | k4 k5 — the block (m1, S, m3) counts once, at index 1.
    const keys = ['k0', 'm1', 'S', 'm3', 'k4', 'k5'];
    const block: Record<string, -1 | 1 | undefined> = { m1: -1, m3: 1 };
    const indexes = [0, 1, 1, 1, 2, 3];
    const gapped: ProjectionItem[] = keys.map((key, i) => ({
      key,
      index: indexes[i]!,
      rect: createRect(0, i * 50, 100, 40),
      ...(block[key] && { side: block[key] }),
    }));
    const project = (y: number) =>
      projectIndex({ strategy: 'vertical', pointer: { x: 50, y }, items: gapped, activeKey: 'S', activeIndex: 1, length: 4, lock: null })
        .index;
    // Between k0 and m1, m1 and S, S and m3, m3 and k4: next to the block.
    for (const y of [45, 95, 145, 195]) expect(project(y), `gap at ${y}`).toBeNull();
    // Between k4 and k5: past k4's center, so the block goes after k4.
    expect(project(245)).toBe(2);
  });

  it('a block never steps past an item you can drop into ahead of the pointer', () => {
    // 40px rows: k0 | m1 S | k3 — the block (m1, S) counts once, at index 1.
    const rows: ProjectionItem[] = ['k0', 'm1', 'S', 'k3'].map((key, i) => ({
      key,
      index: [0, 1, 1, 2][i]!,
      rect: createRect(0, i * 40, 100, 40),
      ...(key === 'm1' && { side: -1 as const }),
    }));
    const project = (targets?: Map<string, Rect>) =>
      projectIndex({
        strategy: 'vertical',
        pointer: { x: 50, y: 50 },
        items: rows,
        activeKey: 'S',
        activeIndex: 1,
        length: 3,
        lock: null,
        targets,
      }).index;
    // The pointer is over m1, the block's leading member: it steps past k0...
    expect(project()).toBe(0);
    // ...unless k0 takes the drag: the pointer has to get there itself.
    expect(project(new Map([['k0', createRect(0, 10, 100, 20)]]))).toBeNull();
  });

  it("nothing moves while the pointer is in a target item's middle band", () => {
    // k1 (40–80) can be dropped into; its middle is 50–70. The hit test may miss it (a
    // sibling still sliding over it): the list must not sort past it there.
    const targets = new Map([['k1', createRect(0, 50, 100, 20)]]);
    const project = (y: number) =>
      projectIndex({ strategy: 'vertical', pointer: { x: 50, y }, items, activeKey: 'k0', activeIndex: 0, length: 4, lock: null, targets })
        .index;
    expect(project(65)).toBeNull();
    // Its far edge: past it, as usual.
    expect(project(75)).toBe(1);
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

  describe('cells holding a drop target (drop into an item)', () => {
    // a b c d in one row, 100px each; c can be dropped into (its middle is 225–275): its edges sort.
    const row = ['a', 'b', 'c', 'd'].map((key, index) => cell(key, index, index * 100, 0));
    const targets = new Map([['c', createRect(225, 0, 50, 100)]]);
    const project = (activeKey: string, x: number, lock: string | null = null) =>
      projectIndex({
        strategy: 'grid',
        pointer: { x, y: 50 },
        items: row,
        activeKey,
        activeIndex: row.findIndex((item) => item.key === activeKey),
        length: 4,
        lock,
        targets,
      });

    it('go before or after the cell by its halves instead of taking it', () => {
      // a over c's left edge: right before c (index 1), c stays where it is.
      expect(project('a', 210)).toEqual({ index: 1, lock: null, key: 'c' });
      // Its right edge: after c.
      expect(project('a', 290)).toEqual({ index: 2, lock: null, key: 'c' });
      // From the other side.
      expect(project('d', 210)).toEqual({ index: 2, lock: null, key: 'c' });
      expect(project('b', 290)).toEqual({ index: 2, lock: null, key: 'c' });
    });

    it('already next to the cell on that side: nothing moves, so the cell never runs from the pointer', () => {
      expect(project('b', 210)).toEqual({ index: null, lock: null, key: null });
      expect(project('d', 290)).toEqual({ index: null, lock: null, key: null });
    });

    it('nothing moves in its middle band, even past its center', () => {
      expect(project('a', 260)).toEqual({ index: null, lock: null, key: null });
      expect(project('d', 240)).toEqual({ index: null, lock: null, key: null });
    });

    it('other cells keep the grid rule', () => {
      expect(project('a', 350)).toEqual({ index: 3, lock: 'd', key: 'd' });
    });
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

describe("projectIndex: a multi-drag 'group' block moves as one", () => {
  /**
   * A draft collapsed like the group does it: the block counts once, at the slot's index;
   * `sides` tags the members travelling with the slot (`S`).
   */
  const collapsed = (heights: number[], keys: string[], sides: Record<string, -1 | 1> = {}): ProjectionItem[] => {
    let top = 0;
    let index = -1;
    return heights.map((height, i) => {
      const key = keys[i]!;
      const side = sides[key];
      const inBlock = key === 'S' || side !== undefined;
      const previous = keys[i - 1];
      const previousInBlock = previous !== undefined && (previous === 'S' || sides[previous] !== undefined);
      if (!inBlock || !previousInBlock) index++;
      const item: ProjectionItem = { key, index, rect: createRect(0, top, 100, height), ...(side && { side }) };
      top += height;
      return item;
    });
  };
  const project = (items: ProjectionItem[], y: number) => {
    const activeIndex = items.find((item) => item.key === 'S')!.index;
    return projectIndex({
      strategy: 'vertical',
      pointer: { x: 50, y },
      items,
      activeKey: 'S',
      activeIndex,
      length: items[items.length - 1]!.index + 1,
      lock: null,
    });
  };
  // k0 | m1 S m3 | k4, 40px each: the block is one unit at index 1 of 3.
  const items = collapsed([40, 40, 40, 40, 40], ['k0', 'm1', 'S', 'm3', 'k4'], { m1: -1, m3: 1 });

  it('keeps the slot while the pointer is on it', () => {
    expect(project(items, 100).index).toBeNull();
  });

  it('steps toward the pointer over a member after the slot, past the next item', () => {
    // After the step k4 starts at the block's top (40): its center (60) is behind the pointer.
    expect(project(items, 130)).toEqual({ index: 2, lock: null, key: 'k4' });
  });

  it('steps back over a member before the slot, past the previous item', () => {
    expect(project(items, 50)).toEqual({ index: 0, lock: null, key: 'k0' });
  });

  it('crosses the neighbour beyond the block like a single item, counting the block once', () => {
    // k4 spans 160-200: past its center the block goes after it.
    expect(project(items, 185)).toEqual({ index: 2, lock: null, key: 'k4' });
    expect(project(items, 175).index).toBeNull();
  });

  it('stays at the end of the list when there is nothing to step past', () => {
    const last = collapsed([40, 40, 40], ['k0', 'S', 'm2'], { m2: 1 });
    expect(project(last, 100).index).toBeNull();
  });

  it('does not step past a taller neighbour that would swap straight back', () => {
    // S m1 | N (200px): after a step N would start at 0, its center (100) still ahead of the pointer.
    const tall = collapsed([40, 40, 200], ['S', 'm1', 'N'], { m1: 1 });
    expect(project(tall, 60).index).toBeNull();
    // Past N's center the usual crossing rule moves the block, counted as one item.
    expect(project(tall, 190)).toEqual({ index: 1, lock: null, key: 'N' });
  });

  it('steps a grid block toward the pointer unless the neighbour would land under it', () => {
    const cell = (key: string, index: number, x: number, y: number, side?: -1 | 1): ProjectionItem => ({
      key,
      index,
      rect: createRect(x, y, 100, 100),
      ...(side && { side }),
    });
    // Three columns: a | S m | b c d. The block (S, m) is index 1.
    const grid = [cell('a', 0, 0, 0), cell('S', 1, 100, 0), cell('m', 1, 200, 0, 1), cell('b', 2, 0, 100), cell('c', 3, 100, 100)];
    const step = (x: number, y: number) =>
      projectIndex({ strategy: 'grid', pointer: { x, y }, items: grid, activeKey: 'S', activeIndex: 1, length: 4, lock: null });
    // Over m: b would take S's cell (100, 0), away from the pointer.
    expect(step(250, 50)).toEqual({ index: 2, lock: null, key: 'b' });
    expect(step(150, 50).index).toBeNull();
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
