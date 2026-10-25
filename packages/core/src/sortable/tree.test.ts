import { describe, expect, it, vi } from 'vitest';
import type { Key } from '../types';
import { createRect } from '../animation/layout';
import type { ProjectionItem } from './projection';
import {
  applyTreeMove,
  blockFilter,
  blockHeight,
  createFlatTree,
  depthRange,
  findTreeNode,
  flattenTree,
  gapPosition,
  getDescendantKeys,
  moveKey,
  nearestValidSlot,
  offsetDepth,
  parentAt,
  projectDepth,
  projectTreeIndex,
  projectTreeIndicator,
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

  it('reads a position the same with the active key inserted or left out', () => {
    const position = positionOf(sample(), 'c', 4);
    const others = position.keys.filter((key) => key !== 'c');
    const inserted: DraftPosition = { keys: others, index: 4, rows: position.rows, inserted: true };
    expect(depthRange(inserted)).toEqual(depthRange(position));
    expect(projectDepth(inserted, 2)).toEqual(projectDepth(position, 2));
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
    const origins = [{ parentKey: null, index: 2 }];
    expect(siblingIndexAt(position, { depth: 1, parentKey: 'a' }, origins)).toBe(2);
    expect(siblingIndexAt(position, { depth: 2, parentKey: 'a2' }, origins)).toBe(1);
    expect(siblingIndexAt(position, { depth: 3, parentKey: 'a2x' }, origins)).toBe(0);
    // At depth 0 it follows a: root index 1, b moves to 2.
    expect(siblingIndexAt(position, { depth: 0, parentKey: null }, origins)).toBe(1);
  });

  it('accounts for leaving an earlier slot of the same parent', () => {
    // a moved after b's subtree at depth 0: a (index 0) left, b becomes 0, so a lands at 1.
    const position = positionOf(sample(), 'a', 3);
    expect(position.keys).toEqual(['b', 'b1', 'c', 'a']);
    expect(siblingIndexAt(position, { depth: 0, parentKey: null }, [{ parentKey: null, index: 0 }])).toBe(2);
    const between = positionOf(sample(), 'a', 2);
    expect(between.keys).toEqual(['b', 'b1', 'a', 'c']);
    expect(siblingIndexAt(between, { depth: 0, parentKey: null }, [{ parentKey: null, index: 0 }])).toBe(1);
  });

  it('accounts for every node of a block leaving its slot', () => {
    // a and c travel as a block (a holds it) to the end, after b's subtree: both left the
    // roots, b becomes 0, so the block starts at 1.
    const position: DraftPosition = { keys: ['b', 'b1', 'a'], index: 2, rows: createFlatTree(flat(sample())).byKey };
    const block = [
      { parentKey: null, index: 0 },
      { parentKey: null, index: 2 },
    ];
    expect(siblingIndexAt(position, { depth: 0, parentKey: null }, block)).toBe(1);
    // Into b after b1: the block's nodes left other parents, b1 keeps its index.
    expect(siblingIndexAt(position, { depth: 1, parentKey: 'b' }, block)).toBe(1);
    // a1 (a's first child) and c into a, after a2: a1 left before a2, so a2 is 0 and the block starts at 1.
    const into: DraftPosition = { keys: ['a', 'a2', 'a2x', 'a1', 'b', 'b1'], index: 3, rows: position.rows };
    const a1AndC = [
      { parentKey: 'a', index: 0 },
      { parentKey: null, index: 2 },
    ];
    expect(siblingIndexAt(into, { depth: 1, parentKey: 'a' }, a1AndC)).toBe(1);
  });

  it('is the first child of a collapsed parent', () => {
    const collapsed = new Set<Key>(['b']);
    const position = positionOf(sample(), 'c', 5, collapsed);
    expect(position.keys).toEqual(['a', 'a1', 'a2', 'a2x', 'b', 'c']);
    const projection = projectDepth(position, 1)!;
    expect(projection).toEqual({ depth: 1, parentKey: 'b' });
    expect(siblingIndexAt(position, projection, [{ parentKey: null, index: 2 }])).toBe(0);
  });
});

