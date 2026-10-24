import { describe, expect, it } from 'vitest';
import type { Active, Coordinates, ModifierArgs, Rect } from '../types';
import { createRect } from '../animation/layout';
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
