/**
 * The flat view of a tree for `makeSortableTree`: the visible nodes in depth-first order,
 * each with its depth, parent and index among its siblings. The draft of a tree is the
 * list of their keys.
 */

import type { FlatNode, Key } from '../../types';

export interface TreeAccessors<T> {
  getKey: (node: T) => Key;
  getChildren: (node: T) => readonly T[] | undefined;
  setChildren: (node: T, children: T[]) => void;
}

/** What the projection needs to know about a visible node. */
export type TreeRow = Pick<FlatNode<unknown>, 'key' | 'depth' | 'parentKey' | 'index'>;

export interface FlatTree<T> {
  nodes: FlatNode<T>[];
  byKey: Map<Key, FlatNode<T>>;
}

/** Visible nodes in depth-first order; children of collapsed nodes are skipped. O(N). */
export function flattenTree<T>(
  nodes: readonly T[],
  getKey: (node: T) => Key,
  getChildren: (node: T) => readonly T[] | undefined,
  collapsed?: ReadonlySet<Key>,
): FlatNode<T>[] {
  const result: FlatNode<T>[] = [];
  // Iterative, so deep trees can't overflow the stack.
  const stack: Array<{ siblings: readonly T[]; index: number; depth: number; parentKey: Key | null }> = [
    { siblings: nodes, index: 0, depth: 0, parentKey: null },
  ];
  while (stack.length) {
    const frame = stack[stack.length - 1]!;
    if (frame.index >= frame.siblings.length) {
      stack.pop();
      continue;
    }
    const index = frame.index++;
    const item = frame.siblings[index]!;
    const key = getKey(item);
    const children = getChildren(item);
    const isCollapsed = !!collapsed?.has(key);
    result.push({
      key,
      item,
      depth: frame.depth,
      parentKey: frame.parentKey,
      index,
      hasChildren: !!children?.length,
      collapsed: isCollapsed,
    });
    if (children?.length && !isCollapsed) {
      stack.push({ siblings: children, index: 0, depth: frame.depth + 1, parentKey: key });
    }
  }
  return result;
}

export function createFlatTree<T>(nodes: FlatNode<T>[]): FlatTree<T> {
  return { nodes, byKey: new Map(nodes.map((node) => [node.key, node])) };
}

/** End (exclusive) of the visible subtree of the node at `index` in a flat list. */
export function subtreeEnd(nodes: readonly Pick<TreeRow, 'depth'>[], index: number): number {
  const depth = nodes[index]!.depth;
  let end = index + 1;
  while (end < nodes.length && nodes[end]!.depth > depth) end++;
  return end;
}

/** Keys of the visible descendants of the node at `index` in a flat list. */
export function getDescendantKeys(nodes: readonly TreeRow[], index: number): Key[] {
  return nodes.slice(index + 1, subtreeEnd(nodes, index)).map((node) => node.key);
}

/** Levels below the deepest of `nodes` (a multi-drag block), collapsed children included. */
export const blockHeight = <T>(nodes: readonly T[], getChildren: (node: T) => readonly T[] | undefined): number =>
  nodes.reduce((height, node) => Math.max(height, subtreeHeight(node, getChildren)), 0);

/** Levels below `node`, collapsed children included (0 for a leaf). Used against `maxDepth`. */
export function subtreeHeight<T>(node: T, getChildren: (node: T) => readonly T[] | undefined): number {
  let height = 0;
  const stack: Array<{ node: T; level: number }> = [{ node, level: 0 }];
  while (stack.length) {
    const { node: current, level } = stack.pop()!;
    if (level > height) height = level;
    for (const child of getChildren(current) ?? []) stack.push({ node: child, level: level + 1 });
  }
  return height;
}
