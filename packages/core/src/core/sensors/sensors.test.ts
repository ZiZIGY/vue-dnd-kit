import { describe, expect, it } from 'vitest';
import { createRect } from '../../animation/layout';
import { checkActivation, makeSelectableForPress, resolveActivation } from './pointer';
import { pickInDirection } from './keyboard';

describe('makeSelectableForPress', () => {
  it('leaves selectable elements alone', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const restore = makeSelectableForPress(element);
    expect(element.style.cssText).toBe('');
    restore();
    expect(element.style.cssText).toBe('');
    element.remove();
  });

  it('makes a user-select: none element selectable and restores its own inline value', () => {
    const element = document.createElement('div');
    element.style.setProperty('user-select', 'none', 'important');
    document.body.appendChild(element);
    const restore = makeSelectableForPress(element);
    expect(element.style.getPropertyValue('user-select')).toBe('text');
    restore();
    expect(element.style.getPropertyValue('user-select')).toBe('none');
    expect(element.style.getPropertyPriority('user-select')).toBe('important');
    // Idempotent: a second call doesn't touch what changed since.
    element.style.setProperty('user-select', 'auto');
    restore();
    expect(element.style.getPropertyValue('user-select')).toBe('auto');
    element.remove();
  });
});

describe('resolveActivation', () => {
  it('uses the item option, then the provider, then the defaults', () => {
    const item = { mouse: { distance: 10 } };
    const provider = { mouse: { distance: 6 }, touch: { delay: 300, tolerance: 8 } };
    expect(resolveActivation('mouse', item, provider, false)).toEqual({ distance: 10 });
    expect(resolveActivation('mouse', undefined, provider, false)).toEqual({ distance: 6 });
    expect(resolveActivation('touch', item, provider, false)).toEqual({ delay: 300, tolerance: 8 });
    expect(resolveActivation('pen', item, provider, false)).toEqual({ distance: 4 });
    expect(resolveActivation('touch', undefined, undefined, false)).toEqual({ delay: 200, tolerance: 5 });
  });

  it('starts a mouse press on a handle at once, unless configured', () => {
    expect(resolveActivation('mouse', undefined, undefined, true)).toEqual({});
    expect(resolveActivation('touch', undefined, undefined, true)).toEqual({ delay: 200, tolerance: 5 });
    expect(resolveActivation('mouse', undefined, { mouse: { distance: 6 } }, true)).toEqual({ distance: 6 });
  });
});

describe('checkActivation', () => {
  it('starts at once without constraints', () => {
    expect(checkActivation({}, 0, 0)).toBe('start');
  });

  it('reports distance progress, then starts', () => {
    expect(checkActivation({ distance: 4 }, 2, 500)).toBe(0.5);
    expect(checkActivation({ distance: 4 }, 4, 0)).toBe('start');
  });

  it('reports delay progress, aborts past the tolerance, then starts', () => {
    expect(checkActivation({ delay: 200, tolerance: 5 }, 3, 100)).toBe(0.5);
    expect(checkActivation({ delay: 200, tolerance: 5 }, 6, 100)).toBe('abort');
    expect(checkActivation({ delay: 200, tolerance: 5 }, 3, 200)).toBe('start');
    expect(checkActivation({ delay: 200 }, 6, 100)).toBe('abort');
  });

  it('starts on whichever of distance and delay comes first', () => {
    const both = { delay: 200, distance: 8 };
    expect(checkActivation(both, 8, 10)).toBe('start');
    expect(checkActivation(both, 2, 200)).toBe('start');
    expect(checkActivation(both, 6, 50)).toBe(0.75);
    expect(checkActivation({ ...both, tolerance: 5 }, 6, 50)).toBe('abort');
  });
});

describe('pickInDirection', () => {
  const zone = (id: string, x: number, y: number) => ({ id, rect: createRect(x - 25, y - 25, 50, 50) });
  const candidates = [zone('right', 300, 100), zone('right-far', 600, 100), zone('diagonal', 200, 250), zone('up', 100, -100)];
  const pointer = { x: 100, y: 100 };

  it('picks the closest target in line with the arrow', () => {
    expect(pickInDirection(pointer, { x: 1, y: 0 }, candidates)).toBe('right');
    expect(pickInDirection(pointer, { x: 0, y: -1 }, candidates)).toBe('up');
    expect(pickInDirection(pointer, { x: 0, y: 1 }, candidates)).toBe('diagonal');
  });

  it('returns null when nothing lies that way', () => {
    expect(pickInDirection(pointer, { x: -1, y: 0 }, candidates)).toBeNull();
    expect(pickInDirection({ x: 300, y: 100 }, { x: 0, y: 1 }, [zone('same-row', 305, 100)])).toBeNull();
  });
});
