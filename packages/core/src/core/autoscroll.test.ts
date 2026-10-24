import { describe, expect, it } from 'vitest';
import { createRect } from '../animation/layout';
import {
  DEFAULT_AUTO_SCROLL,
  createScrollIntent,
  getEdgeSize,
  getEdgeSpeed,
  getRevealDelta,
  getScrollVelocity,
  resolveAutoScrollOptions,
  updateScrollIntent,
  type Directions,
} from './autoscroll';

const all: Directions = { up: true, down: true, left: true, right: true };
const none: Directions = { up: false, down: false, left: false, right: false };
const options = DEFAULT_AUTO_SCROLL;

// A 300×300 scroller at (100, 100): edge zone = 20% of 300 = 60px.
const rect = createRect(100, 100, 300, 300);
const velocity = (x: number, y: number, canScroll = all, intent = all) =>
  getScrollVelocity({ x, y }, rect, canScroll, intent, options);

describe('getEdgeSize', () => {
  it('is a fraction of the container, clamped to 24–96px', () => {
    expect(getEdgeSize(300, 0.2)).toBe(60);
    expect(getEdgeSize(100, 0.2)).toBe(24);
    expect(getEdgeSize(2000, 0.2)).toBe(96);
  });

  it('never exceeds half the container, and 0 disables it', () => {
    expect(getEdgeSize(30, 0.2)).toBe(15);
    expect(getEdgeSize(300, 0)).toBe(0);
    expect(getEdgeSize(0, 0.2)).toBe(0);
  });
});

describe('getEdgeSpeed', () => {
  it('rises with depth, keeps rising past the edge and is capped by maxSpeed', () => {
    const speeds = [0, 0.25, 0.5, 1, 1.5, 2, 5].map((depth) => getEdgeSpeed(depth, options));
    expect(speeds[0]).toBe(0);
    for (let i = 1; i < speeds.length - 2; i++) expect(speeds[i]!).toBeGreaterThan(speeds[i - 1]!);
    expect(getEdgeSpeed(1, options)).toBe(options.acceleration);
    expect(getEdgeSpeed(5, options)).toBe(options.maxSpeed);
  });

  it('scales with acceleration', () => {
    expect(getEdgeSpeed(1, { ...options, acceleration: 20 })).toBe(20);
    expect(getEdgeSpeed(0.5, { ...options, acceleration: 20 })).toBe(5);
  });
});

describe('getScrollVelocity', () => {
  it('is zero outside the edge zones', () => {
    expect(velocity(250, 250)).toEqual({ x: 0, y: 0 });
    expect(velocity(250, 161)).toEqual({ x: 0, y: 0 });
  });

  it('scrolls toward the edge the pointer is in, faster deeper in', () => {
    expect(velocity(250, 390).y).toBeGreaterThan(0);
    expect(velocity(250, 110).y).toBeLessThan(0);
    expect(velocity(390, 250).x).toBeGreaterThan(0);
    expect(velocity(110, 250).x).toBeLessThan(0);
    expect(velocity(250, 395).y).toBeGreaterThan(velocity(250, 370).y);
  });

  it('keeps accelerating past the edge up to maxSpeed', () => {
    expect(velocity(250, 430).y).toBeGreaterThan(velocity(250, 400).y);
    expect(velocity(250, 2000).y).toBe(options.maxSpeed);
  });

  it('ignores a pointer beside the container (10px cross-axis tolerance)', () => {
    expect(velocity(405, 395).y).toBeGreaterThan(0);
    expect(velocity(420, 395).y).toBe(0);
    expect(velocity(80, 395).y).toBe(0);
    expect(velocity(395, 420).x).toBe(0);
  });

  it('respects the scroll limits', () => {
    expect(velocity(250, 390, { ...all, down: false }).y).toBe(0);
    expect(velocity(250, 110, { ...all, up: false }).y).toBe(0);
  });

  it('needs scroll intent in that direction', () => {
    expect(velocity(250, 390, all, none)).toEqual({ x: 0, y: 0 });
    expect(velocity(250, 390, all, { ...none, down: true }).y).toBeGreaterThan(0);
    expect(velocity(250, 390, all, { ...none, up: true }).y).toBe(0);
  });
});

describe('scroll intent', () => {
  it('unlocks a direction only after the pointer moved that way', () => {
    const intent = createScrollIntent({ x: 100, y: 100 });
    expect(updateScrollIntent(intent, { x: 103, y: 102 })).toEqual(none);
    expect(updateScrollIntent(intent, { x: 103, y: 110 })).toEqual({ ...none, down: true });
  });

  it('measures from the farthest point reached, so moving back toward an edge counts', () => {
    const intent = createScrollIntent({ x: 0, y: 100 });
    updateScrollIntent(intent, { x: 0, y: 40 });
    expect(intent.directions.up).toBe(true);
    expect(intent.directions.down).toBe(false);
    expect(updateScrollIntent(intent, { x: 0, y: 50 }).down).toBe(true);
  });
});

describe('resolveAutoScrollOptions', () => {
  it('merges defaults, provider and per-list options', () => {
    expect(resolveAutoScrollOptions(undefined)).toEqual(DEFAULT_AUTO_SCROLL);
    expect(resolveAutoScrollOptions({ maxSpeed: 40 })).toEqual({ ...DEFAULT_AUTO_SCROLL, maxSpeed: 40 });
    expect(resolveAutoScrollOptions({ maxSpeed: 40 }, { threshold: 0.1 })).toEqual({
      ...DEFAULT_AUTO_SCROLL,
      maxSpeed: 40,
      threshold: 0.1,
    });
    expect(resolveAutoScrollOptions({ maxSpeed: 40, threshold: undefined })).toEqual({
      ...DEFAULT_AUTO_SCROLL,
      maxSpeed: 40,
    });
  });

  it('lets a list override the provider either way', () => {
    expect(resolveAutoScrollOptions(false)).toBeNull();
    expect(resolveAutoScrollOptions(false, true)).toEqual(DEFAULT_AUTO_SCROLL);
    expect(resolveAutoScrollOptions(true, false)).toBeNull();
  });
});

describe('getRevealDelta', () => {
  const view = createRect(0, 0, 100, 100);

  it('is zero for a visible rect', () => {
    expect(getRevealDelta(createRect(10, 10, 20, 20), view, 8)).toEqual({ x: 0, y: 0 });
  });

  it('scrolls just enough to show a rect past either edge', () => {
    expect(getRevealDelta(createRect(10, 150, 20, 20), view, 8)).toEqual({ x: 0, y: 78 });
    expect(getRevealDelta(createRect(-50, 10, 20, 20), view, 8)).toEqual({ x: -58, y: 0 });
  });

  it('aligns the start of a rect larger than the view', () => {
    expect(getRevealDelta(createRect(0, 150, 20, 300), view, 8).y).toBe(142);
  });
});
