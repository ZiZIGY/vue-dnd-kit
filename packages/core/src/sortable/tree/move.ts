/**
 * Applying a move to the user's tree: the moved nodes (each with its subtree) leave their
 * parents and land side by side under a new one, in place (`applyTreeMove`) or as a new
 * tree (`buildTreeMove`).
 */

import type { Key } from '../../types';
import type { TreeAccessors } from './flatten';

interface Located<T> {
  node: T;
  parent: T | null;
  index: number;
}

/** Depth-first search for `key`; O(N). */
export function findTreeNode<T>(
  roots: readonly T[],
  key: Key,
  { getKey, getChildren }: Pick<TreeAccessors<T>, 'getKey' | 'getChildren'>,
): Located<T> | null {
  const stack: Array<{ siblings: readonly T[]; parent: T | null }> = [{ siblings: roots, parent: null }];
  while (stack.length) {
    const { siblings, parent } = stack.pop()!;
    for (let index = 0; index < siblings.length; index++) {
      const node = siblings[index]!;
      if (getKey(node) === key) return { node, parent, index };
      const children = getChildren(node);
      if (children?.length) stack.push({ siblings: children, parent: node });
    }
  }
  return null;
}

export interface TreeMove<T> {
  /** Moved nodes in drop order, each with its subtree. */
  keys: readonly Key[];
  /** Node to insert for a key that isn't in the tree yet (it comes from another list). */
  node?: (key: Key) => T | undefined;
  /**
   * Where the first node lands, side by side with the rest (the index among the
   * siblings left once every moved node is out); `null` removes the nodes (they left
   * for another list).
   */
  to: { parentKey: Key | null; index: number } | null;
}

/**
 * The new children of every parent a move changes (`null`: the root array), read from
 * the nodes as they are; `null` for an invalid move (an unknown parent, or a parent
 * inside a moved subtree) or one that moves nothing. A moved node inside another moved
 * one leaves it.
 */
function treeChanges<T>(
  roots: readonly T[],
  move: TreeMove<T>,
  accessors: Pick<TreeAccessors<T>, 'getKey' | 'getChildren'>,
): Map<T | null, T[]> | null {
  // Found before anything moves: a moved node may sit inside another one.
  const located = move.keys.map((key) => findTreeNode(roots, key, accessors));
  const nodes = move.keys
    .map((key, i) => located[i]?.node ?? move.node?.(key))
    .filter((node): node is T => node !== undefined);
  if (!nodes.length) return null;

  let parent: T | null = null;
  if (move.to && move.to.parentKey != null) {
    parent = findTreeNode(roots, move.to.parentKey, accessors)?.node ?? null;
    if (parent === null || findTreeNode(nodes, move.to.parentKey, accessors)) return null;
  }

  const changes = new Map<T | null, T[]>();
  const childrenOf = (owner: T | null): readonly T[] =>
    changes.get(owner) ?? (owner === null ? roots : (accessors.getChildren(owner) ?? []));
  // Every parent drops all its moved children at once: the order of nested moves doesn't matter.
  const moved = new Set(nodes);
  for (const owner of new Set(located.flatMap((place) => (place ? [place.parent] : [])))) {
    changes.set(owner, childrenOf(owner).filter((child) => !moved.has(child)));
  }
  if (move.to) {
    const siblings = [...childrenOf(parent)];
    siblings.splice(Math.max(0, Math.min(move.to.index, siblings.length)), 0, ...nodes);
    changes.set(parent, siblings);
  }
  return changes;
}

/**
 * Moves nodes (each with its whole subtree) and returns the new root array. Children
 * arrays that change are replaced through `setChildren`; nodes are never copied, so
 * collapsed subtrees and the moved nodes' own children stay as they are. The root array
 * is always a new array, so `shallowRef` sources update too. Invalid moves return
 * `roots` unchanged.
 */
export function applyTreeMove<T>(roots: readonly T[], move: TreeMove<T>, accessors: TreeAccessors<T>): T[] {
  const changes = treeChanges(roots, move, accessors);
  if (!changes) return [...roots];
  for (const [owner, children] of changes) if (owner !== null) accessors.setChildren(owner, children);
  return changes.get(null) ?? [...roots];
}

/**
 * `applyTreeMove` without touching `roots`: a new tree in which every node on the path
 * to a changed parent is a copy (`withChildren`), the changed parents included. Other
 * subtrees, the moved nodes' own ones among them, are shared.
 */
export function buildTreeMove<T>(
  roots: readonly T[],
  move: TreeMove<T>,
  accessors: Pick<TreeAccessors<T>, 'getKey' | 'getChildren'> & { withChildren: (node: T, children: T[]) => T },
): T[] {
  const { getChildren, withChildren } = accessors;
  const changes = treeChanges(roots, move, accessors);
  if (!changes) return [...roots];

  // Parents in the tree as it is: each changed parent and its ancestors get copies.
  const parents = new Map<T, T | null>();
  const stack: Array<{ siblings: readonly T[]; parent: T | null }> = [{ siblings: roots, parent: null }];
  while (stack.length) {
    const { siblings, parent } = stack.pop()!;
    for (const node of siblings) {
      parents.set(node, parent);
      const children = getChildren(node);
      if (children?.length) stack.push({ siblings: children, parent: node });
    }
  }
  const copied = new Set<T>();
  for (const owner of changes.keys()) {
    for (let node = owner; node !== null && !copied.has(node); node = parents.get(node) ?? null) copied.add(node);
  }

  // Bottom-up through the new shape, not the old depths: a moved node may land deeper.
  const childrenAfter = (node: T): readonly T[] => changes.get(node) ?? getChildren(node) ?? [];
  const copies = new Map<T, T>();
  const next = changes.get(null) ?? [...roots];
  const pending = next.filter((node) => copied.has(node)).map((node) => ({ node, open: false }));
  while (pending.length) {
    const top = pending[pending.length - 1]!;
    const children = childrenAfter(top.node);
    if (!top.open) {
      top.open = true;
      for (const child of children) if (copied.has(child)) pending.push({ node: child, open: false });
      continue;
    }
    pending.pop();
    copies.set(top.node, withChildren(top.node, children.map((child) => copies.get(child) ?? child)));
  }
  return next.map((node) => copies.get(node) ?? node);
}
