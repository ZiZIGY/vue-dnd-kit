import { describe, expect, it } from 'vitest';
import type { Active, Coordinates, ModifierArgs, Rect } from '../types';
import { createRect, getCenter, getFraction, offsetRect, resizeAround } from '../animation/layout';
import {
  getOverlaySmoothing,
  restrictToHorizontalAxis,
  restrictToParent,
  restrictToVerticalAxis,
  restrictToWindowEdges,
  snapCenterToCursor,
  snapToGrid,
} from './modifiers';

// A 50×30 item at (105, 207) inside a container at (100, 200).
const activeRect = createRect(105, 207, 50, 30);
const container = createRect(100, 200, 400, 300);

const args = (transform: Coordinates, overrides: Partial<ModifierArgs> = {}): ModifierArgs => ({
  transform,
  active: { rect: activeRect } as Active,
  activeRect,
  overlayRect: createRect(
    activeRect.left + transform.x,
    activeRect.top + transform.y,
    activeRect.width,
    activeRect.height,
  ),
  origin: { x: 120, y: 215 },
  containerRect: container,
  containerShift: { x: 0, y: 0 },
  windowRect: createRect(0, 0, 1000, 800),
  over: null,
  ...overrides,
});

/** Overlay top-left relative to the container after a modifier. */
const placed = (offset: Coordinates, rect: Rect = container) => ({
  x: activeRect.left + offset.x - rect.left,
  y: activeRect.top + offset.y - rect.top,
});

describe('snapToGrid', () => {
  it("aligns the overlay's top-left to grid lines from the container by default", () => {
    const snap = snapToGrid(20);
    expect(placed(snap(args({ x: 0, y: 0 })))).toEqual({ x: 0, y: 0 });
    expect(placed(snap(args({ x: 33, y: 47 })))).toEqual({ x: 40, y: 60 });
    expect(placed(snap(args({ x: -18, y: -3 })))).toEqual({ x: -20, y: 0 });
  });

  it("rounds the drag offset with origin: 'delta'", () => {
    const snap = snapToGrid({ x: 20, y: 10, origin: 'delta' });
    expect(snap(args({ x: 33, y: 47 }))).toEqual({ x: 40, y: 50 });
    expect(snap(args({ x: 9, y: 4 }))).toEqual({ x: 0, y: 0 });
  });

  it('falls back to the offset without a container', () => {
    expect(snapToGrid(20)(args({ x: 33, y: 47 }, { containerRect: null }))).toEqual({ x: 40, y: 40 });
  });

  it('leaves an axis with a non-positive size untouched', () => {
    const offset = snapToGrid({ x: 20, y: 0 })(args({ x: 33, y: 47 }));
    expect(placed(offset).x).toBe(40);
    expect(offset.y).toBe(47);
  });

  it('carries a smooth marker for the overlay only when asked to', () => {
    expect(getOverlaySmoothing([snapToGrid(20)])).toBeNull();
    expect(getOverlaySmoothing([restrictToVerticalAxis, snapToGrid({ x: 20, y: 20, smooth: true })])).toEqual({
      duration: 80,
      easing: 'ease-out',
    });
    expect(getOverlaySmoothing([snapToGrid({ x: 20, y: 20, smooth: { duration: 120 } })])).toEqual({
      duration: 120,
      easing: 'ease-out',
    });
    expect(getOverlaySmoothing([snapToGrid({ x: 20, y: 20, smooth: { duration: 0 } })])).toBeNull();
  });
});

describe('restrictions', () => {
  it('lock an axis', () => {
    expect(restrictToVerticalAxis(args({ x: 30, y: 40 }))).toEqual({ x: 0, y: 40 });
    expect(restrictToHorizontalAxis(args({ x: 30, y: 40 }))).toEqual({ x: 30, y: 0 });
  });

  it('hold the locked axis where the content went: the page scrolled 100px down', () => {
    const scrolled = { containerShift: { x: -20, y: -100 } };
    expect(restrictToHorizontalAxis(args({ x: 30, y: 40 }, scrolled))).toEqual({ x: 30, y: -100 });
    expect(restrictToVerticalAxis(args({ x: 30, y: 40 }, scrolled))).toEqual({ x: -20, y: 40 });
  });

  it('keep the overlay inside the container rect', () => {
    // Container spans x 100–500, y 200–500; the item is 50×30 at (105, 207).
    expect(restrictToParent(args({ x: -50, y: 0 }))).toEqual({ x: -5, y: 0 });
    expect(restrictToParent(args({ x: 1000, y: 1000 }))).toEqual({ x: 345, y: 263 });
    expect(restrictToParent(args({ x: 10, y: 10 }))).toEqual({ x: 10, y: 10 });
    expect(restrictToParent(args({ x: -50, y: 0 }, { containerRect: null }))).toEqual({ x: -50, y: 0 });
  });

  it('keep the overlay inside the window', () => {
    expect(restrictToWindowEdges(args({ x: -500, y: 900 }))).toEqual({ x: -105, y: 563 });
  });
});

describe('snapCenterToCursor', () => {
  it('puts the overlay center under the pointer', () => {
    const offset = snapCenterToCursor(args({ x: 10, y: 20 }));
    const center = {
      x: activeRect.left + offset.x + activeRect.width / 2,
      y: activeRect.top + offset.y + activeRect.height / 2,
    };
    expect(center).toEqual({ x: 120 + 10, y: 215 + 20 });
  });
});

describe('a box resized around the grab point (overlayFit)', () => {
  // The 50×30 item shown as a 100×20 box, held at (0.3, 0.25) of it.
  const size = { width: 100, height: 20 };
  const grab = getFraction(activeRect, { x: 120, y: 214.5 });
  const box = (transform: Coordinates) => resizeAround(offsetRect(activeRect, transform.x, transform.y), size, grab);
  const resized = (transform: Coordinates, overrides: Partial<ModifierArgs> = {}) =>
    args(transform, { overlayRect: box(transform), ...overrides });

  it('snapCenterToCursor centers the box as it is shown', () => {
    const offset = snapCenterToCursor(resized({ x: 10, y: 20 }));
    expect(getCenter(box(offset))).toEqual({ x: 120 + 10, y: 215 + 20 });
  });

  it('restrictions keep the box as it is shown inside', () => {
    for (const transform of [{ x: -50, y: -50 }, { x: 1000, y: 1000 }]) {
      const placed = box(restrictToParent(resized(transform)));
      expect(placed.left).toBeGreaterThanOrEqual(container.left);
      expect(placed.right).toBeLessThanOrEqual(container.right);
      expect(placed.top).toBeGreaterThanOrEqual(container.top);
      expect(placed.bottom).toBeLessThanOrEqual(container.bottom);
    }
    const inWindow = box(restrictToWindowEdges(resized({ x: -500, y: 900 })));
    expect([inWindow.left, inWindow.bottom]).toEqual([0, 800]);
  });

  it('snapToGrid puts the top-left of the box as it is shown on the grid', () => {
    const placed = box(snapToGrid(20)(resized({ x: 33, y: 47 })));
    expect((placed.left - container.left) % 20).toBeCloseTo(0, 10);
    expect((placed.top - container.top) % 20).toBeCloseTo(0, 10);
  });
});
