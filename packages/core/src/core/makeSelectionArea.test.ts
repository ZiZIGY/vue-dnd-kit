import { describe, expect, it } from 'vitest';
import type { Key } from '../types';
import { createRect } from '../animation/layout';
import {
  applyStrategy,
  getBandRect,
  intersects,
  isKeyHeld,
  matchesModifier,
  toContentPoint,
  toViewportRect,
  type ContentBox,
} from './makeSelectionArea';

const box = (patch: Partial<ContentBox> = {}): ContentBox => ({
  left: 100,
  top: 50,
  scrollLeft: 0,
  scrollTop: 0,
  width: 400,
  height: 1000,
  ...patch,
});

const noKeys = { shiftKey: false, ctrlKey: false, altKey: false, metaKey: false };

describe('selection geometry', () => {
  it('maps viewport points into content coordinates, scroll included', () => {
    expect(toContentPoint({ x: 150, y: 80 }, box())).toEqual({ x: 50, y: 30 });
    expect(toContentPoint({ x: 150, y: 80 }, box({ scrollTop: 200, scrollLeft: 10 }))).toEqual({ x: 60, y: 230 });
  });

  it('round-trips a content rect back to the viewport', () => {
    const scrolled = box({ scrollTop: 200 });
    expect(toViewportRect(createRect(50, 230, 10, 10), scrolled)).toEqual(createRect(150, 80, 10, 10));
  });

  it('normalizes the band whatever the drag direction', () => {
    const expected = createRect(10, 20, 30, 40);
    expect(getBandRect({ x: 10, y: 20 }, { x: 40, y: 60 }, box())).toEqual(expected);
    expect(getBandRect({ x: 40, y: 60 }, { x: 10, y: 20 }, box())).toEqual(expected);
    expect(getBandRect({ x: 40, y: 20 }, { x: 10, y: 60 }, box())).toEqual(expected);
  });

  it('clamps the band to the content', () => {
    expect(getBandRect({ x: 380, y: 10 }, { x: 900, y: -50 }, box())).toEqual(createRect(380, 0, 20, 10));
  });

  it('keeps the anchor on the content while the area scrolls', () => {
    // The pointer stays still in the viewport; scrolling 300px grows the band by 300px.
    const anchor = toContentPoint({ x: 120, y: 60 }, box());
    const before = getBandRect(anchor, toContentPoint({ x: 300, y: 400 }, box()), box());
    const scrolled = box({ scrollTop: 300 });
    const after = getBandRect(anchor, toContentPoint({ x: 300, y: 400 }, scrolled), scrolled);
    expect(after.top).toBe(before.top);
    expect(after.height).toBe(before.height + 300);
    // In the viewport the band now starts above the visible part of the area.
    expect(toViewportRect(after, scrolled).top).toBe(60 - 300);
  });

  it('keeps the anchor on the content while the page scrolls', () => {
    // Page scroll moves the area's box up in the viewport.
    const anchor = toContentPoint({ x: 120, y: 60 }, box());
    const pageScrolled = box({ top: 50 - 120 });
    const band = getBandRect(anchor, toContentPoint({ x: 300, y: 400 }, pageScrolled), pageScrolled);
    expect(band).toEqual(createRect(20, 10, 180, 460));
  });

  it('intersects only with a positive overlap', () => {
    const item = createRect(0, 0, 100, 50);
    expect(intersects(createRect(90, 40, 20, 20), item)).toBe(true);
    expect(intersects(createRect(100, 0, 20, 20), item)).toBe(false);
    expect(intersects(createRect(0, 50, 20, 20), item)).toBe(false);
    // A zero-width band dragged straight down across the item.
    expect(intersects(createRect(50, -10, 0, 100), item)).toBe(true);
  });
});

describe('selection strategies', () => {
  const hits = (entries: Array<[Key, boolean]>) => new Map<Key, boolean>(entries);

  it('toggle XORs against the selection at band start', () => {
    const base = new Set<Key>(['a', 'b', 'z']);
    const next = applyStrategy('toggle', base, hits([['a', true], ['b', false], ['c', true], ['d', false]]));
    expect([...next].sort()).toEqual(['b', 'c', 'z']);
  });

  it('toggle restores an item when the band leaves it again', () => {
    const base = new Set<Key>(['a']);
    expect([...applyStrategy('toggle', base, hits([['a', true]]))]).toEqual([]);
    expect([...applyStrategy('toggle', base, hits([['a', false]]))]).toEqual(['a']);
  });

  it('select keeps only the hit items of the area', () => {
    const base = new Set<Key>(['a', 'b', 'outside']);
    const next = applyStrategy('select', base, hits([['a', true], ['b', false], ['c', true]]));
    // `outside` belongs to another area (never measured), so it is untouched.
    expect([...next].sort()).toEqual(['a', 'c', 'outside']);
  });

  it('never mutates the base snapshot', () => {
    const base = new Set<Key>(['a']);
    applyStrategy('toggle', base, hits([['a', true], ['b', true]]));
    expect([...base]).toEqual(['a']);
  });
});

describe('selection modifier', () => {
  const held = (event: Partial<typeof noKeys>, pressed: string[] = []) => (key: string) =>
    isKeyHeld(key, { ...noKeys, ...event }, new Set(pressed));

  it('passes without a modifier', () => {
    expect(matchesModifier(undefined, held({}))).toBe(true);
    expect(matchesModifier({ keys: [], method: 'every' }, held({}))).toBe(true);
  });

  it('reads modifier keys from the pointer event', () => {
    expect(matchesModifier({ keys: ['Shift'], method: 'every' }, held({ shiftKey: true }))).toBe(true);
    expect(matchesModifier({ keys: ['Shift'], method: 'every' }, held({}))).toBe(false);
  });

  it('supports every and some', () => {
    const modifier = { keys: ['Control', 'Meta'] };
    expect(matchesModifier({ ...modifier, method: 'some' }, held({ metaKey: true }))).toBe(true);
    expect(matchesModifier({ ...modifier, method: 'every' }, held({ metaKey: true }))).toBe(false);
    expect(matchesModifier({ ...modifier, method: 'every' }, held({ metaKey: true, ctrlKey: true }))).toBe(true);
  });

  it('accepts codes and plain keys tracked from keyboard events', () => {
    expect(isKeyHeld('ShiftLeft', { ...noKeys, shiftKey: true }, new Set(['ShiftLeft']))).toBe(true);
    // Released while the window was blurred: the event flag vetoes the stale entry.
    expect(isKeyHeld('ShiftLeft', noKeys, new Set(['ShiftLeft']))).toBe(false);
    expect(isKeyHeld('KeyA', noKeys, new Set(['KeyA']))).toBe(true);
    expect(isKeyHeld('KeyA', noKeys, new Set())).toBe(false);
  });
});
