import { describe, expect, it, vi } from 'vitest';
import type { Key } from '../types';
import { createRect } from '../animation/layout';
import type { ProjectionItem } from './projection';
import {
  applyTreeMove,
  createFlatTree,
  depthRange,
  findTreeNode,
  flattenTree,
  getDescendantKeys,
  moveKey,
  offsetDepth,
  parentAt,
  projectDepth,
  projectTreeIndex,
  siblingIndexAt,
  subtreeEnd,
  subtreeHeight,
  type DraftPosition,
  type TreeAccessors,
} from './tree';

interface Node {
  id: string;
  folder?: boolean;
  children?: Node[];
}

const node = (id: string, children?: Node[]): Node => (children ? { id, folder: true, children } : { id });

/**
 * a/          (0)
 *   a1        (1)
 *   a2/       (1)
 *     a2x     (2)
 * b/          (0)
 *   b1        (1)
 * c           (0)
 */
const sample = (): Node[] => [
  node('a', [node('a1'), node('a2', [node('a2x')])]),
  node('b', [node('b1')]),
  node('c'),
];

const getKey = (n: Node) => n.id;
const getChildren = (n: Node) => n.children;
const accessors: TreeAccessors<Node> = {
  getKey,
  getChildren,
  setChildren: (n, children) => {
    n.children = children;
  },
};

const flat = (roots: Node[], collapsed?: Set<Key>) => flattenTree(roots, getKey, getChildren, collapsed);

/** Serializes a tree as `a(a1,a2(a2x)),b(b1),c`. */
const shape = (roots: readonly Node[]): string =>
  roots.map((n) => (n.children?.length ? `${n.id}(${shape(n.children)})` : n.id)).join(',');

/** Draft position with `active` moved to `index` of the flat keys. */
const positionOf = (roots: Node[], active: string, index: number, collapsed?: Set<Key>): DraftPosition => {
  const nodes = flat(roots, collapsed);
  const tree = createFlatTree(nodes);
  const keys = nodes.map((n) => n.key);
  const from = keys.indexOf(active);
  const end = from === -1 ? from : subtreeEnd(nodes, from);
  // Hide the active node's descendants, as the tree does during a drag.
  const visible = from === -1 ? keys : [...keys.slice(0, from + 1), ...keys.slice(end)];
  const start = visible.indexOf(active);
  return { keys: moveKey(visible, active, start, index), index, rows: tree.byKey };
};

describe('flattenTree', () => {
  it('walks depth-first with depth, parent, sibling index and child flags', () => {
    const nodes = flat(sample());
    expect(nodes.map((n) => `${n.key}:${n.depth}:${n.parentKey}:${n.index}`)).toEqual([
      'a:0:null:0',
      'a1:1:a:0',
      'a2:1:a:1',
      'a2x:2:a2:0',
      'b:0:null:1',
      'b1:1:b:0',
      'c:0:null:2',
    ]);
    expect(nodes.filter((n) => n.hasChildren).map((n) => n.key)).toEqual(['a', 'a2', 'b']);
  });

  it('skips the children of collapsed nodes and flags them', () => {
    const nodes = flat(sample(), new Set(['a2', 'b']));
    expect(nodes.map((n) => n.key)).toEqual(['a', 'a1', 'a2', 'b', 'c']);
    expect(nodes.find((n) => n.key === 'b')).toMatchObject({ collapsed: true, hasChildren: true });
  });

  it('handles deep trees without recursion', () => {
    let deep: Node = node('leaf');
    for (let i = 0; i < 20_000; i++) deep = node(`n${i}`, [deep]);
    const nodes = flat([deep]);
    expect(nodes).toHaveLength(20_001);
    expect(nodes[nodes.length - 1]).toMatchObject({ key: 'leaf', depth: 20_000 });
  });
});

