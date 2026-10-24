import { describe, expect, it } from 'vitest';
import type { CollisionArgs, CollisionCandidate, Key } from '../types';
import { createRect } from '../animation/layout';
import {
  HYSTERESIS,
  closestCenter,
  closestCorners,
  createTargetStabilizer,
  pointerFirst,
  pointerWithin,
  rectIntersection,
  type StabilizeContext,
} from './collision';

const candidate = (
  id: Key,
  [left, top, width, height]: [number, number, number, number],
  priority = 0,
  depth?: number,
): CollisionCandidate => ({ id, rect: createRect(left, top, width, height), priority, depth });

const args = (overrides: Partial<CollisionArgs>): CollisionArgs => ({
  pointer: { x: 0, y: 0 },
  overlayRect: null,
  candidates: [],
  hits: [],
  ...overrides,
});

describe('collision detection', () => {
  it('pointerWithin returns the hit-test result as is', () => {
    expect(pointerWithin(args({ hits: ['inner', 'outer'] }))).toEqual(['inner', 'outer']);
  });

  it('rectIntersection ranks overlapping targets by overlap', () => {
    const candidates = [
      candidate('far', [500, 500, 100, 100]),
      candidate('half', [50, 0, 100, 100]),
      candidate('full', [0, 0, 100, 100]),
    ];
    const result = rectIntersection(args({ overlayRect: createRect(0, 0, 100, 100), candidates }));
    expect(result).toEqual(['full', 'half']);
    expect(rectIntersection(args({ candidates }))).toEqual([]);
  });

  it('rectIntersection prefers priority, then nesting depth, over overlap', () => {
    const overlayRect = createRect(0, 0, 100, 100);
    const nested = [
      candidate('outer', [0, 0, 100, 100], 0, 0),
      candidate('inner', [80, 80, 100, 100], 0, 1),
    ];
    expect(rectIntersection(args({ overlayRect, candidates: nested }))).toEqual(['inner', 'outer']);
    const prioritized = [...nested, candidate('trash', [90, 90, 50, 50], 5, 0)];
    expect(rectIntersection(args({ overlayRect, candidates: prioritized }))[0]).toBe('trash');
  });

  it('closestCenter sorts every target by distance to the overlay center, or the pointer', () => {
    const candidates = [candidate('b', [200, 0, 50, 50]), candidate('a', [0, 0, 50, 50])];
    expect(closestCenter(args({ overlayRect: createRect(10, 0, 50, 50), candidates }))).toEqual(['a', 'b']);
    expect(closestCenter(args({ pointer: { x: 220, y: 20 }, candidates }))).toEqual(['b', 'a']);
  });

  it('closestCorners sorts by summed corner distance', () => {
    const candidates = [candidate('wide', [0, 0, 300, 50]), candidate('match', [0, 60, 100, 50])];
    expect(closestCorners(args({ overlayRect: createRect(0, 55, 100, 50), candidates }))).toEqual([
      'match',
      'wide',
    ]);
  });

  it('pointerFirst falls back to the overlap only when nothing is under the pointer', () => {
    const candidates = [candidate('zone', [0, 0, 100, 100])];
    const overlayRect = createRect(50, 50, 100, 100);
    expect(pointerFirst(args({ hits: ['other'], overlayRect, candidates }))).toEqual(['other']);
    expect(pointerFirst(args({ overlayRect, candidates }))).toEqual(['zone']);
  });
});

describe('target stabilizer', () => {
  const resolve = (
    stabilizer: ReturnType<typeof createTargetStabilizer>,
    context: Partial<StabilizeContext> & Pick<StabilizeContext, 'previous' | 'next'>,
  ) =>
    stabilizer.resolve({
      pointer: { x: 0, y: 0 },
      isValid: () => true,
      isGap: () => false,
      ...context,
    });

  it('keeps the current target while the pointer jitters back into the one it left', () => {
    const stabilizer = createTargetStabilizer();
    expect(resolve(stabilizer, { previous: 'a', next: 'b', pointer: { x: 100, y: 0 } })).toBe('b');
    // Back over `a` within the hysteresis distance.
    expect(resolve(stabilizer, { previous: 'b', next: 'a', pointer: { x: 97, y: 0 } })).toBe('b');
    expect(resolve(stabilizer, { previous: 'b', next: 'a', pointer: { x: 100 - HYSTERESIS + 1, y: 0 } })).toBe('b');
    // Far enough: `a` can win again.
    expect(resolve(stabilizer, { previous: 'b', next: 'a', pointer: { x: 100 - HYSTERESIS, y: 0 } })).toBe('a');
  });

  it('lets the left target win once the pointer moved away, even when it comes back', () => {
    const stabilizer = createTargetStabilizer();
    resolve(stabilizer, { previous: 'a', next: 'b', pointer: { x: 0, y: 0 } });
    expect(resolve(stabilizer, { previous: 'b', next: 'b', pointer: { x: 0, y: 30 } })).toBe('b');
    expect(resolve(stabilizer, { previous: 'b', next: 'a', pointer: { x: 0, y: 2 } })).toBe('a');
  });

  it('applies the hysteresis to leaving every target', () => {
    const stabilizer = createTargetStabilizer();
    expect(resolve(stabilizer, { previous: 'a', next: null, pointer: { x: 0, y: 0 } })).toBeNull();
    expect(resolve(stabilizer, { previous: null, next: 'a', pointer: { x: 3, y: 0 } })).toBeNull();
    expect(resolve(stabilizer, { previous: null, next: 'a', pointer: { x: 12, y: 0 } })).toBe('a');
  });

  it('switches immediately when the current target is gone', () => {
    const stabilizer = createTargetStabilizer();
    resolve(stabilizer, { previous: 'a', next: 'b' });
    expect(resolve(stabilizer, { previous: 'b', next: 'a', isValid: (id) => id !== 'b' })).toBe('a');
  });

  it('has no hysteresis for keyboard input and after a reset', () => {
    const stabilizer = createTargetStabilizer();
    resolve(stabilizer, { previous: 'a', next: 'b' });
    expect(resolve(stabilizer, { previous: 'b', next: 'a', exact: true })).toBe('a');

    resolve(stabilizer, { previous: 'a', next: 'b' });
    stabilizer.reset();
    expect(resolve(stabilizer, { previous: 'b', next: 'a' })).toBe('a');
  });

  it('keeps the last nested target while the pointer is in a gap of its parent', () => {
    const stabilizer = createTargetStabilizer();
    const isGap = (parent: Key, child: Key) => parent === 'outer' && child === 'left';
    expect(resolve(stabilizer, { previous: 'left', next: 'outer', isGap })).toBe('left');
    expect(resolve(stabilizer, { previous: 'left', next: 'right', isGap })).toBe('right');
    // Outside the gap (e.g. the parent's padding): the parent wins.
    expect(resolve(stabilizer, { previous: 'right', next: 'outer', isGap })).toBe('outer');
  });
});
