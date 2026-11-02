import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/** The anchor's layout animations, as `layoutShifts` reports them, and where its layout puts it. */
const shifts: Array<{ animation: object; offset: { x: number; y: number } }> = [];
let layoutTop = 0;

vi.mock('../../animation/layout', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../animation/layout')>();
  return {
    ...actual,
    layoutShifts: () => shifts.map((shift) => ({ animation: shift.animation, offset: { ...shift.offset } })),
    // What the screen shows: the layout, moved by the animations' `translate`.
    getRect: () => actual.createRect(0, layoutTop + shifts.reduce((sum, shift) => sum + shift.offset.y, 0), 100, 40),
  };
});

const { createFollow } = await import('./follow');

describe('a landing box following its slot', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame'] });
    shifts.length = 0;
    layoutTop = 0;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("doesn't jump when a library stops the slot's animation a frame before the next one moves it", () => {
    const box = { style: { translate: '' } };
    const follow = createFollow(() => box as unknown as HTMLElement);
    follow.follow({ isConnected: true } as Element);
    const boxY = () => Number.parseFloat(box.style.translate.split(' ')[1] ?? '') || 0;

    // Another drag reorders: the slot moves a row down, and its FLIP slides it from where it was.
    layoutTop = 70;
    shifts.push({ animation: {}, offset: { x: 0, y: -70 } });
    vi.advanceTimersToNextFrame();
    expect(boxY()).toBe(0);
    shifts[0]!.offset.y = -1.26;
    vi.advanceTimersToNextFrame();
    expect(boxY()).toBeCloseTo(68.74);

    // Reordered again: the first animation is stopped, and for a frame the new one still
    // shows what the first one left (motion writes its first frame late).
    layoutTop = 140;
    shifts.splice(0, 1, { animation: {}, offset: { x: 0, y: -1.26 } });
    vi.advanceTimersToNextFrame();
    expect(boxY()).toBeCloseTo(68.74);
    // It starts from where the slot was: the box slides along, from where it is.
    shifts[0]!.offset.y = -71.26;
    vi.advanceTimersToNextFrame();
    expect(boxY()).toBeCloseTo(68.74);
    shifts[0]!.offset.y = -30;
    vi.advanceTimersToNextFrame();
    expect(boxY()).toBeCloseTo(110);
    follow.stop();
  });
});