describe('descendants', () => {
  it('finds the visible subtree of a node', () => {
    const nodes = flat(sample());
    expect(getDescendantKeys(nodes, 0)).toEqual(['a1', 'a2', 'a2x']);
    expect(getDescendantKeys(nodes, 2)).toEqual(['a2x']);
    expect(getDescendantKeys(nodes, 6)).toEqual([]);
    expect(subtreeEnd(nodes, 4)).toBe(6);
  });

  it('measures the subtree height including collapsed children', () => {
    const [a, b, c] = sample();
    expect(subtreeHeight(a!, getChildren)).toBe(2);
    expect(subtreeHeight(b!, getChildren)).toBe(1);
    expect(subtreeHeight(c!, getChildren)).toBe(0);
  });
});

describe('depth projection', () => {
  it('offsets the start depth by whole indentation steps', () => {
    expect(offsetDepth(1, 0, 24)).toBe(1);
    expect(offsetDepth(1, 11, 24)).toBe(1);
    expect(offsetDepth(1, 13, 24)).toBe(2);
    expect(offsetDepth(1, -30, 24)).toBe(0);
    expect(offsetDepth(0, 100, 24)).toBe(4);
  });

  it('is limited by the next item depth and the previous item depth + 1', () => {
    // c dragged between a2x (2) and b (0).
    const position = positionOf(sample(), 'c', 4);
    expect(position.keys).toEqual(['a', 'a1', 'a2', 'a2x', 'c', 'b', 'b1']);
    expect(depthRange(position)).toEqual({ min: 0, max: 3 });
    expect(projectDepth(position, 9)).toEqual({ depth: 3, parentKey: 'a2x' });
    expect(projectDepth(position, 2)).toEqual({ depth: 2, parentKey: 'a2' });
    expect(projectDepth(position, 1)).toEqual({ depth: 1, parentKey: 'a' });
    expect(projectDepth(position, -3)).toEqual({ depth: 0, parentKey: null });
  });

  it('is forced into a parent when the next item is its child', () => {
    // c dragged between a and a1: it must be a child of a.
    const position = positionOf(sample(), 'c', 1);
    expect(depthRange(position)).toEqual({ min: 1, max: 1 });
    expect(projectDepth(position, 0)).toEqual({ depth: 1, parentKey: 'a' });
  });

  it('is 0 at the very top', () => {
    const position = positionOf(sample(), 'c', 0);
    expect(depthRange(position)).toEqual({ min: 0, max: 0 });
    expect(projectDepth(position, 5)).toEqual({ depth: 0, parentKey: null });
  });

  it('derives the parent from the neighbours', () => {
    const position = positionOf(sample(), 'c', 4);
    expect(parentAt(position, 0)).toBeNull();
    expect(parentAt(position, 1)).toBe('a');
    expect(parentAt(position, 2)).toBe('a2');
    expect(parentAt(position, 3)).toBe('a2x');
  });

  it('is lowered while canNest rejects the parent', () => {
    const roots = sample();
    const byId = new Map(flat(roots).map((n) => [n.key, n.item]));
    const folders = (_depth: number, parentKey: Key | null) => parentKey == null || !!byId.get(parentKey as string)?.folder;
    const position = positionOf(roots, 'c', 4);
    // a2x is a file: depth 3 is rejected, a2 is a folder.
    expect(projectDepth(position, 3, folders)).toEqual({ depth: 2, parentKey: 'a2' });
  });

  it('is lowered while maxDepth is exceeded', () => {
    const position = positionOf(sample(), 'c', 4);
    const maxDepth = (depth: number) => depth <= 1;
    expect(projectDepth(position, 3, maxDepth)).toEqual({ depth: 1, parentKey: 'a' });
  });

  it('returns null when no depth fits the slot', () => {
    // Between a and a1 only depth 1 (child of a) fits.
    const position = positionOf(sample(), 'c', 1);
    expect(projectDepth(position, 1, (depth) => depth === 0)).toBeNull();
  });

  it('counts the index among the new siblings', () => {
    const roots = sample();
    // c (root index 2) right after a2x at depth 1: after a2 among a's children.
    const position = positionOf(roots, 'c', 4);
    expect(siblingIndexAt(position, { depth: 1, parentKey: 'a' }, { parentKey: null, index: 2 })).toBe(2);
    expect(siblingIndexAt(position, { depth: 2, parentKey: 'a2' }, { parentKey: null, index: 2 })).toBe(1);
    expect(siblingIndexAt(position, { depth: 3, parentKey: 'a2x' }, { parentKey: null, index: 2 })).toBe(0);
    // At depth 0 it follows a: root index 1, b moves to 2.
    expect(siblingIndexAt(position, { depth: 0, parentKey: null }, { parentKey: null, index: 2 })).toBe(1);
  });

  it('accounts for leaving an earlier slot of the same parent', () => {
    // a moved after b's subtree at depth 0: a (index 0) left, b becomes 0, so a lands at 1.
    const position = positionOf(sample(), 'a', 3);
    expect(position.keys).toEqual(['b', 'b1', 'c', 'a']);
    expect(siblingIndexAt(position, { depth: 0, parentKey: null }, { parentKey: null, index: 0 })).toBe(2);
    const between = positionOf(sample(), 'a', 2);
    expect(between.keys).toEqual(['b', 'b1', 'a', 'c']);
    expect(siblingIndexAt(between, { depth: 0, parentKey: null }, { parentKey: null, index: 0 })).toBe(1);
  });

  it('is the first child of a collapsed parent', () => {
    const collapsed = new Set<Key>(['b']);
    const position = positionOf(sample(), 'c', 5, collapsed);
    expect(position.keys).toEqual(['a', 'a1', 'a2', 'a2x', 'b', 'c']);
    const projection = projectDepth(position, 1)!;
    expect(projection).toEqual({ depth: 1, parentKey: 'b' });
    expect(siblingIndexAt(position, projection, { parentKey: null, index: 2 })).toBe(0);
  });
});

