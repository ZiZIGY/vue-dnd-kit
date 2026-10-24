import { describe, expect, it } from 'vitest';
import type { AcceptContext, DragItem } from '../types';
import { matchesRule, partitionByRule } from './accept';

const item = (id: string, type: string[] = []): DragItem => ({ id, data: undefined, type });

const context = (items: DragItem[]): AcceptContext => ({
  active: {} as AcceptContext['active'],
  items,
  types: items.flatMap((entry) => entry.type),
});

describe('accept rules', () => {
  it('accepts everything without a rule or with "*"', () => {
    expect(matchesRule(undefined, context([item('a', ['card'])]))).toBe(true);
    expect(matchesRule('*', context([item('a', ['card'])]))).toBe(true);
  });

  it('lets untyped items into any typed target (v2 groups: [] parity)', () => {
    expect(matchesRule('card', context([item('a')]))).toBe(true);
  });

  it('matches by type, all by default and at least one with "some"', () => {
    const mixed = context([item('a', ['card']), item('b', ['column'])]);
    expect(matchesRule(['card'], mixed)).toBe(false);
    expect(matchesRule(['card'], mixed, 'some')).toBe(true);
    expect(partitionByRule('card', mixed)).toEqual({ accepted: ['a'], rejected: ['b'] });
  });

  it('delegates to a function rule', () => {
    expect(matchesRule(({ items }) => items.length < 2, context([item('a'), item('b')]))).toBe(false);
  });
});