describe('nearestValidSlot', () => {
  // Visible (a2 collapsed): a(0) a1(1) a2(1) b(0) b1(1) c(0); c is dragged up.
  const roots = sample();
  const collapsed = new Set<Key>(['a2']);
  const nodes = flat(roots, collapsed);
  const keys = nodes.map((n) => n.key);
  const rows = createFlatTree(nodes).byKey;
  const from = keys.indexOf('c');
  // Only the root level is allowed (maxDepth 0).
  const rootOnly = (depth: number) => depth === 0;

  it('returns the target when it fits', () => {
    expect(nearestValidSlot(keys, 'c', from, 3, rows)).toBe(3);
    expect(nearestValidSlot(keys, 'c', from, 3, rows, rootOnly)).toBe(3);
  });

  it('stops at the last valid slot on the way when the pointer skipped past it', () => {
    // Slots 1 and 2 (inside a) need depth >= 1; slot 3 (between a2 and b) can be root.
    expect(keys).toEqual(['a', 'a1', 'a2', 'b', 'b1', 'c']);
    expect(nearestValidSlot(keys, 'c', from, 1, rows, rootOnly)).toBe(3);
  });

  it('keeps the slot when nothing on the way fits', () => {
    // From the end, slot 4 (between b and b1) needs depth 1.
    expect(nearestValidSlot(keys, 'c', from, 4, rows, rootOnly)).toBeNull();
  });

  it('only tries the target for an item from another list', () => {
    expect(nearestValidSlot(keys, 'x', -1, 1, rows, rootOnly)).toBeNull();
    expect(nearestValidSlot(keys, 'x', -1, 3, rows, rootOnly)).toBe(3);
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

  it('catches up next to a row when the pointer skipped rows between frames', () => {
    // From the end straight into the bottom band of f, two rows up: right after f.
    expect(project(['f', 'g', 'h', 'x'], 'x', 35, ['f'])).toMatchObject({ index: 1, nest: null });
    // From the top into the top band of h: right before it.
    expect(project(['x', 'f', 'g', 'h'], 'x', 125, ['h'])).toMatchObject({ index: 2, nest: null });
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

  it('never nests into the other members of a block: over them the block steps as in lists', () => {
    // The block [x, f] holds index 0 (x is the slot, f travels after it), then g, h.
    const items: ProjectionItem[] = [
      { key: 'x', index: 0, rect: createRect(0, 0, 200, 40) },
      { key: 'f', index: 0, rect: createRect(0, 40, 200, 40), side: 1 },
      { key: 'g', index: 1, rect: createRect(0, 80, 200, 40) },
      { key: 'h', index: 2, rect: createRect(0, 120, 200, 40) },
    ];
    const project = (y: number) =>
      projectTreeIndex({ pointer: { x: 50, y }, items, activeKey: 'x', activeIndex: 0, length: 3, canNestInto: () => true });
    // The middle of f (a member) is not "into f": the block steps past g, as in lists.
    expect(project(60)).toMatchObject({ index: 1, nest: null, hit: null });
    // Over the active row nothing moves.
    expect(project(20)).toMatchObject({ index: null, nest: null });
    // The middle of g nests into it.
    expect(project(100)).toMatchObject({ index: 1, nest: 'g' });
  });

  it('keeps the slot over a still row (the original of a copy): no nesting into it, no step past it', () => {
    const project = (y: number, still?: Set<string>) =>
      projectTreeIndex({
        pointer: { x: 50, y },
        items: rows(['f', 'g']),
        activeKey: 'copy',
        activeIndex: -1,
        length: 2,
        canNestInto: () => true,
        still,
      });
    expect(project(20, new Set(['f']))).toMatchObject({ index: null, nest: null, hit: { key: 'f' } });
    expect(project(20)).toMatchObject({ index: 1, nest: 'f' });
    // The rows around it still take the copy.
    expect(project(60, new Set(['f']))).toMatchObject({ index: 2, nest: 'g' });
  });
});

describe('indicator projection', () => {
  /** Rows of height 40 stacked from y = 0, at their draft indices. */
  const rows = (keys: string[]): ProjectionItem[] =>
    keys.map((key, index) => ({ key, index, rect: createRect(0, index * 40, 200, 40) }));
  // Visible: a(0) a1(1) a2(1) a2x(2) b(0) b1(1) c(0).
  const keys = ['a', 'a1', 'a2', 'a2x', 'b', 'b1', 'c'];
  const tree = createFlatTree(flat(sample())).byKey;

  const line = (y: number, moving: Set<Key> = new Set(['c']), nestable: string[] = []) =>
    projectTreeIndicator({
      pointer: { x: 50, y },
      items: rows(keys),
      activeKey: 'c',
      length: keys.length,
      moving,
      canNestInto: (key) => nestable.includes(key as string),
    });

  it('goes before or after the hovered row; the middle of a row that takes the nodes means inside', () => {
    expect(line(85)).toEqual({ index: 2, key: 'a2', side: 'before' });
    expect(line(115)).toEqual({ index: 3, key: 'a2', side: 'after' });
    expect(line(100, undefined, ['a2'])).toEqual({ index: 3, key: 'a2', side: 'inside' });
    // The edge bands of a folder are still before/after.
    expect(line(85, undefined, ['a2'])).toEqual({ index: 2, key: 'a2', side: 'before' });
  });

  it('has no line over the rows that travel with the drag, and keeps it in gaps', () => {
    expect(line(170, new Set(['b', 'b1']))).toBeNull();
    expect(line(250)).toBeNull();
    const gappy: ProjectionItem[] = [
      { key: 'a', index: 0, rect: createRect(0, 0, 200, 30) },
      { key: 'b', index: 1, rect: createRect(0, 40, 200, 30) },
    ];
    expect(
      projectTreeIndicator({ pointer: { x: 50, y: 35 }, items: gappy, activeKey: 'z', length: 2, moving: new Set() }),
    ).toBeUndefined();
  });

  it('projects the depth of the line between its neighbours, without the rows that travel', () => {
    // Line before b (index 4) while a2 (with a2x) is dragged: between a1 (1) and b (0).
    const position = gapPosition(keys, 4, new Set(['a2', 'a2x']), tree);
    expect(position).toMatchObject({ keys: ['a', 'a1', 'b', 'b1', 'c'], index: 2, inserted: true });
    expect(depthRange(position)).toEqual({ min: 0, max: 2 });
    expect(projectDepth(position, 9)).toEqual({ depth: 2, parentKey: 'a1' });
    expect(projectDepth(position, 1)).toEqual({ depth: 1, parentKey: 'a' });
    expect(projectDepth(position, -1)).toEqual({ depth: 0, parentKey: null });
    // Among its new siblings: after a1, with a2 gone from a.
    expect(siblingIndexAt(position, { depth: 1, parentKey: 'a' }, [{ parentKey: 'a', index: 1 }])).toBe(1);
  });

  it('puts a line inside a row one level deeper, under it', () => {
    const inside = line(100, undefined, ['a2'])!;
    const position = gapPosition(keys, inside.index, new Set(['c']), tree);
    // Right after a2, before its child a2x: only depth 2 fits, as a2's first child.
    expect(depthRange(position)).toEqual({ min: 2, max: 2 });
    expect(projectDepth(position, 2)).toEqual({ depth: 2, parentKey: 'a2' });
    expect(siblingIndexAt(position, { depth: 2, parentKey: 'a2' }, [{ parentKey: null, index: 2 }])).toBe(0);
  });

  it('lowers the depth of the line while the block rules refuse it', () => {
    // [a2, c] (a2 has a child) after a2x: maxDepth 2 leaves depth 1 at most.
    const position = gapPosition(keys, 4, new Set(['c']), tree);
    const filter = blockFilter([tree.get('a2')!.item, tree.get('c')!.item], 1, tree, 2);
    expect(projectDepth(position, 3, filter)).toEqual({ depth: 1, parentKey: 'a' });
    // Nothing fits between a and a1 (only depth 1, under a, too deep with maxDepth 1).
    expect(projectDepth(gapPosition(keys, 1, new Set(), tree), 1, blockFilter([], 1, tree, 1))).toBeNull();
  });
});

describe('applyTreeMove', () => {
  it('reorders among siblings', () => {
    const roots = sample();
    const next = applyTreeMove(roots, { keys: ['c'], to: { parentKey: null, index: 0 } }, accessors);
    expect(shape(next)).toBe('c,a(a1,a2(a2x)),b(b1)');
    expect(next).not.toBe(roots);
  });

  it('moves a node into another parent with its subtree', () => {
    const roots = sample();
    const a2 = roots[0]!.children![1]!;
    const next = applyTreeMove(roots, { keys: ['a2'], to: { parentKey: 'b', index: 1 } }, accessors);
    expect(shape(next)).toBe('a(a1),b(b1,a2(a2x)),c');
    // Nodes are moved, not copied.
    expect(findTreeNode(next, 'a2', accessors)?.node).toBe(a2);
  });

  it('interprets the index after removing the node from the same parent', () => {
    const next = applyTreeMove(sample(), { keys: ['a'], to: { parentKey: null, index: 1 } }, accessors);
    expect(shape(next)).toBe('b(b1),a(a1,a2(a2x)),c');
  });

  it('un-nests to the root and replaces the root array', () => {
    const roots = sample();
    const next = applyTreeMove(roots, { keys: ['a2x'], to: { parentKey: null, index: 3 } }, accessors);
    expect(shape(next)).toBe('a(a1,a2),b(b1),c,a2x');
    expect(roots[0]!.children![1]!.children).toEqual([]);
  });

  it('writes nested changes through setChildren and keeps untouched arrays', () => {
    const roots = sample();
    const bChildren = roots[1]!.children;
    const setChildren = vi.fn((n: Node, children: Node[]) => {
      n.children = children;
    });
    applyTreeMove(roots, { keys: ['a1'], to: { parentKey: 'a2', index: 0 } }, { ...accessors, setChildren });
    expect(setChildren.mock.calls.map(([n]) => n.id)).toEqual(['a', 'a2']);
    expect(shape(roots)).toBe('a(a2(a1,a2x)),b(b1),c');
    expect(roots[1]!.children).toBe(bChildren);
  });

  it('keeps hidden children of a collapsed target', () => {
    const next = applyTreeMove(sample(), { keys: ['c'], to: { parentKey: 'b', index: 0 } }, accessors);
    expect(shape(next)).toBe('a(a1,a2(a2x)),b(c,b1)');
  });

  it('removes a node that left for another list', () => {
    const next = applyTreeMove(sample(), { keys: ['a2'], to: null }, accessors);
    expect(shape(next)).toBe('a(a1),b(b1),c');
  });

  it('inserts a node that comes from another list', () => {
    const next = applyTreeMove(
      sample(),
      { keys: ['new'], node: (key) => node(String(key)), to: { parentKey: 'a2', index: 1 } },
      accessors,
    );
    expect(shape(next)).toBe('a(a1,a2(a2x,new)),b(b1),c');
  });

  it('ignores moves into the node itself, its subtree or an unknown parent', () => {
    for (const parentKey of ['a', 'a2', 'a2x', 'missing']) {
      const roots = sample();
      const next = applyTreeMove(roots, { keys: ['a'], to: { parentKey, index: 0 } }, accessors);
      expect(shape(next)).toBe(shape(sample()));
    }
  });
});

describe('applyTreeMove with a block', () => {
  it('lands the nodes side by side, in order, each with its subtree', () => {
    // a2 (with a2x) and c into b, after b1: the index counts b's children once both left.
    const next = applyTreeMove(sample(), { keys: ['a2', 'c'], to: { parentKey: 'b', index: 1 } }, accessors);
    expect(shape(next)).toBe('a(a1),b(b1,a2(a2x),c)');
  });

  it('counts the index after every moved node left the parent', () => {
    // a and c (roots 0 and 2) after b: b is root 0 once they left.
    const next = applyTreeMove(sample(), { keys: ['a', 'c'], to: { parentKey: null, index: 1 } }, accessors);
    expect(shape(next)).toBe('b(b1),a(a1,a2(a2x)),c');
  });

  it('takes a moved node out of another moved one', () => {
    // a2x travels on its own (it was grabbed) next to a2.
    const next = applyTreeMove(sample(), { keys: ['a2', 'a2x'], to: { parentKey: null, index: 3 } }, accessors);
    expect(shape(next)).toBe('a(a1),b(b1),c,a2,a2x');
  });

  it('mixes nodes of the tree and nodes from another list', () => {
    const next = applyTreeMove(
      sample(),
      { keys: ['x', 'b1', 'y'], node: (key) => node(String(key)), to: { parentKey: 'a', index: 0 } },
      accessors,
    );
    expect(shape(next)).toBe('a(x,b1,y,a1,a2(a2x)),b,c');
  });

  it('removes every node that left for another list', () => {
    const next = applyTreeMove(sample(), { keys: ['a1', 'b', 'a2x'], to: null }, accessors);
    expect(shape(next)).toBe('a(a2),c');
  });

  it('refuses a parent inside any moved subtree', () => {
    const next = applyTreeMove(sample(), { keys: ['c', 'a'], to: { parentKey: 'a2x', index: 0 } }, accessors);
    expect(shape(next)).toBe(shape(sample()));
  });
});

describe('block rules', () => {
  const roots = sample();
  const rows = createFlatTree(flat(roots)).byKey;
  const item = (id: string) => rows.get(id)!.item;

  it('measures the block by its deepest node', () => {
    expect(blockHeight([item('c'), item('a'), item('b')], getChildren)).toBe(2);
    expect(blockHeight([item('c'), item('a1')], getChildren)).toBe(0);
  });

  it('keeps the deepest descendant of the block within maxDepth', () => {
    // a (2 levels below it) with c: at most at depth 0 with maxDepth 2.
    const filter = blockFilter([item('a'), item('c')], 2, rows, 2);
    expect(filter(0, null)).toBe(true);
    expect(filter(1, 'b')).toBe(false);
    // Without a: one level deeper is fine.
    expect(blockFilter([item('a1'), item('c')], 0, rows, 2)(2, 'a2')).toBe(true);
  });

  it('asks canNest about every node of the block', () => {
    // Only folders take children, and folders don't go into b.
    const canNest = (n: Node, parent: Node) => !!parent.folder && !(n.folder && parent.id === 'b');
    expect(blockFilter([item('c'), item('a1')], 0, rows, undefined, canNest)(1, 'b')).toBe(true);
    expect(blockFilter([item('c'), item('a2')], 1, rows, undefined, canNest)(1, 'b')).toBe(false);
    expect(blockFilter([item('c'), item('a2')], 1, rows, undefined, canNest)(1, 'a')).toBe(true);
    // A file parent refuses the whole block.
    expect(blockFilter([item('c')], 0, rows, undefined, canNest)(3, 'a2x')).toBe(false);
  });

  it('stops a flicking block at the last slot where it fits', () => {
    // Visible: a(0) a1(1) a2(1) a2x(2) b(0) b1(1) | the block [c, a] dragged up from the end.
    // With maxDepth 2 the block (height 2) only fits at depth 0: slots between rows of
    // depth >= 1 are skipped.
    const view = ['b', 'b1', 'c'];
    const filter = blockFilter([item('c'), item('a')], 2, rows, 2);
    expect(nearestValidSlot(view, 'c', 2, 1, rows, filter)).toBeNull();
    expect(nearestValidSlot(view, 'c', 2, 0, rows, filter)).toBe(0);
  });
});