describe('projectTreeIndex', () => {
  /** Rows of height 40 stacked from y = 0. */
  const rows = (keys: string[]): ProjectionItem[] =>
    keys.map((key, index) => ({ key, index, rect: createRect(0, index * 40, 200, 40) }));

  const project = (keys: string[], active: string, y: number, nestable: string[] = []) =>
    projectTreeIndex({
      pointer: { x: 50, y },
      items: rows(keys),
      activeKey: active,
      activeIndex: keys.indexOf(active),
      length: keys.length,
      canNestInto: (key) => nestable.includes(key as string),
    });

  it('nests into a row whose middle band is hovered, as its next slot', () => {
    const keys = ['x', 'f', 'g'];
    // Moving down into f (40–80): its middle band is 50–70.
    expect(project(keys, 'x', 45, ['f'])).toMatchObject({ index: null, nest: null });
    expect(project(keys, 'x', 50, ['f'])).toMatchObject({ index: 1, nest: 'f' });
    expect(project(keys, 'x', 70, ['f'])).toMatchObject({ index: 1, nest: 'f' });
    // Moving up into f from below: the slot right after f.
    expect(project(['f', 'g', 'x'], 'x', 20, ['f'])).toMatchObject({ index: 1, nest: 'f' });
    // Already right after f: nest without moving.
    expect(project(['f', 'x', 'g'], 'x', 20, ['f'])).toMatchObject({ index: null, nest: 'f' });
  });

  it('uses the list rule in the edge bands', () => {
    // Bottom band of f while moving down: past f, not into it.
    expect(project(['x', 'f', 'g'], 'x', 75, ['f'])).toMatchObject({ index: 1, nest: null });
    // Top band of f while moving up: before f.
    expect(project(['g', 'f', 'x'], 'x', 45, ['f'])).toMatchObject({ index: 1, nest: null });
    // Bottom band of f while moving up: stay after f.
    expect(project(['g', 'f', 'x'], 'x', 75, ['f'])).toMatchObject({ index: null, nest: null });
  });

  it('treats rows that refuse children as plain list items', () => {
    // The middle of a file is just its center: passed once crossed.
    expect(project(['x', 'file', 'g'], 'x', 65, [])).toMatchObject({ index: 1, nest: null });
    expect(project(['x', 'file', 'g'], 'x', 55, [])).toMatchObject({ index: null, nest: null });
  });

  it('keeps the slot over the active row and in gaps', () => {
    expect(project(['x', 'f'], 'x', 20, ['f'])).toMatchObject({ index: null, nest: null, hit: null });
  });

  it('nests an item from another list after the hovered row', () => {
    const result = projectTreeIndex({
      pointer: { x: 50, y: 20 },
      items: rows(['f', 'g']),
      activeKey: 'external',
      activeIndex: -1,
      length: 2,
      canNestInto: () => true,
    });
    expect(result).toMatchObject({ index: 1, nest: 'f' });
  });

  it('never nests without canNestInto (offset mode)', () => {
    const result = projectTreeIndex({
      pointer: { x: 50, y: 65 },
      items: rows(['x', 'f']),
      activeKey: 'x',
      activeIndex: 0,
      length: 2,
    });
    expect(result).toMatchObject({ index: 1, nest: null });
  });
});

