import { describe, expect, it } from 'vitest';
import {
  HYSTERESIS,
  blocksKey,
  blocksList,
  neighbourKeys,
  passedKeys,
  settleHysteresis,
  type Hysteresis,
} from './stability';

const keys = ['a', 'b', 'c', 'd', 'e', 'f'];

describe('passedKeys', () => {
  it('collects the keys a downward move slides past', () => {
    expect([...passedKeys(keys, 1, 4)]).toEqual(['c', 'd', 'e']);
  });

  it('collects the keys an upward move slides past', () => {
    expect([...passedKeys(keys, 4, 1)]).toEqual(['b', 'c', 'd']);
  });

  it('is empty when nothing moves', () => {
    expect(passedKeys(keys, 2, 2).size).toBe(0);
  });

  it('caps very long moves', () => {
    const many = Array.from({ length: 500 }, (_, index) => index);
    expect(passedKeys(many, 0, 499).size).toBeLessThanOrEqual(64);
  });
});

describe('neighbourKeys', () => {
  it('returns the keys around an insertion point', () => {
    expect([...neighbourKeys(keys, 2)]).toEqual(['b', 'c']);
    expect([...neighbourKeys(keys, 0)]).toEqual(['a']);
    expect([...neighbourKeys(keys, 6)]).toEqual(['f']);
    expect([...neighbourKeys([], 0)]).toEqual([]);
  });
});

describe('hysteresis', () => {
  const at = { x: 100, y: 100 };
  const hysteresis: Hysteresis = { keys: new Set(['c']), list: 'left', at };

  it('blocks the passed keys and the list just left', () => {
    expect(blocksKey(hysteresis, 'c')).toBe(true);
    expect(blocksKey(hysteresis, 'd')).toBe(false);
    expect(blocksKey(hysteresis, null)).toBe(false);
    expect(blocksList(hysteresis, 'left')).toBe(true);
    expect(blocksList(hysteresis, 'right')).toBe(false);
    expect(blocksKey(null, 'c')).toBe(false);
  });

  it('holds while the pointer jitters within the threshold', () => {
    expect(settleHysteresis(hysteresis, { x: 104, y: 97 })).toBe(hysteresis);
    expect(settleHysteresis(hysteresis, { x: 100 + HYSTERESIS - 0.5, y: 100 })).toBe(hysteresis);
  });

  it('releases once the pointer has moved far enough', () => {
    expect(settleHysteresis(hysteresis, { x: 100 + HYSTERESIS, y: 100 })).toBeNull();
    expect(settleHysteresis(hysteresis, { x: 108, y: 108 })).toBeNull();
  });
});
