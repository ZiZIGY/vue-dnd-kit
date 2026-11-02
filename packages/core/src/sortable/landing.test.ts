import { afterEach, describe, expect, it } from 'vitest';
import type { DnDEvent, SortableStrategy } from '../types';
import { createRect } from '../animation/layout';
import type { GroupContext } from './context';
import type { ListEntry } from './entry';
import { inView } from './landing';

/** A list whose shown part is 100–400px down the page (its scroller clips the rest). */
const VIEW = createRect(0, 100, 200, 300);

const setUp = (strategy: SortableStrategy) => {
  const element = document.body.appendChild(document.createElement('ul'));
  const g = { manager: { measureVisible: () => VIEW } } as unknown as GroupContext;
  const list = { strategy: () => strategy, getElement: () => element } as unknown as ListEntry;
  return { g, list };
};

const at = (x: number, y: number, sensor: 'pointer' | 'keyboard' = 'pointer') =>
  ({ pointer: { x, y }, active: { sensor } }) as unknown as DnDEvent;

describe('inView: the point a list projects, within the part of it that shows', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('past the edge of a scrolled list, it is at the edge: auto-scroll brings the items past it', () => {
    const { g, list } = setUp('vertical');
    expect(inView(g, list, at(50, 700)).pointer).toEqual({ x: 50, y: 399 });
    expect(inView(g, list, at(50, 20)).pointer).toEqual({ x: 50, y: 101 });
    // Inside, and across the axis, nothing changes.
    const inside = at(900, 250);
    expect(inView(g, list, inside)).toBe(inside);
  });

  it('along the axis of a horizontal list; grids and keyboard drags keep theirs', () => {
    expect(inView(setUp('horizontal').g, setUp('horizontal').list, at(-40, 900)).pointer).toEqual({ x: 1, y: 900 });
    const grid = setUp('grid');
    const past = at(50, 700);
    expect(inView(grid.g, grid.list, past)).toBe(past);
    const vertical = setUp('vertical');
    const key = at(50, 700, 'keyboard');
    expect(inView(vertical.g, vertical.list, key)).toBe(key);
  });
});