describe('applyTreeMove', () => {
  it('reorders among siblings', () => {
    const roots = sample();
    const next = applyTreeMove(roots, { key: 'c', to: { parentKey: null, index: 0 } }, accessors);
    expect(shape(next)).toBe('c,a(a1,a2(a2x)),b(b1)');
    expect(next).not.toBe(roots);
  });

  it('moves a node into another parent with its subtree', () => {
    const roots = sample();
    const a2 = roots[0]!.children![1]!;
    const next = applyTreeMove(roots, { key: 'a2', to: { parentKey: 'b', index: 1 } }, accessors);
    expect(shape(next)).toBe('a(a1),b(b1,a2(a2x)),c');
    // Nodes are moved, not copied.
    expect(findTreeNode(next, 'a2', accessors)?.node).toBe(a2);
  });

  it('interprets the index after removing the node from the same parent', () => {
    const next = applyTreeMove(sample(), { key: 'a', to: { parentKey: null, index: 1 } }, accessors);
    expect(shape(next)).toBe('b(b1),a(a1,a2(a2x)),c');
  });

  it('un-nests to the root and replaces the root array', () => {
    const roots = sample();
    const next = applyTreeMove(roots, { key: 'a2x', to: { parentKey: null, index: 3 } }, accessors);
    expect(shape(next)).toBe('a(a1,a2),b(b1),c,a2x');
    expect(roots[0]!.children![1]!.children).toEqual([]);
  });

  it('writes nested changes through setChildren and keeps untouched arrays', () => {
    const roots = sample();
    const bChildren = roots[1]!.children;
    const setChildren = vi.fn((n: Node, children: Node[]) => {
      n.children = children;
    });
    applyTreeMove(roots, { key: 'a1', to: { parentKey: 'a2', index: 0 } }, { ...accessors, setChildren });
    expect(setChildren.mock.calls.map(([n]) => n.id)).toEqual(['a', 'a2']);
    expect(shape(roots)).toBe('a(a2(a1,a2x)),b(b1),c');
    expect(roots[1]!.children).toBe(bChildren);
  });

  it('keeps hidden children of a collapsed target', () => {
    const next = applyTreeMove(sample(), { key: 'c', to: { parentKey: 'b', index: 0 } }, accessors);
    expect(shape(next)).toBe('a(a1,a2(a2x)),b(c,b1)');
  });

  it('removes a node that left for another list', () => {
    const next = applyTreeMove(sample(), { key: 'a2', to: null }, accessors);
    expect(shape(next)).toBe('a(a1),b(b1),c');
  });

  it('inserts a node that comes from another list', () => {
    const next = applyTreeMove(
      sample(),
      { key: 'new', node: node('new'), to: { parentKey: 'a2', index: 1 } },
      accessors,
    );
    expect(shape(next)).toBe('a(a1,a2(a2x,new)),b(b1),c');
  });

  it('ignores moves into the node itself, its subtree or an unknown parent', () => {
    for (const parentKey of ['a', 'a2', 'a2x', 'missing']) {
      const roots = sample();
      const next = applyTreeMove(roots, { key: 'a', to: { parentKey, index: 0 } }, accessors);
      expect(shape(next)).toBe(shape(sample()));
    }
  });
});
